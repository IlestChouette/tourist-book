import { redirect } from "next/navigation";
import { HotelFooter, HotelHeader } from "@/components/HotelShell";
import { getHotelContext } from "@/lib/hotelAuth";
import { loadDay, loadMeta } from "@/lib/hotelData";
import { parisDate } from "@/lib/hotelTime";
import CahierClient from "./CahierClient";

export const metadata = { title: "Cahier de consignes", robots: { index: false, follow: false } };

export default async function CahierPage() {
  const ctx = await getHotelContext();
  if (!ctx) redirect("/hotel/connexion");

  const today = parisDate();
  const isManager = ctx.mode === "manager";
  const [items, meta] = await Promise.all([loadDay(ctx.hotel.id, today, isManager), loadMeta(ctx.hotel.id)]);

  return (
    <main className="flex-1 bg-sand-card/50">
      <HotelHeader
        hotel={ctx.hotel}
        links={[
          ...(ctx.hotel.lost_found_enabled === true ? [{ href: "/hotel/objets-trouves", label: "Objets trouvés" }] : []),
          // Le personnel n'a pas besoin du lien « manager » : le manager y accède
          // par /hotel/connexion. Moins de boutons, moins de questions.
          ...(isManager
            ? [
                { href: "/hotel/statistiques", label: "Statistiques" },
                { href: "/hotel/gestion", label: "Gestion" },
              ]
            : []),
        ]}
      />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <CahierClient
          hotelName={ctx.hotel.name}
          mode={ctx.mode}
          today={today}
          initialItems={items}
          tags={meta.tags}
          places={meta.places}
        />
      </section>
      <HotelFooter />
    </main>
  );
}
