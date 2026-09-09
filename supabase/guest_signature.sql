-- La fiche individuelle de police (article R.611-42 du CESEDA) exige aussi
-- la signature du voyageur, en plus des données d'identité déjà collectées.
alter table guest_accounts add column if not exists signature_url text;
