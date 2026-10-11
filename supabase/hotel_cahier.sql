-- Espace hôtels : cahier de consignes numérique.
-- Tout est lu et écrit uniquement par le serveur (clé service_role) après
-- vérification de l'identité (manager connecté, ou poste activé + PIN) :
-- RLS activée sans aucune policy, aucun accès direct depuis le navigateur.
-- À exécuter dans le SQL Editor de Supabase.

create table if not exists hotels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null,
  logo_url text,
  notification_emails text[] not null default '{}',
  retention_months int not null default 36,
  created_at timestamptz not null default now()
);

create table if not exists hotel_tags (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('shift', 'role', 'custom')),
  unique (hotel_id, name)
);

create table if not exists hotel_places (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('room', 'area')),
  unique (hotel_id, name)
);

create table if not exists hotel_staff (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  name text not null,
  pin_hash text,
  role_ids uuid[] not null default '{}',
  is_manager boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
-- Un PIN ne peut désigner qu'une seule personne active dans un hôtel.
create unique index if not exists hotel_staff_pin_unique
  on hotel_staff (hotel_id, pin_hash) where pin_hash is not null and active;

create table if not exists hotel_stations (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  token_hash text not null unique,
  label text not null default 'Poste',
  created_at timestamptz not null default now()
);

create table if not exists hotel_pin_failures (
  id bigint generated always as identity primary key,
  station_id uuid not null references hotel_stations(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists hotel_pin_failures_recent on hotel_pin_failures (station_id, created_at);

create table if not exists consignes (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references hotels(id) on delete cascade,
  day date not null,
  body text not null,
  kind text not null check (kind in ('info', 'tache', 'probleme', 'plainte')),
  place_id uuid references hotel_places(id) on delete set null,
  place_name text not null,
  tag_ids uuid[] not null default '{}',
  priority boolean not null default false,
  created_by uuid references hotel_staff(id) on delete set null,
  created_by_name text not null,
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  closed_by uuid references hotel_staff(id) on delete set null,
  closed_by_name text,
  pinned boolean not null default false,
  pinned_until timestamptz
);
create index if not exists consignes_hotel_day on consignes (hotel_id, day);
create index if not exists consignes_open on consignes (hotel_id) where closed_at is null;

-- Un envoi par hôtel, jour et créneau : empêche les doublons si le
-- déclencheur est appelé deux fois.
create table if not exists hotel_digest_log (
  hotel_id uuid not null references hotels(id) on delete cascade,
  day date not null,
  slot text not null,
  sent_at timestamptz not null default now(),
  primary key (hotel_id, day, slot)
);

alter table hotels enable row level security;
alter table hotel_tags enable row level security;
alter table hotel_places enable row level security;
alter table hotel_staff enable row level security;
alter table hotel_stations enable row level security;
alter table hotel_pin_failures enable row level security;
alter table consignes enable row level security;
alter table hotel_digest_log enable row level security;

revoke all on hotels, hotel_tags, hotel_places, hotel_staff, hotel_stations,
  hotel_pin_failures, consignes, hotel_digest_log from anon, authenticated;
