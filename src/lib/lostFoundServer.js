import { getHotelContext } from "@/lib/hotelAuth";

// Module "Objets trouvés" : désactivé par défaut. Tant que
// hotels.lost_found_enabled est faux (ou que la colonne n'existe pas encore),
// toutes les pages et routes du module répondent comme si elles n'existaient pas.
export async function getLostFoundContext() {
  const ctx = await getHotelContext();
  if (!ctx || ctx.hotel.lost_found_enabled !== true) return null;
  return ctx;
}
