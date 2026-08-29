alter table hosts add column if not exists is_admin boolean not null default false;

create table if not exists cancellation_requests (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  host_id uuid not null references hosts(id) on delete cascade,
  reason text not null,
  status text not null default 'pendiente',
  created_at timestamptz not null default now()
);
