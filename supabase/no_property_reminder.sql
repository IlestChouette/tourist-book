-- Empêche de renvoyer plusieurs fois le même email de relance à un hôtelier
-- qui n'a toujours pas créé de logement.
alter table hosts add column if not exists no_property_reminder_sent_at timestamptz;
