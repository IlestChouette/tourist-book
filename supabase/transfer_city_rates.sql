-- Tarifs de transfert aéroport par ville, modifiables depuis /admin/tarifas :
-- prix NET du conducteur + commission globale en %. Le prix affiché au
-- voyageur = net + commission, arrondi au multiple de 5 supérieur.
-- RLS activée sans aucune policy : seul le serveur (clé service_role) y
-- accède, jamais un hôtelier ni un voyageur.

create table if not exists transfer_city_rates (
  city text primary key,               -- nom normalisé, ex. "saint-paul-de-vence"
  label text not null,                 -- nom affiché, ex. "Saint-Paul-de-Vence"
  net_small numeric(10,2) not null,    -- 1 à 3 passagers, jusqu'à 2 grands bagages
  net_large numeric(10,2) not null,    -- 3 à 6 passagers, jusqu'à 6 grands bagages
  updated_at timestamptz not null default now()
);
alter table transfer_city_rates enable row level security;

create table if not exists app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table app_settings enable row level security;

insert into app_settings (key, value) values ('transfer_commission_pct', '20')
on conflict (key) do nothing;

insert into transfer_city_rates (city, label, net_small, net_large) values
  ('nice', 'Nice', 50, 70),
  ('beausoleil', 'Beausoleil', 100, 120),
  ('roquebrune-cap-martin', 'Roquebrune-Cap-Martin', 100, 120),
  ('cannes', 'Cannes', 100, 120),
  ('monaco', 'Monaco', 100, 120),
  ('saint-paul-de-vence', 'Saint-Paul-de-Vence', 80, 100),
  ('antibes', 'Antibes', 80, 110)
on conflict (city) do nothing;
