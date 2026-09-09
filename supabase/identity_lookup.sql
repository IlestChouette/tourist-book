-- Journal des consultations de pièces d'identité par l'admin de la
-- plateforme (hors hôtelier), pour garder une trace de qui a demandé accès
-- à quoi et pourquoi — dans le même esprit que la fiche de police elle-même :
-- une donnée sensible qu'on ne consulte que sur demande justifiée, tracée.
create table if not exists identity_access_log (
  id uuid primary key default gen_random_uuid(),
  admin_email text not null,
  search_query text,
  reservation_id uuid references reservations(id) on delete set null,
  guest_name text,
  created_at timestamptz not null default now()
);

alter table identity_access_log enable row level security;
-- Aucune policy : uniquement accessible via service_role (createAdminClient).
