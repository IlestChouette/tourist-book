import { redirect } from "next/navigation";
import { getHotelContext } from "@/lib/hotelAuth";
import { slugForHotel } from "@/lib/hotelSlug";

export const metadata = { title: "Cahier de consignes", robots: { index: false, follow: false } };

// Ancienne adresse, toujours valable (postes déjà activés, favoris) : renvoie
// vers l'adresse propre à l'hôtel, /hotel/<nom>/cahier.
export default async function CahierRedirectPage() {
  const ctx = await getHotelContext();
  if (!ctx) redirect("/hotel/connexion");
  const slug = await slugForHotel(ctx.hotel.id, ctx.admin);
  redirect(slug ? `/hotel/${slug}/cahier` : "/hotel/connexion");
}
