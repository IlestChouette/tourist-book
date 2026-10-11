import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false } };

export default async function HotelSlugPage({ params }) {
  const { slug } = await params;
  redirect(`/hotel/${slug}/cahier`);
}
