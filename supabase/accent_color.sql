-- Couleur d'accent des boutons/tuiles du livret, choisie par l'hôte parmi
-- une palette curée (jamais une valeur libre) — NULL = couleur par défaut
-- (terracotta).
alter table properties add column if not exists accent_color text;
