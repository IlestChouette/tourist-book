import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getHotelContext } from "@/lib/hotelAuth";
import { listHotelSlugs } from "@/lib/hotelSlug";
import CahierView from "../../CahierView";
import ActivationGate from "./ActivationGate";

// Aperçu du lien (WhatsApp, e-mail, Slack…) : le nom de l'hôtel et son logo, pas ceux de Tourist Book.
// L'image est générée par opengraph-image.js. Rien de plus que ce que montre déjà l'écran
// d'activation : le nom et le logo de l'hôtel, jamais de consignes.
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const admin = createAdminClient();
  const entry = (await listHotelSlugs(admin)).find((h) => h.slug === slug);
  if (!entry) return { title: "Cahier de consignes", robots: { index: false, follow: false } };
  const { data: hotel } = await admin.from("hotels").select("name").eq("id", entry.id).single();
  const name = hotel?.name ?? entry.name;
  const title = `${name} — Cahier de consignes`;
  const description = "Le cahier de consignes de l'équipe. Ouvrez-le avec le code ou le lien d'activation donné par votre manager.";
  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: { type: "website", siteName: name, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

// Adresse du cahier d'un hôtel. Elle ne donne pas accès à elle seule : le
// poste doit avoir été activé (code donné par le manager), ou le manager être
// connecté. Sinon, on propose d'entrer le code d'activation.
export default async function HotelCahierPage({ params, searchParams }) {
  const { slug } = await params;
  const { lien } = await searchParams;
  const linkSecret = typeof lien === "string" && /^[0-9a-f]{32}$/.test(lien) ? lien : null;
  const admin = createAdminClient();
  const entry = (await listHotelSlugs(admin)).find((h) => h.slug === slug);
  if (!entry) notFound();

  const ctx = await getHotelContext();
  if (ctx && ctx.hotel.id === entry.id) return <CahierView ctx={ctx} />;

  const { data: hotel } = await admin.from("hotels").select("name, logo_url").eq("id", entry.id).single();
  return <ActivationGate linkSecret={linkSecret} slug={slug} hotelName={hotel?.name ?? entry.name} logoUrl={hotel?.logo_url ?? null} />;
}
