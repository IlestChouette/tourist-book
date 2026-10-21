-- Responsable de service : une personne de l'équipe (avec son code personnel)
-- qui voit, pour ses services seulement, qui a écrit et qui a validé.
-- Additif : sans effet tant qu'aucune personne n'est marquée responsable.
alter table hotel_staff add column if not exists is_supervisor boolean not null default false;
