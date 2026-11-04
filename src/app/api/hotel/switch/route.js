import { NextResponse } from "next/server";
import { HOTEL_COOKIE, getHotelContext } from "@/lib/hotelAuth";

// Liste des hôtels du compte manager (pour le sélecteur d'en-tête).
export async function GET() {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return NextResponse.json({ hotels: [] });
  return NextResponse.json({ hotels: ctx.hotels, current: ctx.hotel.id }, { headers: { "Cache-Control": "private, no-store" } });
}

// Change l'hôtel affiché : il doit appartenir au compte connecté.
export async function POST(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const b = await request.json().catch(() => ({}));
  const target = ctx.hotels.find((h) => h.id === b.hotelId);
  if (!target) return NextResponse.json({ error: "Hôtel introuvable." }, { status: 404 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(HOTEL_COOKIE, target.id, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
