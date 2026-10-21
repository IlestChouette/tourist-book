import { NextResponse } from "next/server";
import { hotelHasAccess } from "@/lib/hotelBilling";
import { getHotelContext } from "@/lib/hotelAuth";
import { overviewConsignes } from "@/lib/hotelData";
import { cleanCustomTypes } from "@/lib/hotelTheme";

// Suivi de toutes les consignes (manager ; un responsable : ses services seulement) : filtres et recherche.
export async function GET(request) {
  const ctx = await getHotelContext();
  const supervisor = ctx?.mode === "station" ? ctx.supervisor : null;
  if (!ctx || (ctx.mode !== "manager" && !supervisor)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (supervisor && !hotelHasAccess(ctx.hotel)) return NextResponse.json({ error: "L'accès au cahier est suspendu." }, { status: 402 });

  const sp = new URL(request.url).searchParams;
  const result = await overviewConsignes(ctx.hotel.id, {
    q: (sp.get("q") ?? "").slice(0, 100),
    serviceId: sp.get("service") ?? undefined,
    scopeServiceIds: supervisor ? supervisor.serviceIds : undefined,
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
