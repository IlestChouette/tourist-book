import { NextResponse } from "next/server";
import { getHotelContext, resolveActor } from "@/lib/hotelAuth";
import { addDays, isDay, parisDate } from "@/lib/hotelTime";

const KINDS = ["info", "tache", "probleme", "plainte"];

// Création d'une consigne. Sur un poste de réception, la personne s'identifie
// avec son PIN à chaque consigne ; le manager connecté est identifié d'office.
export async function POST(request) {
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const b = await request.json().catch(() => ({}));
  const body = typeof b.body === "string" ? b.body.trim() : "";
  if (!body || body.length > 2000) {
    return NextResponse.json({ error: "Écrivez la consigne (2000 caractères maximum)." }, { status: 400 });
  }
  if (!KINDS.includes(b.kind)) return NextResponse.json({ error: "Type invalide." }, { status: 400 });

  const today = parisDate();
  const day = b.day || today;
  if (!isDay(day) || day < today || day > addDays(today, 365)) {
    return NextResponse.json({ error: "Date invalide : aujourd'hui ou plus tard." }, { status: 400 });
  }

  const { admin, hotel } = ctx;
  const { data: place } = await admin
    .from("hotel_places")
    .select("id, name")
    .eq("hotel_id", hotel.id)
    .eq("id", b.placeId ?? "")
    .maybeSingle();
  if (!place) return NextResponse.json({ error: "Choisissez une chambre ou un lieu." }, { status: 400 });

  const requestedTags = Array.isArray(b.tagIds) ? b.tagIds : [];
  const { data: tags } = await admin.from("hotel_tags").select("id").eq("hotel_id", hotel.id).in("id", requestedTags);
  const tagIds = (tags ?? []).map((t) => t.id);

  let pinnedUntil = null;
  if (b.pinnedUntil) {
    if (!isDay(b.pinnedUntil) || b.pinnedUntil < day) {
      return NextResponse.json({ error: "Date d'épinglage invalide." }, { status: 400 });
    }
    pinnedUntil = `${b.pinnedUntil}T21:59:59Z`;
  }

  const actor = await resolveActor(ctx, b.pin);
  if (actor.error) return NextResponse.json({ error: actor.error }, { status: actor.status });

  const { error } = await admin.from("consignes").insert({
    hotel_id: hotel.id,
    day,
    body,
    kind: b.kind,
    place_id: place.id,
    place_name: place.name,
    tag_ids: tagIds,
    priority: Boolean(b.priority),
    created_by: actor.staff.id,
    created_by_name: actor.staff.name,
    pinned: Boolean(pinnedUntil),
    pinned_until: pinnedUntil,
  });
  if (error) {
    console.error("consigne insert failed:", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la consigne." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
