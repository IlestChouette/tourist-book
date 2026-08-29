import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import Hero from "@/components/Hero";
import LivretMenu from "@/components/LivretMenu";

export default async function LivretPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <main className="flex-1">
      <Hero
        backHref="/"
        backLabel="Tous les logements"
        eyebrow="Livret d'accueil"
        title={property.name}
        subtitle={property.address}
        stamps={["FR", "EN", "ES"]}
        photo={property.photos?.[0] ?? null}
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-ink/80">
          Ce livret numérique réunit tout ce qu&apos;il faut pour ton séjour : le wifi, les horaires
          d&apos;arrivée et de départ, les recommandations de l&apos;hôte, et la réservation de ton transfert —
          directement depuis ton téléphone, sans rien installer.
        </p>

        <div className="mt-8">
          <LivretMenu property={property} slug={slug} />
        </div>
      </section>
    </main>
  );
}
