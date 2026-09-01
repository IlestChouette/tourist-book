import Image from "next/image";

const MAX_DESCRIPTION_LENGTH = 220;

function truncate(text, max) {
  if (!text) return text;
  const clean = text.trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trimEnd()}…`;
}

// Header du livret d'accueil, spécifique à cette page : la photo est un
// fond fixe plein écran (comme styQR) — elle reste visible derrière le
// titre ET la grille de tuiles, pas seulement dans un bandeau du haut.
export default function LivretHero({ title, subtitle, description, photo }) {
  const shortDescription = truncate(description, MAX_DESCRIPTION_LENGTH);

  return (
    <>
      {photo && (
        <div className="fixed inset-0 -z-10 bg-aqua-deep">
          <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12202a]/45 via-[#12202a]/25 to-[#12202a]/75" />
        </div>
      )}

      <header className="relative flex min-h-[62vh] flex-col items-center justify-center px-6 pb-12 pt-6 text-center md:min-h-[52vh]">
        <a
          href="#menu"
          aria-label="Aller au menu"
          className="fixed left-5 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-[#f7f1e4] backdrop-blur-sm transition-colors hover:bg-black/50 md:left-8 md:top-8"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </a>

        {photo && (
          <div className="mb-5 h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-[#f7f1e4] shadow-lg md:h-32 md:w-32">
            <Image src={photo} alt="" width={128} height={128} className="h-full w-full object-cover" />
          </div>
        )}
        <h1 className="font-display italic text-4xl text-[#f7f1e4] [text-shadow:0_2px_12px_rgba(0,0,0,0.55)] md:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-xs text-[#f7f1e4]/95 [text-shadow:0_1px_6px_rgba(0,0,0,0.55)] md:max-w-md">
            {subtitle}
          </p>
        )}
        {shortDescription && (
          <p className="mt-5 max-w-sm rounded-2xl bg-[#12202a]/35 px-4 py-3 text-sm leading-relaxed text-[#f7f1e4]/95 backdrop-blur-sm md:max-w-lg">
            {shortDescription}
          </p>
        )}

        <a
          href="#menu"
          aria-label="Voir le menu"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-bounce text-[#f7f1e4]/80 transition-colors hover:text-[#f7f1e4]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </header>
    </>
  );
}
