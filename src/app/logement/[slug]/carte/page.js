import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import { recommendationsForCity } from "@/data/recommendations";
import Hero from "@/components/Hero";
import CarteInteractive from "@/components/CarteInteractive";

export default async function CartePage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const items = recommendationsForCity(property.city);

  return (
    <main className="flex-1">
      <Hero
        backHref={`/logement/${slug}`}
        backLabel={property.name}
        title="Carte locale"
        subtitle={`Les recommandations de l'hôte à ${property.city}.`}
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <CarteInteractive property={property} items={items} />
      </section>
    </main>
  );
}
