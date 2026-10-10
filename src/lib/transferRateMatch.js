// Choix du tarif de transfert pour une demande. Même règle côté écran du
// voyageur (aperçu du prix) et côté serveur (prix transmis au transporteur) :
// le prix qui part au transporteur est recalculé ici, jamais repris tel quel
// de ce que le navigateur envoie.
//
// Le prix dépend du véhicule, donc à la fois des passagers ET des bagages —
// une berline peut suffire pour 4 passagers mais pas avec 6 grosses valises.
// On garde les tarifs qui couvrent les deux besoins, puis le moins cher parmi
// eux (le plus petit véhicule adapté, pas juste celui avec le moins de places).
export function matchRate(rates, pickupKey, passengers, luggage) {
  if (!rates?.length || pickupKey === "other") return null;
  const candidates = rates.filter(
    (r) =>
      r.pickup_location === pickupKey &&
      r.passengers >= passengers &&
      (r.luggage == null || r.luggage >= luggage)
  );
  if (!candidates.length) return null;
  return candidates.reduce((best, r) => (r.price < best.price ? r : best));
}
