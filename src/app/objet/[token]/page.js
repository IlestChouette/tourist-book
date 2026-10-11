import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { CLOSED_STATUSES, guestText } from "@/lib/lostFound";
import GuestClient from "./GuestClient";

export const metadata = { title: "Objet retrouvé", robots: { index: false, follow: false } };

const LANGS = { fr: "Français", en: "English", es: "Español" };

// Page privée du client (lien reçu par email) : il voit la photo de l'objet et
// choisit, dans sa langue, ce que l'hôtel doit en faire.
export default async function ObjetPage({ params, searchParams }) {
  const { token } = await params;
  const { lang } = await searchParams;
  const { data: item } = await createAdminClient()
    .from("lost_items")
    .select("id, found_at, description, photo_url, status, guest_choice, hotels(name, logo_url, lost_found_enabled)")
    .eq("guest_token", token)
    .maybeSingle();
  if (!item || item.hotels?.lost_found_enabled !== true) notFound();

  const locale = guestText[lang] ? lang : "fr";
  const t = guestText[locale];
  const foundOn = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(new Date(item.found_at));

  return (
    <main className="flex-1 bg-sand-card/50">
      <header className="bg-aqua">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {item.hotels.logo_url && (
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f7f1e4]/60 bg-[#f7f1e4] p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.hotels.logo_url} alt="" className="h-full w-full object-contain" />
              </span>
            )}
            <span className="truncate font-display italic text-xl text-ink">{item.hotels.name}</span>
          </div>
          <nav className="flex shrink-0 gap-1 text-xs font-bold" aria-label="Langue">
            {Object.keys(LANGS).map((l) => (
              <a key={l} href={`?lang=${l}`} hrefLang={l} aria-current={l === locale ? "true" : undefined} className={`rounded-full px-2.5 py-1 uppercase ${l === locale ? "bg-sand-card text-ink" : "text-ink/70 hover:bg-sand-card/60"}`}>{l}</a>
            ))}
          </nav>
        </div>
      </header>
      <section className="mx-auto max-w-md px-6 py-6">
        <h1 className="font-display italic text-3xl text-ink">{t.title}</h1>
        <p className="mt-1 text-ink/70">{t.intro(item.hotels.name)}</p>
        {item.photo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.photo_url} alt={item.description || ""} className="mt-5 max-h-80 w-full rounded-2xl border border-sand-dim object-cover" />
        )}
        {item.description && <p className="mt-3 text-lg font-bold text-ink">{item.description}</p>}
        <p className="text-sm text-ink/60">{t.foundOn(foundOn)}</p>
        <GuestClient token={token} locale={locale} t={t} closed={CLOSED_STATUSES.includes(item.status)} initialChoice={item.guest_choice} />
      </section>
    </main>
  );
}
