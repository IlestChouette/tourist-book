create table if not exists contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  properties_count int,
  created_at timestamptz not null default now()
);

alter table contact_leads enable row level security;
-- Aucune policy : uniquement accessible via service_role (la route API
-- /api/contact insère avec createAdminClient) — pas de lecture/écriture
-- publique possible.
