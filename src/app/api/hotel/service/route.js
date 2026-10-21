import { NextResponse } from "next/server";
import { SERVICE_COOKIE, getHotelContext } from "@/lib/hotelAuth";

// Change le service affiché sur un poste qui en porte plusieurs (jusqu'à 3).
// Aucun mot de passe : le poste a déjà été activé pour chacun d'eux.
export async function POST(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "station") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const b = await request.json().catch(() => ({}));
  const target = ctx.services.find((s) => s.id === b.serviceId);
  if (!target) return NextResponse.json({ error: "Ce service n'est pas activé sur cet appareil." }, { status: 404 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SERVICE_COOKIE, target.id, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
