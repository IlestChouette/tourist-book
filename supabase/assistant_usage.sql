-- Limites d'utilisation de l'assistant du livret (coût d'API) :
--   - par visiteur et par jour,
--   - par logement et par mois.
-- Table et compteur atomique, utilisés uniquement par le serveur (service_role).
create table if not exists assistant_usage (
  property_id uuid not null references properties(id) on delete cascade,
  scope text not null,        -- "v:<empreinte>" (visiteur) ou "m" (logement)
  period text not null,       -- "AAAA-MM-JJ" (visiteur) ou "AAAA-MM" (logement)
  count int not null default 0,
  primary key (property_id, scope, period)
);
alter table assistant_usage enable row level security;
revoke all on assistant_usage from anon, authenticated;

create or replace function assistant_hit(p_property uuid, p_scope text, p_period text)
returns int
language sql
security definer
set search_path = public
as $$
  insert into assistant_usage (property_id, scope, period, count)
  values (p_property, p_scope, p_period, 1)
  on conflict (property_id, scope, period)
  do update set count = assistant_usage.count + 1
  returning count;
$$;
revoke all on function assistant_hit(uuid, text, text) from public, anon, authenticated;
