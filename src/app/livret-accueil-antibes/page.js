import CityLandingPage from "@/components/CityLandingPage";
import { getCityPage } from "@/data/cityPages";

const page = getCityPage("antibes");

export const metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: "/livret-accueil-antibes" },
  openGraph: {
    type: "website",
    url: "https://tourist-book.com/livret-accueil-antibes",
    siteName: "Tourist Book",
    locale: "fr_FR",
    title: page.metaTitle,
    description: page.metaDescription,
  },
};

export default function Page() {
  return <CityLandingPage slug="antibes" />;
}
