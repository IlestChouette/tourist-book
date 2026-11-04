import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createHotel } from "@/lib/hotelCreate";
import { HOTEL_COOKIE } from "@/lib/hotelAuth";

// Un compte déjà connecté (par exemple un hôtelier de livrets) crée aussi son
// espace hôtel, sans refaire d'inscription. Un compte peut gérer plusieurs hôtels (groupe) : chacun a son logo et sa configuration.
export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connectez-vous d'abord." }, { status: 401 });

  // Un accès de service sert uniquement à activer un appareil : jamais à créer un hôtel.
  if (user.user_metadata?.account_type === "hotel_service") {
    return NextResponse.json({ error: "Cet accès est celui d'un service : il ne peut pas créer d'hôtel." }, { status: 403 });
  }

  const b = await request.json().catch(() => ({}));
  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Indiquez le nom de l'hôtel (2 à 120 caractères)." }, { status: 400 });
  }

  const { count } = await createAdminClient().from("hotels").select("id", { count: "exact", head: true }).eq("owner_id", user.id);
  if ((count ?? 0) >= 20) return NextResponse.json({ error: "20 hôtels au maximum par compte. Contactez-nous pour un groupe plus grand." }, { status: 400 });
  const id = await createHotel(user, name, { notify: true });
  if (!id) return NextResponse.json({ error: "Impossible de créer l'espace hôtel. Réessayez." }, { status: 500 });
  // On affiche tout de suite le nouvel hôtel, à configurer (logo, services, équipe).
  const res = NextResponse.json({ ok: true, id });
  res.cookies.set(HOTEL_COOKIE, id, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
