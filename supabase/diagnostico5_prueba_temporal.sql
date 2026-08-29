-- SOLO PARA DIAGNÓSTICO — política temporal muy permisiva para aislar el problema.
-- La borraremos en cuanto sepamos qué está pasando.
drop policy if exists "media_insert_test_amplia" on storage.objects;

create policy "media_insert_test_amplia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media');
