import crypto from "crypto";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const STATION_COOKIE = "tb_hotel_station";
// Service affiché sur un poste qui en porte plusieurs (id du service, pas un secret :
// il est revérifié contre les services réellement activés sur le poste).
export const SERVICE_COOKIE = "tb_hotel_service";
export const MAX_SERVICES_PER_DEVICE = 3;

// Le cookie du poste porte 1 à 3 jetons séparés par un point (un par service).
// Un ancien cookie, avec un seul jeton, reste valable tel quel.
export function stationTokens(raw) {
  return String(raw ?? "")
    .split(".")
    .filter((t) => /^[0-9a-f]{64}$/.test(t))
    .slice(0, MAX_SERVICES_PER_DEVICE);
}
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

// Activation d'un poste par code : une ligne "en attente" dans hotel_stations,
// dont le hash est celui du code (lié à l'hôtel), remplacée par le vrai jeton
// du poste à l'utilisation.
export const PENDING_LABEL = "__pending__";
export const ACTIVATION_MINUTES = 10;
export const activationHash = (hotelId, code) => sha256(`code:${hotelId}:${code}`);

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
    if (hotel) return { mode: "manager", hotel, user, service: null, services: null, admin };
  }

  const jar = await cookies();
  const tokens = stationTokens(jar.get(STATION_COOKIE)?.value);
  if (tokens.length) {
    const { data: rows } = await admin
      .from("hotel_stations")
      .select("id, label, service_id, hotels(*), hotel_services(id, key, name, color, position, active)")
      .in("token_hash", tokens.map(sha256));
    const valid = (rows ?? []).filter((r) => r.hotels);
    if (valid.length) {
      const hotel = valid[0].hotels;
      const same = valid.filter((r) => r.hotels.id === hotel.id);
      // Ancien poste (sans service) : il voit tout l'hôtel, comme avant.
      const legacy = same.find((r) => !r.service_id);
      if (legacy) return { mode: "station", hotel, station: legacy, service: null, services: [], admin };

      const services = same
        .filter((r) => r.hotel_services?.active)
        .map((r) => ({ ...r.hotel_services, stationId: r.id }))
        .sort((a, b) => a.position - b.position);
      // Tous les services de ce poste ont été désactivés : plus d'accès.
      if (services.length === 0) return null;
      const wanted = jar.get(SERVICE_COOKIE)?.value;
      const service = services.find((s) => s.id === wanted) ?? services[0];
      return { mode: "station", hotel, station: { id: service.stationId }, service, services, admin };
    }
  }
  return null;
}

// Identifie la personne qui agit. Manager connecté : sa fiche d'équipe, sans
// PIN. Poste de réception : le PIN saisi, avec blocage temporaire après trop
// d'essais ratés (4 chiffres se devineraient vite sinon).
export async function resolveActor(ctx, pin, { managerPin = false } = {}) {
  const { admin, hotel } = ctx;

  if (ctx.mode === "manager") {
    // Publier ou valider : le code personnel est demandé à tout le monde, manager
    // compris (une personne peut valider depuis le poste du manager : le nom
    // enregistré est celui du code). Sans code défini, le manager reste identifié d'office.
    if (managerPin) {
      const { data: managerRow } = await admin
        .from("hotel_staff")
        .select("id, name, pin_hash")
        .eq("hotel_id", hotel.id)
        .eq("is_manager", true)
        .maybeSingle();
      if (isPin(pin)) {
        const { data: person } = await admin
          .from("hotel_staff")
          .select("id, name")
          .eq("hotel_id", hotel.id)
          .eq("pin_hash", pinHash(hotel.id, pin))
          .eq("active", true)
          .maybeSingle();
        if (!person) return { error: "PIN incorrect.", status: 403 };
        return { staff: person };
      }
      if (managerRow?.pin_hash) return { error: "Saisissez votre code personnel à 4 chiffres.", status: 400 };
    }
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
