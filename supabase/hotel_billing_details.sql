-- Données de facturation de l'hôtel, recueillies au paiement de l'abonnement du
-- cahier (raison sociale et SIREN). Additif.
alter table hotels add column if not exists billing_company text;
alter table hotels add column if not exists billing_siren text;
