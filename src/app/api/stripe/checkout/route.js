import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PRICE_BY_PLAN = {
  anual: {
    basico: process.env.STRIPE_PRICE_BASICO_ANUAL,
    premium: process.env.STRIPE_PRICE_PREMIUM_ANUAL,
  },
  temporada: {
    basico: process.env.STRIPE_PRICE_BASICO_TEMPORADA,
    premium: process.env.STRIPE_PRICE_PREMIUM_TEMPORADA,
  },
};

export async function POST(request) {
  const { plan, cycle, propertyId } = await request.json();
  const priceId = PRICE_BY_PLAN[cycle]?.[plan];
  if (!priceId || !propertyId) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Verifica que el alojamiento sea de este hotelero.
  const { data: property } = await supabase
    .from("properties")
    .select("id, name, host_id")
    .eq("id", propertyId)
    .eq("host_id", user.id)
    .single();
  if (!property) {
    return NextResponse.json({ error: "Alojamiento no encontrado" }, { status: 404 });
  }

  const { data: host } = await supabase.from("hosts").select("*").eq("id", user.id).single();

  let customerId = host?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { host_id: user.id },
    });
    customerId = customer.id;

    const admin = createAdminClient();
    await admin.from("hosts").update({ stripe_customer_id: customerId }).eq("id", user.id);
  }

  const origin = request.headers.get("origin") || "http://localhost:3000";

  // El mes gratis solo existe en el plan anual, y es único por cuenta (Stripe
  // customer): si esta cuenta ya tuvo alguna suscripción con periodo de
  // prueba antes (activa, cancelada o lo que sea), no se concede otro,
  // aunque sea para un alojamiento distinto. Evita que cancelar y volver a
  // suscribirse (o borrar y recrear un alojamiento) genere meses gratis
  // indefinidos. Las suscripciones por temporada nunca llevan prueba.
  let grantTrial = false;
  if (cycle === "anual") {
    const previousSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 100,
    });
    const alreadyHadTrial = previousSubscriptions.data.some((sub) => sub.trial_start);
    grantTrial = !alreadyHadTrial;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      ...(grantTrial ? { trial_period_days: 30 } : {}),
      metadata: { host_id: user.id, property_id: propertyId, plan, cycle },
    },
    metadata: { host_id: user.id, property_id: propertyId, plan, cycle },
    success_url: `${origin}/panel/alojamientos/${propertyId}?checkout=success`,
    cancel_url: `${origin}/panel/alojamientos/${propertyId}/suscribirse?checkout=cancelado`,
  });

  return NextResponse.json({ url: session.url });
}
