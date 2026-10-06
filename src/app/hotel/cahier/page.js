import Link from "next/link";
import { redirect } from "next/navigation";
import Hero from "@/components/Hero";
import { getHotelContext } from "@/lib/hotelAuth";
import { loadDay, loadMeta } from "@/lib/hotelData";
import { parisDate } from "@/lib/hotelTime";
import CahierClient from "./CahierClient";

export const metadata = { robots: { index: false, follow: false } };

export default async function CahierPage() {
  const ctx = await getHotelContext();
  if (!ctx) redirect("/hotel/connexion");

  const today = parisDate();
  const isManager = ctx.mode === "manager";
  const [items, meta] = await Promise.all([loadDay(ctx.hotel.id, today, isManager), loadMeta(ctx.hotel.id)]);

  return (
    <main className="flex-1">
      <div className="print:hidden">
        <Hero
          backHref={isManager ? "/hotel/gestion" : "/hotel"}
          backLabel={isManager ? "Gestion" : "Espace hôtels"}
          eyebrow="Cahier de consignes"
          title={ctx.hotel.name}
          logo={ctx.hotel.logo_url}
        />
      </div>
      <section className="mx-auto max-w-3xl px-6 py-8">
        <CahierClient
          hotelName={ctx.hotel.name}
          mode={ctx.mode}
          today={today}
          initialItems={items}
          tags={meta.tags}
          places={meta.places}
        />
        {!isManager && (
          <p className="mt-10 text-center text-xs text-ink/40 print:hidden">
            <Link href="/hotel/connexion">Espace manager</Link>
          </p>
        )}
      </section>
    </main>
  );
}
