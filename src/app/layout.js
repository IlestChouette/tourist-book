import { Bodoni_Moda, Archivo } from "next/font/google";
import Footer from "@/components/Footer";
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
  title: "Tourist Book",
  description: "Livret d'accueil numérique — Côte d'Azur",
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
      </body>
    </html>
  );
}
