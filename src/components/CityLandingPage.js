import Link from "next/link";
import Hero from "@/components/Hero";
import { getCityPage } from "@/data/cityPages";
import { WifiIcon, CompassIcon } from "@/components/icons";

// Chaque ville n'a que 2 paragraphes de fond (voir cityPages.js) — on les
// transforme en 2 points visuels au lieu d'un bloc de texte continu. Le 1er
// couvre toujours wifi/horaires, le 2nd la spécificité locale : même icônes
// pour les 3 villes plutôt que d'en inventer une par thème.
const bodyIcons = [WifiIcon, CompassIcon];

export default function CityLandingPage({ slug }) {
  const page = getCityPage(slug);
  if (!page) return null;

  return (
    <main className="flex-1">
      <Hero eyebrow="Côte d'Azur" title={`Livret d'accueil numérique à ${page.city}`} />
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="max-w-2xl text-lg text-ink/80">{page.intro}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {page.body.map((text, i) => {
            const Icon = bodyIcons[i] ?? CompassIcon;
            return (
              <div key={i} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-ink">
                  <Icon />
                </span>
                <p className="text-sm text-ink/80">{text}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Quartiers couverts</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {page.neighborhoods.map((n) => (
              <span key={n} className="rounded-full border border-sand-dim bg-sand-card px-3 py-1.5 text-sm text-ink/70">
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-xl border border-sand-dim bg-sand-card p-7 text-center">
          <p className="font-display italic text-xl text-ink">
            Votre logement à {page.city} mérite un livret d&apos;accueil à la hauteur.
          </p>
          <Link
            href="/panel/registro"
            className="mt-4 inline-block rounded bg-terracotta px-6 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
          >
            Créer mon compte gratuit →
          </Link>
        </div>
      </section>
    </main>
  );
}
