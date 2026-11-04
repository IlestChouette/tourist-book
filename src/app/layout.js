import { Bodoni_Moda, Archivo } from "next/font/google";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import HideOnPaths from "@/components/HideOnPaths";
import { getLocale } from "@/lib/i18n/locale";
import "./globals.css";

const bodoniModa = Bodoni_Moda({
  variable: "--font-display-src",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const archivo = Archivo({
  variable: "--font-body-src",
  subsets: ["latin"],
});

const HOTEL_APP_PATHS = ["/hotel/cahier", "/hotel/gestion", "/hotel/statistiques", "/hotel/objets-trouves", "/trouve", "/objet"];

export const metadata = {
  metadataBase: new URL("https://tourist-book.com"),
  title: "Tourist Book",
  description: "Livret d'accueil numérique — Côte d'Azur",
  openGraph: {
    title: "Tourist Book",
    description: "Livret d'accueil numérique et check-in électronique pour les hébergements de la Côte d'Azur.",
    url: "https://tourist-book.com",
    siteName: "Tourist Book",
    images: ["/tourist book long.png"],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Tourist Book",
    description: "Livret d'accueil numérique et check-in électronique pour les hébergements de la Côte d'Azur.",
    images: ["/tourist book long.png"],
  },
};

// Données d'organisation pour Google et les assistants IA : qui est Tourist Book, ce qu'il propose, où.
const orgJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://tourist-book.com/#org",
      name: "Tourist Book",
      url: "https://tourist-book.com",
      logo: "https://tourist-book.com/tourist%20book%20logo.png",
      description: "Livret d'accueil numérique pour les hôtes et conciergeries de la Côte d'Azur, et cahier de consignes numérique pour les hôtels.",
      areaServed: { "@type": "AdministrativeArea", name: "Côte d'Azur" },
    },
    { "@type": "WebSite", "@id": "https://tourist-book.com/#site", url: "https://tourist-book.com", name: "Tourist Book", inLanguage: "fr", publisher: { "@id": "https://tourist-book.com/#org" } },
  ],
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${bodoniModa.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand text-ink font-body">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        {children}
        <HideOnPaths prefixes={HOTEL_APP_PATHS}>
          <Footer />
          <CookieConsent locale={locale} />
        </HideOnPaths>
      </body>
    </html>
  );
}
