import { NextResponse } from "next/server";
import { getHotelContext, resolveActor } from "@/lib/hotelAuth";
import { hotelHasAccess } from "@/lib/hotelBilling";
import { isDay, parisDate } from "@/lib/hotelTime";

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
    .select("id, closed_at")
    .eq("id", id)
    .eq("hotel_id", hotel.id)
    .maybeSingle();
  if (!consigne) return NextResponse.json({ error: "Consigne introuvable." }, { status: 404 });

  if (b.action === "reopen" && ctx.mode !== "manager") {
    return NextResponse.json({ error: "Seul le manager peut rouvrir une consigne." }, { status: 403 });
  }

  const actor = await resolveActor(ctx, b.pin);
  if (actor.error) return NextResponse.json({ error: actor.error }, { status: actor.status });

  let update;
  if (b.action === "close") {
    if (consigne.closed_at) return NextResponse.json({ ok: true });
    update = { closed_at: new Date().toISOString(), closed_by: actor.staff.id, closed_by_name: actor.staff.name };
  } else if (b.action === "reopen") {
    update = { closed_at: null, closed_by: null, closed_by_name: null };
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
