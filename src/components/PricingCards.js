"use client";

import { useState } from "react";
import Link from "next/link";

const copy = {
  fr: {
    cycles: [
      { key: "anual", label: "Annuel" },
      { key: "temporada", label: "Saisonnier" },
    ],
    plans: [
      { key: "basico", name: "Livret d'accueil", price: { anual: "39,99 €", temporada: "7 €" } },
      { key: "premium", name: "Livret + Check-in", price: { anual: "59,99 €", temporada: "10 €" } },
    ],
    period: { anual: "/ an", temporada: "/ mois" },
    cycleFoot: {
      anual: "par logement · 1 mois offert",
      temporada: "par logement · sans engagement",
    },
    cta: { anual: "Commencer gratuitement →", temporada: "S'abonner →" },
  },
  en: {
    cycles: [
      { key: "anual", label: "Annual" },
      { key: "temporada", label: "Seasonal" },
    ],
    plans: [
      { key: "basico", name: "Welcome book", price: { anual: "€39.99", temporada: "€7" } },
      { key: "premium", name: "Book + Check-in", price: { anual: "€59.99", temporada: "€10" } },
    ],
    period: { anual: "/ year", temporada: "/ month" },
    cycleFoot: {
      anual: "per property · 1 month free",
      temporada: "per property · no commitment",
    },
    cta: { anual: "Start for free →", temporada: "Subscribe →" },
  },
  es: {
    cycles: [
      { key: "anual", label: "Anual" },
      { key: "temporada", label: "Por temporada" },
    ],
    plans: [
      { key: "basico", name: "Libro de bienvenida", price: { anual: "39,99 €", temporada: "7 €" } },
      { key: "premium", name: "Libro + Check-in", price: { anual: "59,99 €", temporada: "10 €" } },
    ],
    period: { anual: "/ año", temporada: "/ mes" },
    cycleFoot: {
      anual: "por alojamiento · 1 mes gratis",
      temporada: "por alojamiento · sin permanencia",
    },
    cta: { anual: "Empezar gratis →", temporada: "Suscribirse →" },
  },
};

export default function PricingCards({ locale = "fr" }) {
  const [cycle, setCycle] = useState("anual");
  const t = copy[locale] ?? copy.fr;

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-sand-dim bg-sand p-1">
          {t.cycles.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setCycle(c.key)}
              className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                cycle === c.key ? "bg-terracotta text-ink" : "text-ink/60 hover:text-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {t.plans.map((p, i) => (
          <div
            key={p.key}
            className={`rounded-xl bg-sand p-7 ${
              i === 1 ? "border-2 border-terracotta-deep" : "border border-sand-dim"
            }`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-widest ${
                i === 1 ? "text-terracotta-deep" : "text-aqua-deep"
              }`}
            >
              {p.name}
            </span>
            <p className="mt-3 font-display text-4xl text-ink">
              {p.price[cycle]} <span className="text-base font-body font-normal text-ink/60">{t.period[cycle]}</span>
            </p>
            <p className="mt-1 text-sm text-ink/60">{t.cycleFoot[cycle]}</p>
            <Link
              href="/panel/registro"
              className={`mt-6 block rounded px-5 py-3 text-center font-bold transition-colors ${
                i === 1
                  ? "bg-terracotta text-ink hover:bg-terracotta-deep"
                  : "border border-aqua-deep text-aqua-deep hover:bg-aqua-deep hover:text-[#f7f1e4]"
              }`}
            >
              {t.cta[cycle]}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
