import CityLandingPage from "@/components/CityLandingPage";
import { getCityPage } from "@/data/cityPages";

const page = getCityPage("nice");

export const metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: "/livret-accueil-nice" },
  openGraph: {
    type: "website",
    url: "https://tourist-book.com/livret-accueil-nice",
    siteName: "Tourist Book",
    locale: "fr_FR",
    title: page.metaTitle,
    description: page.metaDescription,
  },
};

export default function Page() {
  return <CityLandingPage slug="nice" />;
}
