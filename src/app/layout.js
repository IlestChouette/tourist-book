import { Bodoni_Moda, Archivo } from "next/font/google";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
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

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${bodoniModa.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand text-ink font-body">
        {children}
        <Footer />
        <CookieConsent locale={locale} />
      </body>
    </html>
  );
}
