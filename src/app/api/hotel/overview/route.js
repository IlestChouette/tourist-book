import { NextResponse } from "next/server";
import { getHotelContext } from "@/lib/hotelAuth";
import { overviewConsignes } from "@/lib/hotelData";
import { cleanCustomTypes } from "@/lib/hotelTheme";

// Suivi de toutes les consignes (manager seulement) : filtres et recherche.
export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const sp = new URL(request.url).searchParams;
  const result = await overviewConsignes(ctx.hotel.id, {
    q: (sp.get("q") ?? "").slice(0, 100),
    serviceId: sp.get("service") ?? undefined,
    status: ["open", "done"].includes(sp.get("status")) ? sp.get("status") : "all",
    from: sp.get("from") ?? undefined,
    to: sp.get("to") ?? undefined,
    limit: 40,
    offset: Math.max(0, Number(sp.get("offset")) || 0),
    customTypes: cleanCustomTypes(ctx.hotel.consigne_types),
  });
  const { all, ...rest } = result;
  return NextResponse.json(rest, { headers: { "Cache-Control": "private, no-store" } });
}
