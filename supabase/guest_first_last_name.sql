-- Sépare le nom du voyageur en prénom/nom à la création de la réservation
-- (l'hôtelier le tapait jusqu'ici en un seul champ) — nécessaire pour la
-- fiche individuelle de police (article R.611-42 du CESEDA), qui exige nom
-- et prénom distincts. guest_name reste alimenté (prénom + nom concaténés)
-- pour ne pas casser l'affichage existant ailleurs dans l'app.
alter table reservations add column if not exists guest_first_name text;
alter table reservations add column if not exists guest_last_name text;
