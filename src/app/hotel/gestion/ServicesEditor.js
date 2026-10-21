"use client";

import { useEffect, useState } from "react";
import { SERVICES, MAX_CUSTOM_SERVICES } from "@/lib/hotelServices";
import { Icon } from "../cahier/CahierIcons";

const btn = "rounded bg-aqua-deep px-4 py-2 text-sm font-bold text-sand-card hover:bg-aqua-deep/90 disabled:opacity-60";

const newId = () => "x-" + Math.random().toString(36).slice(2, 8).padEnd(6, "0");

// Choix des services de l'hôtel : chaque service coche = 15 €/mois. Les services
// propres à l'hôtel (nom libre) se comptent comme les autres.
export function ServicesEditor({ selected, initialCustom = [], price, subscribed, busy, onSave, onDirtyChange }) {
  const [ids, setIds] = useState(selected);
  const [custom, setCustom] = useState(initialCustom);
  const [draft, setDraft] = useState("");
  const toggle = (id) => setIds((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  const dirty =
    ids.slice().sort().join() !== selected.slice().sort().join() ||
    JSON.stringify(custom) !== JSON.stringify(initialCustom);

  useEffect(() => { onDirtyChange?.(dirty); }, [dirty, onDirtyChange]);

  function addCustom() {
    const name = draft.replace(/\s+/g, " ").trim();
    if (!name || custom.length >= MAX_CUSTOM_SERVICES) return;
    const id = newId();
    setCustom((l) => [...l, { id, name }]);
    setIds((l) => [...l, id]);
    setDraft("");
  }
  // Retirer un service propre : décoché et sorti de la liste (le cahier garde ses consignes).
  function removeCustom(id) {
    setCustom((l) => l.filter((c) => c.id !== id));
    setIds((l) => l.filter((x) => x !== id));
  }

  const items = [
    ...SERVICES.map((s) => ({ id: s.id, label: s.label, icon: s.icon, own: false })),
    ...custom.map((c) => ({ id: c.id, label: c.name, icon: "user", own: true })),
  ];

  return (
    <div className="grid gap-4">
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((s) => {
          const on = ids.includes(s.id);
          return (
            <label key={s.id} className={`flex cursor-pointer items-center gap-3 rounded border-2 px-4 py-3 text-base font-bold ${on ? "border-aqua-deep bg-aqua-deep/10 text-ink" : "border-sand-dim text-ink/70"}`}>
              <input type="checkbox" checked={on} onChange={() => toggle(s.id)} className="h-5 w-5 shrink-0 accent-[#0a8f87]" />
              <Icon name={s.icon} className={`h-6 w-6 shrink-0 ${on ? "text-aqua-deep" : "text-ink/45"}`} />
              <span className="min-w-0 flex-1 break-words">{s.label}</span>
              {s.own && (
                <button type="button" onClick={(e) => { e.preventDefault(); removeCustom(s.id); }} className="shrink-0 rounded px-2 py-1 text-sm font-bold text-terracotta-deep hover:bg-terracotta/20" aria-label={`Retirer ${s.label}`}>
                  Retirer
                </button>
              )}
            </label>
          );
        })}
      </div>

      {custom.length < MAX_CUSTOM_SERVICES && (
        <div className="grid gap-2 rounded border-2 border-dashed border-sand-dim px-4 py-3">
          <span className="text-sm font-bold text-ink">Un service qui n'est pas dans la liste ?</span>
          <div className="flex flex-wrap gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
              maxLength={30}
              placeholder="Ex. : Spa, Voiturier, Sécurité…"
              className="input h-11 min-w-0 flex-1"
            />
            <button type="button" onClick={addCustom} disabled={!draft.trim()} className={btn}>Ajouter un service personnalisé</button>
          </div>
        </div>
      )}

      <p className="text-lg font-bold text-ink">
        {ids.length} service{ids.length > 1 ? "s" : ""} · {ids.length * price} € par mois
      </p>
      {subscribed && dirty && (
        <p className="text-sm text-ink/60">Le changement s'applique à votre abonnement tout de suite : le montant est ajusté au prorata sur la prochaine facture.</p>
      )}
      <button
        type="button"
        disabled={busy || !dirty || ids.length === 0}
        onClick={() => onSave(ids, custom.filter((c) => ids.includes(c.id)))}
        className={`${btn} w-fit`}
      >
        Enregistrer mes services
      </button>
    </div>
  );
}
