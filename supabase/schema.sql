-- Esquema inicial de la plataforma Tourist Book (multi-hotelero).
-- Ejecutar una sola vez en Supabase: Dashboard -> SQL Editor -> New query -> pegar -> Run.

-- 1. Hoteleros (vinculado 1:1 con auth.users de Supabase Auth)
create table if not exists hosts (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  stripe_customer_id text,
  plan text check (plan in ('basico', 'premium')),
  subscription_status text check (subscription_status in ('trialing', 'active', 'past_due', 'canceled')),
  trial_ends_at timestamptz,
  created_at timestamptz not null default now()
);

-- 2. Alojamientos (reemplaza src/data/properties.js)
create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references hosts(id) on delete cascade,
  slug text not null unique,
  name text not null,
  city text not null,
  address text not null,
  wifi_ssid text,
  wifi_password text,
  checkin text,
  checkout text,
  parking text,
  contact text,
  photo_url text,
  access_code text,
  created_at timestamptz not null default now()
);

-- 3. Reservas (solo plan premium) — generan el enlace de check-in
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  guest_name text not null,
  arrival_date date not null,
  departure_date date not null,
  token text not null unique,
  status text not null default 'pendiente' check (status in ('pendiente', 'check-in hecho')),
  created_at timestamptz not null default now()
);

-- 4. Cuentas de huésped (creadas automáticamente al completar el check-in)
create table if not exists guest_accounts (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null unique references reservations(id) on delete cascade,
  username text not null unique,
  password_hash text not null,
  phone text,
  email text,
  id_document_url text,
  created_at timestamptz not null default now()
);

-- 5. Recomendaciones locales (carta local)
create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  category text not null,
  name text not null,
  note text,
  maps_query text,
  created_at timestamptz not null default now()
);

-- 6. Peticiones (transfert / tour) — detalles variables según el tipo
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  type text not null check (type in ('transfert', 'tour')),
  nom text not null,
  telephone text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- 7. Carnet de visita
create table if not exists guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  nom text not null,
  message text not null,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

-- RLS ya activado automáticamente por la configuración del proyecto (sin
-- políticas por ahora): solo el servidor (clave service_role) puede acceder
-- a estas tablas. Añadiremos políticas concretas fase por fase, a medida que
-- construyamos el login de hoteleros y las páginas públicas del libro.
alter table hosts enable row level security;
alter table properties enable row level security;
alter table reservations enable row level security;
alter table guest_accounts enable row level security;
alter table recommendations enable row level security;
alter table requests enable row level security;
alter table guestbook_entries enable row level security;
