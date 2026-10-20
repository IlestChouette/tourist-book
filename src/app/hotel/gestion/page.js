import { redirect } from "next/navigation";
import { HotelFooter, HotelHeader } from "@/components/HotelShell";
import { getHotelContext } from "@/lib/hotelAuth";
import { listServices, loadMeta } from "@/lib/hotelData";
import { PENDING_LABEL } from "@/lib/hotelAuth";
import { slugForHotel } from "@/lib/hotelSlug";
import { cleanCustomTypes } from "@/lib/hotelTheme";
import { cleanServices, servicesFromTags } from "@/lib/hotelServices";
import { createClient } from "@/lib/supabase/server";
import CreateHotel from "./CreateHotel";
import GestionClient from "./GestionClient";

export const metadata = { title: "Gestion du cahier", robots: { index: false, follow: false } };

export default async function GestionPage() {
  const ctx = await getHotelContext();
  if (!ctx) {
    // Connecté mais sans hôtel (compte de livrets) : on propose d'en créer un.
    const {
      data: { user },
    } = await (await createClient()).auth.getUser();
    if (!user || user.user_metadata?.account_type === "hotel_service") redirect("/hotel/connexion");
    return (
      <main className="flex-1 bg-sand-card/50">
        <CreateHotel email={user.email} />
        <HotelFooter />
      </main>
    );
  }
  if (ctx.mode !== "manager") redirect("/hotel/cahier");

  const { admin, hotel } = ctx;
  const [meta, { data: staff }, { data: stations }, slug, hotelServices] = await Promise.all([
    loadMeta(hotel.id),
    admin
      .from("hotel_staff")
      .select("id, name, role_ids, service_ids, is_manager, active, pin_hash")
      .eq("hotel_id", hotel.id)
      .order("created_at", { ascending: true }),
    admin.from("hotel_stations").select("id, label, created_at, service_id").eq("hotel_id", hotel.id).neq("label", PENDING_LABEL).order("created_at"),
    slugForHotel(hotel.id, admin),
    listServices(hotel.id),
  ]);

  // Services facturés : choix de l'hôtel, sinon ceux dont l'étiquette existe déjà.
  const servicesManaged = hotel.services !== undefined;
  const savedServices = servicesManaged ? cleanServices(hotel.services) : [];
  // Accès email + mot de passe des services : colonne absente tant que le SQL n'est pas passé.
  const { data: accountRows, error: accountError } = await admin.from("hotel_services").select("id, account_email").eq("hotel_id", hotel.id);
  const serviceAccounts = accountError ? null : Object.fromEntries((accountRows ?? []).map((r) => [r.id, r.account_email ?? null]));
  const selectedServices = savedServices.length ? savedServices : servicesFromTags(meta.tags);

  return (
    <main className="flex-1 bg-sand-card/50">
      <HotelHeader hotel={hotel} logout title="Gestion" subtitle="Équipe, chambres, étiquettes et emails du cahier de consignes." links={[{ href: "/hotel/cahier", label: "Cahier" }, ...(hotel.lost_found_enabled === true ? [{ href: "/hotel/objets-trouves", label: "Objets trouvés" }] : []), { href: "/hotel/suivi", label: "Suivi" }, { href: "/hotel/statistiques", label: "Statistiques" }]} />
      <section className="mx-auto max-w-3xl px-6 py-8">
        <GestionClient
          userId={ctx.user.id}
          hotel={{ name: hotel.name, logoUrl: hotel.logo_url, emails: hotel.notification_emails, replyTo: hotel.reply_to === undefined ? null : hotel.reply_to ?? "" }}
          tags={meta.tags}
          places={meta.places}
          staff={(staff ?? []).map((s) => ({ ...s, hasPin: Boolean(s.pin_hash), pin_hash: undefined }))}
          stations={stations ?? []}
          hotelServices={hotelServices}
          serviceAccounts={serviceAccounts}
          cahierPath={slug ? `/hotel/${slug}/cahier` : "/hotel/cahier"}
          billing={
            hotel.billing_status === undefined
              ? null
              : {
                  exempt: hotel.billing_exempt === true,
                  status: hotel.billing_status,
                  services: hotel.services_count ?? 0,
                  managed: servicesManaged,
                  planned: selectedServices.length,
                  periodEnd: hotel.current_period_end ?? null,
                  pastDueSince: hotel.past_due_since ?? null,
                  hasCustomer: Boolean(hotel.stripe_customer_id),
                }
          }
          // null tant que la migration SQL n'est pas passée : la section reste cachée.
          appearance={hotel.consigne_types === undefined ? null : { theme: hotel.theme ?? "sable", types: cleanCustomTypes(hotel.consigne_types) }}
          servicesInfo={servicesManaged ? { selected: selectedServices } : null}
          lostFound={hotel.lost_found_enabled === true ? { token: hotel.lost_found_token ?? null } : null}
        />
      </section>
      <HotelFooter />
    </main>
  );
}
