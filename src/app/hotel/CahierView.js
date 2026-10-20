import { HotelFooter, HotelHeader } from "@/components/HotelShell";
import { listServices, loadDay, loadMeta, loadSent } from "@/lib/hotelData";
import { parisDate } from "@/lib/hotelTime";
import Link from "next/link";
import { hotelHasAccess } from "@/lib/hotelBilling";
import { cleanCustomTypes, selectableTypes, serviceThemeId, themeById, themeStyle } from "@/lib/hotelTheme";
import CahierClient from "./cahier/CahierClient";

// Le cahier d'un hôtel (même contenu quelle que soit l'adresse d'entrée).
export default async function CahierView({ ctx }) {
  const today = parisDate();
  const isManager = ctx.mode === "manager";

  // Abonnement non payé ou suspendu : le cahier ne s'ouvre pas, avec une
  // explication claire (le personnel est renvoyé vers son manager).
  if (!hotelHasAccess(ctx.hotel)) {
    return (
      <main className="flex-1 bg-sand-card/50">
        <HotelHeader hotel={ctx.hotel} logout={isManager} links={isManager ? [{ href: "/hotel/gestion", label: "Gestion" }] : []} />
        <section className="mx-auto max-w-xl px-6 py-14 text-center">
          <h1 className="text-3xl font-bold text-ink">Le cahier est en pause</h1>
          {isManager ? (
            <>
              <p className="mt-4 text-xl text-ink/75">L'abonnement n'est pas actif. Vos consignes sont conservées : elles réapparaissent dès que l'abonnement est réglé.</p>
              <Link href="/hotel/gestion" className="mt-8 inline-flex h-14 items-center rounded-2xl bg-terracotta px-8 text-xl font-bold text-ink hover:bg-terracotta-deep">Régler l'abonnement</Link>
            </>
          ) : (
            <p className="mt-4 text-xl text-ink/75">L'accès est suspendu pour le moment. Prévenez votre manager : il pourra le rétablir en quelques minutes.</p>
          )}
        </section>
        <HotelFooter />
      </main>
    );
  }

  // Le manager a-t-il défini son code personnel ? Alors il le tape aussi (publier, valider).
  const managerHasPin = isManager
    ? Boolean((await ctx.admin.from("hotel_staff").select("id").eq("hotel_id", ctx.hotel.id).eq("is_manager", true).not("pin_hash", "is", null).maybeSingle()).data)
    : false;
  const [items, meta, allServices, sent] = await Promise.all([
    loadDay(ctx.hotel.id, today, isManager, { serviceId: ctx.service?.id }),
    loadMeta(ctx.hotel.id),
    listServices(ctx.hotel.id),
    ctx.service ? loadSent(ctx.hotel.id, ctx.service.id, today) : [],
  ]);
  // Un cahier de service prend la couleur de son service (bien reconnaissable) ;
  // sinon la couleur choisie par l'hôtel (absente ou inconnue : sable d'origine).
  const themeId = ctx.service ? serviceThemeId(ctx.service) : ctx.hotel.theme;
  const themeStyleVars = themeStyle(themeId);
  const customTypes = cleanCustomTypes(ctx.hotel.consigne_types);

  return (
    <main
      className="flex-1 bg-sand-card/50"
      style={themeStyleVars ? { ...themeStyleVars, backgroundColor: themeById(themeId).bg } : undefined}
    >
      <HotelHeader
        hotel={ctx.hotel}
        logout={isManager}
        themeId={themeId}
        serviceName={ctx.service?.name}
        links={[
          ...(ctx.hotel.lost_found_enabled === true ? [{ href: "/hotel/objets-trouves", label: "Objets trouvés" }] : []),
          // Le personnel n'a pas besoin du lien « manager » : le manager y accède
          // par /hotel/connexion. Moins de boutons, moins de questions.
          ...(isManager
            ? [
                { href: "/hotel/suivi", label: "Suivi" },
                { href: "/hotel/statistiques", label: "Statistiques" },
                { href: "/hotel/gestion", label: "Gestion" },
              ]
            : []),
        ]}
      />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <CahierClient hotelName={ctx.hotel.name} mode={ctx.mode} today={today} initialItems={items} initialSent={sent} managerHasPin={managerHasPin} service={ctx.service} deviceServices={ctx.services ?? []} allServices={allServices} tags={meta.tags} places={meta.places} customTypes={customTypes} types={selectableTypes(customTypes)} />
      </section>
      <HotelFooter />
    </main>
  );
}
