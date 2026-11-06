import Link from "next/link";
import Hero from "@/components/Hero";
import { getFeaturePage } from "@/data/featurePages";
import { Icon, LivretPhone, CheckinPhone } from "@/components/FeaturePhones";

const CTA = "inline-flex items-center justify-center rounded bg-terracotta px-6 py-3.5 font-bold text-[#223339] transition-colors hover:bg-terracotta-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-deep";

export default function FeatureLandingPage({ slug }) {
  const page = getFeaturePage(slug);
  if (!page) return null;
  const Phone = page.mock === "checkin" ? CheckinPhone : LivretPhone;
  const stepCols = page.steps.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: "https://tourist-book.com" }, { "@type": "ListItem", position: 2, name: page.seoTitle, item: `https://tourist-book.com${page.path}` }] },
  ];
  return (
    <main className="flex-1">
      {jsonLd.map((j, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />)}
      <Hero title={page.h1} compact />

      {/* Scène : une phrase, le produit à l'écran */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-6 py-14 md:grid-cols-[1fr_auto] md:gap-16 md:py-20">
        <div>
          <p className="max-w-md text-lg leading-relaxed text-ink/85 sm:text-xl">{page.lead}</p>
          <Link href="/panel/registro" className={`${CTA} mt-6`}>Créer mon compte gratuit →</Link>
          <ul className="mt-6 flex flex-wrap gap-2">
            {page.chips.map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-sand-card px-3.5 py-2 text-sm font-bold text-ink ring-1 ring-sand-dim">
                <span className="text-aqua-deep"><Icon name="check" /></span>{c}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:-rotate-2"><Phone /></div>
      </section>

      {/* Ce que ça contient : une tuile large, des tuiles courtes */}
      <section className="bg-sand-card py-14 md:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">{page.bentoTitle}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.bento.map((b) => (
              <div key={b.t} className={b.big ? "flex flex-col justify-between gap-8 rounded-2xl bg-aqua-deep p-7 text-[#f7f1e4] sm:col-span-2 lg:col-span-1 lg:row-span-2" : "rounded-2xl bg-sand p-6 ring-1 ring-sand-dim"}>
                <span className={b.big ? "flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f1e4]/15 [&>svg]:h-8 [&>svg]:w-8" : "flex h-11 w-11 items-center justify-center rounded-xl bg-aqua/35 text-aqua-deep"}><Icon name={b.icon} /></span>
                <div className={b.big ? "" : "mt-4"}>
                  <h3 className={b.big ? "font-display text-xl leading-tight" : "text-base font-bold text-ink"}>{b.t}</h3>
                  <p className={`mt-1.5 text-sm ${b.big ? "text-[#f7f1e4]/90" : "text-ink/75"}`}>{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Étapes : une vraie séquence */}
      <section className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{page.stepsTitle}</h2>
        <ol className={`mt-10 grid gap-8 md:gap-6 ${stepCols}`}>
          {page.steps.map((s, i) => (
            <li key={s.t}>
              <span className="font-display text-4xl leading-none text-terracotta-deep" aria-hidden="true">{i + 1}</span>
              <h3 className="mt-2 text-base font-bold text-ink">{s.t}</h3>
              <p className="mt-1 max-w-[16rem] text-sm text-ink/75">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-14 md:pb-20">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">Questions fréquentes</h2>
        <div className="mt-6 divide-y divide-sand-dim border-y border-sand-dim">
          {page.faq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-2xl leading-none text-terracotta-deep transition-transform duration-200 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2 max-w-xl text-sm text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-aqua-deep px-6 py-14 text-center text-[#f7f1e4] md:py-20">
        <p className="mx-auto max-w-xl font-display text-2xl leading-snug sm:text-3xl">Prêt en 5 minutes pour votre premier logement.</p>
        <Link href="/panel/registro" className={`${CTA} mt-8`}>Créer mon compte gratuit →</Link>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {page.links.map((l) => <li key={l.href}><Link href={l.href} className="font-bold underline underline-offset-4 hover:text-aqua">{l.label}</Link></li>)}
        </ul>
      </section>
    </main>
  );
}
