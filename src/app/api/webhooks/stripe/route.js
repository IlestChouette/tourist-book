import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendSubscriptionStartedNotification, sendSubscriptionActivatedNotification, sendHotelSubscriptionNotification } from "@/lib/email";
import { billingStatusOf } from "@/lib/hotelBilling";

// Depuis la version d'API Stripe utilisée ici, "current_period_end" n'est
// plus sur l'abonnement lui-même mais sur chacune de ses lignes (items).
function periodEndOf(subscription) {
  const end = subscription.items?.data?.[0]?.current_period_end;
  return end ? new Date(end * 1000).toISOString() : null;
}

// Abonnement d'un hôtel (cahier de consignes) : même webhook que les livrets,
// reconnu par la clé "hotel_id" dans les métadonnées.
async function syncHotelSubscription(admin, hotelId, subscription, deleted = false) {
  const { data: hotel } = await admin.from("hotels").select("billing_status, past_due_since").eq("id", hotelId).maybeSingle();
  const status = deleted ? "canceled" : billingStatusOf(subscription.status);
  const update = {
    stripe_subscription_id: subscription.id,
    billing_status: status,
    services_count: subscription.items?.data?.[0]?.quantity ?? 0,
    current_period_end: periodEndOf(subscription),
    past_due_since: status === "past_due" ? hotel?.past_due_since ?? new Date().toISOString() : null,
  };
  await admin.from("hotels").update(update).eq("id", hotelId);
  return { before: hotel?.billing_status, after: status, update };
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
      if (session.metadata?.hotel_id) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const { update } = await syncHotelSubscription(admin, session.metadata.hotel_id, subscription);
        try {
          const { data: hotel } = await admin.from("hotels").select("name").eq("id", session.metadata.hotel_id).maybeSingle();
          await sendHotelSubscriptionNotification({ hotelName: hotel?.name, services: update.services_count });
        } catch (err) {
          console.error("sendHotelSubscriptionNotification failed:", err);
        }
        break;
      }
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
      if (subscription.metadata?.hotel_id) {
        await syncHotelSubscription(admin, subscription.metadata.hotel_id, subscription, event.type === "customer.subscription.deleted");
        break;
      }
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
