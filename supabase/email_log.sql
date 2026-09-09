-- Historique de tous les emails envoyés par la plateforme (notifications,
-- relances automatiques, etc.) pour que l'admin puisse voir qui a reçu quoi
-- et quand, sans devoir fouiller dans les logs Vercel ou le dashboard Resend.
create table if not exists email_log (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  subject text not null,
  template text not null,
  status text not null check (status in ('sent', 'failed')),
  error text,
  created_at timestamptz not null default now()
);

create index if not exists email_log_created_at_idx on email_log (created_at desc);

alter table email_log enable row level security;
-- Aucune policy : uniquement accessible via service_role (createAdminClient)
-- — pas de lecture/écriture publique possible.
