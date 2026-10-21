// Services d'un hôtel : chacun est facturé 15 €/mois. Module sans dépendance
// serveur (utilisé par la gestion et par les routes de facturation).
export const SERVICES = [
  { id: "reception", icon: "bell", label: "Réception", tag: "réception" },
  { id: "conciergerie", icon: "key", label: "Conciergerie", tag: "conciergerie" },
  { id: "gouvernante", icon: "bed", label: "Gouvernante (étages)", tag: "gouvernante" },
  { id: "direction", icon: "star", label: "Direction", tag: "direction" },
  { id: "technique", icon: "tool", label: "Technique", tag: "technique" },
  { id: "reservation", icon: "calendar", label: "Réservation", tag: "réservation" },
  { id: "restaurant", icon: "food", label: "Restaurant", tag: "restaurant" },
  { id: "evenementiel", icon: "heart", label: "Événementiel", tag: "événementiel" },
  { id: "lingerie", icon: "linge", label: "Lingerie / blanchisserie", tag: "lingerie" },
];

// Services propres à l'hôtel (hors catalogue) : identifiant "x-" + 6 caractères,
// nom libre. Facturés comme les autres.
export const MAX_CUSTOM_SERVICES = 5;
const CUSTOM_ID = /^x-[a-z0-9]{6}$/;
export const isCustomServiceId = (id) => typeof id === "string" && CUSTOM_ID.test(id);

export function cleanCustomServices(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const c of list) {
    const id = c?.id;
    const name = String(c?.name ?? "").replace(/\s+/g, " ").trim().slice(0, 30);
    if (!isCustomServiceId(id) || seen.has(id) || !name) continue;
    seen.add(id);
    out.push({ id, name });
    if (out.length === MAX_CUSTOM_SERVICES) break;
  }
  return out;
}

// Identifiants valides, sans doublon : catalogue d'abord (dans son ordre), puis
// les services propres de l'hôtel.
export function cleanServices(list) {
  const wanted = new Set(Array.isArray(list) ? list : []);
  const custom = [...wanted].filter(isCustomServiceId).slice(0, MAX_CUSTOM_SERVICES);
  return [...SERVICES.filter((s) => wanted.has(s.id)).map((s) => s.id), ...custom];
}

// Services d'un hôtel qui n'a pas encore fait son choix : ceux dont l'étiquette
// de poste existe déjà (réception, conciergerie, technique… créées à l'inscription).
export function servicesFromTags(tags) {
  const names = new Set((tags ?? []).filter((t) => t.kind === "role").map((t) => t.name));
  return SERVICES.filter((s) => names.has(s.tag)).map((s) => s.id);
}
