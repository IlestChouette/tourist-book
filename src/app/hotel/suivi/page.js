import { redirect } from "next/navigation";
import { HotelFooter, HotelHeader } from "@/components/HotelShell";
import { getHotelContext } from "@/lib/hotelAuth";
import { listServices, loadMeta } from "@/lib/hotelData";
import { cleanCustomTypes } from "@/lib/hotelTheme";
import SuiviClient from "./SuiviClient";

export const metadata = { title: "Suivi des consignes", robots: { index: false, follow: false } };

// Vue du manager : toutes les consignes de tous les services, qui les a écrites,
// pour qui, si elles sont faites et par qui. Avec recherche et filtres.
export default async function SuiviPage() {
  const ctx = await getHotelContext();
  if (!ctx) redirect("/hotel/connexion");
  if (ctx.mode !== "manager") redirect("/hotel/cahier");

  const [services, meta] = await Promise.all([listServices(ctx.hotel.id), loadMeta(ctx.hotel.id)]);
  return (
    <main className="flex-1 bg-sand-card/50">
      <HotelHeader
        hotel={ctx.hotel}
        logout
        title="Suivi des consignes"
        subtitle="Tous les services : qui a écrit quoi, pour qui, et qui l'a fait."
        links={[
          { href: "/hotel/cahier", label: "Cahier" },
          { href: "/hotel/statistiques", label: "Statistiques" },
          { href: "/hotel/gestion", label: "Gestion" },
        ]}
      />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <SuiviClient services={services} customTypes={cleanCustomTypes(ctx.hotel.consigne_types)} />
      </section>
      <HotelFooter />
    </main>
  );
}
