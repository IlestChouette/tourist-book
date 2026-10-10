"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

const RANGES = [
  ["today", "Aujourd'hui"],
  ["7", "7 derniers jours"],
  ["30", "30 derniers jours"],
  ["90", "90 derniers jours"],
  ["365", "12 derniers mois"],
  ["custom", "Période personnalisée…"],
];
const KINDS = [
  ["info", "Info"],
  ["tache", "Tâche"],
  ["probleme", "Problème"],
  ["plainte", "Plainte"],
];
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-deep";
const label = "text-xs font-bold uppercase tracking-wider text-ink/60";

// Barre de filtres façon Google Analytics : tout est dans l'URL (partageable),
// chaque changement recharge les graphiques en dessous. Une ligne, au-dessus
// des graphiques, jamais dans une carte.
export default function StatsFilters({ params, tags, places, today }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [custom, setCustom] = useState({ from: params.from, to: params.to });
  const showCustom = params.range === "custom";

  function go(patch) {
    const next = { ...params, ...patch };
    const qs = new URLSearchParams();
    qs.set("range", next.range);
    if (next.range === "custom") {
      qs.set("from", next.from);
      qs.set("to", next.to);
    }
    if (next.compare) qs.set("compare", "1");
    if (next.kinds.length) qs.set("kind", next.kinds.join(","));
    if (next.service) qs.set("service", next.service);
    if (next.shift) qs.set("shift", next.shift);
    if (next.place) qs.set("place", next.place);
    startTransition(() => router.push(`${pathname}?${qs.toString()}`, { scroll: false }));
  }

  const services = tags.filter((t) => t.kind !== "shift");
  const shifts = tags.filter((t) => t.kind === "shift");
  const tagName = Object.fromEntries(tags.map((t) => [t.id, t.name]));
  const active = [
    ...params.kinds.map((k) => ({ key: `k-${k}`, text: KINDS.find(([id]) => id === k)?.[1], clear: () => go({ kinds: params.kinds.filter((x) => x !== k) }) })),
    params.service && { key: "s", text: `Service : ${tagName[params.service] ?? "?"}`, clear: () => go({ service: "" }) },
    params.shift && { key: "sh", text: `Équipe : ${tagName[params.shift] ?? "?"}`, clear: () => go({ shift: "" }) },
    params.place && { key: "p", text: `Lieu : ${params.place}`, clear: () => go({ place: "" }) },
  ].filter(Boolean);

  const select = "input h-11 w-auto min-w-40";

  return (
    <div className="rounded-xl border border-sand-dim bg-sand p-4 print:hidden" aria-busy={pending}>
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
        <label className="grid gap-1.5">
          <span className={label}>Période</span>
          <select value={params.range} onChange={(e) => go({ range: e.target.value, from: custom.from, to: custom.to })} className={select}>
            {RANGES.map(([id, text]) => <option key={id} value={id}>{text}</option>)}
          </select>
        </label>
        {showCustom && (
          <>
            <label className="grid gap-1.5">
              <span className={label}>Du</span>
              <input type="date" max={today} value={custom.from} onChange={(e) => setCustom({ ...custom, from: e.target.value })} className="input h-11" />
            </label>
            <label className="grid gap-1.5">
              <span className={label}>Au</span>
              <input type="date" max={today} value={custom.to} onChange={(e) => setCustom({ ...custom, to: e.target.value })} className="input h-11" />
            </label>
            <button type="button" onClick={() => go({ from: custom.from, to: custom.to })} className={`h-11 rounded-lg bg-aqua-deep px-4 text-sm font-bold text-sand-card ${focus}`}>Appliquer</button>
          </>
        )}
        <label className="flex h-11 items-center gap-2 text-sm font-bold text-ink">
          <input type="checkbox" checked={params.compare} onChange={(e) => go({ compare: e.target.checked })} className="h-5 w-5 accent-[var(--aqua-deep)]" />
          Comparer à la période précédente
        </label>
        {pending && <span className="h-11 text-sm leading-[2.75rem] text-ink/50" role="status">Mise à jour…</span>}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-3 border-t border-sand-dim pt-4">
        <div className="grid gap-1.5">
          <span className={label}>Type</span>
          <div className="flex flex-wrap gap-1.5">
            {KINDS.map(([id, text]) => {
              const on = params.kinds.includes(id);
              return (
                <button key={id} type="button" aria-pressed={on} onClick={() => go({ kinds: on ? params.kinds.filter((k) => k !== id) : [...params.kinds, id] })} className={`h-11 rounded-lg border px-3 text-sm font-bold transition-colors ${focus} ${on ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim bg-sand text-ink/70 hover:border-aqua-deep"}`}>
                  {text}
                </button>
              );
            })}
          </div>
        </div>
        <label className="grid gap-1.5">
          <span className={label}>Service</span>
          <select value={params.service} onChange={(e) => go({ service: e.target.value })} className={select}>
            <option value="">Tous</option>
            {services.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className={label}>Équipe</span>
          <select value={params.shift} onChange={(e) => go({ shift: e.target.value })} className={select}>
            <option value="">Toutes</option>
            {shifts.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1.5">
          <span className={label}>Chambre ou lieu</span>
          <input
            key={params.place}
            list="stats-places"
            defaultValue={params.place}
            placeholder="Toutes"
            onBlur={(e) => e.target.value.trim() !== params.place && go({ place: e.target.value.trim() })}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="input h-11 w-40"
          />
          <datalist id="stats-places">{places.map((p) => <option key={p.id} value={p.name} />)}</datalist>
        </label>
      </div>

      {active.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-sand-dim pt-4">
          <span className="text-sm text-ink/60">Filtres actifs :</span>
          {active.map((a) => (
            <button key={a.key} type="button" onClick={a.clear} className={`inline-flex items-center gap-1.5 rounded-full bg-aqua-deep/10 px-3 py-1 text-sm font-bold text-aqua-deep ${focus}`}>
              {a.text} <span aria-hidden="true">×</span><span className="sr-only">retirer</span>
            </button>
          ))}
          <button type="button" onClick={() => go({ kinds: [], service: "", shift: "", place: "" })} className={`text-sm font-bold text-ink/60 underline underline-offset-2 hover:text-ink ${focus}`}>Tout réinitialiser</button>
        </div>
      )}
    </div>
  );
}
