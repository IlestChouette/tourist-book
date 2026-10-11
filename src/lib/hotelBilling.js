import { stripe } from "@/lib/stripe";

export const SERVICE_PRICE_EUR = 15;
const LOOKUP_KEY = "tb_hotel_cahier_service_monthly";
// Après un paiement échoué, l'accès reste ouvert quelques jours avant le blocage.
export const GRACE_DAYS = 7;

// L'hôtel a-t-il le droit d'utiliser le cahier ? Tant que la migration SQL
// n'est pas appliquée (colonne absente), personne n'est bloqué.
export function hotelHasAccess(hotel) {
  if (!hotel || hotel.billing_status === undefined) return true;
  if (hotel.billing_exempt) return true;
  if (hotel.billing_status === "active") return true;
  if (hotel.billing_status === "past_due" && hotel.past_due_since) {
    return Date.now() - Date.parse(hotel.past_due_since) < GRACE_DAYS * 86400000;
  }
  return false;
}

// Prix Stripe du service (15 €/mois, sans essai), retrouvé par sa clé de
// recherche ; créé au premier besoin s'il n'existe pas encore.
export async function hotelServicePriceId() {
  const found = await stripe.prices.list({ lookup_keys: [LOOKUP_KEY], active: true, limit: 1 });
  if (found.data[0]) return found.data[0].id;
  try {
    const product = await stripe.products.create({
      name: "Tourist Book — Cahier de consignes (par service)",
      metadata: { kind: "hotel_cahier" },
    });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: SERVICE_PRICE_EUR * 100,
      currency: "eur",
      recurring: { interval: "month" },
      lookup_key: LOOKUP_KEY,
    });
    return price.id;
  } catch (err) {
    // Deux appels simultanés : l'autre a créé le prix entre-temps.
    const again = await stripe.prices.list({ lookup_keys: [LOOKUP_KEY], active: true, limit: 1 });
    if (again.data[0]) return again.data[0].id;
    throw err;
  }
}

// Statut Stripe → statut du cahier.
export function billingStatusOf(stripeStatus) {
  if (stripeStatus === "active" || stripeStatus === "trialing") return "active";
  if (stripeStatus === "past_due" || stripeStatus === "unpaid") return "past_due";
  if (stripeStatus === "canceled") return "canceled";
  return "none"; // incomplete, incomplete_expired, paused…
}
