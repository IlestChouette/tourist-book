alter table requests add column if not exists whatsapp_sent boolean not null default false;

create policy "requests_select_own_property" on requests
  for select using (
    exists (
      select 1 from properties p
      where p.id = requests.property_id and p.host_id = auth.uid()
    )
  );
