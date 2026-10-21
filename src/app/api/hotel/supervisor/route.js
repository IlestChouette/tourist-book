import { NextResponse } from "next/server";
import { SUPERVISOR_COOKIE, SUPERVISOR_HOURS, getHotelContext, isPin, pinHash, signSupervisor } from "@/lib/hotelAuth";
import { hotelHasAccess } from "@/lib/hotelBilling";

const fail = (error, status) => NextResponse.json({ error }, { status });
const MAX_FAILURES = 8;
const LOCK_MINUTES = 10;

// Vue « responsable » d'un poste de service : le code personnel d'une personne
// marquée responsable de ce service montre qui a écrit et validé, pour ce service.
export async function POST(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "station" || !ctx.service) return fail("Non autorisé", 401);
  if (!hotelHasAccess(ctx.hotel)) return fail("L'accès au cahier est suspendu.", 402);
  const { admin, hotel } = ctx;

  const { pin } = await request.json().catch(() => ({}));
  if (!isPin(pin)) return fail("Saisissez votre code à 4 chiffres.", 400);

  const since = new Date(Date.now() - LOCK_MINUTES * 60 * 1000).toISOString();
  const { count } = await admin.from("hotel_pin_failures").select("id", { count: "exact", head: true }).eq("station_id", ctx.station.id).gte("created_at", since);
  if ((count ?? 0) >= MAX_FAILURES) return fail(`Trop d'essais. Réessayez dans ${LOCK_MINUTES} minutes.`, 429);

  const { data: staff } = await admin
    .from("hotel_staff")
    .select("id, name, service_ids")
    .eq("hotel_id", hotel.id)
    .eq("pin_hash", pinHash(hotel.id, pin))
    .eq("active", true)
    .eq("is_supervisor", true)
    .maybeSingle();
  if (!staff || !(staff.service_ids ?? []).includes(ctx.service.id)) {
    await admin.from("hotel_pin_failures").insert({ station_id: ctx.station.id });
    return fail("Code incorrect, ou vous n'êtes pas responsable de ce service.", 403);
  }

  const res = NextResponse.json({ ok: true, name: staff.name });
  res.cookies.set(SUPERVISOR_COOKIE, signSupervisor(staff.id), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SUPERVISOR_HOURS * 3600 });
  return res;
}

// Quitter la vue responsable.
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SUPERVISOR_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
