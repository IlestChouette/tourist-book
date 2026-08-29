-- Vuelve a crear la política que permite a un hotelero gestionar sus propios
-- alojamientos (por si la primera vez no se aplicó del todo).
drop policy if exists "properties_manage_own" on properties;

create policy "properties_manage_own" on properties
  for all using (host_id = auth.uid()) with check (host_id = auth.uid());
