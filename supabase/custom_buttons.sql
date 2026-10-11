-- Boutons personnalisés du livret : [{ id, icon, label, text, video }]
alter table properties
  add column if not exists custom_buttons jsonb not null default '[]'::jsonb;
