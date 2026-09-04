import Hero from "@/components/Hero";
import { getLocale } from "@/lib/i18n/locale";

const content = {
  fr: {
    metaTitle: "Conditions d'utilisation et d'abonnement — Tourist Book",
    metaDescription: "Conditions d'utilisation et d'abonnement de Tourist Book, le livret d'accueil numérique pour hôtes Airbnb de la Côte d'Azur.",
    eyebrow: "Légal",
    title: "Conditions d'utilisation et d'abonnement",
    notice:
      "Ce texte est un modèle de départ, pas un avis juridique. Avant d'opérer avec de vrais clients, faites-le relire par un avocat spécialisé en protection des données et droit de la consommation (UE).",
    s1Title: "1. Le service",
    s1Body:
      "Tourist Book est une plateforme qui permet aux hôteliers et loueurs de créer un livret d'accueil numérique pour leurs hôtes, et en option de gérer le check-in électronique avant l'arrivée.",
    s2Title: "2. Offres et tarifs",
    s2Body:
      "Chaque logement souscrit à une offre de contenu (Essentiel ou Premium) et à un cycle de facturation (Annuel ou Saisonnier), indépendamment de vos autres logements.",
    s2Basic: "Offre Essentiel : livret numérique (wifi, informations pratiques, livre d'or, guide local, assistant).",
    s2Premium: "Offre Premium : tout ce qui précède + check-in électronique par réservation.",
    annualLabel: "Cycle Annuel",
    annualBody1: "39,99 €/an (Essentiel) ou 59,99 €/an (Premium). Inclut 30 jours d'essai gratuit",
    annualBodyBold: "une seule fois par compte",
    annualBody2:
      ", quel que soit le nombre de logements gérés ou une réabonnement après résiliation. L'abonnement se renouvelle automatiquement chaque année ; la résiliation ne peut être demandée qu'une fois l'année en cours terminée, et prend effet à la fin de cette année (aucun remboursement partiel).",
    seasonalLabel: "Cycle Saisonnier",
    seasonalBody:
      "7 €/mois (Essentiel) ou 10 €/mois (Premium). Sans période d'essai. Facturation mensuelle récurrente ; vous pouvez résilier à tout moment, la résiliation prend effet à la fin du mois déjà facturé.",
    billingBody: "Facturation gérée par Stripe dans tous les cas.",
    s3Title: "3. Responsabilité concernant les données des hôtes",
    s3Body:
      "L'hôtelier est responsable de l'exactitude des informations publiées dans son livret et du recueil du consentement de ses hôtes pour le traitement de leurs données lors du check-in électronique (offre Premium). Tourist Book agit comme sous-traitant pour ces données, conformément au RGPD.",
    s4Title: "4. Compte et usage acceptable",
    s4Body:
      "Vous êtes responsable de la confidentialité de votre mot de passe et de l'exactitude des informations de votre compte. Il est interdit d'utiliser la plateforme à des fins illicites ou pour publier du contenu portant atteinte aux droits de tiers.",
    s5Title: "5. Protection des données",
    s5Body1: "Consultez le détail dans notre",
    privacyLink: "Politique de confidentialité",
    s6Title: "6. Contact",
    s6Body: "Pour toute question sur ces conditions : allo@ilestchouette.fr.",
  },
  en: {
    metaTitle: "Terms of use and subscription — Tourist Book",
    metaDescription: "Terms of use and subscription for Tourist Book, the digital welcome book for Airbnb hosts on the French Riviera.",
    eyebrow: "Legal",
    title: "Terms of use and subscription",
    notice:
      "This text is a starting template, not legal advice. Before operating with real customers, have it reviewed by a lawyer specialized in data protection and EU consumer law.",
    s1Title: "1. The service",
    s1Body:
      "Tourist Book is a platform that lets hosts and hoteliers create a digital welcome book for their guests, and optionally manage electronic check-in before arrival.",
    s2Title: "2. Plans and pricing",
    s2Body:
      "Each property subscribes to a content plan (Essential or Premium) and a billing cycle (Annual or Seasonal), independently of your other properties.",
    s2Basic: "Essential plan: digital welcome book (wifi, practical info, guestbook, local guide, assistant).",
    s2Premium: "Premium plan: all of the above + electronic check-in per booking.",
    annualLabel: "Annual cycle",
    annualBody1: "€39.99/year (Essential) or €59.99/year (Premium). Includes a 30-day free trial",
    annualBodyBold: "once per account",
    annualBody2:
      ", regardless of the number of properties you manage or of resubscribing after a cancellation. The subscription renews automatically each year; cancellation can only be requested once the current year is over, and takes effect at the end of that year (no partial refunds).",
    seasonalLabel: "Seasonal cycle",
    seasonalBody:
      "€7/month (Essential) or €10/month (Premium). No trial period. Recurring monthly billing; you can cancel at any time, and cancellation takes effect at the end of the already-billed month.",
    billingBody: "Billing is handled by Stripe in all cases.",
    s3Title: "3. Responsibility for guest data",
    s3Body:
      "The host is responsible for the accuracy of the information published in their welcome book and for obtaining guest consent for the processing of their data during electronic check-in (Premium plan). Tourist Book acts as a data processor for that data, in accordance with the GDPR.",
    s4Title: "4. Account and acceptable use",
    s4Body:
      "You are responsible for the confidentiality of your password and the accuracy of your account information. The platform may not be used for unlawful purposes or to publish content that infringes third-party rights.",
    s5Title: "5. Data protection",
    s5Body1: "See the detail in our",
    privacyLink: "Privacy policy",
    s6Title: "6. Contact",
    s6Body: "For any question about these terms: allo@ilestchouette.fr.",
  },
  es: {
    metaTitle: "Términos de uso y suscripción — Tourist Book",
    metaDescription: "Términos de uso y suscripción de Tourist Book, el livret de bienvenida digital para anfitriones Airbnb en la Costa Azul.",
    eyebrow: "Legal",
    title: "Términos de uso y suscripción",
    notice:
      "Este texto es una plantilla de partida, no asesoría legal. Antes de operar con clientes reales, hazlo revisar por un abogado especializado en protección de datos y derecho del consumo (UE).",
    s1Title: "1. El servicio",
    s1Body:
      "Tourist Book es una plataforma que permite a hoteleros y anfitriones crear un livret de acogida digital para sus huéspedes, y opcionalmente gestionar el check-in electrónico previo a la llegada.",
    s2Title: "2. Planes y precios",
    s2Body:
      "Cada alojamiento se suscribe a un plan de contenido (Básico o Premium) y a un ciclo de facturación (Anual o Por temporada), de forma independiente del resto de tus alojamientos.",
    s2Basic: "Plan Básico: livret digital (wifi, información práctica, libro de oro, carta local, asistente).",
    s2Premium: "Plan Premium: todo lo anterior + check-in electrónico por reserva.",
    annualLabel: "Ciclo Anual",
    annualBody1: "39,99 €/año (Básico) o 59,99 €/año (Premium). Incluye 30 días de prueba gratuita",
    annualBodyBold: "una única vez por cuenta",
    annualBody2:
      ", con independencia del número de alojamientos que gestiones o de si te vuelves a suscribir tras una cancelación. La suscripción se renueva automáticamente cada año; la cancelación solo puede solicitarse una vez transcurrido el año en curso, y surte efecto al final de ese año (no se realizan reembolsos parciales).",
    seasonalLabel: "Ciclo Por temporada",
    seasonalBody:
      "7 €/mes (Básico) o 10 €/mes (Premium). Sin periodo de prueba. Facturación mensual recurrente; puedes cancelar en cualquier momento, y la cancelación surte efecto al final del mes ya facturado.",
    billingBody: "Facturación gestionada por Stripe en todos los casos.",
    s3Title: "3. Responsabilidad sobre los datos de los huéspedes",
    s3Body:
      "El hotelero es responsable de la exactitud de la información que publica en su livret y de obtener el consentimiento de sus huéspedes para el tratamiento de sus datos durante el check-in electrónico (plan Premium). Tourist Book actúa como encargado del tratamiento respecto a esos datos, conforme al RGPD.",
    s4Title: "4. Cuenta y uso aceptable",
    s4Body:
      "Eres responsable de la confidencialidad de tu contraseña y de la veracidad de la información de tu cuenta. No está permitido usar la plataforma para fines ilícitos ni para publicar contenido que infrinja derechos de terceros.",
    s5Title: "5. Protección de datos",
    s5Body1: "Consulta el detalle en nuestra",
    privacyLink: "Política de Privacidad",
    s6Title: "6. Contacto",
    s6Body: "Para cualquier duda sobre estas condiciones: allo@ilestchouette.fr.",
  },
};

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: content[locale].metaTitle, description: content[locale].metaDescription };
}

export default async function TerminosPage() {
  const locale = await getLocale();
  const t = content[locale];

  return (
    <main className="flex-1">
      <Hero eyebrow={t.eyebrow} title={t.title} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-terracotta bg-sand-card p-4 text-sm text-ink/80">{t.notice}</div>

        <div className="mt-8 grid gap-6 text-ink/80">
          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s1Title}</h2>
            <p className="mt-2">{t.s1Body}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s2Title}</h2>
            <p className="mt-2">{t.s2Body}</p>
            <ul className="mt-2 grid gap-1">
              <li>• {t.s2Basic}</li>
              <li>• {t.s2Premium}</li>
            </ul>
            <p className="mt-3 font-bold text-ink">{t.annualLabel}</p>
            <p className="mt-1">
              {t.annualBody1} <strong>{t.annualBodyBold}</strong>{t.annualBody2}
            </p>
            <p className="mt-3 font-bold text-ink">{t.seasonalLabel}</p>
            <p className="mt-1">{t.seasonalBody}</p>
            <p className="mt-3">{t.billingBody}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s3Title}</h2>
            <p className="mt-2">{t.s3Body}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s4Title}</h2>
            <p className="mt-2">{t.s4Body}</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s5Title}</h2>
            <p className="mt-2">
              {t.s5Body1}{" "}
              <a href="/privacidad" className="font-bold text-aqua-deep">
                {t.privacyLink}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">{t.s6Title}</h2>
            <p className="mt-2">{t.s6Body}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
