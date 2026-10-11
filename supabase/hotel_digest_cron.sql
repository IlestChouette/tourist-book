-- Déclenche l'envoi des pendientes (6h55, 14h55, 22h55 heure de Paris) :
-- Vercel (offre gratuite) ne permet qu'une tâche planifiée par jour, donc
-- c'est Supabase qui appelle le site toutes les 5 minutes. Le site décide
-- lui-même s'il doit envoyer (heure de Paris, changement d'heure inclus,
-- aucun doublon).
--
-- 1. Database → Extensions : activer "pg_cron" et "pg_net".
-- 2. Remplacer __CRON_SECRET__ ci-dessous par la valeur de CRON_SECRET
--    (Vercel → Settings → Environment Variables), puis Run.
select cron.schedule(
  'hotel-digest',
  '*/5 * * * *',
  $$ select net.http_get(
       url := 'https://tourist-book.com/api/cron/hotel-digest',
       headers := jsonb_build_object('Authorization', 'Bearer __CRON_SECRET__')
     ); $$
);
