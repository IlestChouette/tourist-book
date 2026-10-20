"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/hotelServices";

const btn = "rounded bg-aqua-deep px-4 py-2 text-sm font-bold text-sand-card hover:bg-aqua-deep/90 disabled:opacity-60";

// Choix des services de l'hôtel : chaque service coche = 15 €/mois.
export function ServicesEditor({ selected, price, subscribed, busy, onSave }) {
  const [ids, setIds] = useState(selected);
  const toggle = (id) => setIds((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const dirty = ids.slice().sort().join() !== selected.slice().sort().join();

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const on = ids.includes(s.id);
          return (
            <label key={s.id} className={`flex cursor-pointer items-center gap-3 rounded border-2 px-4 py-3 text-base font-bold ${on ? "border-aqua-deep bg-aqua-deep/10 text-ink" : "border-sand-dim text-ink/70"}`}>
              <input type="checkbox" checked={on} onChange={() => toggle(s.id)} className="h-5 w-5 accent-[#0a8f87]" />
              {s.label}
            </label>
          );
        })}
      </div>
      <p className="text-lg font-bold text-ink">
        {ids.length} service{ids.length > 1 ? "s" : ""} · {ids.length * price} € par mois
      </p>
      {subscribed && dirty && (
        <p className="text-sm text-ink/60">Le changement s'applique à votre abonnement tout de suite : le montant est ajusté au prorata sur la prochaine facture.</p>
      )}
      <button type="button" disabled={busy || !dirty || ids.length === 0} onClick={() => onSave(ids)} className={`${btn} w-fit`}>
        Enregistrer mes services
      </button>
    </div>
  );
}
