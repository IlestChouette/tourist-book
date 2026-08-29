import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import Hero from "@/components/Hero";
import CarnetPanel from "@/components/CarnetPanel";

export default async function CarnetPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <main className="flex-1">
      <Hero
        backHref={`/logement/${slug}`}
        backLabel={property.name}
        title="Carnet de visite"
        subtitle="Les messages laissés par les voyageurs précédents — et le tien, si tu veux."
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <CarnetPanel slug={slug} />
      </section>
    </main>
  );
}
