create table if not exists transfer_rates (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  pickup_location text not null,
  passengers int not null,
  price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

alter table transfer_rates enable row level security;

-- Privé à l'hôtelier : lisible/modifiable uniquement par le propriétaire du
-- logement concerné. Jamais exposé au voyageur ni au transporteur.
create policy "transfer_rates_host_owns_property" on transfer_rates
  for all using (
    exists (
      select 1 from properties p
      where p.id = transfer_rates.property_id and p.host_id = auth.uid()
    )
  );
