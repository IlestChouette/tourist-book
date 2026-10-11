import CityLandingPage from "@/components/CityLandingPage";
import { getCityPage } from "@/data/cityPages";

const page = getCityPage("cannes");

export const metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: "/livret-accueil-cannes" },
  openGraph: {
    type: "website",
    url: "https://tourist-book.com/livret-accueil-cannes",
    siteName: "Tourist Book",
    locale: "fr_FR",
    title: page.metaTitle,
    description: page.metaDescription,
  },
};

export default function Page() {
  return <CityLandingPage slug="cannes" />;
}
