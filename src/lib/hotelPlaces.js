// Lieu par défaut de tous les hôtels : pour une consigne qui s'adresse à l'équipe et
// pas à une chambre. Créé avec l'hôtel, il ne se supprime pas et ne compte pas comme une
// chambre dans les statistiques.
export const GENERAL_PLACE = "Général";
export const isGeneralPlace = (name) => String(name ?? "").trim().toLowerCase() === GENERAL_PLACE.toLowerCase();
