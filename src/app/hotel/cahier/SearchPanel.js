"use client";

import { useEffect, useState } from "react";
import { formatDayLong } from "@/lib/hotelTime";
import { highlightParts, MIN_QUERY, searchTerms } from "@/lib/hotelSearch";
import { TONES, typeOf } from "@/lib/hotelTheme";
import { Icon } from "./CahierIcons";

const dayFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

function Highlighted({ text, terms }) {
  return highlightParts(text, terms).map((p, i) =>
    p.hit ? <mark key={i} className="rounded bg-[#ffe27a] px-0.5 text-ink">{p.text}</mark> : <span key={i}>{p.text}</span>
  );
}

// Recherche par mots-clés dans tout le cahier : « colis 405 » trouve ce qui
// parle de colis et de la 405. Remplace le tableau du jour tant qu'on cherche.
export default function SearchPanel({ customTypes, tagName, onActive }) {
  const [q, setQ] = useState("");
  const [state, setState] = useState({ items: [], total: 0, loading: false, error: false });
  const query = q.trim();
  const active = query.length >= MIN_QUERY;
  const terms = searchTerms(query);

  useEffect(() => {
    onActive(active);
    if (!active) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((s) => ({ ...s, loading: true, error: false }));
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/hotel/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        if (!cancelled) setState({ items: data.items, total: data.total, loading: false, error: false });
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: true }));
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="mt-4 print:hidden">
      <label className="relative block">
        <span className="sr-only">Rechercher dans le cahier</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher dans le cahier (ex : colis 405)"
          spellCheck
          lang="fr"
          autoComplete="off"
          className="h-12 w-full rounded-2xl border-2 border-sand-dim bg-sand pl-4 pr-12 text-base text-ink focus:border-aqua-deep focus:outline focus:outline-4 focus:outline-aqua-deep/30"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} aria-label="Effacer la recherche" className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-ink/60 hover:bg-sand-dim">
            <Icon name="close" className="h-5 w-5" />
          </button>
        )}
      </label>

      {active && (
        <section className="mt-6" aria-live="polite">
          <h2 className="text-xl font-bold text-ink">
            {state.loading && state.items.length === 0
              ? "Recherche…"
              : state.total === 0
                ? "Aucun résultat"
                : `${state.total} résultat${state.total > 1 ? "s" : ""}`}
            {state.total > state.items.length && <span className="ml-2 text-base font-normal text-ink/60">(les {state.items.length} plus récents)</span>}
          </h2>
          {state.error && <p className="mt-3 text-base text-terracotta-deep">La recherche n'a pas abouti. Réessayez.</p>}
          {!state.loading && !state.error && state.total === 0 && (
            <p className="mt-3 text-base text-ink/70">Essayez avec moins de mots, ou avec le numéro de chambre seul.</p>
          )}
          <ul className="mt-3 grid gap-3 lg:grid-cols-2 lg:items-start">
            {state.items.map((c) => {
              const t = typeOf(customTypes, c.kind, c.typeId);
              const tags = c.tagIds.map((id) => tagName[id]).filter(Boolean);
              return (
                <li key={c.id} className="rounded-2xl border-2 border-sand-dim bg-sand p-4">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="rounded-xl bg-ink px-3 py-1 text-lg font-bold tabular-nums text-sand"><Highlighted text={c.placeName} terms={terms} /></span>
                    <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-sm font-bold ${TONES[t.tone] ?? TONES.neutre}`}>
                      <Icon name={t.icon} className="h-5 w-5" /> {t.short}
                    </span>
                    <span className={`rounded-xl px-3 py-1 text-sm font-bold ${c.done ? "bg-aqua-deep/10 text-aqua-deep" : "bg-terracotta/30 text-terracotta-deep"}`}>
                      {c.done ? `Fait le ${dayFmt.format(new Date(c.closedAt))}` : "À faire"}
                    </span>
                    <span className="ml-auto text-sm text-ink/60" title={formatDayLong(c.day)}>{dayFmt.format(new Date(`${c.day}T12:00:00Z`))}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words text-lg leading-snug text-ink"><Highlighted text={c.body} terms={terms} /></p>
                  {tags.length > 0 && <p className="mt-2 text-sm text-ink/60">Pour : {tags.join(", ")}</p>}
                  {(c.createdByName || c.closedByName) && (
                    <p className="mt-1 text-sm text-ink/50">
                      {c.createdByName ? `Écrit par ${c.createdByName}` : ""}
                      {c.closedByName ? ` · Clôturé par ${c.closedByName}` : ""}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
