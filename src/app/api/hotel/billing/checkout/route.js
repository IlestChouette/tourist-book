import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getHotelContext } from "@/lib/hotelAuth";
import { hotelServicePriceId, pilotOf } from "@/lib/hotelBilling";
import { cleanServices } from "@/lib/hotelServices";

const SITE_URL = process.env.SITE_URL || "https://tourist-book.com";
const fail = (error, status) => NextResponse.json({ error }, { status });

// Ouvre le paiement Stripe de l'abonnement du cahier : 15 €/mois par service,
// l'essai gratuit de 14 jours éventuel est repris (premier paiement à son terme). Réservé au manager (propriétaire de l'hôtel).
export async function POST(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return fail("Connectez-vous en tant que manager.", 401);
  const { hotel, admin, user } = ctx;
  if (hotel.billing_exempt) return fail("Cet hôtel n'est pas facturé.", 400);
  if (hotel.billing_status === "active") return fail("L'abonnement est déjà actif.", 400);

  const b = await request.json().catch(() => ({}));
  // Quantité = nombre de services choisis par l'hôtel (colonne présente) ;
  // sinon l'ancien choix manuel.
  let quantity = Math.min(20, Math.max(1, Math.floor(Number(b.quantity) || 1)));
  const managed = hotel.services !== undefined;
  if (managed) {
    const ids = cleanServices(hotel.services);
    if (ids.length === 0) return fail("Choisissez et enregistrez d'abord vos services (carte « Services »).", 400);
    quantity = ids.length;
  }

  const pilot = pilotOf(hotel);
  try {
    let customerId = hotel.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: hotel.name, metadata: { hotel_id: hotel.id } });
      customerId = customer.id;
      await admin.from("hotels").update({ stripe_customer_id: customerId }).eq("id", hotel.id);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      allow_promotion_codes: true,
      // Client professionnel : raison sociale, adresse, SIREN (la facture est émise
      // par la société mère, mention de TVA réglée dans le modèle de facture Stripe).
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      name_collection: { business: { enabled: true, optional: false } },
      customer_update: { name: "auto", address: "auto" },
      custom_fields: [
        { key: "siren", label: { type: "custom", custom: "SIREN (9 chiffres)" }, type: "text", text: { minimum_length: 9, maximum_length: 9 } },
      ],
      line_items: [
        {
          price: await hotelServicePriceId(),
          quantity,
          ...(managed ? {} : { adjustable_quantity: { enabled: true, minimum: 1, maximum: 20 } }),
        },
      ],
      // Essai gratuit en cours : l'abonnement démarre tout de suite mais le premier paiement
      // n'a lieu qu'à la fin de l'essai (Stripe exige au moins 48 h devant soi).
      subscription_data: {
        metadata: { hotel_id: hotel.id, kind: "hotel_cahier" },
        ...(pilot?.active && Date.parse(pilot.endsAt) - Date.now() > 49 * 3600000 ? { trial_end: Math.floor(Date.parse(pilot.endsAt) / 1000) } : {}),
      },
      metadata: { hotel_id: hotel.id, kind: "hotel_cahier" },
      success_url: `${SITE_URL}/hotel/gestion?abonnement=ok`,
      cancel_url: `${SITE_URL}/hotel/gestion?abonnement=annule`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("hotel checkout failed:", err);
    return fail("Le paiement n'a pas pu être ouvert. Réessayez dans un instant.", 502);
  }
}
