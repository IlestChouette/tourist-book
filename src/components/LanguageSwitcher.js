import { setLocale } from "@/lib/i18n/actions";

const LANGS = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

export default function LanguageSwitcher({ locale, className = "" }) {
  return (
    <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${className}`}>
      {LANGS.map((lang, i) => (
        <div key={lang.code} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink/30">·</span>}
          <form action={setLocale}>
            <input type="hidden" name="locale" value={lang.code} />
            <button
              type="submit"
              disabled={locale === lang.code}
              className={locale === lang.code ? "text-ink" : "text-ink/50 hover:text-ink"}
            >
              {lang.label}
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
