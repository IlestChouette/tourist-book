import Link from "next/link";
import { properties } from "@/data/properties";
import Hero from "@/components/Hero";

export default function Home() {
  const cities = [...new Set(properties.map((p) => p.city))];

  return (
    <main className="flex-1">
      <Hero
        eyebrow="Tourist Book"
        title="Tes logements"
        subtitle="Un livret d'accueil numérique pour chaque adresse."
        stamps={cities}
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {properties.map((property) => (
            <Link
              key={property.slug}
              href={`/logement/${property.slug}`}
              className="block rounded border border-sand-dim bg-sand-card p-5 transition-colors hover:border-aqua-deep"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                {property.city}
              </span>
              <h2 className="mt-2 font-display italic text-2xl text-ink">
                {property.name}
              </h2>
              <p className="mt-1 text-sm text-ink/70">{property.address}</p>
            </Link>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="mt-8 inline-block text-sm font-bold uppercase tracking-wider text-aqua-deep"
        >
          Tableau de bord hébergeur →
        </Link>
      </section>
    </main>
  );
}
