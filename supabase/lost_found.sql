-- Objets trouvés (module hôtel, DÉSACTIVÉ par défaut).
-- Rien n'est visible ni utilisable tant que hotels.lost_found_enabled est faux.
-- Pour l'activer plus tard, pour un hôtel :
--   update hotels set lost_found_enabled = true where name = 'Nom de l''hôtel';
-- Tout est lu et écrit par le serveur (clé service_role) : RLS activée sans
-- aucune policy, aucun accès direct depuis le navigateur.
-- À exécuter dans le SQL Editor de Supabase.

alter table hotels add column if not exists lost_found_enabled boolean not null default false;
-- Jeton du lien privé que les femmes de chambre gardent dans leur téléphone :
-- il ne permet que de CRÉER un objet "à traiter", jamais de lire le registre.
alter table hotels add column if not exists lost_found_token text unique;

create table if not exists lost_items (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity,
  hotel_id uuid not null references hotels(id) on delete cascade,
  found_at timestamptz not null default now(),
  room_text text,
  room_confirmed boolean not null default false,
  description text not null default '',
  category text,
  photo_url text,
  storage_location text,
  status text not null default 'a_traiter'
    check (status in ('a_traiter', 'garde', 'client_averti', 'rendu', 'envoye', 'detruit')),
  guest_name text,
  guest_email text,
  guest_token text unique,
  notified_at timestamptz,
  guest_choice text check (guest_choice in ('pickup', 'ship', 'discard')),
  guest_choice_at timestamptz,
  guest_address text,
  guest_phone text,
  notes text,
  created_via text not null default 'capture' check (created_via in ('capture', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz
);
create index if not exists lost_items_hotel_found on lost_items (hotel_id, found_at desc);
create index if not exists lost_items_hotel_status on lost_items (hotel_id, status);

alter table lost_items enable row level security;
revoke all on lost_items from anon, authenticated;
