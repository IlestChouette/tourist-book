import FeatureLandingPage from "@/components/FeatureLandingPage";
import { getFeaturePage } from "@/data/featurePages";

const page = getFeaturePage("check-in-electronique-airbnb");
const title = `${page.seoTitle} — Tourist Book`;

export const metadata = {
  title,
  description: page.metaDescription,
  alternates: { canonical: page.path },
  openGraph: { type: "website", url: `https://tourist-book.com${page.path}`, siteName: "Tourist Book", locale: "fr_FR", title, description: page.metaDescription },
};

export default function Page() {
  return <FeatureLandingPage slug="check-in-electronique-airbnb" />;
}
