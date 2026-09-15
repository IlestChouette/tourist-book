import { useEffect, useState } from "react";

const SUPPORTED = ["fr", "en", "es"];

// Équivalent côté client de getLocale() (src/lib/i18n/locale.js) : lit le
// cookie posé par le sélecteur de langue, sinon déduit la langue du
// navigateur, sinon retombe sur le français. Nécessaire dans les pages
// "use client" (formulaires du panel) qui ne peuvent pas lire les cookies
// serveur via next/headers.
export function getClientLocale() {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|; )locale=([^;]+)/);
    if (match && SUPPORTED.includes(match[1])) return match[1];
  }
  if (typeof navigator !== "undefined") {
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    for (const lang of langs) {
      const code = (lang || "").slice(0, 2).toLowerCase();
      if (SUPPORTED.includes(code)) return code;
    }
  }
  return "fr";
}

// Version hook : démarre sur "fr" (même valeur que le rendu serveur, aucune
// cookie/langue navigateur n'y étant disponible) puis corrige vers la vraie
// langue juste après le montage. Évite le mismatch d'hydratation React
// (erreur #418) qu'un `useState(getClientLocale)` direct provoquait dès que
// la langue réelle différait du français.
export function useClientLocale() {
  const [locale, setLocale] = useState("fr");
  useEffect(() => {
    const real = getClientLocale();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale((current) => (real === current ? current : real));
  }, []);
  return locale;
}
