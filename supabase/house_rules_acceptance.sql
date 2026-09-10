-- Trace si le voyageur a explicitement accepté ou refusé le règlement
-- intérieur de l'hôte lors du check-in électronique — null si le logement
-- n'a pas de règles (rien à accepter dans ce cas).
alter table guest_accounts add column if not exists house_rules_accepted boolean;
