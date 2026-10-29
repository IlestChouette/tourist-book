import { createAdminClient } from "@/lib/supabase/admin";
import { sendHotelSignupNotification } from "@/lib/email";
import { GENERAL_PLACE } from "@/lib/hotelPlaces";

const SHIFT_TAGS = ["matin", "soir", "nuit"];
const ROLE_TAGS = [
  "réception",
  "conciergerie",
  "technique",
  "housekeeping",
  "gouvernante",
  "réservation",
  "bagagiste",
  "voiturier",
  "manager",
  "directeur",
  "chef de service",
  "premier de réception",
];

// Crée l'hôtel d'un compte (une seule fois par compte) avec ses équipes et
// postes de départ. Le nom vient de l'inscription, ou de `nameOverride` quand un
// compte existant (un hôtelier de livrets, par exemple) crée aussi son hôtel.
export async function ensureHotel(user, nameOverride) {
  const admin = createAdminClient();
  const { data: existing } = await admin.from("hotels").select("id").eq("owner_id", user.id).limit(1);
  if (existing?.length) return;
  const meta = user.user_metadata ?? {};
  await createHotel(user, nameOverride || meta.hotel_name || "Mon hôtel");
  // Inscription d'un groupe : les autres hôtels saisis à l'inscription.
  const extras = Array.isArray(meta.extra_hotels) ? meta.extra_hotels : [];
  for (const n of extras.slice(0, 19)) if (typeof n === "string" && n.trim().length >= 2) await createHotel(user, n, { notify: false });
}

// Crée un hôtel pour ce compte (un compte peut en gérer plusieurs), avec ses équipes
// et postes de départ. Renvoie l'id, ou null en cas d'échec.
export async function createHotel(user, name, { notify = true } = {}) {
  const admin = createAdminClient();
  const meta = user.user_metadata ?? {};
  const hotelName = String(name || "Mon hôtel").trim().slice(0, 120);
  const { data: hotel, error } = await admin
    .from("hotels")
    .insert({ owner_id: user.id, name: hotelName, notification_emails: [user.email] })
    .select("id")
    .single();
  if (error) {
    console.error("createHotel failed:", error);
    return null;
  }

  await admin.from("hotel_staff").insert({ hotel_id: hotel.id, name: meta.name || "Manager", is_manager: true });
  await admin.from("hotel_places").insert({ hotel_id: hotel.id, name: GENERAL_PLACE, kind: "area" });
  await admin.from("hotel_tags").insert([
    ...SHIFT_TAGS.map((name) => ({ hotel_id: hotel.id, name, kind: "shift" })),
    ...ROLE_TAGS.map((name) => ({ hotel_id: hotel.id, name, kind: "role" })),
  ]);

  if (notify) {
    try {
      await sendHotelSignupNotification({ hotelName, name: meta.name, email: user.email });
    } catch (err) {
      console.error("sendHotelSignupNotification failed:", err);
    }
  }
  return hotel.id;
}
