-- Fase 2 : consigne que cada persona del servicio debe validar con su código.
-- Reste visible jusqu'à ce que toutes les personnes rattachées au service
-- aient validé ; elle se clôture alors toute seule.

-- 1) La consigne est « à valider par tous ».
alter table consignes
  add column if not exists require_all boolean not null default false;

-- 2) Qui a validé quoi (une ligne par personne et par consigne).
create table if not exists consigne_acks (
  consigne_id uuid not null references consignes(id) on delete cascade,
  staff_id uuid not null references hotel_staff(id) on delete cascade,
  staff_name text not null,
  created_at timestamptz not null default now(),
  primary key (consigne_id, staff_id)
);
alter table consigne_acks enable row level security;
revoke all on consigne_acks from anon, authenticated;

-- 3) Reprise : chaque personne est rattachée aux services dont elle avait déjà
--    le poste (réception, conciergerie…). Seulement celles encore sans service.
update hotel_staff st
set service_ids = coalesce((
  select array_agg(distinct sv.id)
  from hotel_services sv
  join hotel_tags t on t.hotel_id = sv.hotel_id and t.kind = 'role' and t.id = any (st.role_ids)
  join (values
    ('reception', 'réception'), ('conciergerie', 'conciergerie'), ('gouvernante', 'gouvernante'),
    ('direction', 'direction'), ('technique', 'technique'), ('reservation', 'réservation'),
    ('restaurant', 'restaurant'), ('evenementiel', 'événementiel'), ('lingerie', 'lingerie')
  ) m(key, tag) on m.key = sv.key and m.tag = t.name
  where sv.hotel_id = st.hotel_id
), '{}')
where st.service_ids = '{}' and st.is_manager = false;
