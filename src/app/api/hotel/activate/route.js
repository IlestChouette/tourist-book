import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ACTIVATION_MINUTES, LINK_HOURS, MAX_SERVICES_PER_DEVICE, PENDING_LABEL, SERVICE_COOKIE, STATION_COOKIE, activationHash, sha256, stationTokens } from "@/lib/hotelAuth";
import { listHotelSlugs } from "@/lib/hotelSlug";

// Active un appareil avec le code donné par le manager. Le code est lié à
// l'hôtel, vaut 10 minutes et ne sert qu'une fois.
// ponytail: limite en mémoire par adresse IP (propre à chaque instance) ; avec
// 1 million de codes possibles et 10 minutes de validité, ça freine un essai
// en masse sans l'empêcher — passer à une table si ça devient un sujet.
const hits = new Map();
function tooMany(ip) {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || e.reset < now) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  e.count += 1;
  return e.count > 8;
}

const fail = (error, status) => NextResponse.json({ error }, { status });

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) return fail("Trop d'essais. Réessayez dans une minute.", 429);

  const b = await request.json().catch(() => ({}));
  // Soit le code à 6 chiffres du manager (10 minutes), soit le lien reçu par email (24 h).
  const link = typeof b.link === "string" && /^[0-9a-f]{32}$/.test(b.link) ? b.link : "";
  const code = typeof b.code === "string" ? b.code.trim() : "";
  if ((!link && !/^\d{6}$/.test(code)) || typeof b.slug !== "string") return fail("Le code a 6 chiffres.", 400);
  const secret = link || code;
  const notValid = link
    ? "Ce lien n'est plus valable (24 h, une seule utilisation). Demandez-en un nouveau au manager."
    : "Ce code n'est pas bon ou a expiré. Demandez-en un nouveau au manager.";

  const admin = createAdminClient();
  const hotel = (await listHotelSlugs(admin)).find((h) => h.slug === b.slug);
  if (!hotel) return fail("Ce code n'est pas bon ou a expiré.", 404);

  const since = new Date(Date.now() - (link ? LINK_HOURS * 60 : ACTIVATION_MINUTES) * 60 * 1000).toISOString();
  const { data: pending } = await admin
    .from("hotel_stations")
    .select("id, service_id")
    .eq("hotel_id", hotel.id)
    .eq("token_hash", activationHash(hotel.id, secret))
    .eq("label", PENDING_LABEL)
    .gte("created_at", since)
    .maybeSingle();
  if (!pending) return fail(notValid, 404);

  // Un appareil porte jusqu'à 3 services ; les jetons déjà présents sont gardés.
  const existing = stationTokens(request.cookies.get(STATION_COOKIE)?.value);
  if (pending.service_id && existing.length >= MAX_SERVICES_PER_DEVICE) {
    return fail(`Cet appareil porte déjà ${MAX_SERVICES_PER_DEVICE} services. Désactivez-en un dans Gestion avant d'en ajouter un autre.`, 409);
  }

  const token = crypto.randomBytes(32).toString("hex");
  const { error } = await admin
    .from("hotel_stations")
    .update({ token_hash: sha256(token), label: "Poste activé", created_at: new Date().toISOString() })
    .eq("id", pending.id)
    .eq("label", PENDING_LABEL);
  if (error) return fail("Impossible d'activer cet appareil.", 500);

  const res = NextResponse.json({ ok: true });
  // Un code sans service = ancien poste (tout l'hôtel) : il remplace le cookie.
  const value = pending.service_id ? [...existing, token].join(".") : token;
  res.cookies.set(STATION_COOKIE, value, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  // Le service qu'on vient d'activer devient celui qu'on voit.
  if (pending.service_id) res.cookies.set(SERVICE_COOKIE, pending.service_id, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return res;
}
