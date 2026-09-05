import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/properties";
import Hero from "@/components/Hero";
import TransfertForm from "@/components/TransfertForm";

export default async function TransfertPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();
  if (!property.postal_code?.startsWith("06")) notFound();

  return (
    <main className="flex-1">
      <Hero
        backHref={`/logement/${slug}`}
        backLabel={property.name}
        title="Réserver un transfert"
        subtitle="Remplis le formulaire, l'hôte organise ton transfert avec le partenaire."
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <TransfertForm slug={slug} propertyName={property.name} propertyAddress={property.address} />
      </section>
    </main>
  );
}
