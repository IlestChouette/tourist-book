-- Le nom exact du voyageur (prénom/nom séparés, comme sur sa pièce
-- d'identité) est désormais saisi par le voyageur lui-même pendant le
-- check-in, pas par l'hôtelier à la création de la réservation — celui-ci se
-- contentait de copier le nom affiché sur Airbnb/Booking, rarement déjà
-- séparé, ce qui n'ajoutait que de la friction sans gain réel de précision.
alter table guest_accounts add column if not exists first_name text;
alter table guest_accounts add column if not exists last_name text;
