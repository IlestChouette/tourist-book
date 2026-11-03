"use client";

import { useEffect, useState } from "react";

const SERVICE_PRICE = 15;
const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

// Simulateur de prix : le nombre de services choisi donne le prix par mois et par jour (15 € / service / mois).
export function PriceCalc() {
  const [n, setN] = useState(3);
  const total = n * SERVICE_PRICE;
  return (
    <div className="rounded-2xl border-2 border-terracotta bg-sand-card p-6 sm:p-8">
      <label htmlFor="svc" className="text-sm font-bold uppercase tracking-wider text-ink/60">Combien de services dans votre hôtel ?</label>
      <div className="mt-4 flex items-center gap-5">
        <input id="svc" type="range" min="1" max="10" value={n} onChange={(e) => setN(Number(e.target.value))} className="h-3 w-full accent-[var(--terracotta-deep)]" />
        <span className="w-12 text-right font-display text-4xl tabular-nums text-ink">{n}</span>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div><p className="text-sm text-ink/60">Par mois</p><p className="font-display text-4xl tabular-nums text-ink">{eur.format(total)}</p></div>
        <div><p className="text-sm text-ink/60">Par jour, pour tout l&apos;hôtel</p><p className="font-display text-4xl tabular-nums text-ink">{eur.format(total / 30)}</p></div>
        <div><p className="text-sm text-ink/60">Par service et par jour</p><p className="font-display text-4xl tabular-nums text-terracotta-deep">{eur.format(SERVICE_PRICE / 30)}</p></div>
      </div>
    </div>
  );
}

// Notes pour le présentateur : masquées par défaut (on partage l'écran avec le client) ; touche N ou bouton pour les afficher.
export function Notes({ children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea")) return;
      if (e.key === "n" || e.key === "N") setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-pressed={open} className="fixed bottom-4 left-4 z-40 rounded-full border border-sand-dim bg-sand-card/90 px-3 py-1.5 text-xs font-bold text-ink/50 shadow hover:text-ink print:hidden">
        Notes {open ? "▾" : "▸"} <span className="opacity-60">(N)</span>
      </button>
      {open && <div className="print:hidden">{children}</div>}
    </>
  );
}
