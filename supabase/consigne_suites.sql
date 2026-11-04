-- Suite d'une consigne : une consigne rattachée à une autre (fil de suivi).
alter table public.consignes add column if not exists parent_id uuid references public.consignes(id) on delete set null;
create index if not exists consignes_parent_idx on public.consignes (parent_id) where parent_id is not null;
