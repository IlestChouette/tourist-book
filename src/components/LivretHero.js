import Image from "next/image";

// Header du livret d'accueil, spécifique à cette page : photo plein écran
// avec avatar rond centré (comme styQR), sur mobile comme sur desktop.
export default function LivretHero({ title, subtitle, photo }) {
  return (
    <header className="relative h-[62vh] min-h-[420px] w-full overflow-hidden bg-aqua-deep md:h-[56vh]">
      {photo && (
        <>
          <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#12202a]/45 via-[#12202a]/25 to-[#12202a]/75" />
        </>
      )}

      <a
        href="#menu"
        aria-label="Aller au menu"
        className="absolute left-5 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/35 text-[#f7f1e4] backdrop-blur-sm transition-colors hover:bg-black/50 md:left-8 md:top-8"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </a>

      <div className="relative z-[1] flex h-full flex-col items-center justify-center px-6 text-center">
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
      </div>
    </header>
  );
}
