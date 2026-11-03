import Hero from "@/components/Hero";
import DemoFunnel from "./DemoFunnel";

const title = "Démonstration gratuite du livret d'accueil numérique | Tourist Book";
const description = "Voyez en 2 minutes comment le livret d'accueil Tourist Book répond à vos voyageurs à votre place, puis réservez une démonstration gratuite.";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/demo-livret" },
  openGraph: { type: "website", url: "https://tourist-book.com/demo-livret", siteName: "Tourist Book", locale: "fr_FR", title, description },
};

export default function DemoLivretPage() {
  return (
    <main className="flex-1">
      <Hero
        eyebrow="Pour les hôtes Airbnb de la Côte d'Azur"
        title="Plus de « quel est le wifi ? » à 23 h"
        subtitle="Un seul lien, un QR code : vos voyageurs trouvent tout dans leur poche. Regardez comment ça marche, puis réservez une démonstration gratuite."
      />
      <DemoFunnel />
    </main>
  );
}
