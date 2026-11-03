-- SEGURIDAD: un usuario conectado no debe poder cambiarse a sí mismo columnas privilegiadas.
-- Las políticas "hosts_update_own" y "properties_manage_own" dejan editar la fila propia sin limitar columnas:
--   · hosts.is_admin  → cualquiera podía hacerse administrador;
--   · properties.plan / subscription_status / stripe_subscription_id / trial_ends_at / billing_cycle /
--     current_period_end → cualquiera podía darse una suscripción Premium sin pagar.
-- Estos disparadores ignoran esos cambios cuando no vienen del servidor (service_role) ni del SQL Editor.

create or replace function public.protect_hosts_admin() returns trigger language plpgsql as $$
begin
  if auth.role() = 'service_role' or current_user in ('postgres', 'supabase_admin', 'service_role') then return new; end if;
  if tg_op = 'INSERT' then new.is_admin := false; else new.is_admin := old.is_admin; end if;
  return new;
end $$;
drop trigger if exists protect_hosts_admin on public.hosts;
create trigger protect_hosts_admin before insert or update on public.hosts
  for each row execute function public.protect_hosts_admin();

create or replace function public.protect_properties_billing() returns trigger language plpgsql as $$
begin
  if auth.role() = 'service_role' or current_user in ('postgres', 'supabase_admin', 'service_role') then return new; end if;
  if tg_op = 'INSERT' then
    new.plan := null; new.subscription_status := null; new.stripe_subscription_id := null;
    new.trial_ends_at := null; new.billing_cycle := null; new.current_period_end := null;
  else
    new.plan := old.plan; new.subscription_status := old.subscription_status; new.stripe_subscription_id := old.stripe_subscription_id;
    new.trial_ends_at := old.trial_ends_at; new.billing_cycle := old.billing_cycle; new.current_period_end := old.current_period_end;
  end if;
  return new;
end $$;
drop trigger if exists protect_properties_billing on public.properties;
create trigger protect_properties_billing before insert or update on public.properties
  for each row execute function public.protect_properties_billing();
