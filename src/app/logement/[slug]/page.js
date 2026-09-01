import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import { createAdminClient } from "@/lib/supabase/admin";
import LivretHero from "@/components/LivretHero";
import LivretMenu from "@/components/LivretMenu";

const CHECKIN_STATUS_BANNER = {
  pendiente: {
    className: "border-terracotta bg-terracotta/10 text-ink",
    text: "Ton check-in est bien enregistré et en cours de vérification par l'hôte.",
  },
  rechazado: {
    className: "border-terracotta-deep bg-terracotta-deep/10 text-ink",
    text: "Tes documents de check-in n'ont pas pu être validés — contacte ton hôte pour en savoir plus.",
  },
};

async function getGuestCheckinStatus(slug) {
  const cookieStore = await cookies();
  const reservationId = cookieStore.get(`guest_${slug}`)?.value;
  if (!reservationId) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("guest_accounts")
    .select("verification_status")
    .eq("reservation_id", reservationId)
    .single();
  return data?.verification_status ?? null;
}

export default async function LivretPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const photos = property.photos ?? [];
  const checkinStatus = await getGuestCheckinStatus(slug);
  const banner = checkinStatus ? CHECKIN_STATUS_BANNER[checkinStatus] : null;

  const description =
    property.description ||
    "Ce livret numérique réunit tout ce qu'il faut pour ton séjour : le wifi, les horaires d'arrivée et de départ, les recommandations de l'hôte, et la réservation de ton transfert — directement depuis ton téléphone, sans rien installer.";

  return (
    <main className="flex-1">
      <LivretHero
        title={property.name}
        subtitle={property.address}
        description={description}
        photos={photos}
      />

      <section id="menu" className="mx-auto max-w-2xl px-6 py-8 md:max-w-5xl md:py-10">
        {banner && (
          <div className={`mb-6 rounded border p-4 text-sm ${banner.className}`}>{banner.text}</div>
        )}
        <LivretMenu property={property} slug={slug} />
      </section>
    </main>
  );
}
