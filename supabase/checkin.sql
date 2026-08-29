-- Fase 7: check-in electrónico del huésped.

alter table guest_accounts add column if not exists selfie_url text;
alter table guest_accounts add column if not exists verification_status text
  not null default 'pendiente' check (verification_status in ('pendiente', 'aprobado', 'rechazado'));

-- Bucket PRIVADO para documentos de identidad y selfies — nunca público.
-- Todo el acceso (subida y lectura) pasa por el servidor (service_role),
-- igual que ya hicimos para el bucket "media" tras el problema de RLS/Storage.
insert into storage.buckets (id, name, public)
values ('identity', 'identity', false)
on conflict (id) do nothing;
