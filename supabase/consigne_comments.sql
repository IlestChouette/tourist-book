-- Précision facultative à la validation d'une consigne : « c'est fait » (closed_comment) ou
-- « je valide » dans une consigne à valider par tous (comment, une par personne). Additif.
alter table consignes add column if not exists closed_comment text;
alter table consigne_acks add column if not exists comment text;
