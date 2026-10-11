import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getHotelContext } from "@/lib/hotelAuth";
import { hotelServicePriceId } from "@/lib/hotelBilling";

const SITE_URL = process.env.SITE_URL || "https://tourist-book.com";
const fail = (error, status) => NextResponse.json({ error }, { status });

// Ouvre le paiement Stripe de l'abonnement du cahier : 15 €/mois par service,
// sans essai gratuit. Réservé au manager (propriétaire de l'hôtel).
export async function POST(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return fail("Connectez-vous en tant que manager.", 401);
  const { hotel, admin, user } = ctx;
  if (hotel.billing_exempt) return fail("Cet hôtel n'est pas facturé.", 400);
  if (hotel.billing_status === "active") return fail("L'abonnement est déjà actif.", 400);

  const b = await request.json().catch(() => ({}));
  const quantity = Math.min(20, Math.max(1, Math.floor(Number(b.quantity) || 1)));

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
      line_items: [
        {
          price: await hotelServicePriceId(),
          quantity,
          adjustable_quantity: { enabled: true, minimum: 1, maximum: 20 },
        },
      ],
      subscription_data: { metadata: { hotel_id: hotel.id, kind: "hotel_cahier" } },
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
