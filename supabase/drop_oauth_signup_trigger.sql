-- Supprime le trigger et la fonction d'auto-création de "hosts" ajoutés pour
-- l'inscription OAuth (jamais terminée, aucun bouton Google/Facebook n'existe
-- dans l'interface). Ce trigger créait une ligne "hosts" vide dès la création
-- du compte auth.users, et l'insertion explicite faite ensuite par le
-- formulaire d'inscription (avec le vrai nom/téléphone) échouait en silence
-- sur la clé déjà prise — c'est ce qui est arrivé au compte de Frank Chevalier
-- (nom/téléphone jamais enregistrés, accepted_terms_at resté null).
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_host();
