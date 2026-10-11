import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/Hero";
import { getLocale } from "@/lib/i18n/locale";

export const metadata = { robots: { index: false, follow: false } };

const content = {
  fr: {
    eyebrow: "Panel hôtelier",
    welcome: "Bienvenue",
    hello: (name) => `Bonjour, ${name}`,
    email: "Email :",
    properties: "Vos logements →",
    profile: "Profil et logo →",
    onbEyebrow: "Bienvenue sur Tourist Book",
    onbSubtitle: "Votre compte est prêt. Il ne reste qu'une étape : créer votre premier livret.",
    onbTitle: "Créez votre premier livret — prêt en 5 minutes",
    onbText:
      "Nom du logement, adresse, wifi, horaires : le reste peut attendre. Vos voyageurs reçoivent un seul lien avec tout ce dont ils ont besoin.",
    onbCta: "Créer mon premier livret →",
    onbOffer: "Dès 7 €/mois sans engagement · Ou annuel dès 39,99 €/an avec 1 mois offert",
    onbStepsTitle: "Comment ça marche",
    onbSteps: [
      { t: "Ajoutez votre logement", d: "Nom, adresse, wifi, horaires — 5 minutes. Vous complétez le reste quand vous voulez." },
      {
        t: "Choisissez votre offre",
        d: "Essentiel ou Premium, annuel ou saisonnier. L'offre annuelle démarre par un mois offert ; une carte bancaire est demandée, sans débit avant la fin de l'essai.",
      },
      { t: "Partagez le lien", d: "Par WhatsApp, email ou Airbnb : vos voyageurs ouvrent tout depuis leur téléphone." },
    ],
    onbDemo: "Voir un exemple de livret →",
  },
  en: {
    eyebrow: "Host panel",
    welcome: "Welcome",
    hello: (name) => `Hi, ${name}`,
    email: "Email:",
    properties: "Your properties →",
    profile: "Profile and logo →",
    onbEyebrow: "Welcome to Tourist Book",
    onbSubtitle: "Your account is ready. One step left: create your first livret.",
    onbTitle: "Create your first livret — ready in 5 minutes",
    onbText:
      "Property name, address, wifi, times: the rest can wait. Your guests get a single link with everything they need.",
    onbCta: "Create my first livret →",
    onbOffer: "From €7/month, no commitment · Or annual from €39.99/year with 1 month free",
    onbStepsTitle: "How it works",
    onbSteps: [
      { t: "Add your property", d: "Name, address, wifi, times — 5 minutes. Complete the rest whenever you like." },
      {
        t: "Choose your plan",
        d: "Essential or Premium, annual or seasonal. The annual plan starts with a free month; a bank card is requested, with no charge before the trial ends.",
      },
      { t: "Share the link", d: "By WhatsApp, email or Airbnb: your guests open everything from their phone." },
    ],
    onbDemo: "See an example livret →",
  },
  es: {
    eyebrow: "Panel hotelero",
    welcome: "Bienvenido",
    hello: (name) => `Hola, ${name}`,
    email: "Email:",
    properties: "Tus alojamientos →",
    profile: "Perfil y logo →",
    onbEyebrow: "Bienvenido a Tourist Book",
    onbSubtitle: "Tu cuenta está lista. Solo falta un paso: crear tu primer livret.",
    onbTitle: "Crea tu primer livret — listo en 5 minutos",
    onbText:
      "Nombre del alojamiento, dirección, wifi, horarios: lo demás puede esperar. Tus huéspedes reciben un solo enlace con todo lo que necesitan.",
    onbCta: "Crear mi primer livret →",
    onbOffer: "Desde 7 €/mes sin permanencia · O anual desde 39,99 €/año con 1 mes gratis",
    onbStepsTitle: "Cómo funciona",
    onbSteps: [
      { t: "Añade tu alojamiento", d: "Nombre, dirección, wifi, horarios — 5 minutos. Completas el resto cuando quieras." },
      {
        t: "Elige tu plan",
        d: "Essentiel o Premium, anual o por temporada. El plan anual empieza con un mes gratis; se pide una tarjeta bancaria, sin cargo antes de que termine la prueba.",
      },
      { t: "Comparte el enlace", d: "Por WhatsApp, email o Airbnb: tus huéspedes abren todo desde el teléfono." },
    ],
    onbDemo: "Ver un ejemplo de livret →",
  },
};

export default async function PanelPage() {
  const locale = await getLocale();
  const t = content[locale];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: host } = await supabase.from("hosts").select("*").eq("id", user.id).single();
  const { count } = await supabase
    .from("properties")
    .select("id", { count: "exact", head: true })
    .eq("host_id", user.id);
  const isNewHost = (count ?? 0) === 0;
  const title = host?.name ? t.hello(host.name) : t.welcome;

  if (isNewHost) {
    return (
      <main className="flex-1">
        <Hero eyebrow={t.onbEyebrow} title={title} subtitle={t.onbSubtitle} />
        <section className="mx-auto max-w-2xl px-6 py-10">
          <div className="rounded-xl border border-sand-dim bg-sand-card p-6 text-center sm:p-8">
            <h2 className="font-display italic text-2xl text-ink sm:text-3xl">{t.onbTitle}</h2>
            <p className="mx-auto mt-3 max-w-md text-ink/70">{t.onbText}</p>
            <Link
              href="/panel/alojamientos/nuevo"
              className="mt-6 inline-block rounded bg-terracotta px-7 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              {t.onbCta}
            </Link>
            <p className="mt-4 text-sm font-bold text-ink/60">{t.onbOffer}</p>
          </div>

          <h3 className="mt-12 text-center font-display italic text-2xl text-ink">{t.onbStepsTitle}</h3>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            {t.onbSteps.map((step, i) => (
              <div key={step.t}>
                <span className="font-display italic text-3xl text-terracotta-deep">{i + 1}</span>
                <h4 className="mt-2 font-bold text-ink">{step.t}</h4>
                <p className="mt-1 text-sm text-ink/70">{step.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="/logement/exemple/entrer?code=0000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded border border-aqua-deep px-5 py-2.5 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card"
            >
              {t.onbDemo}
            </a>
          </div>
          <p className="mt-8 text-center text-sm">
            <Link href="/panel/perfil" className="font-bold text-aqua-deep">
              {t.profile}
            </Link>
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero eyebrow={t.eyebrow} title={title} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-sand-dim bg-sand-card p-5">
          <p className="text-ink">{t.email} {host?.email ?? user.email}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/panel/alojamientos"
            className="rounded border border-sand-dim bg-sand-card p-4 font-bold text-ink transition-colors hover:border-aqua-deep"
          >
            {t.properties}
          </Link>
          <Link
            href="/panel/perfil"
            className="rounded border border-sand-dim bg-sand-card p-4 font-bold text-ink transition-colors hover:border-aqua-deep"
          >
            {t.profile}
          </Link>
        </div>
      </section>
    </main>
  );
}
