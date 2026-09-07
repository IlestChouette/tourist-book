import CityLandingPage from "@/components/CityLandingPage";
import { getCityPage } from "@/data/cityPages";

const page = getCityPage("antibes");

export const metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: "/livret-accueil-antibes" },
};

export default function Page() {
  return <CityLandingPage slug="antibes" />;
}
