-- Lieu « Général » par défaut dans tous les hôtels : pour une consigne qui s'adresse à
-- l'équipe et pas à une chambre. Idempotent : ne crée rien là où il existe déjà.
insert into hotel_places (hotel_id, name, kind)
select h.id, 'Général', 'area'
from hotels h
where not exists (select 1 from hotel_places p where p.hotel_id = h.id and lower(p.name) = 'général');
