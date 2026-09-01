import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import Hero from "@/components/Hero";
import CarteInteractive from "@/components/CarteInteractive";

export default async function CartePage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <main className="flex-1">
      <Hero
        backHref={`/logement/${slug}`}
        backLabel={property.name}
        title="Carte locale"
        subtitle={`Autour de ${property.name}.`}
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <CarteInteractive property={property} />
      </section>
    </main>
  );
}
