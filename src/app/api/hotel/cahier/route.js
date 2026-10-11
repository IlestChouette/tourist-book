import { NextResponse } from "next/server";
import { getHotelContext } from "@/lib/hotelAuth";
import { loadDay } from "@/lib/hotelData";
import { isDay, parisDate } from "@/lib/hotelTime";

export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const day = new URL(request.url).searchParams.get("day") || parisDate();
  if (!isDay(day)) return NextResponse.json({ error: "Date invalide" }, { status: 400 });

  const items = await loadDay(ctx.hotel.id, day, ctx.mode === "manager");
  return NextResponse.json({ items });
}
