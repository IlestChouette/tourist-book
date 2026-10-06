import crypto from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const STATION_COOKIE = "tb_hotel_station";
const MAX_PIN_FAILURES = 8;
const PIN_LOCK_MINUTES = 10;

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

// Le PIN n'a que 10 000 combinaisons : on le signe avec une clé serveur
// (HMAC) pour qu'une fuite de la base seule ne permette pas de le retrouver
// hors ligne, et on limite les essais par poste (voir resolveActor).
export function pinHash(hotelId, pin) {
  return crypto
    .createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY)
    .update(`${hotelId}:${pin}`)
    .digest("hex");
}

export const isPin = (value) => typeof value === "string" && /^\d{4}$/.test(value);

// Qui parle ? Soit le manager (session Supabase, propriétaire d'un hôtel),
// soit un poste de réception activé (cookie), à qui chaque action demande
// ensuite le PIN de la personne. Renvoie null si aucun des deux.
export async function getHotelContext() {
  const admin = createAdminClient();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: hotel } = await admin.from("hotels").select("*").eq("owner_id", user.id).maybeSingle();
    if (hotel) return { mode: "manager", hotel, user, admin };
  }

  const token = (await cookies()).get(STATION_COOKIE)?.value;
  if (token) {
    const { data: station } = await admin
      .from("hotel_stations")
      .select("id, label, hotels(*)")
      .eq("token_hash", sha256(token))
      .maybeSingle();
    if (station?.hotels) return { mode: "station", hotel: station.hotels, station, admin };
  }
  return null;
}

// Identifie la personne qui agit. Manager connecté : sa fiche d'équipe, sans
// PIN. Poste de réception : le PIN saisi, avec blocage temporaire après trop
// d'essais ratés (4 chiffres se devineraient vite sinon).
export async function resolveActor(ctx, pin) {
  const { admin, hotel } = ctx;

  if (ctx.mode === "manager") {
    let { data: staff } = await admin
      .from("hotel_staff")
      .select("id, name")
      .eq("hotel_id", hotel.id)
      .eq("is_manager", true)
      .maybeSingle();
    if (!staff) {
      ({ data: staff } = await admin
        .from("hotel_staff")
        .insert({ hotel_id: hotel.id, name: "Manager", is_manager: true })
        .select("id, name")
        .single());
    }
    return { staff };
  }

  if (!isPin(pin)) return { error: "Saisissez votre PIN à 4 chiffres.", status: 400 };

  const since = new Date(Date.now() - PIN_LOCK_MINUTES * 60 * 1000).toISOString();
  const { count } = await admin
    .from("hotel_pin_failures")
    .select("id", { count: "exact", head: true })
    .eq("station_id", ctx.station.id)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_PIN_FAILURES) {
    return { error: `Trop d'essais. Réessayez dans ${PIN_LOCK_MINUTES} minutes.`, status: 429 };
  }

  const { data: staff } = await admin
    .from("hotel_staff")
    .select("id, name")
    .eq("hotel_id", hotel.id)
    .eq("pin_hash", pinHash(hotel.id, pin))
    .eq("active", true)
    .maybeSingle();
  if (!staff) {
    await admin.from("hotel_pin_failures").insert({ station_id: ctx.station.id });
    return { error: "PIN incorrect.", status: 403 };
  }
  return { staff };
}
