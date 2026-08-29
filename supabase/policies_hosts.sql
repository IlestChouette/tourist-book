-- Permite a un hotelero conectado leer/crear/editar SU PROPIA fila en "hosts".
-- Ejecutar en el SQL Editor de Supabase (igual que schema.sql).

create policy "hosts_select_own" on hosts
  for select using (auth.uid() = id);

create policy "hosts_insert_own" on hosts
  for insert with check (auth.uid() = id);

create policy "hosts_update_own" on hosts
  for update using (auth.uid() = id);
