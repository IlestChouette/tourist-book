-- Un compte peut gérer plusieurs hôtels (groupe) : on retire l'unicité de owner_id.
alter table public.hotels drop constraint if exists hotels_owner_id_key;
create index if not exists hotels_owner_idx on public.hotels (owner_id);
