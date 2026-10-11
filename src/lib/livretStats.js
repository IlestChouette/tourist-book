import { createAdminClient } from "@/lib/supabase/admin";

// Événements acceptés par /api/track : "open" (ouverture du livret) et les
// clés des tuiles de LivretMenu. Tout le reste est refusé, pour qu'un
// appel forgé ne puisse pas remplir la table de n'importe quoi.
export const TILE_EVENTS = [
  "wifi",
  "horaires",
  "directions",
  "parking",
  "contact",
  "rules",
  "basuras",
  "info",
  "transfert",
  "tours",
  "carte",
  "carnet",
];
export const TRACKED_EVENTS = ["open", ...TILE_EVENTS];

export const eventLabels = {
  fr: {
    wifi: "Wifi",
    horaires: "Horaires",
    directions: "Itinéraire",
    parking: "Stationnement",
    contact: "Contact",
    rules: "Règles",
    basuras: "Poubelles",
    info: "Informations",
    transfert: "Transfert",
    tours: "Tours",
    carte: "Carte locale",
    carnet: "Livre d'or",
  },
  en: {
    wifi: "Wifi",
    horaires: "Times",
    directions: "Directions",
    parking: "Parking",
    contact: "Contact",
    rules: "Rules",
    basuras: "Bins",
    info: "Information",
    transfert: "Transfer",
    tours: "Tours",
    carte: "Local map",
    carnet: "Guestbook",
  },
  es: {
    wifi: "Wifi",
    horaires: "Horarios",
    directions: "Itinerario",
    parking: "Aparcamiento",
    contact: "Contacto",
    rules: "Normas",
    basuras: "Basuras",
    info: "Información",
    transfert: "Transfer",
    tours: "Tours",
    carte: "Mapa local",
    carnet: "Libro de oro",
  },
};

// Statistiques par logement : ouvertures (total et 30 derniers jours),
// boutons les plus utilisés et check-ins terminés.
// Renvoie un Map property_id → { opens, opens30, buttons: [{event,total}], reservations, checkins }.
export async function getLivretStats(propertyIds) {
  const stats = new Map(propertyIds.map((id) => [id, { opens: 0, opens30: 0, buttons: [], reservations: 0, checkins: 0 }]));
  if (propertyIds.length === 0) return stats;

  const admin = createAdminClient();
  const [{ data: counts, error }, { data: reservations }] = await Promise.all([
    admin.from("livret_event_counts").select("property_id, event, total, last_30_days").in("property_id", propertyIds),
    admin.from("reservations").select("property_id, status").in("property_id", propertyIds),
  ]);
  if (error) console.error("getLivretStats failed:", error);

  for (const row of counts ?? []) {
    const s = stats.get(row.property_id);
    if (row.event === "open") {
      s.opens = row.total;
      s.opens30 = row.last_30_days;
    } else {
      s.buttons.push({ event: row.event, total: row.total });
    }
  }
  for (const s of stats.values()) s.buttons.sort((a, b) => b.total - a.total);
  for (const r of reservations ?? []) {
    const s = stats.get(r.property_id);
    s.reservations += 1;
    if (r.status === "check-in hecho") s.checkins += 1;
  }
  return stats;
}
