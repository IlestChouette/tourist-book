// Services d'un hôtel : chacun est facturé 15 €/mois. Module sans dépendance
// serveur (utilisé par la gestion et par les routes de facturation).
export const SERVICES = [
  { id: "reception", label: "Réception", tag: "réception" },
  { id: "conciergerie", label: "Conciergerie", tag: "conciergerie" },
  { id: "gouvernante", label: "Gouvernante (étages)", tag: "gouvernante" },
  { id: "direction", label: "Direction", tag: "direction" },
  { id: "technique", label: "Technique", tag: "technique" },
  { id: "reservation", label: "Réservation", tag: "réservation" },
  { id: "restaurant", label: "Restaurant", tag: "restaurant" },
  { id: "evenementiel", label: "Événementiel", tag: "événementiel" },
  { id: "lingerie", label: "Lingerie / blanchisserie", tag: "lingerie" },
];

// Identifiants valides, sans doublon, dans l'ordre du catalogue.
export function cleanServices(list) {
  const wanted = new Set(Array.isArray(list) ? list : []);
  return SERVICES.filter((s) => wanted.has(s.id)).map((s) => s.id);
}

// Services d'un hôtel qui n'a pas encore fait son choix : ceux dont l'étiquette
// de poste existe déjà (réception, conciergerie, technique… créées à l'inscription).
export function servicesFromTags(tags) {
  const names = new Set((tags ?? []).filter((t) => t.kind === "role").map((t) => t.name));
  return SERVICES.filter((s) => names.has(s.tag)).map((s) => s.id);
}
