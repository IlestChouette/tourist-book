import { redirect } from "next/navigation";
import { HotelFooter, HotelHeader } from "@/components/HotelShell";
import { getHotelContext } from "@/lib/hotelAuth";
import { loadMeta } from "@/lib/hotelData";
import { PENDING_LABEL } from "@/lib/hotelAuth";
import { slugForHotel } from "@/lib/hotelSlug";
import GestionClient from "./GestionClient";

export const metadata = { title: "Gestion du cahier", robots: { index: false, follow: false } };

export default async function GestionPage() {
  const ctx = await getHotelContext();
  if (!ctx) redirect("/hotel/connexion");
  if (ctx.mode !== "manager") redirect("/hotel/cahier");

  const { admin, hotel } = ctx;
  const [meta, { data: staff }, { data: stations }, slug] = await Promise.all([
    loadMeta(hotel.id),
    admin
      .from("hotel_staff")
      .select("id, name, role_ids, is_manager, active, pin_hash")
      .eq("hotel_id", hotel.id)
      .order("created_at", { ascending: true }),
    admin.from("hotel_stations").select("id, label, created_at").eq("hotel_id", hotel.id).neq("label", PENDING_LABEL).order("created_at"),
    slugForHotel(hotel.id, admin),
  ]);

  return (
    <main className="flex-1 bg-sand-card/50">
      <HotelHeader hotel={hotel} title="Gestion" subtitle="Équipe, chambres, étiquettes et emails du cahier de consignes." links={[{ href: "/hotel/cahier", label: "Cahier" }, ...(hotel.lost_found_enabled === true ? [{ href: "/hotel/objets-trouves", label: "Objets trouvés" }] : []), { href: "/hotel/statistiques", label: "Statistiques" }]} />
      <section className="mx-auto max-w-3xl px-6 py-8">
        <GestionClient
          userId={ctx.user.id}
          hotel={{ name: hotel.name, logoUrl: hotel.logo_url, emails: hotel.notification_emails }}
          tags={meta.tags}
          places={meta.places}
          staff={(staff ?? []).map((s) => ({ ...s, hasPin: Boolean(s.pin_hash), pin_hash: undefined }))}
          stations={stations ?? []}
          cahierPath={slug ? `/hotel/${slug}/cahier` : "/hotel/cahier"}
          billing={
            hotel.billing_status === undefined
              ? null
              : {
                  exempt: hotel.billing_exempt === true,
                  status: hotel.billing_status,
                  services: hotel.services_count ?? 0,
                  periodEnd: hotel.current_period_end ?? null,
                  pastDueSince: hotel.past_due_since ?? null,
                  hasCustomer: Boolean(hotel.stripe_customer_id),
                }
          }
          lostFound={hotel.lost_found_enabled === true ? { token: hotel.lost_found_token ?? null } : null}
        />
      </section>
      <HotelFooter />
    </main>
  );
}
