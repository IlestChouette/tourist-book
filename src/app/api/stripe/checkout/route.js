import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PRICE_BY_PLAN = {
  basico: process.env.STRIPE_PRICE_BASICO,
  premium: process.env.STRIPE_PRICE_PREMIUM,
};

export async function POST(request) {
  const { plan, propertyId } = await request.json();
  const priceId = PRICE_BY_PLAN[plan];
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

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 30,
      metadata: { host_id: user.id, property_id: propertyId, plan },
    },
    metadata: { host_id: user.id, property_id: propertyId, plan },
    success_url: `${origin}/panel/alojamientos/${propertyId}?checkout=success`,
    cancel_url: `${origin}/panel/alojamientos/${propertyId}/suscribirse?checkout=cancelado`,
  });

  return NextResponse.json({ url: session.url });
}
