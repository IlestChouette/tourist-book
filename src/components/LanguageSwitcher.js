"use client";

import { useTransition } from "react";
import { setLocale } from "@/lib/i18n/actions";

const LANGS = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

// Recharge la page après avoir posé le cookie plutôt que de compter sur le
// rafraîchissement automatique des composants serveur : plusieurs pages
// (panel hôtelier, check-in) sont entièrement côté client et lisent la
// langue une seule fois au montage (cookie ou navigateur) — sans rechargement
// complet, leur propre texte ne change jamais, même si le cookie est à jour.
export default function LanguageSwitcher({ locale, className = "" }) {
  const [isPending, startTransition] = useTransition();

  function handleClick(e) {
    const code = e.currentTarget.dataset.locale;
    if (code === locale || isPending) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.append("locale", code);
      await setLocale(formData);
      window.location.reload();
    });
  }

  return (
    <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${className}`}>
      {LANGS.map((lang, i) => (
        <div key={lang.code} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink/30">·</span>}
          <button
            type="button"
            onClick={handleClick}
            data-locale={lang.code}
            disabled={locale === lang.code || isPending}
            className={locale === lang.code ? "text-ink" : "text-ink/50 hover:text-ink"}
          >
            {lang.label}
          </button>
        </div>
      ))}
    </div>
  );
}
