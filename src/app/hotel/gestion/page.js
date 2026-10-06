import { redirect } from "next/navigation";
import Hero from "@/components/Hero";
import { getHotelContext } from "@/lib/hotelAuth";
import { loadMeta } from "@/lib/hotelData";
import GestionClient from "./GestionClient";

export const metadata = { robots: { index: false, follow: false } };

export default async function GestionPage() {
  const ctx = await getHotelContext();
  if (!ctx) redirect("/hotel/connexion");
  if (ctx.mode !== "manager") redirect("/hotel/cahier");

  const { admin, hotel } = ctx;
  const [meta, { data: staff }, { data: stations }] = await Promise.all([
    loadMeta(hotel.id),
    admin
      .from("hotel_staff")
      .select("id, name, role_ids, is_manager, active, pin_hash")
      .eq("hotel_id", hotel.id)
      .order("created_at", { ascending: true }),
    admin.from("hotel_stations").select("id, label, created_at").eq("hotel_id", hotel.id).order("created_at"),
  ]);

  return (
    <main className="flex-1">
      <Hero eyebrow="Espace hôtels" title={hotel.name} subtitle="Gestion du cahier de consignes" logo={hotel.logo_url} />
      <section className="mx-auto max-w-3xl px-6 py-8">
        <GestionClient
          userId={ctx.user.id}
          hotel={{ name: hotel.name, logoUrl: hotel.logo_url, emails: hotel.notification_emails }}
          tags={meta.tags}
          places={meta.places}
          staff={(staff ?? []).map((s) => ({ ...s, hasPin: Boolean(s.pin_hash), pin_hash: undefined }))}
          stations={stations ?? []}
        />
      </section>
    </main>
  );
}
