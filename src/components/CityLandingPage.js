import Link from "next/link";
import Hero from "@/components/Hero";
import { getCityPage } from "@/data/cityPages";

export default function CityLandingPage({ slug }) {
  const page = getCityPage(slug);
  if (!page) return null;

  return (
    <main className="flex-1">
      <Hero eyebrow="Côte d'Azur" title={`Livret d'accueil numérique à ${page.city}`} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <p className="text-ink/80">{page.intro}</p>
        <div className="mt-6 grid gap-4 text-ink/80">
          {page.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-8">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Quartiers couverts</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {page.neighborhoods.map((n) => (
              <span key={n} className="rounded-full border border-sand-dim bg-sand-card px-3 py-1 text-sm text-ink/70">
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded border border-sand-dim bg-sand-card p-5 text-center">
          <p className="text-ink">Votre logement à {page.city} mérite un livret d&apos;accueil à la hauteur.</p>
          <Link
            href="/panel/registro"
            className="mt-3 inline-block rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
          >
            Créer mon compte gratuit →
          </Link>
        </div>
      </section>
    </main>
  );
}
