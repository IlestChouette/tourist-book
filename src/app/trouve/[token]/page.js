import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import CaptureForm from "./CaptureForm";

export const metadata = { title: "Objet trouvé", robots: { index: false, follow: false } };

// Page privée des femmes de chambre : un lien gardé dans leur téléphone, sans
// compte ni PIN. Elle ne sait que créer un objet "à traiter".
export default async function TrouvePage({ params }) {
  const { token } = await params;
  const { data: hotel } = await createAdminClient()
    .from("hotels")
    .select("name, logo_url, lost_found_enabled")
    .eq("lost_found_token", token)
    .maybeSingle();
  if (!hotel || hotel.lost_found_enabled !== true) notFound();

  return (
    <main className="flex-1 bg-sand-card/50">
      <header className="bg-aqua">
        <div className="mx-auto flex max-w-md items-center gap-3 px-6 py-4">
          {hotel.logo_url && (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f7f1e4]/60 bg-[#f7f1e4] p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hotel.logo_url} alt="" className="h-full w-full object-contain" />
            </span>
          )}
          <span className="truncate font-display italic text-2xl text-ink">{hotel.name}</span>
        </div>
      </header>
      <section className="mx-auto max-w-md px-6 py-6">
        <h1 className="font-display italic text-3xl text-ink">Objet trouvé</h1>
        <p className="mt-1 text-ink/70">Prenez une photo, notez la chambre si vous la connaissez, c'est tout.</p>
        <CaptureForm token={token} />
      </section>
    </main>
  );
}
