import { NextResponse } from "next/server";
import { getHotelContext } from "@/lib/hotelAuth";
import { isUuid, loadDay, loadSent } from "@/lib/hotelData";
import { isDay, parisDate } from "@/lib/hotelTime";

// Le cahier du jour. Un poste lié à un service ne reçoit que ce service ; le
// manager voit tout et peut filtrer avec ?service=<id>.
export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const sp = new URL(request.url).searchParams;
  const day = sp.get("day") || parisDate();
  if (!isDay(day)) return NextResponse.json({ error: "Date invalide" }, { status: 400 });

  const manager = ctx.mode === "manager";
  const requested = sp.get("service");
  const serviceId = ctx.service ? ctx.service.id : manager && isUuid(requested) ? requested : null;

  const [items, sent] = await Promise.all([
    loadDay(ctx.hotel.id, day, manager, { serviceId }),
    ctx.service ? loadSent(ctx.hotel.id, ctx.service.id, day) : [],
  ]);
  return NextResponse.json({ items, sent });
}
