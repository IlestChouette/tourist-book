-- Le prix d'un transfert dépend du véhicule (berline ou van), qui dépend à
-- la fois des passagers ET des bagages — un tarif "jusqu'à 4 passagers" ne
-- suffit pas si le voyageur a 6 grosses valises. Nullable pour les tarifs
-- déjà créés (traités comme "pas de limite de bagages").
alter table transfer_rates add column if not exists luggage int;
