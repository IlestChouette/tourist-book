import Link from "next/link";
import HotelLogoutButton from "./HotelLogoutButton";
import { themeById } from "@/lib/hotelTheme";

const linkClass =
  "rounded-full bg-sand-card/85 px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink/70 transition-colors hover:bg-sand-card print:hidden";

// Habillage des pages de l'application hôtelière : le logo et le nom de
// l'hôtel, pas ceux de Tourist Book (seulement une mention discrète en bas).
// `links` : [{ href, label }] affichés à droite de la barre.
export function HotelHeader({ hotel, title, subtitle, links = [], logout = false, themeId, serviceName }) {
  const band = themeById(themeId ?? hotel.theme).band;
  return (
    <header className="relative bg-aqua print:hidden" style={band ? { backgroundColor: band } : undefined}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        <div className="flex min-w-0 items-center gap-4">
          {hotel.logo_url && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f7f1e4]/60 bg-[#f7f1e4] p-1.5 sm:h-14 sm:w-14">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={hotel.logo_url} alt="" className="h-full w-full object-contain" />
            </span>
          )}
          <span className="truncate font-display italic text-xl text-ink sm:text-2xl">{hotel.name}</span>
          {serviceName && <span className="shrink-0 rounded-md bg-ink px-3 py-1.5 text-sm font-bold uppercase tracking-widest text-sand">{serviceName}</span>}
        </div>
        <nav className="flex flex-wrap gap-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass}>
              {l.label}
            </Link>
          ))}
          {logout && <HotelLogoutButton />}
        </nav>
      </div>
      {title && (
        <div className="mx-auto max-w-6xl px-6 pb-8 pt-2">
          <h1 className="font-display italic text-4xl text-ink sm:text-5xl">{title}</h1>
          {subtitle && <p className="mt-2 text-ink/70">{subtitle}</p>}
        </div>
      )}
    </header>
  );
}

export function HotelFooter() {
  return (
    <footer className="mt-12 border-t border-sand-dim px-6 py-6 text-center text-xs text-ink/40 print:hidden">
      <p>Les consignes sont conservées 36 mois, puis supprimées automatiquement.</p>
      <p className="mt-1">
        Créé par{" "}
        <a href="https://tourist-book.com/hotel" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-ink/70">
          Tourist Book
        </a>
      </p>
    </footer>
  );
}
