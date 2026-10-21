import crypto from "crypto";
import { NextResponse } from "next/server";
import { cleanCustomTypes, MAX_CUSTOM_TYPES, THEMES } from "@/lib/hotelTheme";
import { SERVICES, cleanServices, cleanCustomServices, isCustomServiceId } from "@/lib/hotelServices";
import { stripe } from "@/lib/stripe";
import { slugForHotel } from "@/lib/hotelSlug";
import { sendHotelActivationLink } from "@/lib/email";
import { ACTIVATION_MINUTES, LINK_HOURS, MAX_SERVICES_PER_DEVICE, PENDING_LABEL, SERVICE_COOKIE, activationHash, getHotelContext, isPin, pinHash, sha256, STATION_COOKIE, stationTokens } from "@/lib/hotelAuth";

// Identifiants de services qui appartiennent bien à cet hôtel.
async function ownServiceIds(admin, hotelId, ids) {
  const { data } = await admin.from("hotel_services").select("id").eq("hotel_id", hotelId).in("id", ids);
  return (data ?? []).map((s) => s.id);
}

const fail = (error, status = 400) => NextResponse.json({ error }, { status });
const PIN_TAKEN = "Ce PIN est déjà utilisé par une autre personne : choisissez-en un autre.";

// "101-135, Spa, Bar" → [{name:"101",kind:"room"}, … , {name:"Spa",kind:"area"}]
function parsePlaces(text) {
  const out = new Map();
  for (const part of String(text).split(/[,;\n]+/).map((p) => p.trim()).filter(Boolean)) {
    const range = part.match(/^(\d{1,4})\s*(?:-|à|a)\s*(\d{1,4})$/i);
    if (range) {
      const [from, to] = [Number(range[1]), Number(range[2])];
      if (to < from || to - from > 600) continue;
      for (let n = from; n <= to; n++) out.set(String(n), "room");
    } else {
      out.set(part.slice(0, 60), /^\d+$/.test(part) ? "room" : "area");
    }
  }
  return [...out].map(([name, kind]) => ({ name, kind }));
}

// Toutes les actions d'administration du manager : équipe, lieux, étiquettes,
// emails, postes de réception. Réservé au manager connecté.
export async function POST(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return fail("Non autorisé", 401);
  const { admin, hotel } = ctx;
  const b = await request.json().catch(() => ({}));
  const ok = (extra = {}) => NextResponse.json({ ok: true, ...extra });

  switch (b.action) {
    case "update_hotel": {
      const update = {};
      if (typeof b.name === "string" && b.name.trim()) update.name = b.name.trim().slice(0, 120);
      if (b.logoUrl === null || typeof b.logoUrl === "string") update.logo_url = b.logoUrl;
      const { error } = await admin.from("hotels").update(update).eq("id", hotel.id);
      return error ? fail("Impossible d'enregistrer.", 500) : ok();
    }

    // Couleur du cahier : uniquement les palettes validées (contraste).
    case "set_theme": {
      if (!THEMES.some((t) => t.id === b.theme)) return fail("Couleur inconnue.");
      const { error } = await admin.from("hotels").update({ theme: b.theme === "sable" ? null : b.theme }).eq("id", hotel.id);
      return error ? fail("Impossible d'enregistrer.", 500) : ok();
    }

    // Types de consigne propres à l'hôtel (jamais supprimés : désactivés, pour
    // que les consignes déjà écrites gardent leur libellé).
    case "set_types": {
      const types = cleanCustomTypes(b.types);
      // Supprimer un type : possible s'il n'a servi à aucune consigne. Sinon il est gardé,
      // désactivé, pour que les consignes déjà écrites gardent leur nom.
      const removed = cleanCustomTypes(hotel.consigne_types).filter((t) => !types.some((n) => n.id === t.id));
      const kept = [];
      if (removed.length > 0) {
        const { data: used } = await admin.from("consignes").select("type_id").eq("hotel_id", hotel.id).in("type_id", removed.map((t) => t.id));
        const usedIds = new Set((used ?? []).map((r) => r.type_id));
        for (const t of removed) if (usedIds.has(t.id)) kept.push({ ...t, active: false });
      }
      if (types.length + kept.length > MAX_CUSTOM_TYPES) {
        return fail(`Vous avez déjà ${MAX_CUSTOM_TYPES} types, dont certains utilisés par des consignes (ils ne peuvent qu'être désactivés). Supprimez-en un autre avant d'en ajouter.`);
      }
      const { error } = await admin.from("hotels").update({ consigne_types: [...types, ...kept] }).eq("id", hotel.id);
      if (error) return fail("Impossible d'enregistrer.", 500);
      return ok(kept.length ? { notice: `Enregistré. ${kept.map((t) => `« ${t.label} »`).join(", ")} ${kept.length > 1 ? "sont utilisés" : "est utilisé"} par des consignes déjà écrites : ${kept.length > 1 ? "ils sont désactivés" : "il est désactivé"} au lieu d'être supprimé${kept.length > 1 ? "s" : ""}, pour garder leur nom.` } : {});
    }

    // Services de l'hôtel : ils fixent le prix (15 €/mois chacun). Si
    // l'abonnement est actif, la quantité Stripe suit, au prorata.
    case "set_services": {
      const custom = cleanCustomServices(b.customServices);
      const customIds = new Set(custom.map((c) => c.id));
      // Un service propre n'est retenu que s'il arrive avec son nom.
      const ids = cleanServices(Array.isArray(b.services) ? b.services.filter((id) => !isCustomServiceId(id) || customIds.has(id)) : []);
      if (ids.length === 0) return fail("Gardez au moins un service.");
      const { error } = await admin.from("hotels").update({ services: ids }).eq("id", hotel.id);
      if (error) return fail("Impossible d'enregistrer.", 500);
      // Les étiquettes de poste correspondantes existent (pour adresser une consigne).
      await admin
        .from("hotel_tags")
        .upsert(
          [
            ...SERVICES.filter((s) => ids.includes(s.id)).map((s) => ({ hotel_id: hotel.id, name: s.tag, kind: "role" })),
            ...custom.filter((c) => ids.includes(c.id)).map((c) => ({ hotel_id: hotel.id, name: c.name.toLowerCase(), kind: "role" })),
          ],
          { onConflict: "hotel_id,name", ignoreDuplicates: true },
        );
      // Les services du cahier suivent : on crée les nouveaux, on désactive les retirés
      // (jamais supprimés : leurs consignes gardent leur service).
      const { data: current } = await admin.from("hotel_services").select("id, key, active").eq("hotel_id", hotel.id);
      const have = new Map((current ?? []).map((r) => [r.key, r]));
      for (const [i, s] of SERVICES.entries()) {
        const row = have.get(s.id);
        const wanted = ids.includes(s.id);
        if (row && row.active !== wanted) await admin.from("hotel_services").update({ active: wanted }).eq("id", row.id);
        if (!row && wanted) await admin.from("hotel_services").insert({ hotel_id: hotel.id, key: s.id, name: s.label, position: i + 1 });
      }
      for (const [i, c] of custom.entries()) {
        const row = have.get(c.id);
        const wanted = ids.includes(c.id);
        if (row) await admin.from("hotel_services").update({ active: wanted, name: c.name }).eq("id", row.id);
        else if (wanted) await admin.from("hotel_services").insert({ hotel_id: hotel.id, key: c.id, name: c.name, position: 100 + i });
      }
      // Un service propre qui n'est plus dans la liste est désactivé (jamais supprimé).
      for (const row of current ?? []) {
        if (isCustomServiceId(row.key) && !ids.includes(row.key) && row.active) await admin.from("hotel_services").update({ active: false }).eq("id", row.id);
      }
      if (hotel.stripe_subscription_id && ["active", "past_due"].includes(hotel.billing_status) && !hotel.billing_exempt) {
        try {
          const sub = await stripe.subscriptions.retrieve(hotel.stripe_subscription_id);
          const item = sub.items?.data?.[0];
          if (item && item.quantity !== ids.length) {
            await stripe.subscriptionItems.update(item.id, { quantity: ids.length, proration_behavior: "create_prorations" });
          }
        } catch (err) {
          console.error("hotel services stripe update failed:", err);
          return fail("Services enregistrés, mais l'abonnement n'a pas pu être mis à jour. Réessayez dans un instant.", 502);
        }
      }
      return ok({ count: ids.length });
    }

    // Accès d'un service (email + mot de passe) : sert à activer un appareil pour
    // ce service. Le compte est confirmé d'office (aucun email n'est envoyé).
    case "create_service_account": {
      const email = String(b.email ?? "").trim().toLowerCase();
      const password = String(b.password ?? "");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Cette adresse email n'est pas valide.");
      if (password.length < 8) return fail("Le mot de passe doit avoir au moins 8 caractères.");
      const { data: svc } = await admin.from("hotel_services").select("id, account_user_id").eq("id", b.serviceId ?? "").eq("hotel_id", hotel.id).eq("active", true).maybeSingle();
      if (!svc) return fail("Service introuvable.", 404);
      if (svc.account_user_id) return fail("Ce service a déjà un accès. Changez son mot de passe ou supprimez-le d'abord.");
      const { data: created, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { account_type: "hotel_service", hotel_id: hotel.id },
      });
      if (createError || !created?.user) {
        const taken = /already|registered|exists/i.test(createError?.message ?? "");
        return fail(taken ? "Cet email est déjà utilisé par un autre compte : choisissez-en un autre." : "Impossible de créer l'accès.", taken ? 409 : 500);
      }
      const { error: linkError } = await admin.from("hotel_services").update({ account_user_id: created.user.id, account_email: email }).eq("id", svc.id);
      if (linkError) {
        await admin.auth.admin.deleteUser(created.user.id);
        return fail("Impossible de créer l'accès.", 500);
      }
      return ok();
    }
    case "set_service_password": {
      const password = String(b.password ?? "");
      if (password.length < 8) return fail("Le mot de passe doit avoir au moins 8 caractères.");
      const { data: svc } = await admin.from("hotel_services").select("account_user_id").eq("id", b.serviceId ?? "").eq("hotel_id", hotel.id).maybeSingle();
      if (!svc?.account_user_id) return fail("Ce service n'a pas d'accès.", 404);
      const { error: updateError } = await admin.auth.admin.updateUserById(svc.account_user_id, { password });
      return updateError ? fail("Impossible de changer le mot de passe.", 500) : ok();
    }
    case "delete_service_account": {
      const { data: svc } = await admin.from("hotel_services").select("id, account_user_id").eq("id", b.serviceId ?? "").eq("hotel_id", hotel.id).maybeSingle();
      if (!svc?.account_user_id) return fail("Ce service n'a pas d'accès.", 404);
      await admin.from("hotel_services").update({ account_user_id: null, account_email: null }).eq("id", svc.id);
      await admin.auth.admin.deleteUser(svc.account_user_id);
      return ok();
    }
    // Déconnecte tous les appareils d'un service (départ d'un employé, appareil perdu).
    case "revoke_service_devices": {
      const { data: svc } = await admin.from("hotel_services").select("id").eq("id", b.serviceId ?? "").eq("hotel_id", hotel.id).maybeSingle();
      if (!svc) return fail("Service introuvable.", 404);
      await admin.from("hotel_stations").delete().eq("hotel_id", hotel.id).eq("service_id", svc.id);
      return ok();
    }

    case "set_manager_pin": {
      if (!isPin(b.pin)) return fail("Le PIN doit avoir 4 chiffres.");
      const { data: staff } = await admin
        .from("hotel_staff")
        .select("id")
        .eq("hotel_id", hotel.id)
        .eq("is_manager", true)
        .maybeSingle();
      const hash = pinHash(hotel.id, b.pin);
      const { error } = staff
        ? await admin.from("hotel_staff").update({ pin_hash: hash }).eq("id", staff.id)
        : await admin.from("hotel_staff").insert({ hotel_id: hotel.id, name: "Manager", is_manager: true, pin_hash: hash });
      if (error) return fail(error.code === "23505" ? PIN_TAKEN : "Impossible d'enregistrer.", error.code === "23505" ? 409 : 500);
      return ok();
    }

    case "add_staff": {
      const name = typeof b.name === "string" ? b.name.trim().slice(0, 80) : "";
      if (!name) return fail("Indiquez le nom.");
      if (!isPin(b.pin)) return fail("Le PIN doit avoir 4 chiffres.");
      const { data: roles } = await admin.from("hotel_tags").select("id").eq("hotel_id", hotel.id).in("id", b.roleIds ?? []);
      const { error } = await admin.from("hotel_staff").insert({
        hotel_id: hotel.id,
        name,
        pin_hash: pinHash(hotel.id, b.pin),
        role_ids: (roles ?? []).map((r) => r.id),
        ...(Array.isArray(b.serviceIds) ? { service_ids: await ownServiceIds(admin, hotel.id, b.serviceIds) } : {}),
      });
      if (error) return fail(error.code === "23505" ? PIN_TAKEN : "Impossible d'ajouter.", error.code === "23505" ? 409 : 500);
      return ok();
    }

    case "update_staff": {
      const { data: staff } = await admin
        .from("hotel_staff")
        .select("id, is_manager")
        .eq("id", b.id ?? "")
        .eq("hotel_id", hotel.id)
        .maybeSingle();
      if (!staff) return fail("Personne introuvable.", 404);
      const update = {};
      if (typeof b.name === "string" && b.name.trim()) update.name = b.name.trim().slice(0, 80);
      if (b.pin !== undefined && b.pin !== "") {
        if (!isPin(b.pin)) return fail("Le PIN doit avoir 4 chiffres.");
        update.pin_hash = pinHash(hotel.id, b.pin);
      }
      if (Array.isArray(b.roleIds)) {
        const { data: roles } = await admin.from("hotel_tags").select("id").eq("hotel_id", hotel.id).in("id", b.roleIds);
        update.role_ids = (roles ?? []).map((r) => r.id);
      }
      if (Array.isArray(b.serviceIds)) update.service_ids = await ownServiceIds(admin, hotel.id, b.serviceIds);
      if (typeof b.active === "boolean" && !staff.is_manager) update.active = b.active;
      // Responsable de service : voit qui a écrit et validé pour ses services ; il en faut au moins un.
      if (typeof b.supervisor === "boolean" && !staff.is_manager) {
        if (b.supervisor) {
          const services = update.service_ids ?? (await admin.from("hotel_staff").select("service_ids").eq("id", staff.id).maybeSingle()).data?.service_ids ?? [];
          if (services.length === 0) return fail("Choisissez d'abord au moins un service pour cette personne.");
        }
        update.is_supervisor = b.supervisor;
      }
      // Retirer tous les services d'un responsable lui retire aussi cette vue.
      if (update.service_ids && update.service_ids.length === 0 && b.supervisor !== true) update.is_supervisor = false;
      const { error } = await admin.from("hotel_staff").update(update).eq("id", staff.id);
      if (error) return fail(error.code === "23505" ? PIN_TAKEN : "Impossible d'enregistrer.", error.code === "23505" ? 409 : 500);
      return ok();
    }

    case "add_places": {
      const places = parsePlaces(b.text).map((p) => ({ ...p, hotel_id: hotel.id }));
      if (places.length === 0) return fail("Rien à ajouter. Exemple : 101-135, Spa, Bar.");
      const { error } = await admin.from("hotel_places").upsert(places, { onConflict: "hotel_id,name", ignoreDuplicates: true });
      return error ? fail("Impossible d'ajouter.", 500) : ok({ count: places.length });
    }
    case "delete_place": {
      await admin.from("hotel_places").delete().eq("id", b.id ?? "").eq("hotel_id", hotel.id);
      return ok();
    }

    case "add_tag": {
      // kind "role" : un poste de l'équipe (serveur, cuisinier, directeur…), en minuscules comme les autres.
      const kind = b.kind === "role" ? "role" : "custom";
      const raw = typeof b.name === "string" ? b.name.replace(/\s+/g, " ").trim().slice(0, 40) : "";
      const name = kind === "role" ? raw.toLowerCase() : raw;
      if (!name) return fail(kind === "role" ? "Indiquez le nom du poste." : "Indiquez le nom de l'étiquette.");
      const { error } = await admin.from("hotel_tags").insert({ hotel_id: hotel.id, name, kind });
      return error ? fail(error.code === "23505" ? (kind === "role" ? "Ce poste existe déjà." : "Cette étiquette existe déjà.") : "Impossible d'ajouter.", 409) : ok();
    }
    case "delete_tag": {
      await admin.from("hotel_tags").delete().eq("id", b.id ?? "").eq("hotel_id", hotel.id);
      return ok();
    }

    // Adresse officielle de l'hôtel : les réponses aux emails de relève y arrivent.
    case "set_reply_to": {
      const email = String(b.email ?? "").trim().toLowerCase();
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Cette adresse n'est pas valide.");
      const { error } = await admin.from("hotels").update({ reply_to: email || null }).eq("id", hotel.id);
      return error ? fail("Impossible d'enregistrer.", 500) : ok();
    }

    case "set_emails": {
      const emails = [...new Set(String(b.emails ?? "").split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean))];
      if (emails.length > 10) return fail("10 adresses au maximum.");
      if (emails.some((e) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e))) return fail("Une des adresses n'est pas valide.");
      const { error } = await admin.from("hotels").update({ notification_emails: emails }).eq("id", hotel.id);
      return error ? fail("Impossible d'enregistrer.", 500) : ok();
    }

    case "activate_station": {
      const token = crypto.randomBytes(32).toString("hex");
      let label = typeof b.label === "string" && b.label.trim() ? b.label.trim().slice(0, 60) : "";
      // Avec un service : ce poste ouvre le cahier de ce service (3 services au plus
      // par appareil). Sans service : ancien mode, tout l'hôtel.
      let serviceId = null;
      if (typeof b.serviceId === "string" && b.serviceId) {
        const { data: svc } = await admin.from("hotel_services").select("id, name").eq("id", b.serviceId).eq("hotel_id", hotel.id).eq("active", true).maybeSingle();
        if (!svc) return fail("Service introuvable.", 404);
        serviceId = svc.id;
        // Sans nom donné, le poste porte le nom du service.
        if (!label) label = svc.name;
      }
      if (!label) label = "Poste";
      const existing = stationTokens(request.cookies.get(STATION_COOKIE)?.value);
      if (serviceId && existing.length >= MAX_SERVICES_PER_DEVICE) {
        return fail(`Cet appareil porte déjà ${MAX_SERVICES_PER_DEVICE} services.`, 409);
      }
      const { error } = await admin
        .from("hotel_stations")
        .insert({ hotel_id: hotel.id, token_hash: sha256(token), label, service_id: serviceId });
      if (error) return fail("Impossible d'activer ce poste.", 500);
      const res = ok();
      const cookieOptions = { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 };
      res.cookies.set(STATION_COOKIE, serviceId ? [...existing, token].join(".") : token, cookieOptions);
      if (serviceId) res.cookies.set(SERVICE_COOKIE, serviceId, cookieOptions);
      return res;
    }
    // Code d'activation d'un nouveau poste (6 chiffres, 10 minutes, une fois).
    // Stocké comme un poste "en attente" : aucune table de plus.
    case "create_activation_code": {
      await admin
        .from("hotel_stations")
        .delete()
        .eq("hotel_id", hotel.id)
        .eq("label", PENDING_LABEL)
        .lt("created_at", new Date(Date.now() - LINK_HOURS * 3600 * 1000).toISOString());
      // Code lié à un service : l'appareil qui l'utilise ouvre le cahier de ce service.
      let serviceId = null;
      if (typeof b.serviceId === "string" && b.serviceId) {
        const { data: svc } = await admin.from("hotel_services").select("id").eq("id", b.serviceId).eq("hotel_id", hotel.id).eq("active", true).maybeSingle();
        if (!svc) return fail("Service introuvable.", 404);
        serviceId = svc.id;
      }
      for (let attempt = 0; attempt < 3; attempt++) {
        const code = String(crypto.randomInt(100000, 1000000));
        const { error } = await admin
          .from("hotel_stations")
          .insert({ hotel_id: hotel.id, token_hash: activationHash(hotel.id, code), label: PENDING_LABEL, service_id: serviceId });
        if (!error) return ok({ code, expiresInMinutes: ACTIVATION_MINUTES });
      }
      return fail("Impossible de créer le code.", 500);
    }
    // Lien d'activation envoyé par email à un service : à ouvrir sur l'ordinateur du service,
    // une seule fois, valable 24 h. Sans mot de passe ni compte. Même mécanique qu'un code.
    case "send_activation_link": {
      const email = String(b.email ?? "").trim().toLowerCase();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("Cette adresse email n'est pas valide.");
      const { data: svc } = await admin.from("hotel_services").select("id, name").eq("id", b.serviceId ?? "").eq("hotel_id", hotel.id).eq("active", true).maybeSingle();
      if (!svc) return fail("Service introuvable.", 404);
      await admin.from("hotel_stations").delete().eq("hotel_id", hotel.id).eq("label", PENDING_LABEL).lt("created_at", new Date(Date.now() - LINK_HOURS * 3600 * 1000).toISOString());
      // Au plus 10 liens par heure et par hôtel (évite d'envoyer des emails en rafale).
      const { count } = await admin.from("hotel_stations").select("id", { count: "exact", head: true }).eq("hotel_id", hotel.id).eq("label", PENDING_LABEL).not("service_id", "is", null).gte("created_at", new Date(Date.now() - 3600 * 1000).toISOString());
      if ((count ?? 0) >= 10) return fail("Trop de liens envoyés. Réessayez dans une heure.", 429);
      const slug = await slugForHotel(hotel.id, admin);
      if (!slug) return fail("Adresse du cahier introuvable.", 500);
      const secret = crypto.randomBytes(16).toString("hex");
      const { data: row, error } = await admin.from("hotel_stations").insert({ hotel_id: hotel.id, token_hash: activationHash(hotel.id, secret), label: PENDING_LABEL, service_id: svc.id }).select("id").single();
      if (error) return fail("Impossible de créer le lien.", 500);
      const link = `https://tourist-book.com/hotel/${slug}/cahier?lien=${secret}`;
      try {
        const sent = await sendHotelActivationLink({ to: email, hotelName: hotel.name, serviceName: svc.name, link, replyTo: hotel.reply_to || undefined });
        if (sent?.sent === false && process.env.NODE_ENV === "production") throw new Error("not sent");
      } catch (err) {
        console.error("activation link email failed:", err);
        await admin.from("hotel_stations").delete().eq("id", row.id);
        return fail("L'email n'a pas pu être envoyé. Réessayez dans un instant.", 502);
      }
      return ok(process.env.NODE_ENV === "production" ? {} : { devLink: link });
    }
    case "delete_station": {
      await admin.from("hotel_stations").delete().eq("id", b.id ?? "").eq("hotel_id", hotel.id);
      return ok();
    }

    // Lien privé des femmes de chambre (module Objets trouvés, s'il est activé).
    // Régénérer le lien invalide l'ancien : à faire si le lien a fuité.
    case "regen_lost_found_token": {
      if (hotel.lost_found_enabled !== true) return fail("Non autorisé", 403);
      const token = crypto.randomBytes(24).toString("hex");
      const { error } = await admin.from("hotels").update({ lost_found_token: token }).eq("id", hotel.id);
      return error ? fail("Impossible de générer le lien.", 500) : ok();
    }

    default:
      return fail("Action inconnue.");
  }
}
