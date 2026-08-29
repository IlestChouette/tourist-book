-- La suscripción pasa de la cuenta del hotelero a cada alojamiento
-- individual: cada "properties" tiene su propio plan y su propio estado de
-- suscripción de Stripe. "hosts" conserva solo el stripe_customer_id (un
-- cliente Stripe por hotelero, con una suscripción por alojamiento).

alter table properties add column if not exists plan text check (plan in ('basico', 'premium'));
alter table properties add column if not exists subscription_status text check (subscription_status in ('trialing', 'active', 'past_due', 'canceled'));
alter table properties add column if not exists stripe_subscription_id text;
alter table properties add column if not exists trial_ends_at timestamptz;
