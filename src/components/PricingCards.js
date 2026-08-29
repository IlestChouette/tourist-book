"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    key: "basico",
    name: "Libro de bienvenida",
    price: { anual: "39,99 €", temporada: "7 €" },
    period: { anual: "/ año", temporada: "/ mes" },
    highlight: false,
  },
  {
    key: "premium",
    name: "Libro + Check-in",
    price: { anual: "59,99 €", temporada: "10 €" },
    period: { anual: "/ año", temporada: "/ mes" },
    highlight: true,
  },
];

const cycleFoot = {
  anual: "por alojamiento · 1 mes gratis",
  temporada: "por alojamiento · sin permanencia",
};

export default function PricingCards() {
  const [cycle, setCycle] = useState("anual");

  return (
    <div>
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-sand-dim bg-sand p-1">
          {[
            { key: "anual", label: "Anual" },
            { key: "temporada", label: "Por temporada" },
          ].map((c) => (
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
        {plans.map((p) => (
          <div
            key={p.key}
            className={`rounded-xl bg-sand p-7 ${
              p.highlight ? "border-2 border-terracotta-deep" : "border border-sand-dim"
            }`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-widest ${
                p.highlight ? "text-terracotta-deep" : "text-aqua-deep"
              }`}
            >
              {p.name}
            </span>
            <p className="mt-3 font-display text-4xl text-ink">
              {p.price[cycle]} <span className="text-base font-body font-normal text-ink/60">{p.period[cycle]}</span>
            </p>
            <p className="mt-1 text-sm text-ink/60">{cycleFoot[cycle]}</p>
            <Link
              href="/panel/registro"
              className={`mt-6 block rounded px-5 py-3 text-center font-bold transition-colors ${
                p.highlight
                  ? "bg-terracotta text-ink hover:bg-terracotta-deep"
                  : "border border-aqua-deep text-aqua-deep hover:bg-aqua-deep hover:text-[#f7f1e4]"
              }`}
            >
              {cycle === "anual" ? "Empezar gratis →" : "Suscribirse →"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
