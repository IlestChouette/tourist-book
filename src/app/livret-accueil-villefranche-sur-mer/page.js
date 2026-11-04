import CityLandingPage from "@/components/CityLandingPage";
import { getCityPage } from "@/data/cityPages";

const page = getCityPage("villefranche-sur-mer");

export const metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: "/livret-accueil-villefranche-sur-mer" },
  openGraph: {
    type: "website",
    url: "https://tourist-book.com/livret-accueil-villefranche-sur-mer",
    siteName: "Tourist Book",
    locale: "fr_FR",
    title: page.metaTitle,
    description: page.metaDescription,
  },
};

export default function Page() {
  return <CityLandingPage slug="villefranche-sur-mer" />;
}
