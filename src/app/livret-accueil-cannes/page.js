import CityLandingPage from "@/components/CityLandingPage";
import { getCityPage } from "@/data/cityPages";

const page = getCityPage("cannes");

export const metadata = {
  title: page.metaTitle,
  description: page.metaDescription,
  alternates: { canonical: "/livret-accueil-cannes" },
};

export default function Page() {
  return <CityLandingPage slug="cannes" />;
}
