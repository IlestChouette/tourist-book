-- Bloquer des clients depuis le tableau de bord admin (livrets et cahier de consignes).
alter table public.hosts add column if not exists blocked_at timestamptz;
alter table public.hotels add column if not exists blocked_at timestamptz;

-- Un utilisateur ne doit pas pouvoir se débloquer lui-même : on protège aussi blocked_at (en plus de is_admin).
create or replace function public.protect_hosts_admin() returns trigger language plpgsql as $$
begin
  if auth.role() = 'service_role' or current_user in ('postgres', 'supabase_admin', 'service_role') then return new; end if;
  if tg_op = 'INSERT' then new.is_admin := false; new.blocked_at := null;
  else new.is_admin := old.is_admin; new.blocked_at := old.blocked_at; end if;
  return new;
end $$;
