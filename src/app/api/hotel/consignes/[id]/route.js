import { NextResponse } from "next/server";
import { getHotelContext, resolveActor } from "@/lib/hotelAuth";
import { hotelHasAccess } from "@/lib/hotelBilling";
import { isDay, parisDate } from "@/lib/hotelTime";
import { ackProgress } from "@/lib/hotelData";
import { cleanCustomTypes } from "@/lib/hotelTheme";

const KINDS = ["info", "tache", "probleme", "plainte"];

// Actions sur une consigne existante : clôturer (valider), rouvrir (manager),
// épingler / désépingler. Une consigne n'est jamais supprimée : le cahier est
// un registre, on garde l'historique.
export async function PATCH(request, { params }) {
  const { id } = await params;
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!hotelHasAccess(ctx.hotel)) {
    return NextResponse.json({ error: "L'accès au cahier est suspendu. Prévenez votre manager." }, { status: 402 });
  }

  const b = await request.json().catch(() => ({}));
  const { admin, hotel } = ctx;

  const { data: consigne } = await admin
    .from("consignes")
    .select("id, closed_at, service_id, require_all")
    .eq("id", id)
    .eq("hotel_id", hotel.id)
    .maybeSingle();
  if (!consigne) return NextResponse.json({ error: "Consigne introuvable." }, { status: 404 });

  // Un poste lié à un service ne touche qu'aux consignes de son service (et
  // aux anciennes consignes sans service).
  if (ctx.service && consigne.service_id && consigne.service_id !== ctx.service.id) {
    return NextResponse.json({ error: "Cette consigne est celle d'un autre service." }, { status: 403 });
  }

  // Consigne « chaque personne doit valider » : chacun valide avec son propre
  // code ; elle se clôture toute seule quand la dernière personne a validé.
  // Modifier une consigne : avec son code personnel (qui est enregistré), sans effacer
  // l'ancienne version. Une consigne envoyée à plusieurs services reste la même partout.
  // Si le texte change, les validations déjà données ne valent plus pour le nouveau texte.
  if (b.action === "edit") {
    const who = await resolveActor(ctx, b.pin, { managerPin: true });
    if (who.error) return NextResponse.json({ error: who.error }, { status: who.status });
    const { data: cur } = await admin.from("consignes").select("*").eq("id", id).eq("hotel_id", hotel.id).single();
    if (cur.closed_at && ctx.mode !== "manager") {
      return NextResponse.json({ error: "Cette consigne est terminée : seul le manager peut la modifier." }, { status: 403 });
    }

    const body = typeof b.body === "string" ? b.body.trim() : cur.body;
    if (!body || body.length > 2000) return NextResponse.json({ error: "Écrivez la consigne (2000 caractères maximum)." }, { status: 400 });

    let kind = typeof b.kind === "string" ? b.kind : cur.kind;
    let typeId = b.kind === undefined && b.typeId === undefined ? cur.type_id ?? null : null;
    if (typeof b.typeId === "string" && b.typeId) {
      const custom = cleanCustomTypes(hotel.consigne_types).find((t) => t.id === b.typeId && t.active);
      if (!custom) return NextResponse.json({ error: "Type invalide." }, { status: 400 });
      kind = custom.kind;
      typeId = custom.id;
    }
    if (!KINDS.includes(kind)) return NextResponse.json({ error: "Type invalide." }, { status: 400 });

    let place = { id: cur.place_id, name: cur.place_name };
    if (typeof b.placeId === "string" && b.placeId && b.placeId !== cur.place_id) {
      const { data: found } = await admin.from("hotel_places").select("id, name").eq("hotel_id", hotel.id).eq("id", b.placeId).maybeSingle();
      if (!found) return NextResponse.json({ error: "Choisissez une chambre ou un lieu." }, { status: 400 });
      place = found;
    }
    let tagIds = cur.tag_ids ?? [];
    if (Array.isArray(b.tagIds)) {
      const { data: tags } = await admin.from("hotel_tags").select("id").eq("hotel_id", hotel.id).in("id", b.tagIds);
      tagIds = (tags ?? []).map((t) => t.id);
    }
    const priority = typeof b.priority === "boolean" ? b.priority : Boolean(cur.priority);

    const snap = (r) => ({ body: r.body, kind: r.kind, typeId: r.type_id ?? null, placeName: r.place_name, tagIds: [...(r.tag_ids ?? [])].sort(), priority: Boolean(r.priority) });
    const next = { body, kind, typeId, placeName: place.name, tagIds: [...tagIds].sort(), priority };
    if (JSON.stringify(snap(cur)) === JSON.stringify(next)) return NextResponse.json({ ok: true, unchanged: true });

    const { data: copies } = cur.group_id
      ? await admin.from("consignes").select("*").eq("hotel_id", hotel.id).eq("group_id", cur.group_id)
      : { data: [cur] };
    const bodyChanged = body !== cur.body;
    const now = new Date().toISOString();
    for (const row of copies ?? [cur]) {
      const before = snap(row);
      let acksReset = 0;
      const update = { body, kind, type_id: typeId, place_id: place.id, place_name: place.name, tag_ids: tagIds, priority, edited_at: now };
      if (bodyChanged && row.require_all) {
        const { count } = await admin.from("consigne_acks").select("consigne_id", { count: "exact", head: true }).eq("consigne_id", row.id);
        acksReset = count ?? 0;
        await admin.from("consigne_acks").delete().eq("consigne_id", row.id);
        // Fermée parce que tout le monde avait validé : elle se rouvre pour le nouveau texte.
        if (row.closed_at && row.closed_by_name === "Toute l'équipe") Object.assign(update, { closed_at: null, closed_by: null, closed_by_name: null });
      }
      const { error } = await admin.from("consignes").update(update).eq("id", row.id).eq("hotel_id", hotel.id);
      if (error) return NextResponse.json({ error: "Impossible de modifier la consigne." }, { status: 500 });
      await admin.from("consigne_edits").insert({
        consigne_id: row.id,
        hotel_id: hotel.id,
        edited_by: who.staff.id,
        edited_by_name: who.staff.name,
        before,
        after: { ...next, ...(acksReset ? { acksReset } : {}) },
      });
    }
    return NextResponse.json({ ok: true });
  }

  // Précision facultative donnée en validant (information complémentaire pour la suite).
  const comment = typeof b.comment === "string" ? b.comment.replace(/\s+/g, " ").trim().slice(0, 500) : "";

  if (b.action === "ack") {
    if (ctx.mode === "manager") {
      return NextResponse.json({ error: "Ce sont les personnes du service qui valident, avec leur code, sur le poste." }, { status: 400 });
    }
    if (!consigne.require_all) return NextResponse.json({ error: "Action invalide." }, { status: 400 });
    if (consigne.closed_at) return NextResponse.json({ ok: true, complete: true });

    const who = await resolveActor(ctx, b.pin, { managerPin: true });
    if (who.error) return NextResponse.json({ error: who.error }, { status: who.status });
    const { data: person } = await admin.from("hotel_staff").select("service_ids").eq("id", who.staff.id).maybeSingle();
    if (!(person?.service_ids ?? []).includes(consigne.service_id)) {
      return NextResponse.json({ error: "Cette consigne n'est pas pour votre service." }, { status: 403 });
    }

    const { error: ackError } = await admin
      .from("consigne_acks")
      .insert({ consigne_id: id, staff_id: who.staff.id, staff_name: who.staff.name, ...(comment ? { comment } : {}) });
    const already = ackError?.code === "23505";
    if (ackError && !already) return NextResponse.json({ error: "Impossible d'enregistrer votre validation." }, { status: 500 });

    const progress = (await ackProgress(admin, hotel.id, [consigne])).get(id);
    if (progress?.complete) {
      await admin
        .from("consignes")
        .update({ closed_at: new Date().toISOString(), closed_by_name: "Toute l'équipe" })
        .eq("id", id)
        .eq("hotel_id", hotel.id);
    }
    return NextResponse.json({ ok: true, already, complete: Boolean(progress?.complete) });
  }
  if (b.action === "close" && consigne.require_all && ctx.mode !== "manager") {
    return NextResponse.json({ error: "Chaque personne du service doit valider avec son code." }, { status: 400 });
  }

  if (b.action === "reopen" && ctx.mode !== "manager") {
    return NextResponse.json({ error: "Seul le manager peut rouvrir une consigne." }, { status: 403 });
  }

  const actor = await resolveActor(ctx, b.pin, { managerPin: b.action === "close" || b.action === "reopen" });
  if (actor.error) return NextResponse.json({ error: actor.error }, { status: actor.status });

  let update;
  if (b.action === "close") {
    if (consigne.closed_at) return NextResponse.json({ ok: true });
    update = { closed_at: new Date().toISOString(), closed_by: actor.staff.id, closed_by_name: actor.staff.name, ...(comment ? { closed_comment: comment } : {}) };
  } else if (b.action === "reopen") {
    update = { closed_at: null, closed_by: null, closed_by_name: null };
    // Colonne ajoutée plus tard : un échec ici ne doit jamais empêcher de rouvrir.
    await admin.from("consignes").update({ closed_comment: null }).eq("id", id).eq("hotel_id", hotel.id);
    // Une consigne à valider par tous repart de zéro.
    if (consigne.require_all) await admin.from("consigne_acks").delete().eq("consigne_id", id);
  } else if (b.action === "pin") {
    if (!isDay(b.until) || b.until < parisDate()) {
      return NextResponse.json({ error: "Choisissez une date de fin d'épinglage." }, { status: 400 });
    }
    update = { pinned: true, pinned_until: `${b.until}T21:59:59Z` };
  } else if (b.action === "unpin") {
    update = { pinned: false, pinned_until: null };
  } else {
    return NextResponse.json({ error: "Action invalide." }, { status: 400 });
  }

  const { error } = await admin.from("consignes").update(update).eq("id", id).eq("hotel_id", hotel.id);
  if (error) return NextResponse.json({ error: "Impossible de modifier la consigne." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
