-- Cahier par service (phase 1). Additif et sans effet tant que le code ne
-- l'utilise pas : rien de l'existant ne change.
--
-- Principe : chaque service (réception, conciergerie…) a son cahier. Une
-- consigne destinée à plusieurs services est copiée en une ligne par service
-- (même group_id) : fermeture, épinglage, report, PDF et statistiques
-- continuent donc de fonctionner ligne par ligne, comme aujourd'hui.

-- 1) Les services de l'hôtel (facturés 15 €/mois chacun).
create table if not exists hotel_services (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  key text not null,              -- identifiant du catalogue : reception, conciergerie…
  name text not null,             -- nom affiché
  color text,                     -- palette (null = choisie par le code selon la position)
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (hotel_id, key)
);
alter table hotel_services enable row level security;
revoke all on hotel_services from anon, authenticated;

-- 2) Un poste (ordinateur) peut porter jusqu'à 3 services : une ligne par
--    service, le cookie du poste garde les jetons. service_id vide = ancien
--    poste, qui continue de voir tout l'hôtel.
alter table hotel_stations
  add column if not exists service_id uuid references hotel_services(id) on delete cascade;

-- 3) Les consignes : service destinataire, service qui l'a écrite, groupe.
alter table consignes
  add column if not exists service_id uuid references hotel_services(id) on delete set null,
  add column if not exists from_service_id uuid references hotel_services(id) on delete set null,
  add column if not exists group_id uuid;
create index if not exists consignes_service_day on consignes (hotel_id, service_id, day);
create index if not exists consignes_group on consignes (group_id) where group_id is not null;

-- 4) Les personnes (préparation de la phase 2 : validation par tous).
alter table hotel_staff
  add column if not exists service_ids uuid[] not null default '{}';

-- 5) Reprise de l'existant : un service par service déjà choisi dans Gestion
--    (hotels.services) ou, à défaut, par poste de départ déjà présent.
with catalogue(key, name, tag, pos) as (values
  ('reception',    'Réception',               'réception',     1),
  ('conciergerie', 'Conciergerie',            'conciergerie',  2),
  ('gouvernante',  'Gouvernante (étages)',    'gouvernante',   3),
  ('direction',    'Direction',               'direction',     4),
  ('technique',    'Technique',               'technique',     5),
  ('reservation',  'Réservation',             'réservation',   6),
  ('restaurant',   'Restaurant',              'restaurant',    7),
  ('evenementiel', 'Événementiel',            'événementiel',  8),
  ('lingerie',     'Lingerie / blanchisserie','lingerie',      9)
)
insert into hotel_services (hotel_id, key, name, position)
select h.id, c.key, c.name, c.pos
from hotels h
join catalogue c on (
  (h.services is not null and cardinality(h.services) > 0 and c.key = any (h.services))
  or ((h.services is null or cardinality(h.services) = 0) and exists (
        select 1 from hotel_tags t where t.hotel_id = h.id and t.kind = 'role' and t.name = c.tag))
)
on conflict (hotel_id, key) do nothing;
