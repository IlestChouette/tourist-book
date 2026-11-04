import { NextResponse } from "next/server";
import { getPropertyBySlug, hasActiveSubscription } from "@/lib/properties";
import { blocked, clear, clientIp, fail } from "@/lib/rateLimit";

const WINDOW = 10 * 60_000, MAX_FAILS = 10;

export async function POST(request) {
  const { slug, code } = await request.json();
  // Le code a 4 chiffres : on bloque les essais en rafale (10 échecs / 10 min par IP et logement).
  const key = `access:${clientIp(request)}:${slug}`;
  if (blocked(key, MAX_FAILS, WINDOW)) return NextResponse.json({ ok: false, error: "Trop d'essais. Réessayez dans quelques minutes." }, { status: 429 });
  const property = await getPropertyBySlug(slug);

  if (!property || String(code ?? "").trim() !== property.access_code) {
    fail(key, WINDOW);
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  clear(key);

  if (!hasActiveSubscription(property)) {
    return NextResponse.json({ ok: false, error: "Abonnement inactif" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(`access_${slug}`, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
