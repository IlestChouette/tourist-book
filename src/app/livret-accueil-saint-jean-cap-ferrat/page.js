import CityLandingPage from "@/components/CityLandingPage";
import { getCityPage } from "@/data/cityPages";

const page = getCityPage("saint-jean-cap-ferrat");

export const metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: "/livret-accueil-saint-jean-cap-ferrat" },
  openGraph: {
    type: "website",
    url: "https://tourist-book.com/livret-accueil-saint-jean-cap-ferrat",
    siteName: "Tourist Book",
    locale: "fr_FR",
    title: page.metaTitle,
    description: page.metaDescription,
  },
};

export default function Page() {
  return <CityLandingPage slug="saint-jean-cap-ferrat" />;
}
