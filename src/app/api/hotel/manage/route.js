import crypto from "crypto";
import { NextResponse } from "next/server";
import { cleanCustomTypes, THEMES } from "@/lib/hotelTheme";
import { SERVICES, cleanServices } from "@/lib/hotelServices";
import { stripe } from "@/lib/stripe";
import { ACTIVATION_MINUTES, PENDING_LABEL, activationHash, getHotelContext, isPin, pinHash, sha256, STATION_COOKIE } from "@/lib/hotelAuth";

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
      const { error } = await admin.from("hotels").update({ consigne_types: types }).eq("id", hotel.id);
      return error ? fail("Impossible d'enregistrer.", 500) : ok();
    }

    // Services de l'hôtel : ils fixent le prix (15 €/mois chacun). Si
    // l'abonnement est actif, la quantité Stripe suit, au prorata.
    case "set_services": {
      const ids = cleanServices(b.services);
      if (ids.length === 0) return fail("Gardez au moins un service.");
      const { error } = await admin.from("hotels").update({ services: ids }).eq("id", hotel.id);
      if (error) return fail("Impossible d'enregistrer.", 500);
      // Les étiquettes de poste correspondantes existent (pour adresser une consigne).
      await admin
        .from("hotel_tags")
        .upsert(SERVICES.filter((s) => ids.includes(s.id)).map((s) => ({ hotel_id: hotel.id, name: s.tag, kind: "role" })), { onConflict: "hotel_id,name", ignoreDuplicates: true });
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
      if (typeof b.active === "boolean" && !staff.is_manager) update.active = b.active;
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
      const name = typeof b.name === "string" ? b.name.trim().slice(0, 40) : "";
      if (!name) return fail("Indiquez le nom de l'étiquette.");
      const { error } = await admin.from("hotel_tags").insert({ hotel_id: hotel.id, name, kind: "custom" });
      return error ? fail(error.code === "23505" ? "Cette étiquette existe déjà." : "Impossible d'ajouter.", 409) : ok();
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
      const label = typeof b.label === "string" && b.label.trim() ? b.label.trim().slice(0, 60) : "Réception";
      const { error } = await admin
        .from("hotel_stations")
        .insert({ hotel_id: hotel.id, token_hash: sha256(token), label });
      if (error) return fail("Impossible d'activer ce poste.", 500);
      const res = ok();
      res.cookies.set(STATION_COOKIE, token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
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
        .lt("created_at", new Date(Date.now() - ACTIVATION_MINUTES * 60 * 1000).toISOString());
      for (let attempt = 0; attempt < 3; attempt++) {
        const code = String(crypto.randomInt(100000, 1000000));
        const { error } = await admin
          .from("hotel_stations")
          .insert({ hotel_id: hotel.id, token_hash: activationHash(hotel.id, code), label: PENDING_LABEL });
        if (!error) return ok({ code, expiresInMinutes: ACTIVATION_MINUTES });
      }
      return fail("Impossible de créer le code.", 500);
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
