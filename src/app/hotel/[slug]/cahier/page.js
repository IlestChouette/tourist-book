import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getHotelContext } from "@/lib/hotelAuth";
import { listHotelSlugs } from "@/lib/hotelSlug";
import CahierView from "../../CahierView";
import ActivationGate from "./ActivationGate";

export const metadata = { title: "Cahier de consignes", robots: { index: false, follow: false } };

// Adresse du cahier d'un hôtel. Elle ne donne pas accès à elle seule : le
// poste doit avoir été activé (code donné par le manager), ou le manager être
// connecté. Sinon, on propose d'entrer le code d'activation.
export default async function HotelCahierPage({ params }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const entry = (await listHotelSlugs(admin)).find((h) => h.slug === slug);
  if (!entry) notFound();

  const ctx = await getHotelContext();
  if (ctx && ctx.hotel.id === entry.id) return <CahierView ctx={ctx} />;

  const { data: hotel } = await admin.from("hotels").select("name, logo_url").eq("id", entry.id).single();
  return <ActivationGate slug={slug} hotelName={hotel?.name ?? entry.name} logoUrl={hotel?.logo_url ?? null} />;
}
