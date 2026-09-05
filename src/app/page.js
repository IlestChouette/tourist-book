import Link from "next/link";
import Image from "next/image";
import ContactButton from "@/components/ContactButton";
import PricingCards from "@/components/PricingCards";
import { getLocale } from "@/lib/i18n/locale";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function WifiIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M3 8.5a14 14 0 0 1 18 0" />
      <path d="M6.5 12a9 9 0 0 1 11 0" />
      <path d="M9.5 15.5a4.5 4.5 0 0 1 5 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 9l-2 6-6 2 2-6 6-2z" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 16V11l2-4h12l2 4v5" />
      <path d="M4 16h16" />
      <circle cx="7.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H10l-4.5 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M12 3.5l7 2.6v5.4c0 4.5-2.9 7.5-7 9-4.1-1.5-7-4.5-7-9V6.1l7-2.6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5v-13z" />
    </svg>
  );
}

const featureIcons = [<WifiIcon key="wifi" />, <CompassIcon key="compass" />, <CarIcon key="car" />, <BookIcon key="book" />, <ChatIcon key="chat" />, <LogoIcon key="logo" />];

function Check({ on }) {
  if (!on) return <span className="text-ink/25">—</span>;
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" className="text-sage">
      <path
        d="M4 10.5l3.5 3.5L16 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const content = {
  fr: {
    metaTitle: "Tourist Book — Livret d'accueil numérique et check-in",
    metaDescription:
      "Livret d'accueil numérique et check-in électronique pour hôtes Airbnb de la Côte d'Azur — wifi, horaires et recommandations en un lien, dès 7€/mois.",
    login: "Se connecter",
    createAccount: "Créer un compte →",
    eyebrow: "Pour les hôteliers et loueurs de la Côte d'Azur",
    title: "Le livret d'accueil de vos hôtes, sans imprimer une seule page",
    subtitle:
      "Wifi, horaires, recommandations locales et check-in électronique — le tout dans un lien envoyé avant leur arrivée. De Beausoleil à Nice.",
    ctaPrimary: "Créer mon compte gratuit →",
    ctaSecondary: "Voir les offres",
    priceNote: "Dès 7 €/mois sans engagement · Ou annuel dès 39,99 €/an avec 1 mois offert",
    beforeLabel: "Avant",
    beforeText:
      "Un PDF perdu dans les emails, un groupe WhatsApp que personne ne relit, un formulaire compliqué, et la même question sur le wifi à 23h.",
    afterLabel: "Avec Tourist Book",
    afterText:
      "Un seul lien, mis à jour à l'instant, en trois langues, à vos couleurs — et le check-in fait avant même l'arrivée de vos hôtes.",
    featuresTitle: "Tout ce dont votre hôte a besoin",
    features: [
      { title: "Wifi et horaires en un instant", desc: "Mot de passe, arrivée, départ et stationnement, comment accéder au logement — sans répéter le même message à chaque hôte." },
      { title: "Guide local avec recherche", desc: "Vos recommandations de restaurants, plages et musées, classées par catégorie." },
      { title: "Réservation de transfert", desc: "L'hôte demande son transfert directement depuis le livret, sans appel ni tarif fixe." },
      { title: "Livre d'or", desc: "Un livre de souvenirs numérique où vos hôtes laissent leur message." },
      { title: "Assistant virtuel", desc: "Répond aux questions fréquentes de l'hôte à toute heure." },
      { title: "Avec votre propre logo", desc: "Votre marque sur chaque page vue par l'hôte, dès le premier clic." },
    ],
    howItWorksTitle: "Comment ça marche",
    steps: [
      { n: "1", t: "Créez votre compte et ajoutez votre logement", d: "Nom, photos, wifi, horaires — 5 minutes." },
      { n: "2", t: "Choisissez l'offre de ce logement", d: "Essentiel ou Premium, annuel ou saisonnier, selon chaque logement." },
      { n: "3", t: "Partagez le lien avec vos hôtes", d: "Par WhatsApp, email ou Airbnb — comme vous préférez." },
    ],
    pricingTitle: "Une offre par logement",
    pricingSubtitle:
      "Pas par compte — si vous gérez plusieurs logements, chacun choisit son offre. Sans vous inscrire, vous pouvez voir ici même ce qu'inclut chaque offre.",
    comparisonHeader: { includes: "Inclus", basic: "Essentiel", premium: "Premium" },
    comparison: [
      { label: "Livret numérique en FR / EN / ES", basico: true, premium: true },
      { label: "Wifi, horaires, stationnement, contact", basico: true, premium: true },
      { label: "Guide local avec recherche", basico: true, premium: true },
      { label: "Réservation de transfert et livre d'or", basico: true, premium: true },
      { label: "Assistant virtuel", basico: true, premium: true },
      { label: "Votre logo sur chaque page", basico: true, premium: true },
      { label: "Lien unique de check-in par réservation", basico: false, premium: true },
      { label: "Pièce d'identité + selfie", basico: false, premium: true },
      { label: "Vérification manuelle depuis votre panel", basico: false, premium: true },
      { label: "Identifiants automatiques pour l'hôte", basico: false, premium: true },
    ],
    pricingNote:
      "Offre annuelle : 1 mois d'essai gratuit lors de votre première souscription (par compte, pas par logement) ; l'abonnement se renouvelle chaque année et ne peut être résilié qu'une fois l'année en cours terminée. Offre saisonnière : sans essai gratuit, facturation mensuelle, résiliable à tout moment.",
    positioningTitle: "Pensé pour la Côte d'Azur, pas pour une chaîne hôtelière",
    positioningBody:
      "Beausoleil, Roquebrune-Cap-Martin, Saint-Paul-de-Vence, Nice et d'autres villes des Alpes-Maritimes et de la Côte d'Azur — Tourist Book est fait pour l'hôte qui gère un ou plusieurs logements lui-même, pas pour une agence de cent biens.",
    faqTitle: "Questions fréquentes",
    faq: [
      {
        q: "Mes voyageurs doivent envoyer une pièce d'identité — est-ce sécurisé ?",
        a: "Oui. Les documents et selfies sont stockés dans un espace privé, jamais accessible publiquement, et ne sont visibles que par vous depuis votre panel, via un lien à durée limitée. Aucune donnée n'est partagée avec des tiers.",
      },
      {
        q: "Je peux résilier quand je veux ?",
        a: "Sur l'offre saisonnière, oui, à tout moment. Sur l'offre annuelle, l'abonnement court jusqu'à la fin de l'année en cours — comme la plupart des engagements annuels — sans reconduction si vous ne renouvelez pas.",
      },
      {
        q: "Combien de temps pour tout configurer ?",
        a: "Environ 5 minutes pour un premier logement : nom, photos, wifi, horaires. Le lien du livret est utilisable immédiatement après.",
      },
      {
        q: "Je gère plusieurs logements, dois-je payer plusieurs abonnements ?",
        a: "L'offre se choisit par logement, pas par compte — un seul compte peut gérer autant de logements que vous voulez, chacun avec son propre plan.",
      },
      {
        q: "Et si mes voyageurs ne parlent pas français ?",
        a: "Le livret est disponible en français, anglais et espagnol — le voyageur choisit sa langue en un clic.",
      },
    ],
    finalCtaTitle: "Prêt à arrêter d'imprimer des livrets d'accueil ?",
  },
  en: {
    metaTitle: "Tourist Book — Digital welcome book and check-in",
    metaDescription:
      "Digital welcome book and electronic check-in for Airbnb hosts on the French Riviera — wifi, schedule and local tips in one link, from €7/month.",
    login: "Log in",
    createAccount: "Create an account →",
    eyebrow: "For hosts and hoteliers on the French Riviera",
    title: "Your guests' welcome book, without printing a single page",
    subtitle:
      "Wifi, schedules, local recommendations and electronic check-in — all in one link you send before they arrive. From Beausoleil to Nice.",
    ctaPrimary: "Create my free account →",
    ctaSecondary: "See the plans",
    priceNote: "From €7/month, no commitment · Or annual from €39.99/year with 1 month free",
    beforeLabel: "Before",
    beforeText:
      "A PDF lost in email, a WhatsApp group nobody reads, an awkward form, and the same wifi question at 11pm.",
    afterLabel: "With Tourist Book",
    afterText:
      "One single link, updated instantly, in three languages, with your branding — and check-in done before your guests even arrive.",
    featuresTitle: "Everything your guest needs",
    features: [
      { title: "Wifi and schedules, instantly", desc: "Password, check-in, check-out and parking, how to reach the property — without repeating the same message to every guest." },
      { title: "Local guide with search", desc: "Your restaurant, beach and museum recommendations, organized by category." },
      { title: "Transfer booking", desc: "Guests request their transfer straight from the welcome book, no calls or fixed rates." },
      { title: "Guestbook", desc: "A digital keepsake book where your guests leave their message." },
      { title: "Virtual assistant", desc: "Answers your guest's frequent questions at any hour." },
      { title: "With your own branding", desc: "Your logo on every page your guest sees, from the very first click." },
    ],
    howItWorksTitle: "How it works",
    steps: [
      { n: "1", t: "Create your account and add your property", d: "Name, photos, wifi, schedules — 5 minutes." },
      { n: "2", t: "Choose that property's plan", d: "Essential or Premium, annual or seasonal, for each property." },
      { n: "3", t: "Share the link with your guests", d: "By WhatsApp, email or Airbnb — whatever you prefer." },
    ],
    pricingTitle: "One plan per property",
    pricingSubtitle:
      "Not per account — if you manage several properties, each one picks its own plan. Without signing up, you can see right here what each plan includes.",
    comparisonHeader: { includes: "Includes", basic: "Essential", premium: "Premium" },
    comparison: [
      { label: "Digital welcome book in FR / EN / ES", basico: true, premium: true },
      { label: "Wifi, schedules, parking, contact", basico: true, premium: true },
      { label: "Local guide with search", basico: true, premium: true },
      { label: "Transfer booking and guestbook", basico: true, premium: true },
      { label: "Virtual assistant", basico: true, premium: true },
      { label: "Your logo on every page", basico: true, premium: true },
      { label: "Unique check-in link per booking", basico: false, premium: true },
      { label: "ID document + selfie", basico: false, premium: true },
      { label: "Manual verification from your panel", basico: false, premium: true },
      { label: "Automatic guest login", basico: false, premium: true },
    ],
    pricingNote:
      "Annual plan: 1 month free trial the first time you subscribe (per account, not per property); the subscription renews every year and can only be cancelled once the current year is over. Seasonal plan: no free trial, monthly billing, cancel anytime.",
    positioningTitle: "Built for the French Riviera, not a hotel chain",
    positioningBody:
      "Beausoleil, Roquebrune-Cap-Martin, Saint-Paul-de-Vence, Nice and other towns in the Alpes-Maritimes and the French Riviera — Tourist Book is made for the host who manages one or a few properties themselves, not an agency running a hundred listings.",
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "My guests have to send an ID document — is that secure?",
        a: "Yes. Documents and selfies are stored in a private space, never publicly accessible, and only visible to you from your panel via a time-limited link. No data is shared with third parties.",
      },
      {
        q: "Can I cancel whenever I want?",
        a: "On the seasonal plan, yes, anytime. On the annual plan, the subscription runs until the end of the current year — like most annual commitments — with no renewal if you don't sign up again.",
      },
      {
        q: "How long does setup take?",
        a: "About 5 minutes for a first property: name, photos, wifi, schedule. The livret link is usable right away.",
      },
      {
        q: "I manage several properties — do I need several subscriptions?",
        a: "The plan is chosen per property, not per account — one account can manage as many properties as you want, each with its own plan.",
      },
      {
        q: "What if my guests don't speak French?",
        a: "The livret is available in French, English and Spanish — the guest picks their language in one click.",
      },
    ],
    finalCtaTitle: "Ready to stop printing welcome books?",
  },
  es: {
    metaTitle: "Tourist Book — Livret de acogida digital y check-in",
    metaDescription:
      "Livret de bienvenida digital y check-in electrónico para anfitriones Airbnb en la Costa Azul — wifi, horarios y recomendaciones en un enlace, desde 7€/mes.",
    login: "Iniciar sesión",
    createAccount: "Crear cuenta →",
    eyebrow: "Para hoteleros y anfitriones de la Côte d'Azur",
    title: "El libro de bienvenida de tus huéspedes, sin imprimir una sola página",
    subtitle:
      "Wifi, horarios, recomendaciones locales y check-in electrónico — todo en un enlace que envías antes de que lleguen. Desde Beausoleil hasta Niza.",
    ctaPrimary: "Crear mi cuenta gratis →",
    ctaSecondary: "Ver los planes",
    priceNote: "Desde 7 €/mes sin permanencia · O anual desde 39,99 €/año con 1 mes gratis",
    beforeLabel: "Antes",
    beforeText:
      "Un PDF perdido en el email, un grupo de WhatsApp que nadie relee, un formulario difícil de utilizar, y la misma pregunta del wifi a las 23h.",
    afterLabel: "Con Tourist Book",
    afterText:
      "Un único enlace, actualizado al instante, en tres idiomas, con tu logo — y el check-in hecho antes de que lleguen tus huéspedes.",
    featuresTitle: "Todo lo que necesita tu huésped",
    features: [
      { title: "Wifi y horarios al instante", desc: "Contraseña, llegada, salida y aparcamiento, indicaciones de cómo acceder a la propiedad — sin repetir el mismo mensaje a cada huésped." },
      { title: "Guía local con buscador", desc: "Tus recomendaciones de restaurantes, playas y museos, organizadas por categoría." },
      { title: "Reserva de transfer", desc: "El huésped pide su traslado directamente desde el livret, sin llamadas con tarifas fijas." },
      { title: "Libro de oro", desc: "Un libro de recuerdos digital donde tus huéspedes dejan su mensaje." },
      { title: "Asistente virtual", desc: "Responde las preguntas frecuentes del huésped a cualquier hora." },
      { title: "Con tu propio logo", desc: "Tu marca en cada página que ve el huésped, desde el primer clic." },
    ],
    howItWorksTitle: "Cómo funciona",
    steps: [
      { n: "1", t: "Crea tu cuenta y añade tu alojamiento", d: "Nombre, fotos, wifi, horarios — 5 minutos." },
      { n: "2", t: "Elige el plan de esa propiedad", d: "Básico o Premium, anual o por temporada, según cada alojamiento." },
      { n: "3", t: "Comparte el enlace con tus huéspedes", d: "Por WhatsApp, email o Airbnb — como prefieras." },
    ],
    pricingTitle: "Un plan por cada alojamiento",
    pricingSubtitle:
      "No por cuenta — si gestionas varias propiedades, cada una elige su plan. Sin registrarte puedes ver aquí mismo lo que incluye cada uno.",
    comparisonHeader: { includes: "Incluye", basic: "Básico", premium: "Premium" },
    comparison: [
      { label: "Livret digital en FR / EN / ES", basico: true, premium: true },
      { label: "Wifi, horarios, aparcamiento, contacto", basico: true, premium: true },
      { label: "Guía local con buscador", basico: true, premium: true },
      { label: "Reserva de transfer y libro de oro", basico: true, premium: true },
      { label: "Asistente virtual", basico: true, premium: true },
      { label: "Tu logo en cada página", basico: true, premium: true },
      { label: "Enlace único de check-in por reserva", basico: false, premium: true },
      { label: "Documento de identidad + selfie", basico: false, premium: true },
      { label: "Verificación manual desde tu panel", basico: false, premium: true },
      { label: "Usuario y contraseña automáticos para el huésped", basico: false, premium: true },
    ],
    pricingNote:
      "Plan anual: 1 mes de prueba gratuita la primera vez que te suscribes (por cuenta, no por alojamiento); la suscripción se renueva cada año y solo puede cancelarse una vez transcurrido el año en curso. Plan por temporada: sin prueba gratuita, facturación mensual, cancela cuando quieras.",
    positioningTitle: "Pensado para la Côte d'Azur, no para una cadena hotelera",
    positioningBody:
      "Beausoleil, Roquebrune-Cap-Martin, Saint-Paul-de-Vence, Niza y otras ciudades de los Alpes-Marítimos y la Côte d'Azur — Tourist Book está hecho para el anfitrión que gestiona uno o varios alojamientos él mismo, no para una gestora de cien propiedades.",
    faqTitle: "Preguntas frecuentes",
    faq: [
      {
        q: "Mis huéspedes tienen que enviar un documento de identidad — ¿es seguro?",
        a: "Sí. Los documentos y selfies se guardan en un espacio privado, nunca accesible públicamente, y solo tú puedes verlos desde tu panel, mediante un enlace de duración limitada. Ningún dato se comparte con terceros.",
      },
      {
        q: "¿Puedo cancelar cuando quiera?",
        a: "En el plan por temporada, sí, en cualquier momento. En el plan anual, la suscripción corre hasta el fin del año en curso — como la mayoría de los compromisos anuales — sin renovarse si no vuelves a suscribirte.",
      },
      {
        q: "¿Cuánto tiempo toma configurarlo?",
        a: "Unos 5 minutos para el primer alojamiento: nombre, fotos, wifi, horarios. El enlace del livret se puede usar de inmediato.",
      },
      {
        q: "Gestiono varios alojamientos, ¿debo pagar varias suscripciones?",
        a: "El plan se elige por alojamiento, no por cuenta — una sola cuenta puede gestionar tantos alojamientos como quieras, cada uno con su propio plan.",
      },
      {
        q: "¿Y si mis huéspedes no hablan español?",
        a: "El livret está disponible en francés, inglés y español — el huésped elige su idioma con un clic.",
      },
    ],
    finalCtaTitle: "¿Listo para dejar de imprimir libros de bienvenida?",
  },
};

export async function generateMetadata() {
  const locale = await getLocale();
  const t = content[locale];
  return { title: t.metaTitle, description: t.metaDescription };
}

export default async function Home() {
  const locale = await getLocale();
  const t = content[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Tourist Book",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: t.metaDescription,
    url: "https://tourist-book.com",
    offers: [
      { "@type": "Offer", price: "39.99", priceCurrency: "EUR", name: "Essentiel — annuel" },
      { "@type": "Offer", price: "59.99", priceCurrency: "EUR", name: "Premium — annuel" },
      { "@type": "Offer", price: "7", priceCurrency: "EUR", name: "Essentiel — saisonnier" },
      { "@type": "Offer", price: "10", priceCurrency: "EUR", name: "Premium — saisonnier" },
    ],
    provider: {
      "@type": "Organization",
      name: "Il est chouette",
      url: "https://tourist-book.com/aviso-legal",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <header className="bg-[#2f7d76]">
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/tourist book long.png"
              alt="Tourist Book"
              width={278}
              height={106}
              className="h-20 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-24"
              priority
            />
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/panel/login" className="text-sm font-bold text-[#f7f1e4]/80 hover:text-[#f7f1e4]">
              {t.login}
            </Link>
            <Link
              href="/panel/registro"
              className="rounded bg-terracotta px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              {t.createAccount}
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-aqua-deep">
        <div className="mx-auto max-w-3xl px-6 pb-20 pt-6 text-center sm:pb-28 sm:pt-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f7f1e4]/80">{t.eyebrow}</span>
          <h1 className="mt-5 font-display italic text-4xl leading-tight text-[#f7f1e4] sm:text-5xl">{t.title}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#f7f1e4]/90">{t.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/panel/registro"
              className="rounded bg-terracotta px-6 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              {t.ctaPrimary}
            </Link>
            <a
              href="#planes"
              className="rounded border border-[#f7f1e4]/40 px-6 py-3.5 font-bold text-[#f7f1e4] transition-colors hover:border-[#f7f1e4]"
            >
              {t.ctaSecondary}
            </a>
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#f7f1e4]/70">{t.priceNote}</p>
        </div>
        <div className="stripe-band" />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-deep">{t.beforeLabel}</span>
            <p className="mt-3 font-display italic text-2xl text-ink">{t.beforeText}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-aqua-deep">{t.afterLabel}</span>
            <p className="mt-3 font-display italic text-2xl text-ink">{t.afterText}</p>
          </div>
        </div>
      </section>

      <section className="bg-sand-card py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-display italic text-3xl text-ink">{t.featuresTitle}</h2>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((f, i) => (
              <div key={f.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-ink">
                  {featureIcons[i]}
                </span>
                <div>
                  <h3 className="font-bold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm text-ink/70">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center font-display italic text-3xl text-ink">{t.howItWorksTitle}</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {t.steps.map((s) => (
            <div key={s.n}>
              <span className="font-display italic text-3xl text-terracotta-deep">{s.n}</span>
              <h3 className="mt-2 font-bold text-ink">{s.t}</h3>
              <p className="mt-1 text-sm text-ink/70">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="planes" className="bg-sand-card py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="font-display italic text-3xl text-ink">{t.pricingTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/70">{t.pricingSubtitle}</p>
          </div>

          <div className="mt-12">
            <PricingCards locale={locale} />
          </div>

          <div className="mt-10 overflow-x-auto rounded-xl border border-sand-dim">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-sand-dim bg-sand">
                  <th className="px-5 py-3 text-left font-bold text-ink/70">{t.comparisonHeader.includes}</th>
                  <th className="px-5 py-3 text-center font-bold text-aqua-deep">{t.comparisonHeader.basic}</th>
                  <th className="px-5 py-3 text-center font-bold text-terracotta-deep">{t.comparisonHeader.premium}</th>
                </tr>
              </thead>
              <tbody>
                {t.comparison.map((row) => (
                  <tr key={row.label} className="border-b border-sand-dim last:border-0">
                    <td className="px-5 py-3 text-ink/80">{row.label}</td>
                    <td className="px-5 py-3 text-center">
                      <Check on={row.basico} />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Check on={row.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-center text-xs text-ink/50">{t.pricingNote}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-aqua-deep text-[#f7f1e4]">
          <ShieldIcon />
        </span>
        <h2 className="mt-5 font-display italic text-2xl text-ink">{t.positioningTitle}</h2>
        <p className="mx-auto mt-3 max-w-lg text-ink/70">{t.positioningBody}</p>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-16">
        <h2 className="text-center font-display italic text-3xl text-ink">{t.faqTitle}</h2>
        <div className="mt-8 grid gap-3">
          {t.faq.map((item) => (
            <details
              key={item.q}
              className="group rounded border border-sand-dim bg-sand-card p-4 open:pb-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-ink">
                {item.q}
                <span className="shrink-0 text-xl text-ink/40 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-ink/70">{item.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <ContactButton locale={locale} />
        </div>
      </section>

      <section className="bg-aqua-deep py-16 text-center">
        <h2 className="font-display italic text-3xl text-[#f7f1e4]">{t.finalCtaTitle}</h2>
        <Link
          href="/panel/registro"
          className="mt-6 inline-block rounded bg-terracotta px-7 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
        >
          {t.ctaPrimary}
        </Link>
      </section>
    </main>
  );
}
