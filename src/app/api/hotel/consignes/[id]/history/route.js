import { NextResponse } from "next/server";
import { canSeeNames, getHotelContext } from "@/lib/hotelAuth";
import { hotelHasAccess } from "@/lib/hotelBilling";

// Historique des modifications d'une consigne : qui a changé quoi, et quand. Réservé à ceux
// qui voient déjà les noms (manager, responsable du service) ; le personnel voit seulement
// que la consigne a été modifiée.
export async function GET(_request, { params }) {
  const { id } = await params;
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (!hotelHasAccess(ctx.hotel)) return NextResponse.json({ error: "L'accès au cahier est suspendu." }, { status: 402 });
  const { admin, hotel } = ctx;
  const { data: consigne } = await admin.from("consignes").select("id, service_id").eq("id", id).eq("hotel_id", hotel.id).maybeSingle();
  if (!consigne) return NextResponse.json({ error: "Consigne introuvable." }, { status: 404 });
  if (!canSeeNames(ctx, consigne.service_id)) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  const { data } = await admin.from("consigne_edits").select("edited_at, edited_by_name, before, after").eq("consigne_id", id).order("edited_at", { ascending: true });
  return NextResponse.json({ edits: (data ?? []).map((e) => ({ at: e.edited_at, by: e.edited_by_name, before: e.before, after: e.after })) }, { headers: { "Cache-Control": "private, no-store" } });
}
