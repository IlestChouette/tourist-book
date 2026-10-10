import { HotelFooter, HotelHeader } from "@/components/HotelShell";
import { loadDay, loadMeta } from "@/lib/hotelData";
import { parisDate } from "@/lib/hotelTime";
import Link from "next/link";
import { hotelHasAccess } from "@/lib/hotelBilling";
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
        <HotelHeader hotel={ctx.hotel} links={isManager ? [{ href: "/hotel/gestion", label: "Gestion" }] : []} />
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
        <CahierClient hotelName={ctx.hotel.name} mode={ctx.mode} today={today} initialItems={items} tags={meta.tags} places={meta.places} />
      </section>
      <HotelFooter />
    </main>
  );
}
