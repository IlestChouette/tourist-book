import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSubscriptionStartedNotification, sendSubscriptionActivatedNotification } from "@/lib/email";

// Depuis la version d'API Stripe utilisée ici, "current_period_end" n'est
// plus sur l'abonnement lui-même mais sur chacune de ses lignes (items).
function periodEndOf(subscription) {
  const end = subscription.items?.data?.[0]?.current_period_end;
  return end ? new Date(end * 1000).toISOString() : null;
}

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
      const cycle = session.metadata?.cycle;
      if (propertyId) {
        // Le statut réel (trialing vs active) dépend de si un essai a été
        // accordé (seulement pour le cycle annuel) — on va le chercher plutôt
        // que de le supposer.
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        await admin
          .from("properties")
          .update({
            plan,
            billing_cycle: cycle,
            subscription_status: subscription.status,
            stripe_subscription_id: session.subscription,
            trial_ends_at: subscription.trial_end
              ? new Date(subscription.trial_end * 1000).toISOString()
              : null,
            current_period_end: periodEndOf(subscription),
          })
          .eq("id", propertyId);

        try {
          const { data: property } = await admin
            .from("properties")
            .select("name, hosts(email)")
            .eq("id", propertyId)
            .single();
          await sendSubscriptionStartedNotification({
            hostEmail: property?.hosts?.email,
            propertyName: property?.name,
            plan,
            cycle,
            trialing: subscription.status === "trialing",
          });
        } catch (err) {
          console.error("sendSubscriptionStartedNotification failed:", err);
        }
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
            current_period_end: periodEndOf(subscription),
          })
          .eq("id", propertyId);

        // "L'essai se termine et devient un vrai abonnement facturé" ne
        // concerne que la transition trialing -> active, pas les autres mises
        // à jour (changement de carte, etc.) qui déclenchent aussi cet event.
        const wasTrialing = event.data.previous_attributes?.status === "trialing";
        if (wasTrialing && subscription.status === "active") {
          try {
            const { data: property } = await admin
              .from("properties")
              .select("name, plan, billing_cycle, hosts(email)")
              .eq("id", propertyId)
              .single();
            await sendSubscriptionActivatedNotification({
              hostEmail: property?.hosts?.email,
              propertyName: property?.name,
              plan: property?.plan,
              cycle: property?.billing_cycle,
            });
          } catch (err) {
            console.error("sendSubscriptionActivatedNotification failed:", err);
          }
        }
      }
      break;
    }
    default:
      break;
  }

  return new Response("ok", { status: 200 });
}
