import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const admin = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const propertyId = session.metadata?.property_id;
      const plan = session.metadata?.plan;
      if (propertyId) {
        await admin
          .from("properties")
          .update({
            plan,
            subscription_status: "trialing",
            stripe_subscription_id: session.subscription,
          })
          .eq("id", propertyId);
      }
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const propertyId = subscription.metadata?.property_id;
      if (propertyId) {
        await admin
          .from("properties")
          .update({
            subscription_status:
              event.type === "customer.subscription.deleted" ? "canceled" : subscription.status,
            trial_ends_at: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
          })
          .eq("id", propertyId);
      }
      break;
    }
    default:
      break;
  }

  return new Response("ok", { status: 200 });
}
