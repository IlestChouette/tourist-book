-- Les tarifs de transfert sont désormais fixés uniquement par l'admin de la
-- plateforme (accord avec les transporteurs), pas par chaque hôtelier — celui-ci
-- garde uniquement une visibilité en lecture. Remplace l'ancienne policy
-- "tout ou rien" par : lecture pour l'hôtelier propriétaire ET l'admin,
-- écriture réservée à l'admin.
drop policy if exists "transfer_rates_host_owns_property" on transfer_rates;

create policy "transfer_rates_select_host_or_admin" on transfer_rates
  for select using (
    exists (
      select 1 from properties p
      where p.id = transfer_rates.property_id and p.host_id = auth.uid()
    )
    or exists (select 1 from hosts h where h.id = auth.uid() and h.is_admin = true)
  );

create policy "transfer_rates_admin_insert" on transfer_rates
  for insert with check (exists (select 1 from hosts h where h.id = auth.uid() and h.is_admin = true));

create policy "transfer_rates_admin_update" on transfer_rates
  for update using (exists (select 1 from hosts h where h.id = auth.uid() and h.is_admin = true));

create policy "transfer_rates_admin_delete" on transfer_rates
  for delete using (exists (select 1 from hosts h where h.id = auth.uid() and h.is_admin = true));
