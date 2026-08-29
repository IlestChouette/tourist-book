-- Fase 5: logo del hotelero, fotos de alojamientos, aceptación de condiciones.
-- Ejecutar en el SQL Editor de Supabase (igual que los anteriores).

-- Nuevas columnas
alter table hosts add column if not exists logo_url text;
alter table hosts add column if not exists accepted_terms_at timestamptz;
alter table properties add column if not exists photos text[] not null default '{}'::text[];

-- Bucket público para logos y fotos (no sensible; los documentos de identidad
-- del check-in irán en un bucket PRIVADO aparte, en la fase de check-in).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Cada hotelero solo puede escribir dentro de su propia carpeta:
-- media/{host_id}/logo.ext  ó  media/{host_id}/{property_id}/1.jpg
create policy "media_insert_own" on storage.objects
  for insert with check (
    bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "media_update_own" on storage.objects
  for update using (
    bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "media_delete_own" on storage.objects
  for delete using (
    bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Un hotelero gestiona sus propios alojamientos (necesario para el panel).
create policy "properties_manage_own" on properties
  for all using (host_id = auth.uid()) with check (host_id = auth.uid());
