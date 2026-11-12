import { stripe } from "@/lib/stripe";

export const SERVICE_PRICE_EUR = 15;
const LOOKUP_KEY = "tb_hotel_cahier_service_monthly";
// Après un paiement échoué, l'accès reste ouvert quelques jours avant le blocage.
export const GRACE_DAYS = 7;
// Essai gratuit : 14 jours, 3 services au plus, sans carte. Le jour 15, sans abonnement, tout est bloqué.
export const PILOT_DAYS = 14;
export const PILOT_MAX_SERVICES = 3;

// État de l'essai d'un hôtel : null s'il n'en a pas (colonne absente ou vide).
export function pilotOf(hotel) {
  if (!hotel?.pilot_ends_at) return null;
  const end = Date.parse(hotel.pilot_ends_at);
  const left = end - Date.now();
  return { endsAt: hotel.pilot_ends_at, active: left > 0, daysLeft: Math.max(0, Math.ceil(left / 86400000)) };
}

// L'hôtel a-t-il le droit d'utiliser le cahier ? Tant que la migration SQL
// n'est pas appliquée (colonne absente), personne n'est bloqué.
export function hotelHasAccess(hotel) {
  if (hotel?.blocked_at) return false; // bloqué par l'admin (colonne absente avant la migration : pas de blocage)
  if (!hotel || hotel.billing_status === undefined) return true;
  if (hotel.billing_exempt) return true;
  if (pilotOf(hotel)?.active) return true; // essai gratuit en cours
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
