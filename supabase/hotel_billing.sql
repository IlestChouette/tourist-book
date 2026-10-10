-- Abonnement des hôtels : 15 €/mois par service, sans mois d'essai.
-- Paiement via Stripe Checkout ; le webhook existant met ces colonnes à jour.
-- À exécuter dans le SQL Editor de Supabase (idempotent).

alter table hotels add column if not exists stripe_customer_id text;
alter table hotels add column if not exists stripe_subscription_id text;
-- none (pas encore payé) | active | past_due (paiement échoué) | canceled
alter table hotels add column if not exists billing_status text not null default 'none';
alter table hotels add column if not exists services_count int not null default 0;
alter table hotels add column if not exists current_period_end timestamptz;
alter table hotels add column if not exists past_due_since timestamptz;
-- Hôtel non facturé (démonstration, essai interne).
alter table hotels add column if not exists billing_exempt boolean not null default false;

-- L'hôtel de test existant n'est pas facturé :
update hotels set billing_exempt = true where name = 'Test hotel fer';
