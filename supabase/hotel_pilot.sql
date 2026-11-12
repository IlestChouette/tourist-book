-- Essai gratuit des hôtels : 14 jours, 3 services au plus, sans carte.
-- Le jour 15, sans abonnement, tout le cahier est bloqué. Si l'hôtel ne paie que
-- certains services, les autres restent en pause (désactivés, jamais supprimés).
-- Additif et idempotent : les hôtels existants ne sont pas touchés (colonne vide).
alter table hotels add column if not exists pilot_ends_at timestamptz;

-- Pour offrir ou prolonger un essai à un hôtel existant (exemple, 14 jours à partir de maintenant) :
--   update hotels set pilot_ends_at = now() + interval '14 days' where name = 'Nom de l''hôtel';
