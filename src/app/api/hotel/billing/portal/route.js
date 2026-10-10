import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getHotelContext } from "@/lib/hotelAuth";

const SITE_URL = process.env.SITE_URL || "https://tourist-book.com";
const fail = (error, status) => NextResponse.json({ error }, { status });

// Portail Stripe : changer de carte, voir les factures, résilier.
export async function POST() {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return fail("Connectez-vous en tant que manager.", 401);
  if (!ctx.hotel.stripe_customer_id) return fail("Aucun abonnement à gérer.", 400);
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: ctx.hotel.stripe_customer_id,
      return_url: `${SITE_URL}/hotel/gestion`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("hotel billing portal failed:", err);
    return fail("Le portail de gestion n'est pas disponible pour l'instant. Écrivez-nous : allo@ilestchouette.fr.", 502);
  }
}
