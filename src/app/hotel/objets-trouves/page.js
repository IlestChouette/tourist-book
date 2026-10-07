import { notFound, redirect } from "next/navigation";
import { HotelFooter, HotelHeader } from "@/components/HotelShell";
import { getHotelContext } from "@/lib/hotelAuth";
import { ITEM_COLUMNS } from "@/lib/lostFound";
import { getLostFoundContext } from "@/lib/lostFoundServer";
import ObjetsClient from "./ObjetsClient";

export const metadata = { title: "Objets trouvés", robots: { index: false, follow: false } };

export default async function ObjetsTrouvesPage() {
  const ctx = await getLostFoundContext();
  if (!ctx) {
    // Module désactivé : la page n'existe pas. Sans session, on renvoie vers la connexion.
    if (!(await getHotelContext())) redirect("/hotel/connexion");
    notFound();
  }
  const { data } = await ctx.admin
    .from("lost_items")
    .select(ITEM_COLUMNS)
    .eq("hotel_id", ctx.hotel.id)
    .order("found_at", { ascending: false })
    .limit(2000);

  const isManager = ctx.mode === "manager";
  return (
    <main className="flex-1 bg-sand-card/50">
      <HotelHeader
        hotel={ctx.hotel}
        links={[
          { href: "/hotel/cahier", label: "Cahier" },
          ...(isManager ? [{ href: "/hotel/statistiques", label: "Statistiques" }, { href: "/hotel/gestion", label: "Gestion" }] : []),
        ]}
      />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <ObjetsClient initialItems={data ?? []} retentionMonths={ctx.hotel.retention_months ?? 36} isManager={isManager} />
      </section>
      <HotelFooter />
    </main>
  );
}
