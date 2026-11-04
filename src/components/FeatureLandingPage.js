import Link from "next/link";
import Hero from "@/components/Hero";
import { getFeaturePage } from "@/data/featurePages";

export default function FeatureLandingPage({ slug }) {
  const page = getFeaturePage(slug);
  if (!page) return null;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Accueil", item: "https://tourist-book.com" }, { "@type": "ListItem", position: 2, name: page.seoTitle, item: `https://tourist-book.com${page.path}` }] },
  ];
  return (
    <main className="flex-1">
      {jsonLd.map((j, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />)}
      <Hero eyebrow={page.eyebrow} title={page.h1} />
      <section className="mx-auto max-w-3xl px-6 py-14">
        <p className="max-w-2xl text-lg text-ink/80">{page.intro}</p>
        {page.sections.map((s) => (
          <div key={s.h2} className="mt-12">
            <h2 className="font-display italic text-2xl text-ink">{s.h2}</h2>
            {s.text && <p className="mt-3 text-ink/80">{s.text}</p>}
            {s.steps && (
              <ol className="mt-4 grid gap-3">
                {s.steps.map((st, i) => (
                  <li key={st.t} className="flex gap-4 rounded-lg border border-sand-dim bg-sand-card p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-terracotta font-bold text-ink">{i + 1}</span>
                    <div><p className="font-bold text-ink">{st.t}</p><p className="mt-0.5 text-sm text-ink/75">{st.d}</p></div>
                  </li>
                ))}
              </ol>
            )}
            {s.list && (
              <ul className="mt-4 grid gap-2.5 text-ink/80">
                {s.list.map((t) => <li key={t} className="flex gap-3 text-sm"><span aria-hidden="true" className="mt-0.5 text-aqua-deep">✓</span><span>{t}</span></li>)}
              </ul>
            )}
          </div>
        ))}

        <h2 className="mt-14 font-display italic text-2xl text-ink">Questions fréquentes</h2>
        <div className="mt-4 grid gap-3">
          {page.faq.map((f) => (
            <details key={f.q} className="rounded-lg border border-sand-dim bg-sand-card px-5 py-4">
              <summary className="cursor-pointer font-bold text-ink">{f.q}</summary>
              <p className="mt-2 text-sm text-ink/75">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-sand-dim bg-sand-card p-7 text-center">
          <p className="font-display italic text-xl text-ink">Prêt en 5 minutes pour votre premier logement.</p>
          <Link href="/panel/registro" className="mt-4 inline-block rounded bg-terracotta px-6 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep">Créer mon compte gratuit →</Link>
        </div>

        <h2 className="mt-14 font-display italic text-2xl text-ink">À lire aussi</h2>
        <ul className="mt-4 grid gap-2">
          {page.links.map((l) => <li key={l.href}><Link href={l.href} className="font-bold text-aqua-deep underline underline-offset-4">{l.label}</Link></li>)}
        </ul>
      </section>
    </main>
  );
}
