-- Champ facultatif où l'hôte explique comment arriver au logement (transports,
-- repères, parking à proximité...) — affiché en premier dans le livret, avant
-- même le wifi, car c'est la première chose qu'un voyageur cherche en arrivant.
alter table properties add column if not exists directions text;
