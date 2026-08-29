-- Quita la política de diagnóstico temporal (ya no es necesaria: las
-- subidas ahora pasan por nuestro servidor con la clave service_role).
drop policy if exists "media_insert_test_amplia" on storage.objects;
