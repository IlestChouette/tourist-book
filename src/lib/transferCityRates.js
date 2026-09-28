// Calcul des tarifs de transfert aéroport — fonctions pures, utilisables côté
// serveur comme dans l'écran admin (prévisualisation en direct). Les données
// (prix net par ville, commission) vivent en base : voir transferPricing.js.

export function normalizeCity(city) {
  return (city || "")
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Prix affiché au voyageur : net + commission, arrondi au multiple de 5
// supérieur. L'epsilon évite qu'une imprécision flottante (70 × 1,2 =
// 84,00000000000001) fasse monter d'un cran un résultat déjà rond.
export function clientPrice(net, commissionPct) {
  return Math.ceil((Number(net) * (100 + Number(commissionPct))) / 500 - 1e-9) * 5;
}

// Deux tarifs "aéroport" par ville : jusqu'à 3 passagers / 2 bagages, puis
// jusqu'à 6 passagers / 6 bagages.
export function ratesFromNet(row, commissionPct) {
  return [
    { pickup_location: "airport", passengers: 3, luggage: 2, price: clientPrice(row.net_small, commissionPct) },
    { pickup_location: "airport", passengers: 6, luggage: 6, price: clientPrice(row.net_large, commissionPct) },
  ];
}
