import Link from "next/link";
import Hero from "@/components/Hero";
import { cityPages, getCityPage } from "@/data/cityPages";
import { WifiIcon, CompassIcon } from "@/components/icons";

// Chaque ville n'a que 2 paragraphes de fond (voir cityPages.js) — on les
// transforme en 2 points visuels au lieu d'un bloc de texte continu. Le 1er
// couvre toujours wifi/horaires, le 2nd la spécificité locale : même icônes
// pour les 3 villes plutôt que d'en inventer une par thème.
const bodyIcons = [WifiIcon, CompassIcon];

// Ce que contient le livret : mêmes fonctions partout, décrites sans rien promettre de plus que le produit.
const FEATURES = [
  "Wifi, horaires d'arrivée et de départ, itinéraire et stationnement, trouvés en un instant à toute heure.",
  "Vos recommandations locales (restaurants, plages, commerces), classées par catégorie, avec une recherche.",
  "Une carte qui trouve les adresses autour de l'adresse exacte du logement.",
  "Réservation de transfert depuis le livret, avec le tarif indicatif affiché.",
  "Français, anglais et espagnol, traduits automatiquement, avec votre logo.",
  "Modifiable en ligne autant de fois que vous le voulez : rien à imprimer, rien à exporter.",
  "Avec l'offre Premium : check-in avant l'arrivée (pièce d'identité, signature, règlement accepté) et assistant virtuel.",
];

// Articles du blog liés à tous les logements de la Côte d'Azur.
const READ_ALSO = [
  { href: "/blog/loi-le-meur-2026-meubles-tourisme-cote-azur", label: "Loi Le Meur 2026 : ce que doivent faire les hôtes de la Côte d'Azur" },
  { href: "/blog/taxe-sejour-numero-enregistrement-mentions-obligatoires-2026", label: "Taxe de séjour et numéro d'enregistrement : les mentions obligatoires" },
  { href: "/blog/voyageurs-etrangers-cote-azur-traduction-livret-accueil", label: "Voyageurs étrangers sur la Côte d'Azur : pourquoi traduire son livret" },
  { href: "/blog/livret-accueil-numerique-avantages-hote", label: "Livret d'accueil numérique : à quoi ça sert ?" },
  { href: "/check-in-electronique-airbnb", label: "Check-in électronique et auto-enregistrement des voyageurs" },
  { href: "/livret-accueil-interactif-video", label: "Le livret d'accueil interactif, avec photos et vidéos" },
];

export default function CityLandingPage({ slug }) {
  const page = getCityPage(slug);
  if (!page) return null;

  const faq = [
    ...(page.faqLocal ?? []),
    { q: `Combien coûte le livret d'accueil pour un logement à ${page.city} ?`, a: "Dès 7 € par mois sans engagement, ou à l'année dès 39,99 € avec 1 mois offert. L'offre se choisit par logement : Essentiel ou Premium." },
    { q: "Comment mes voyageurs reçoivent-ils le livret ?", a: "Par un simple lien ou un QR code, que vous envoyez par WhatsApp, email ou la messagerie Airbnb. Aucune application à installer." },
    { q: "Puis-je modifier mon livret quand je veux ?", a: "Oui, autant de fois que vous le voulez. Les changements sont en ligne tout de suite, sans imprimer ni exporter une seule page." },
    { q: "Combien de temps faut-il pour créer le livret ?", a: "Environ 5 minutes pour un premier logement : nom, photos, wifi, horaires. Le lien est utilisable immédiatement." },
  ];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: "https://tourist-book.com" },
        { "@type": "ListItem", position: 2, name: `Livret d'accueil à ${page.city}`, item: `https://tourist-book.com/livret-accueil-${page.slug}` },
      ],
    },
  ];
  const others = cityPages.filter((c) => c.slug !== slug);

  return (
    <main className="flex-1">
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
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

        <h2 className="mt-14 font-display italic text-2xl text-ink">Ce que vos voyageurs trouvent dans le livret à {page.city}</h2>
        <ul className="mt-4 grid gap-2.5 text-ink/80">
          {FEATURES.map((f) => (
            <li key={f} className="flex gap-3 text-sm"><span aria-hidden="true" className="mt-0.5 text-aqua-deep">✓</span><span>{f}</span></li>
          ))}
        </ul>

        <h2 className="mt-14 font-display italic text-2xl text-ink">Les lieux que vos voyageurs cherchent à {page.city}</h2>
        <p className="mt-3 text-sm text-ink/70">Ajoutez vos adresses préférées autour de ces lieux : le livret les range par catégorie et la carte les trouve autour du logement.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {page.neighborhoods.map((n) => (
            <span key={n} className="rounded-full border border-sand-dim bg-sand-card px-3 py-1.5 text-sm text-ink/70">{n}</span>
          ))}
        </div>

        <h2 className="mt-14 font-display italic text-2xl text-ink">Questions fréquentes sur le livret d&apos;accueil à {page.city}</h2>
        <div className="mt-4 grid gap-3">
          {faq.map((f) => (
            <details key={f.q} className="rounded-lg border border-sand-dim bg-sand-card px-5 py-4">
              <summary className="cursor-pointer font-bold text-ink">{f.q}</summary>
              <p className="mt-2 text-sm text-ink/75">{f.a}</p>
            </details>
          ))}
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

        <h2 className="mt-14 font-display italic text-2xl text-ink">À lire aussi</h2>
        <ul className="mt-4 grid gap-2">
          {READ_ALSO.map((a) => (
            <li key={a.href}><Link href={a.href} className="font-bold text-aqua-deep underline underline-offset-4">{a.label}</Link></li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-ink/70">
          Le livret d&apos;accueil numérique dans d&apos;autres villes :{" "}
          {others.map((c, i) => (
            <span key={c.slug}>{i > 0 ? ", " : ""}<Link href={`/livret-accueil-${c.slug}`} className="font-bold text-aqua-deep underline underline-offset-4">{c.city}</Link></span>
          ))}
          . Vous gérez un hôtel ? Découvrez le <Link href="/hotel" className="font-bold text-aqua-deep underline underline-offset-4">cahier de consignes numérique pour hôtels</Link>.
        </p>
      </section>
    </main>
  );
}
