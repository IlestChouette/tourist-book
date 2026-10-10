-- Date de la prochaine facturation (fin de la période en cours), pour
-- afficher "Renouvellement le ..." dans l'admin une fois l'abonnement actif.
alter table properties add column if not exists current_period_end timestamptz;
