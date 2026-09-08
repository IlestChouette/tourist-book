-- Empêche de renvoyer plusieurs fois le même email de conseils/bienvenue à
-- un hôtelier qui a déjà créé au moins un logement.
alter table hosts add column if not exists listing_tips_sent_at timestamptz;
