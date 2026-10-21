-- Fase 3 : un accès (email + mot de passe) par service. Le manager le crée dans
-- Gestion ; la personne se connecte sur /hotel/connexion et l'ordinateur est
-- activé pour ce service (jusqu'à 3 par appareil), sans nouveau mot de passe
-- ensuite. Le compte ne sert qu'à activer un appareil : aucune session ne reste.
alter table hotel_services
  add column if not exists account_user_id uuid unique references auth.users(id) on delete set null,
  add column if not exists account_email text;
