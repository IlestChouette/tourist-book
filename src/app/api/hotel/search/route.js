import { NextResponse } from "next/server";
import { getHotelContext } from "@/lib/hotelAuth";
import { searchConsignes } from "@/lib/hotelData";
import { MIN_QUERY } from "@/lib/hotelSearch";
import { cleanCustomTypes } from "@/lib/hotelTheme";

// Recherche par mots-clés dans le cahier de l'hôtel (équipe et manager).
export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const q = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 100);
  if (q.trim().length < MIN_QUERY) return NextResponse.json({ items: [], total: 0 });

  const result = await searchConsignes(ctx.hotel.id, q, {
    showNames: ctx.mode === "manager",
    customTypes: cleanCustomTypes(ctx.hotel.consigne_types),
    serviceId: ctx.service?.id ?? null,
  });
  return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
}
