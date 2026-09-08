import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getPropertyBySlug, hasActiveSubscription } from "@/lib/properties";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale } from "@/lib/i18n/locale";
import { translateProperty } from "@/lib/translate";
import LivretHero from "@/components/LivretHero";
import LivretMenu from "@/components/LivretMenu";

const CHECKIN_STATUS_BANNER = {
  fr: {
    pendiente: {
      className: "border-terracotta bg-terracotta/10 text-ink",
      text: "Ton check-in est bien enregistré et en cours de vérification par l'hôte.",
    },
    rechazado: {
      className: "border-terracotta-deep bg-terracotta-deep/10 text-ink",
      text: "Tes documents de check-in n'ont pas pu être validés — contacte ton hôte pour en savoir plus.",
    },
  },
  en: {
    pendiente: {
      className: "border-terracotta bg-terracotta/10 text-ink",
      text: "Your check-in has been recorded and is being reviewed by your host.",
    },
    rechazado: {
      className: "border-terracotta-deep bg-terracotta-deep/10 text-ink",
      text: "Your check-in documents couldn't be validated — contact your host to find out more.",
    },
  },
  es: {
    pendiente: {
      className: "border-terracotta bg-terracotta/10 text-ink",
      text: "Tu check-in quedó registrado y está siendo verificado por tu anfitrión.",
    },
    rechazado: {
      className: "border-terracotta-deep bg-terracotta-deep/10 text-ink",
      text: "Tus documentos de check-in no pudieron validarse — contacta a tu anfitrión para más información.",
    },
  },
};

const content = {
  fr: {
    unavailable:
      "Ce livret n'est plus disponible. Contacte directement ton hôte pour obtenir les informations de ton séjour.",
    defaultDescription:
      "Ce livret numérique réunit tout ce qu'il faut pour ton séjour : le wifi, les horaires d'arrivée et de départ, les recommandations de l'hôte, et la réservation de ton transfert — directement depuis ton téléphone, sans rien installer.",
  },
  en: {
    unavailable:
      "This welcome book is no longer available. Contact your host directly for information about your stay.",
    defaultDescription:
      "This digital welcome book has everything you need for your stay: wifi, check-in and check-out times, your host's recommendations, and transfer booking — all from your phone, nothing to install.",
  },
  es: {
    unavailable:
      "Este livret ya no está disponible. Contacta directamente a tu anfitrión para obtener la información de tu estancia.",
    defaultDescription:
      "Este livret digital reúne todo lo necesario para tu estancia: wifi, horarios de llegada y salida, las recomendaciones de tu anfitrión, y la reserva de tu transfer — directamente desde tu teléfono, sin instalar nada.",
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
  const locale = await getLocale();
  const t = content[locale];
  const rawProperty = await getPropertyBySlug(slug);
  if (!rawProperty) notFound();

  if (!hasActiveSubscription(rawProperty)) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-20 text-center">
        <p className="max-w-sm text-ink/70">{t.unavailable}</p>
      </main>
    );
  }

  const property = await translateProperty(rawProperty, locale);

  const photos = property.photos ?? [];
  const checkinStatus = await getGuestCheckinStatus(slug);
  const banner = checkinStatus ? CHECKIN_STATUS_BANNER[locale][checkinStatus] : null;

  const description = property.description || t.defaultDescription;

  return (
    <main className="flex-1">
      <LivretHero
        title={property.name}
        subtitle={property.address}
        description={description}
        photos={photos}
        locale={locale}
      />

      <section id="menu" className="mx-auto max-w-2xl px-6 py-8 md:max-w-5xl md:py-10">
        {banner && (
          <div className={`mb-6 rounded border p-4 text-sm ${banner.className}`}>{banner.text}</div>
        )}
        <LivretMenu property={property} slug={slug} locale={locale} />
      </section>
    </main>
  );
}
