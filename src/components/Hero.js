import Link from "next/link";
import Image from "next/image";

export default function Hero({ backHref, backLabel, eyebrow, title, subtitle, stamps, photo, logo }) {
  const light = Boolean(photo);

  return (
    <header className={`relative overflow-hidden ${light ? "bg-aqua-deep" : "bg-aqua"}`}>
      {photo && (
        <>
          <Image src={photo} alt="" fill priority sizes="100vw" className="object-cover" />
          {/* couleurs fixes (pas les tokens --ink/--sand-card qui s'inversent en dark mode) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12202a]/80 via-[#12202a]/30 to-[#12202a]/10" />
        </>
      )}

      <div className="relative mx-auto max-w-2xl px-6 py-14 sm:py-16">
        {logo && (
          <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#f7f1e4]/50 bg-[#f7f1e4] p-1.5">
            <Image src={logo} alt="" width={48} height={48} className="h-full w-full object-contain" />
          </div>
        )}
        {backHref && (
          <Link
            href={backHref}
            className={`text-xs font-bold uppercase tracking-widest ${light ? "text-[#f7f1e4]/80" : "text-ink/60"}`}
          >
            ← {backLabel}
          </Link>
        )}
        {eyebrow && (
          <span
            className={`mt-4 block text-xs font-bold uppercase tracking-widest ${light ? "text-[#f7f1e4]/80" : "text-ink/60"}`}
          >
            {eyebrow}
          </span>
        )}
        <h1 className={`mt-3 font-display italic text-5xl ${light ? "text-[#f7f1e4]" : "text-ink"}`}>{title}</h1>
        {subtitle && (
          <p className={`mt-2 max-w-md ${light ? "text-[#f7f1e4]/90" : "text-ink/80"}`}>{subtitle}</p>
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
