import { NextResponse } from "next/server";
import { canSeeNames, getHotelContext } from "@/lib/hotelAuth";
import { hotelHasAccess } from "@/lib/hotelBilling";
import { searchConsignes } from "@/lib/hotelData";
import { MIN_QUERY } from "@/lib/hotelSearch";
import { cleanCustomTypes } from "@/lib/hotelTheme";

// Recherche par mots-clés dans le cahier de l'hôtel (équipe et manager).
export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Abonnement en pause : les postes ne lisent plus rien (le manager garde accès pour régler).
  if (ctx.mode !== "manager" && !hotelHasAccess(ctx.hotel)) {
    return NextResponse.json({ error: "L'accès au cahier est suspendu. Prévenez votre manager." }, { status: 402 });
  }

  const q = (new URL(request.url).searchParams.get("q") ?? "").slice(0, 100);
  if (q.trim().length < MIN_QUERY) return NextResponse.json({ items: [], total: 0 });

  const result = await searchConsignes(ctx.hotel.id, q, {
    showNames: canSeeNames(ctx, ctx.service?.id),
    customTypes: cleanCustomTypes(ctx.hotel.consigne_types),
    serviceId: ctx.service?.id ?? null,
  });
  return NextResponse.json(result, { headers: { "Cache-Control": "private, no-store" } });
}
