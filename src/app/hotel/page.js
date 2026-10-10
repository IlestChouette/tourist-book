import Image from "next/image";
import Link from "next/link";
import { Icon } from "./cahier/CahierIcons";
import { EmailMockup, PhoneKind, PhonePin, StatsMockup, TabletMockup } from "./Mockups";

const URL = "https://tourist-book.com/hotel";
const TITLE = "Cahier de consignes numérique pour hôtels — Tourist Book";
const DESCRIPTION =
  "Remplacez le cahier papier de votre réception : consignes qui ne se perdent plus entre deux équipes, validation avec le code de la badgeuse, récap par email à chaque relève et statistiques pour la direction.";

// Le dossier /hotel est en noindex (espace de travail) : cette page de
// présentation, elle, doit être référencée.
export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  alternates: { canonical: "/hotel" },
  openGraph: { type: "website", url: URL, siteName: "Tourist Book", locale: "fr_FR", title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const faq = [
  {
    q: "Faut-il installer quelque chose ?",
    a: "Non. Le cahier s'ouvre dans le navigateur du poste de réception, d'une tablette ou d'un téléphone. Le manager active le poste une seule fois ; ensuite chacun s'identifie avec son code.",
  },
  {
    q: "Mes équipes devront-elles apprendre à s'en servir ?",
    a: "Très peu. Un gros bouton « Écrire une consigne », une question par écran, un clavier à chiffres : la personne la moins à l'aise avec un ordinateur s'en sort sans explication.",
  },
  {
    q: "Quel code utilisent les employés ?",
    a: "Celui que vous voulez. Beaucoup d'hôtels reprennent le code de la badgeuse (arrivée et départ) : personne n'a un nouveau code à retenir.",
  },
  {
    q: "Tout le monde voit qui a écrit quoi ?",
    a: "Non. Les employés voient les consignes et leur état ; seuls le manager et la direction voient qui les a écrites ou validées.",
  },
  {
    q: "Et si internet tombe ?",
    a: "Le bouton « Imprimer la journée » garde une copie papier à portée de main, et chaque journée se télécharge en PDF ou pour Excel.",
  },
  {
    q: "C'est compatible avec mon logiciel de réception ?",
    a: "Le cahier fonctionne à côté de votre logiciel (Hotsoft, Mews, Opera…), sans rien à connecter ni à installer. Vous pouvez commencer dès aujourd'hui.",
  },
];

const features = [
  { icon: "user", title: "Pensé pour tout le monde", text: "Un gros bouton, des questions simples, un clavier à chiffres. Aucune formation, même pour qui n'utilise jamais d'ordinateur." },
  { icon: "probleme", title: "Les urgences d'abord", text: "Ce qui est urgent ou en retard passe en haut de la liste, avec le nombre de jours depuis lequel c'est en attente." },
  { icon: "pin", title: "Important pour tous", text: "Gardez une information en haut de la page, pour tout le monde, jusqu'à la date que vous choisissez." },
  { icon: "download", title: "Excel et PDF en un clic", text: "Chaque rapport se télécharge pour Excel ou en PDF, et la journée s'imprime si vous le souhaitez." },
  { icon: "info", title: "Des chiffres pour la direction", text: "Chambres qui reviennent, délais de clôture, consignes laissées en suspens par équipe : enfin des réponses." },
  { icon: "check", title: "Vos données restent à vous", text: "Chaque hôtel ne voit que les siennes. Elles sont conservées 3 ans et exportables à tout moment." },
];

const steps = [
  {
    n: "1",
    title: "On écrit en quelques secondes",
    text: "Quoi, où, un petit message, pour qui, urgent ou non. Une seule question par écran, que l'on soit à la réception ou en étage avec une tablette.",
    visual: <PhoneKind />,
  },
  {
    n: "2",
    title: "On valide avec son code",
    text: "Chacun tape le code qu'il connaît déjà : celui de la badgeuse. Le message part tout seul au quatrième chiffre, et le manager sait qui a fait quoi.",
    visual: <PhonePin />,
  },
  {
    n: "3",
    title: "Rien ne se perd, jamais",
    text: "Ce qui n'est pas fait revient le lendemain en priorité. Un récap arrive par email à 6 h 55, 14 h 55 et 22 h 55, juste avant chaque relève.",
    visual: <EmailMockup />,
  },
];

function Cta({ children = "Créer l'espace de mon hôtel", className = "" }) {
  return (
    <Link
      href="/hotel/inscription"
      className={`inline-flex items-center justify-center rounded-xl bg-terracotta px-7 py-4 text-lg font-bold text-ink transition-colors hover:bg-terracotta-deep focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-sand-card ${className}`}
    >
      {children}
    </Link>
  );
}

export default function HotelLandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Tourist Book — Cahier de consignes",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: DESCRIPTION,
        url: URL,
        offers: { "@type": "Offer", price: "15", priceCurrency: "EUR", description: "Par mois et par service" },
        provider: { "@type": "Organization", name: "Tourist Book", url: "https://tourist-book.com" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="bg-[#2f7d76]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <Link href="/" className="inline-flex shrink-0">
            <Image src="/tourist book long.png" alt="Tourist Book" width={278} height={106} priority className="h-16 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-20" />
          </Link>
          <nav className="flex items-center gap-5 text-sm font-bold text-[#f7f1e4]/85">
            <Link href="/hotel/connexion" className="hidden hover:text-[#f7f1e4] sm:inline">Connexion</Link>
            <Link href="/hotel/inscription" className="whitespace-nowrap rounded-lg bg-terracotta px-4 py-2 text-ink transition-colors hover:bg-terracotta-deep">Créer mon espace</Link>
          </nav>
        </div>
      </header>

      {/* Promesse */}
      <section className="bg-aqua-deep">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-[1.05fr_1fr] md:py-20">
          <div>
            <h1 className="font-display italic text-4xl leading-[1.1] text-[#f7f1e4] sm:text-5xl lg:text-6xl">
              Plus aucune consigne oubliée entre deux équipes.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[#f7f1e4]/90">
              Le cahier de consignes de votre réception, sur écran. Chacun écrit en quelques touches, tout le monde voit ce qu'il reste à faire, et rien ne disparaît tant que personne ne l'a validé.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Cta />
              <a href="#comment" className="text-base font-bold text-[#f7f1e4] underline underline-offset-4 hover:text-white">Voir comment ça marche</a>
            </div>
            <p className="mt-5 text-sm text-[#f7f1e4]/80">Prêt en 10 minutes · Aucune formation nécessaire · Pour les équipes de réception, conciergerie, technique…</p>
          </div>
          <div className="mx-auto w-full max-w-md md:max-w-none">
            <TabletMockup className="md:-rotate-1" />
          </div>
        </div>
      </section>

      {/* Le problème */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2 className="max-w-2xl font-display italic text-3xl text-ink sm:text-4xl">Le cahier papier, vous le connaissez.</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            ["Lu une fois, puis oublié", "Un message écrit à 22 h est lu à 6 h… ou pas. Rien n'indique s'il a été fait."],
            ["Le message n'arrive pas", "Entre le matin, le soir et la nuit, une information se perd au changement d'équipe."],
            ["Impossible de s'y retrouver", "Quelle chambre revient sans cesse ? Combien de plaintes ce mois-ci ? Personne ne peut le dire."],
          ].map(([title, text]) => (
            <div key={title}>
              <h3 className="text-xl font-bold text-ink">{title}</h3>
              <p className="mt-2 text-ink/70">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment" className="scroll-mt-4 bg-sand-card py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="max-w-2xl font-display italic text-3xl text-ink sm:text-4xl">Trois gestes, et la relève se fait toute seule.</h2>
          <div className="mt-12 grid gap-14">
            {steps.map((s, i) => (
              <div key={s.n} className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""}`}>
                <div>
                  <span className="font-display italic text-5xl text-terracotta-deep">{s.n}</span>
                  <h3 className="mt-2 text-2xl font-bold text-ink">{s.title}</h3>
                  <p className="mt-3 max-w-md text-lg text-ink/75">{s.text}</p>
                </div>
                <div>{s.visual}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fonctions */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <h2 className="max-w-2xl font-display italic text-3xl text-ink sm:text-4xl">Simple pour l'équipe, utile pour la direction.</h2>
        <div className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-terracotta text-ink">
                <Icon name={f.icon} className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-bold text-ink">{f.title}</h3>
                <p className="mt-1 text-sm text-ink/70">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direction / statistiques */}
      <section className="bg-aqua-deep">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-20">
          <div>
            <h2 className="font-display italic text-3xl text-[#f7f1e4] sm:text-4xl">Voyez enfin ce qui revient.</h2>
            <p className="mt-4 text-lg text-[#f7f1e4]/90">
              Chaque consigne est un chiffre. Cliquez sur une chambre : tous ses problèmes, ses plaintes, et si c'est la 2e, la 3e, la 4e fois que le même défaut revient.
            </p>
            <ul className="mt-6 grid gap-3 text-[#f7f1e4]/90">
              {["Les chambres et lieux les plus touchés", "Les délais pour clôturer une consigne", "Ce que chaque équipe laisse en suspens", "Tout exportable pour Excel"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Icon name="check" className="mt-0.5 h-6 w-6 shrink-0 text-terracotta" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <StatsMockup className="mx-auto w-full max-w-sm" />
        </div>
      </section>

      {/* Papier / Tourist Book */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <h2 className="text-center font-display italic text-3xl text-ink sm:text-4xl">Le même cahier. Sans les oublis.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-sand-dim bg-sand p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink/50">Cahier papier</h3>
            <ul className="mt-4 grid gap-3 text-ink/80">
              {["Lu une fois, jamais relu", "Personne ne sait si c'est fait", "Retrouver une consigne : tourner les pages", "Aucune statistique", "Disparaît avec le cahier"].map((t) => (
                <li key={t} className="flex gap-3"><span className="text-ink/40">–</span> {t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border-2 border-aqua-deep bg-aqua-deep/[0.06] p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-aqua-deep">Tourist Book</h3>
            <ul className="mt-4 grid gap-3 text-ink/85">
              {["Ce qui n'est pas fait revient en priorité", "Chaque consigne a un état : à faire ou faite", "Recherche, jour par jour, en un clic", "Statistiques et exports Excel", "Conservé 3 ans, téléchargeable"].map((t) => (
                <li key={t} className="flex gap-3"><Icon name="check" className="h-6 w-6 shrink-0 text-aqua-deep" /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tarif */}
      <section className="bg-sand-card py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display italic text-3xl text-ink sm:text-4xl">Un tarif simple, par service.</h2>
          <p className="mt-4 text-lg text-ink/75">Vous ne payez que les services que vous utilisez : réception, conciergerie, technique, housekeeping…</p>
          <div className="mx-auto mt-8 max-w-sm rounded-2xl border-2 border-ink bg-sand p-8">
            <p className="font-display italic text-6xl text-ink">15 €</p>
            <p className="mt-1 text-lg font-bold text-ink">par mois et par service</p>
            <p className="mt-4 text-ink/70">Statistiques, exports Excel et PDF, récap par email : tout est inclus.</p>
          </div>
          <div className="mt-8"><Cta className="bg-terracotta" /></div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-6 py-16 md:py-20">
        <h2 className="text-center font-display italic text-3xl text-ink">Questions fréquentes</h2>
        <div className="mt-8 grid gap-3">
          {faq.map((item) => (
            <details key={item.q} className="group rounded-xl border border-sand-dim bg-sand-card p-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                {item.q}
                <span className="shrink-0 text-xl text-ink/40 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-prose text-ink/70">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Appel final */}
      <section className="bg-aqua-deep py-16 text-center">
        <h2 className="mx-auto max-w-2xl px-6 font-display italic text-3xl text-[#f7f1e4] sm:text-4xl">Votre prochaine relève, sans rien oublier.</h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 px-6">
          <Cta />
          <Link href="/hotel/connexion" className="text-base font-bold text-[#f7f1e4] underline underline-offset-4">J'ai déjà un espace</Link>
        </div>
        <p className="mt-5 px-6 text-sm text-[#f7f1e4]/80">Une question ? Écrivez-nous : <a href="mailto:allo@ilestchouette.fr" className="font-bold underline underline-offset-2">allo@ilestchouette.fr</a></p>
      </section>
    </main>
  );
}
