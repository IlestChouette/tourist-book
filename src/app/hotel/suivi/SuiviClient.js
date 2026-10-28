"use client";

import { useEffect, useState } from "react";
import { highlightParts, searchTerms } from "@/lib/hotelSearch";
import { TONES, typeOf } from "@/lib/hotelTheme";
import { Icon } from "../cahier/CahierIcons";
import EditHistory from "../cahier/EditHistory";

const dayFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const field = "h-11 rounded-xl border-2 border-sand-dim bg-sand px-3 text-base text-ink focus:border-aqua-deep focus:outline focus:outline-4 focus:outline-aqua-deep/30";
const chip = (on) => `rounded-xl border-2 px-4 py-2 text-base font-bold ${on ? "border-ink bg-ink text-sand" : "border-sand-dim bg-sand text-ink hover:border-ink"}`;

function Highlighted({ text, terms }) {
  return highlightParts(text, terms).map((p, i) =>
    p.hit ? <mark key={i} className="rounded bg-[#ffe27a] px-0.5 text-ink">{p.text}</mark> : <span key={i}>{p.text}</span>
  );
}

export default function SuiviClient({ services, customTypes, tags = [], canExport = true }) {
  const [q, setQ] = useState("");
  const [service, setService] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState({ items: [], total: 0, open: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const terms = searchTerms(q);

  const params = (offset = 0) => {
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    if (service) p.set("service", service);
    if (status !== "all") p.set("status", status);
    if (from) p.set("from", from);
    if (to) p.set("to", to);
    if (offset) p.set("offset", String(offset));
    return p;
  };

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/hotel/overview?${params()}`);
        if (!res.ok) throw new Error("failed");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, service, status, from, to]);

  async function more() {
    const res = await fetch(`/api/hotel/overview?${params(data.items.length)}`);
    if (!res.ok) return;
    const json = await res.json();
    setData((d) => ({ ...json, items: [...d.items, ...json.items] }));
  }

  return (
    <div>
      <div className="grid gap-3 rounded-2xl border-2 border-sand-dim bg-sand p-4 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <label className="relative block lg:col-span-1">
          <span className="sr-only">Rechercher</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher (ex : colis 405, Léa, conciergerie)" spellCheck lang="fr" autoComplete="off" className={`${field} w-full`} />
        </label>
        <select value={service} onChange={(e) => setService(e.target.value)} aria-label="Service" className={field}>
          <option value="">Tous les services</option>
          {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-ink/60">
          Du <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={`${field} w-full`} />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/60">
          au <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={`${field} w-full`} />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[["all", "Toutes"], ["open", "À faire"], ["done", "Faites"]].map(([id, label]) => (
          <button key={id} type="button" aria-pressed={status === id} onClick={() => setStatus(id)} className={chip(status === id)}>{label}</button>
        ))}
        <span className="ml-2 text-base text-ink/70">
          <strong className="text-ink">{data.total}</strong> consigne{data.total > 1 ? "s" : ""} · <span className="text-terracotta-deep">{data.open} à faire</span> · <span className="text-aqua-deep">{data.done} faite{data.done > 1 ? "s" : ""}</span>
        </span>
        {canExport && (
          <a href={`/api/hotel/overview-csv?${params()}`} className="ml-auto rounded-xl border-2 border-sand-dim px-4 py-2 text-base font-bold text-ink/70 hover:border-ink">
            Télécharger pour Excel
          </a>
        )}
      </div>

      {error && <p className="mt-4 text-base text-terracotta-deep">Le suivi n'a pas pu être chargé. Réessayez.</p>}
      {!loading && !error && data.total === 0 && <p className="mt-6 text-lg text-ink/70">Aucune consigne ne correspond. Essayez avec moins de filtres.</p>}

      <ul className="mt-5 grid gap-3 lg:grid-cols-2 lg:items-start">
        {data.items.map((c) => {
          const t = typeOf(customTypes, c.kind, c.typeId);
          return (
            <li key={c.id} className="rounded-2xl border-2 border-sand-dim bg-sand p-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="rounded-xl bg-ink px-3 py-1 text-lg font-bold tabular-nums text-sand"><Highlighted text={c.placeName} terms={terms} /></span>
                <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-sm font-bold ${TONES[t.tone] ?? TONES.neutre}`}>
                  <Icon name={t.icon} className="h-5 w-5" /> {t.short}
                </span>
                <span className={`rounded-xl px-3 py-1 text-sm font-bold ${c.done ? "bg-aqua-deep text-sand-card" : "bg-terracotta/30 text-terracotta-deep"}`}>
                  {c.done ? "Faite" : "À faire"}
                </span>
                <span className="ml-auto text-sm text-ink/60">{dayFmt.format(new Date(`${c.day}T12:00:00Z`))}</span>
              </div>
              {(c.fromServiceName || c.toServiceName) && (
                <p className="mt-2 text-sm font-bold text-ink/70">
                  {c.fromServiceName ? <Highlighted text={c.fromServiceName} terms={terms} /> : "Direction"} → {c.toServiceName ? <Highlighted text={c.toServiceName} terms={terms} /> : "Tous"}
                </p>
              )}
              <p className="mt-2 whitespace-pre-wrap break-words text-lg leading-snug text-ink"><Highlighted text={c.body} terms={terms} /></p>
              <p className="mt-2 text-sm text-ink/60">
                Écrit par <Highlighted text={c.createdByName ?? "?"} terms={terms} /> à {timeFmt.format(new Date(c.createdAt))}
                {c.done && c.closedAt && (
                  <> · {c.requireAll ? "validé par tous" : <>terminé par <Highlighted text={c.closedByName ?? "?"} terms={terms} /></>} le {dayFmt.format(new Date(c.closedAt))} à {timeFmt.format(new Date(c.closedAt))}</>
                )}
              </p>
              {c.editedAt && <p className="mt-1 text-sm font-bold text-ink/70">Modifiée le {dayFmt.format(new Date(c.editedAt))} à {timeFmt.format(new Date(c.editedAt))}</p>}
              {c.editedAt && <EditHistory id={c.id} tags={tags} />}
              {c.closedComment && (
                <p className="mt-2 rounded-xl bg-ink/[0.06] px-3 py-2 text-sm text-ink"><span className="font-bold">Précision{c.closedByName ? ` de ${c.closedByName}` : ""} :</span> <Highlighted text={c.closedComment} terms={terms} /></p>
              )}
              {c.requireAll && c.ack && (
                <div className="mt-2 rounded-xl bg-ink/[0.06] px-3 py-2 text-sm text-ink">
                  <p className="font-bold">À valider par chaque personne · {c.ack.acked} sur {c.ack.expected}</p>
                  {c.ack.ackNames.length > 0 && <p className="mt-0.5 text-ink/70">Ont validé : <Highlighted text={c.ack.ackNames.join(", ")} terms={terms} /></p>}
                  {(c.ack.comments ?? []).map((x, i) => <p key={i} className="mt-0.5 text-ink/80"><span className="font-bold">Précision de {x.name} :</span> {x.comment}</p>)}
                  {c.ack.missingNames.length > 0 && <p className="mt-0.5 text-terracotta-deep">Il manque : <Highlighted text={c.ack.missingNames.join(", ")} terms={terms} /></p>}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {data.items.length < data.total && (
        <button type="button" onClick={more} className="mt-6 rounded-xl border-2 border-sand-dim px-6 py-3 text-lg font-bold text-ink hover:border-ink">
          Voir plus ({data.total - data.items.length} restantes)
        </button>
      )}
    </div>
  );
}
