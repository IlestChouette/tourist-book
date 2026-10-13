-- Cahier : adresse officielle de l'hôtel pour les réponses aux emails de relève.
alter table hotels add column if not exists reply_to text;
