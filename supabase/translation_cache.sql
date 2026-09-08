-- Cache des traductions automatiques du texte libre saisi par l'hôte
-- (message de bienvenue, règles, recommandations...) pour ne pas rappeler
-- l'API de traduction à chaque visite d'un voyageur. source_hash permet de
-- détecter que l'hôte a modifié le texte et de retraduire seulement dans ce cas.
create table if not exists translation_cache (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  field text not null,
  locale text not null,
  source_hash text not null,
  translated_text text not null,
  created_at timestamptz not null default now(),
  unique (property_id, field, locale)
);

alter table translation_cache enable row level security;
-- Aucune policy : uniquement accessible via service_role (createAdminClient)
-- — pas de lecture/écriture publique possible.
