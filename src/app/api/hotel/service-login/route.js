import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MAX_SERVICES_PER_DEVICE, SERVICE_COOKIE, STATION_COOKIE, sha256, stationTokens } from "@/lib/hotelAuth";
import { slugForHotel } from "@/lib/hotelSlug";

// Connexion d'un service par email + mot de passe. Le compte ne sert qu'à
// activer l'appareil pour ce service (jusqu'à 3 par appareil) : on crée le poste,
// on le range dans le cookie de l'appareil, puis on ferme la session — ensuite
// on passe d'un service à l'autre sans mot de passe, et chaque action demande
// le code personnel. Un compte qui n'est pas celui d'un service reçoit
// { service: false } et suit son chemin habituel (manager).
export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connectez-vous d'abord." }, { status: 401 });

  const admin = createAdminClient();
  const { data: service } = await admin
    .from("hotel_services")
    .select("id, name, active, hotel_id")
    .eq("account_user_id", user.id)
    .maybeSingle();
  if (!service) return NextResponse.json({ service: false });
  if (!service.active) return NextResponse.json({ error: "Ce service est désactivé. Prévenez votre manager." }, { status: 403 });

  const existing = stationTokens(request.cookies.get(STATION_COOKIE)?.value);
  const { data: rows } = existing.length
    ? await admin.from("hotel_stations").select("id, service_id").in("token_hash", existing.map(sha256))
    : { data: [] };
  const already = (rows ?? []).some((r) => r.service_id === service.id);

  const cookieOptions = { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 };
  let tokens = existing;
  if (!already) {
    if (existing.length >= MAX_SERVICES_PER_DEVICE) {
      return NextResponse.json({ error: `Cet appareil porte déjà ${MAX_SERVICES_PER_DEVICE} services. Demandez à votre manager d'en désactiver un.` }, { status: 409 });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const { error } = await admin
      .from("hotel_stations")
      .insert({ hotel_id: service.hotel_id, token_hash: sha256(token), label: `Poste (${service.name})`, service_id: service.id });
    if (error) return NextResponse.json({ error: "Impossible d'activer cet appareil." }, { status: 500 });
    tokens = [...existing, token];
  }

  // Fin de la session du compte : il n'a servi qu'à activer l'appareil.
  try {
    await supabase.auth.signOut({ scope: "local" });
  } catch (err) {
    console.error("service-login signOut failed:", err);
  }
  const slug = await slugForHotel(service.hotel_id, admin);
  const res = NextResponse.json({ service: true, slug });
  for (const c of request.cookies.getAll()) {
    if (c.name.startsWith("sb-")) res.cookies.set(c.name, "", { path: "/", maxAge: 0 });
  }
  res.cookies.set(STATION_COOKIE, tokens.join("."), cookieOptions);
  res.cookies.set(SERVICE_COOKIE, service.id, cookieOptions);
  return res;
}
