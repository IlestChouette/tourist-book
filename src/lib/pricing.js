// Prix affichés côté hôtelier (source de vérité : les Price Stripe correspondants).
export const PRICES = {
  basico: { anual: 39.99, temporada: 7 },
  premium: { anual: 59.99, temporada: 10 },
};

export function monthlyRevenue(plan, cycle) {
  const price = PRICES[plan]?.[cycle];
  if (!price) return 0;
  return cycle === "anual" ? price / 12 : price;
}
