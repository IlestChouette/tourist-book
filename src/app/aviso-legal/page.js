import Hero from "@/components/Hero";
import { getLocale } from "@/lib/i18n/locale";

const content = {
  fr: {
    metaTitle: "Mentions légales — Tourist Book",
    eyebrow: "Légal",
    title: "Mentions légales",
    editorTitle: "Éditeur du site",
    companyLine: "— Société par actions simplifiée (société à associé unique), capital social de 5 000 €.",
    registry: "SIREN 942 069 949 · RCS Nice",
    address: "Siège social : 143 Promenade des Anglais, 06200 Nice, France",
    president: "Président : Fernando Francisco Fonseca Pinzon",
    contact: "Contact :",
    companySite: "Site de l'entreprise :",
    hostingTitle: "Hébergement",
    hostingBody: "Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.",
    processorsBody1: "Base de données, authentification et stockage des documents : Supabase. Traitement des paiements : Stripe. Plus de détails sur ces sous-traitants dans la",
    privacyLink: "Politique de confidentialité",
    ipTitle: "Propriété intellectuelle",
    ipBody:
      "Le nom, le design et le contenu de Tourist Book appartiennent à Il est chouette, à l'exception du contenu propre à chaque hôtelier (photos, textes et recommandations de son logement). Toute reproduction sans autorisation est interdite.",
    moreTitle: "En savoir plus",
    moreBody1: "Consultez aussi les",
    termsLink: "Conditions d'utilisation et d'abonnement",
    moreBody2: "et la",
  },
  en: {
    metaTitle: "Legal notice — Tourist Book",
    eyebrow: "Legal",
    title: "Legal notice",
    editorTitle: "Site publisher",
    companyLine: "— Simplified joint-stock company (single-shareholder company), share capital of €5,000.",
    registry: "SIREN 942 069 949 · RCS Nice",
    address: "Registered office: 143 Promenade des Anglais, 06200 Nice, France",
    president: "President: Fernando Francisco Fonseca Pinzon",
    contact: "Contact:",
    companySite: "Company website:",
    hostingTitle: "Hosting",
    hostingBody: "Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, United States.",
    processorsBody1: "Database, authentication and document storage: Supabase. Payment processing: Stripe. More detail on these processors in the",
    privacyLink: "Privacy policy",
    ipTitle: "Intellectual property",
    ipBody:
      "The name, design and content of Tourist Book belong to Il est chouette, except for each host's own content (photos, text and recommendations for their property). Reproduction without authorization is prohibited.",
    moreTitle: "More information",
    moreBody1: "Also see the",
    termsLink: "Terms of use and subscription",
    moreBody2: "and the",
  },
  es: {
    metaTitle: "Aviso legal — Tourist Book",
    eyebrow: "Legal",
    title: "Aviso legal",
    editorTitle: "Editor del sitio",
    companyLine: "— Société par actions simplifiée (société à associé unique), capital social de 5.000 €.",
    registry: "SIREN 942 069 949 · RCS Nice",
    address: "Domicilio social: 143 Promenade des Anglais, 06200 Niza, Francia",
    president: "Presidente: Fernando Francisco Fonseca Pinzon",
    contact: "Contacto:",
    companySite: "Sitio de la empresa:",
    hostingTitle: "Alojamiento (hébergement)",
    hostingBody: "Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, Estados Unidos.",
    processorsBody1: "Base de datos, autenticación y almacenamiento de documentos: Supabase. Procesamiento de pagos: Stripe. Más detalle sobre estos encargados del tratamiento en la",
    privacyLink: "Política de privacidad",
    ipTitle: "Propiedad intelectual",
    ipBody:
      "El nombre, el diseño y el contenido de Tourist Book pertenecen a Il est chouette, salvo el contenido propio de cada hotelero (fotos, textos y recomendaciones de su alojamiento). Su reproducción sin autorización está prohibida.",
    moreTitle: "Más información",
    moreBody1: "Consulta también los",
    termsLink: "Términos de uso y suscripción",
    moreBody2: "y la",
  },
};

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: content[locale].metaTitle };
}

export default async function AvisoLegalPage() {
  const locale = await getLocale();
  const t = content[locale];

  return (
    <main className="flex-1">
      <Hero eyebrow={t.eyebrow} title={t.title} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-6 text-ink/80">
          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.editorTitle}</h2>
            <div className="mt-3 rounded border border-sand-dim bg-sand-card p-5">
              <p className="text-ink">
                <span className="font-bold">Il est chouette</span> {t.companyLine}
              </p>
              <p className="mt-2">{t.registry}</p>
              <p className="mt-1">{t.address}</p>
              <p className="mt-1">{t.president}</p>
              <p className="mt-3">
                {t.contact}{" "}
                <a href="mailto:allo@ilestchouette.fr" className="font-bold text-aqua-deep">allo@ilestchouette.fr</a>
                {" "}· 06 95 42 73 12
              </p>
              <p className="mt-1">
                {t.companySite}{" "}
                <a
                  href="https://ilestchouette.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-aqua-deep"
                >
                  ilestchouette.fr
                </a>
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.hostingTitle}</h2>
            <p className="mt-2">{t.hostingBody}</p>
            <p className="mt-2">
              {t.processorsBody1}{" "}
              <a href="/privacidad" className="font-bold text-aqua-deep">{t.privacyLink}</a>.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.ipTitle}</h2>
            <p className="mt-2">{t.ipBody}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.moreTitle}</h2>
            <p className="mt-2">
              {t.moreBody1}{" "}
              <a href="/terminos" className="font-bold text-aqua-deep">{t.termsLink}</a>{" "}
              {t.moreBody2}{" "}
              <a href="/privacidad" className="font-bold text-aqua-deep">{t.privacyLink}</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
