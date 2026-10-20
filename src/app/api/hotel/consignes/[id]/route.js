import { NextResponse } from "next/server";
import { getHotelContext, resolveActor } from "@/lib/hotelAuth";
import { hotelHasAccess } from "@/lib/hotelBilling";
import { isDay, parisDate } from "@/lib/hotelTime";
import { ackProgress } from "@/lib/hotelData";

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
      .insert({ consigne_id: id, staff_id: who.staff.id, staff_name: who.staff.name });
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
    update = { closed_at: new Date().toISOString(), closed_by: actor.staff.id, closed_by_name: actor.staff.name };
  } else if (b.action === "reopen") {
    update = { closed_at: null, closed_by: null, closed_by_name: null };
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
