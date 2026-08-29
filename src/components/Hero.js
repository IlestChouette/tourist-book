import Link from "next/link";
import Image from "next/image";

export default function Hero({ backHref, backLabel, eyebrow, title, subtitle, stamps, photo, logo }) {
  const light = Boolean(photo);

  return (
    <header className={`relative overflow-hidden ${light ? "bg-aqua-deep" : "bg-aqua"}`}>
      {photo && (
        <>
          <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover" />
          {/* couleurs fixes (pas les tokens --ink/--sand-card qui s'inversent en dark mode) —
              assombrit toute la photo (pas juste le bas) pour garder le texte lisible partout. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#12202a]/55 via-[#12202a]/40 to-[#12202a]/70" />
        </>
      )}

      <div className="relative flex items-start justify-between gap-4 px-6 pt-6">
        <Link href="/" className="inline-flex shrink-0">
          <Image
            src="/tourist book long.png"
            alt="Tourist Book"
            width={278}
            height={106}
            className="h-20 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] sm:h-24"
          />
        </Link>
        {backHref && (
          <Link
            href={backHref}
            className={`mt-2 inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest backdrop-blur-sm transition-colors ${
              light
                ? "bg-black/40 text-[#f7f1e4] hover:bg-black/55"
                : "bg-sand-card/80 text-ink/70 hover:bg-sand-card"
            }`}
          >
            ← {backLabel}
          </Link>
        )}
      </div>

      <div className="relative mx-auto max-w-2xl px-6 pb-14 pt-6 sm:pb-16">
        {logo && (
          <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#f7f1e4]/50 bg-[#f7f1e4] p-1.5">
            <Image src={logo} alt="" width={48} height={48} className="h-full w-full object-contain" />
          </div>
        )}
        {eyebrow && (
          <span
            className={`mt-4 block text-xs font-bold uppercase tracking-widest ${
              light
                ? "text-[#f7f1e4] [text-shadow:0_1px_5px_rgba(0,0,0,0.7)]"
                : "text-ink/60"
            }`}
          >
            {eyebrow}
          </span>
        )}
        <h1
          className={`mt-3 font-display italic text-5xl ${
            light ? "text-[#f7f1e4] [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]" : "text-ink"
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`mt-2 max-w-md ${
              light ? "text-[#f7f1e4]/95 [text-shadow:0_1px_6px_rgba(0,0,0,0.55)]" : "text-ink/80"
            }`}
          >
            {subtitle}
          </p>
        )}
        {stamps && stamps.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {stamps.map((s) => (
              <span key={s} className={light ? "stamp stamp--light" : "stamp"}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="stripe-band" />
    </header>
  );
}
