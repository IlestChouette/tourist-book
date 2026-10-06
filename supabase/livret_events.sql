-- Statistiques du livret : une ligne par ouverture du livret ("open") et par
-- bouton touché par le voyageur (wifi, transfert, carte…). Écrit uniquement
-- par le serveur (/api/track, clé service_role) et lu uniquement par le
-- serveur (panel Premium, admin) : RLS activée sans aucune policy, donc
-- aucun accès direct depuis le navigateur.
-- À exécuter dans le SQL Editor de Supabase.

create table if not exists livret_events (
  id bigint generated always as identity primary key,
  property_id uuid not null references properties(id) on delete cascade,
  event text not null,
  created_at timestamptz not null default now()
);

create index if not exists livret_events_property_created on livret_events (property_id, created_at);

alter table livret_events enable row level security;

-- Totaux par logement et par événement, calculés par la base plutôt que de
-- rapatrier toutes les lignes. security_invoker : la vue respecte la RLS de
-- l'appelant (sinon elle serait lisible publiquement via l'API).
create or replace view livret_event_counts with (security_invoker = true) as
select
  property_id,
  event,
  count(*)::int as total,
  (count(*) filter (where created_at > now() - interval '30 days'))::int as last_30_days
from livret_events
group by property_id, event;

revoke all on livret_events from anon, authenticated;
revoke all on livret_event_counts from anon, authenticated;
