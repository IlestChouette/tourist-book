import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import Hero from "@/components/Hero";

export default async function ToursPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <main className="flex-1">
      <Hero
        backHref={`/logement/${slug}`}
        backLabel={property.name}
        title="Tours & activités"
        subtitle="Bientôt disponible."
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-sand-dim bg-sand-card p-5">
          <p className="text-ink">
            La réservation de tours et d&apos;activités arrive bientôt — le partenaire est en cours de
            configuration.
          </p>
        </div>
      </section>
    </main>
  );
}
