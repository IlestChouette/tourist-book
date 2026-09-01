-- cancellation_requests a été créée dans admin_and_cancellations.sql sans
-- jamais activer la RLS (contrairement à toutes les autres tables dans
-- schema.sql) : elle était donc lisible/modifiable par la clé anon publique
-- via l'API REST auto-générée de Supabase. Aucune policy n'est nécessaire —
-- la clé service_role (utilisée par le code serveur) contourne la RLS ;
-- aucun accès anon/authenticated n'est prévu sur cette table.
alter table cancellation_requests enable row level security;
