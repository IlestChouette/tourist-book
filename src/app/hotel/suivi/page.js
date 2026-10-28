import { redirect } from "next/navigation";
import { HotelFooter, HotelHeader } from "@/components/HotelShell";
import { hotelHasAccess } from "@/lib/hotelBilling";
import { getHotelContext } from "@/lib/hotelAuth";
import { listServices, loadMeta, retentionInfo } from "@/lib/hotelData";
import RetentionNotice from "@/components/RetentionNotice";
import { cleanCustomTypes } from "@/lib/hotelTheme";
import SuiviClient from "./SuiviClient";

export const metadata = { title: "Suivi des consignes", robots: { index: false, follow: false } };

// Vue du manager : toutes les consignes de tous les services, qui les a écrites,
// pour qui, si elles sont faites et par qui. Avec recherche et filtres.
export default async function SuiviPage() {
  const ctx = await getHotelContext();
  if (!ctx) redirect("/hotel/connexion");
  const supervisor = ctx.mode === "station" ? ctx.supervisor : null;
  if (ctx.mode !== "manager" && !supervisor) redirect("/hotel/cahier");
  if (supervisor && !hotelHasAccess(ctx.hotel)) redirect("/hotel/cahier");

  const [allServices, meta] = await Promise.all([listServices(ctx.hotel.id), loadMeta(ctx.hotel.id)]);
  const retention = ctx.mode === "manager" ? await retentionInfo(ctx.hotel.id, ctx.hotel.retention_months ?? 36) : null;
  const services = supervisor ? allServices.filter((s) => supervisor.serviceIds.includes(s.id)) : allServices;
  return (
    <main className="flex-1 bg-sand-card/50">
      <HotelHeader
        hotel={ctx.hotel}
        logout={!supervisor}
        title="Suivi des consignes"
        subtitle={supervisor ? "Vos services : qui a écrit quoi, pour qui, et qui l'a fait." : "Tous les services : qui a écrit quoi, pour qui, et qui l'a fait."}
        links={
          supervisor
            ? [{ href: "/hotel/cahier", label: "Cahier" }, { href: "/hotel/statistiques", label: "Statistiques" }]
            : [
                { href: "/hotel/cahier", label: "Cahier" },
                { href: "/hotel/statistiques", label: "Statistiques" },
                { href: "/hotel/gestion", label: "Gestion" },
              ]
        }
      />
      <section className="mx-auto max-w-6xl px-6 py-8">
        {retention && <RetentionNotice info={retention} className="mb-6" />}
        <SuiviClient canExport={!supervisor} tags={meta.tags} services={services} customTypes={cleanCustomTypes(ctx.hotel.consigne_types)} />
      </section>
      <HotelFooter />
    </main>
  );
}
