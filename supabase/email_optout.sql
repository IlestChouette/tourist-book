-- Désabonnement des emails de rappel et de conseils envoyés aux hôtes (lien signé
-- dans chaque email). Additif.
alter table hosts add column if not exists email_optout boolean not null default false;
