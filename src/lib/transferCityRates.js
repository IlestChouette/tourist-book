// Tarifs de transfert aéroport fixés par Fernando (accord transporteur, prix
// net + 20% arrondi au multiple de 5 supérieur), par ville — appliqués
// automatiquement à tout logement dont la ville correspond, sans action de
// l'hôtelier. Les autres villes restent "sur demande" (aucun tarif défini).
const CITY_RATES = {
  nice: { small: 60, large: 85 },
  beausoleil: { small: 120, large: 145 },
  "roquebrune-cap-martin": { small: 120, large: 145 },
  cannes: { small: 120, large: 145 },
  monaco: { small: 120, large: 145 },
  "saint-paul-de-vence": { small: 100, large: 120 },
  antibes: { small: 100, large: 135 },
};

export function normalizeCity(city) {
  return (city || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Renvoie les deux tarifs "aéroport" (jusqu'à 3 puis jusqu'à 6 passagers) pour
// une ville, ou null si elle n'est pas dans la liste (reste sur demande).
export function transferRatesForCity(city) {
  const rates = CITY_RATES[normalizeCity(city)];
  if (!rates) return null;
  return [
    { pickup_location: "airport", passengers: 3, luggage: 2, price: rates.small },
    { pickup_location: "airport", passengers: 6, luggage: 6, price: rates.large },
  ];
}
