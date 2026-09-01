import { Bodoni_Moda, Archivo } from "next/font/google";
import Footer from "@/components/Footer";
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

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${bodoniModa.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-sand text-ink font-body">
        {children}
        <Footer />
      </body>
    </html>
  );
}
