import { NextResponse } from "next/server";
import { getHotelContext } from "@/lib/hotelAuth";
import { loadDay, loadMeta } from "@/lib/hotelData";
import { buildDayPdf } from "@/lib/hotelPdf";
import { isDay, parisDate } from "@/lib/hotelTime";

// PDF d'une journée du cahier, téléchargeable à tout moment. Les noms des
// auteurs n'y figurent que pour le manager.
export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const day = new URL(request.url).searchParams.get("day") || parisDate();
  if (!isDay(day)) return NextResponse.json({ error: "Date invalide" }, { status: 400 });

  const withNames = ctx.mode === "manager";
  const [items, meta] = await Promise.all([loadDay(ctx.hotel.id, day, withNames), loadMeta(ctx.hotel.id)]);
  const pdf = await buildDayPdf({
    hotelName: ctx.hotel.name,
    day,
    items,
    tagNames: Object.fromEntries(meta.tags.map((t) => [t.id, t.name])),
    withNames,
  });
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="consignes-${day}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
