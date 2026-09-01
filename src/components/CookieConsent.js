"use client";

import { useState } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";

const STORAGE_KEY = "cookie_consent";
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const content = {
  fr: {
    text: "Nous utilisons des cookies techniques nécessaires au fonctionnement du site, et, avec votre accord, des cookies de mesure d'audience (Google Analytics).",
    learnMore: "En savoir plus",
    reject: "Refuser",
    accept: "Accepter",
  },
  en: {
    text: "We use technical cookies necessary for the site to work, and, with your consent, audience-measurement cookies (Google Analytics).",
    learnMore: "Learn more",
    reject: "Reject",
    accept: "Accept",
  },
  es: {
    text: "Usamos cookies técnicas necesarias para el funcionamiento del sitio, y, con tu consentimiento, cookies de medición de audiencia (Google Analytics).",
    learnMore: "Saber más",
    reject: "Rechazar",
    accept: "Aceptar",
  },
};

function readConsent() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export default function CookieConsent({ locale }) {
  const [consent, setConsent] = useState(readConsent);
  const t = content[locale];

  function choose(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Stockage indisponible (navigation privée, etc.) : le bandeau réapparaîtra, sans bloquer le choix actuel.
    }
    setConsent(value);
  }

  return (
    <>
      {GA_ID && consent === "accepted" && <GoogleAnalytics gaId={GA_ID} />}

      {consent === null && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-sand-dim bg-sand-card p-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:p-5">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-sm text-ink/80">
              {t.text}{" "}
              <Link href="/privacidad#cookies" className="font-bold text-aqua-deep underline">
                {t.learnMore}
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose("rejected")}
                className="rounded border border-sand-dim px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink/70 transition-colors hover:border-ink/40"
              >
                {t.reject}
              </button>
              <button
                type="button"
                onClick={() => choose("accepted")}
                className="rounded bg-terracotta px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:bg-terracotta-deep"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
