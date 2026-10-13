-- Cahier : services facturés (15 €/mois par service). La liste choisie par
-- l'hôtel détermine la quantité de l'abonnement Stripe.
alter table hotels add column if not exists services text[];
