import { NextResponse } from "next/server";
import { resolveActor } from "@/lib/hotelAuth";
import { CATEGORIES, CLOSED_STATUSES, ITEM_COLUMNS, STATUSES, isEmail } from "@/lib/lostFound";
import { getLostFoundContext } from "@/lib/lostFoundServer";

const fail = (error, status = 400) => NextResponse.json({ error }, { status });

export async function GET() {
  const ctx = await getLostFoundContext();
  if (!ctx) return fail("Non autorisé", 401);
  const { data, error } = await ctx.admin
    .from("lost_items")
    .select(ITEM_COLUMNS)
    .eq("hotel_id", ctx.hotel.id)
    .order("found_at", { ascending: false })
    .limit(2000);
  if (error) return fail("Lecture impossible.", 500);
  return NextResponse.json({ items: data ?? [], retentionMonths: ctx.hotel.retention_months ?? 36 });
}

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

// Modification d'un objet par la gouvernante ou la réception.
export async function PATCH(request) {
  const ctx = await getLostFoundContext();
  if (!ctx) return fail("Non autorisé", 401);
  const b = await request.json().catch(() => ({}));

  const { data: item } = await ctx.admin.from("lost_items").select("id").eq("id", b.id ?? "").eq("hotel_id", ctx.hotel.id).maybeSingle();
  if (!item) return fail("Objet introuvable.", 404);

  const actor = await resolveActor(ctx, b.pin);
  if (actor.error) return fail(actor.error, actor.status);

  const p = b.patch ?? {};
  const update = { updated_at: new Date().toISOString() };
  const set = (key, value) => value !== undefined && (update[key] = value === "" ? null : value);
  set("room_text", clean(p.room, 30));
  if (typeof p.room === "string") {
    const room = p.room.trim();
    const { data: place } = room ? await ctx.admin.from("hotel_places").select("id").eq("hotel_id", ctx.hotel.id).ilike("name", room).maybeSingle() : { data: null };
    update.room_confirmed = Boolean(place);
  }
  if (typeof p.description === "string") update.description = p.description.trim().slice(0, 500);
  set("storage_location", clean(p.storageLocation, 120));
  set("guest_name", clean(p.guestName, 120));
  set("guest_phone", clean(p.guestPhone, 40));
  set("notes", clean(p.notes, 1000));
  if (p.category !== undefined) {
    if (p.category !== "" && !CATEGORIES.includes(p.category)) return fail("Catégorie invalide.");
    set("category", p.category);
  }
  if (p.guestEmail !== undefined) {
    if (p.guestEmail !== "" && !isEmail(p.guestEmail)) return fail("Adresse email invalide.");
    set("guest_email", clean(p.guestEmail, 200)?.toLowerCase());
  }
  if (p.foundAt !== undefined) {
    const t = Date.parse(p.foundAt);
    if (Number.isNaN(t) || t > Date.now() + 86400000) return fail("Date invalide.");
    update.found_at = new Date(t).toISOString();
  }
  if (p.status !== undefined) {
    if (!STATUSES[p.status]) return fail("Statut invalide.");
    update.status = p.status;
    update.closed_at = CLOSED_STATUSES.includes(p.status) ? new Date().toISOString() : null;
  }

  const { error } = await ctx.admin.from("lost_items").update(update).eq("id", item.id).eq("hotel_id", ctx.hotel.id);
  if (error) return fail("Impossible d'enregistrer.", 500);
  return NextResponse.json({ ok: true });
}
