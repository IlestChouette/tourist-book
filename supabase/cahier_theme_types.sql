-- Cahier de consignes : couleur choisie par l'hôtel et types de consigne propres.
-- consigne_types : [{ id, label, icon, tone, kind, active }]
-- consignes.type_id : id du type propre (kind reste le type de base pour les statistiques).
alter table hotels
  add column if not exists theme text,
  add column if not exists consigne_types jsonb not null default '[]'::jsonb;

alter table consignes
  add column if not exists type_id text;
