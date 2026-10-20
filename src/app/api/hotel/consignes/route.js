import { NextResponse } from "next/server";
import { getHotelContext, resolveActor } from "@/lib/hotelAuth";
import { hotelHasAccess } from "@/lib/hotelBilling";
import { addDays, isDay, parisDate } from "@/lib/hotelTime";
import crypto from "crypto";
import { cleanCustomTypes } from "@/lib/hotelTheme";
import { listServices } from "@/lib/hotelData";

const KINDS = ["info", "tache", "probleme", "plainte"];

// Création d'une consigne. Sur un poste de réception, la personne s'identifie
// avec son PIN à chaque consigne ; le manager connecté est identifié d'office.
export async function POST(request) {
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!hotelHasAccess(ctx.hotel)) {
    return NextResponse.json({ error: "L'accès au cahier est suspendu. Prévenez votre manager." }, { status: 402 });
  }

  const b = await request.json().catch(() => ({}));
  const body = typeof b.body === "string" ? b.body.trim() : "";
  if (!body || body.length > 2000) {
    return NextResponse.json({ error: "Écrivez la consigne (2000 caractères maximum)." }, { status: 400 });
  }
  // Type propre à l'hôtel : on retient son type de base (statistiques) et son id.
  let kind = b.kind;
  let typeId = null;
  if (typeof b.typeId === "string" && b.typeId) {
    const custom = cleanCustomTypes(ctx.hotel.consigne_types).find((t) => t.id === b.typeId && t.active);
    if (!custom) return NextResponse.json({ error: "Type invalide." }, { status: 400 });
    kind = custom.kind;
    typeId = custom.id;
  }
  if (!KINDS.includes(kind)) return NextResponse.json({ error: "Type invalide." }, { status: 400 });

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

  // Services destinataires : un poste lié à un service écrit par défaut pour
  // son service ; on peut en viser d'autres (la consigne apparaît chez eux).
  // Une ligne par service, même group_id : chaque service ferme la sienne.
  // Hôtel sans services définis : comportement d'avant (une ligne, sans service).
  const services = await listServices(hotel.id);
  let targets = [];
  if (services.length > 0) {
    const asked = Array.isArray(b.serviceIds) ? b.serviceIds : [];
    targets = services.filter((s) => asked.includes(s.id)).map((s) => s.id);
    if (targets.length === 0 && ctx.service) targets = [ctx.service.id];
    if (targets.length === 0) {
      return NextResponse.json({ error: "Choisissez pour quel service est cette consigne." }, { status: 400 });
    }
  }
  const groupId = targets.length > 0 ? crypto.randomUUID() : null;
  const base = {
    hotel_id: hotel.id,
    day,
    body,
    kind,
    // Colonne absente avant la migration : on ne l'envoie que si utile.
    ...(typeId ? { type_id: typeId } : {}),
    place_id: place.id,
    place_name: place.name,
    tag_ids: tagIds,
    priority: Boolean(b.priority),
    created_by: actor.staff.id,
    created_by_name: actor.staff.name,
    pinned: Boolean(pinnedUntil),
    pinned_until: pinnedUntil,
  };
  const rows =
    targets.length > 0
      ? targets.map((serviceId) => ({ ...base, service_id: serviceId, from_service_id: ctx.service?.id ?? null, group_id: groupId }))
      : [base];
  const { error } = await admin.from("consignes").insert(rows);
  if (error) {
    console.error("consigne insert failed:", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la consigne." }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
