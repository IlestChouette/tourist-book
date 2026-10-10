import { notFound } from "next/navigation";
import { ITEM_COLUMNS } from "@/lib/lostFound";
import { getLostFoundContext } from "@/lib/lostFoundServer";
import PrintButton from "./PrintButton";

export const metadata = { title: "Étiquette", robots: { index: false, follow: false } };

// Étiquette à imprimer et coller sur l'objet : numéro, date, chambre, rangement.
export default async function EtiquettePage({ params }) {
  const { id } = await params;
  const ctx = await getLostFoundContext();
  if (!ctx) notFound();
  const { data: i } = await ctx.admin.from("lost_items").select(ITEM_COLUMNS).eq("id", id).eq("hotel_id", ctx.hotel.id).maybeSingle();
  if (!i) notFound();
  const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(i.found_at));

  return (
    <main className="flex-1 bg-sand-card/50 p-6 print:bg-white print:p-0">
      <div className="mx-auto max-w-sm print:hidden"><PrintButton /></div>
      <div className="mx-auto mt-4 w-full max-w-sm rounded-xl border-2 border-ink bg-white p-6 print:mt-0 print:border">
        <p className="text-sm font-bold uppercase tracking-widest text-ink/60">{ctx.hotel.name}</p>
        <p className="mt-1 text-sm text-ink/60">Objet trouvé</p>
        <p className="mt-3 font-display text-6xl italic tabular-nums text-ink">N° {i.number}</p>
        <dl className="mt-4 grid gap-1.5 text-base text-ink">
          <div className="flex gap-2"><dt className="font-bold">Date :</dt><dd>{date}</dd></div>
          <div className="flex gap-2"><dt className="font-bold">Chambre :</dt><dd>{i.room_text || "—"}</dd></div>
          <div className="flex gap-2"><dt className="font-bold">Objet :</dt><dd>{i.description || "—"}</dd></div>
          {i.storage_location && <div className="flex gap-2"><dt className="font-bold">Rangé :</dt><dd>{i.storage_location}</dd></div>}
        </dl>
      </div>
    </main>
  );
}
