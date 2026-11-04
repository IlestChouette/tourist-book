"use client";

import { useState } from "react";

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const KIND_LABELS = { info: "Information", tache: "À faire", probleme: "Problème", plainte: "Plainte client" };

// Ce qui a changé entre deux versions : une ligne par champ modifié.
function changes(before, after, tagName) {
  const out = [];
  if (before.body !== after.body) out.push({ label: "Texte", from: before.body, to: after.body });
  if (before.placeName !== after.placeName) out.push({ label: "Lieu", from: before.placeName, to: after.placeName });
  if (before.kind !== after.kind || (before.typeId ?? null) !== (after.typeId ?? null)) out.push({ label: "Type", from: KIND_LABELS[before.kind] ?? before.kind, to: KIND_LABELS[after.kind] ?? after.kind });
  if (before.priority !== after.priority) out.push({ label: "Priorité", from: before.priority ? "prioritaire" : "normale", to: after.priority ? "prioritaire" : "normale" });
  const names = (ids) => (ids ?? []).map(tagName).filter(Boolean).join(", ") || "personne";
  if (JSON.stringify(before.tagIds) !== JSON.stringify(after.tagIds)) out.push({ label: "Pour", from: names(before.tagIds), to: names(after.tagIds) });
  return out;
}

// Historique des modifications d'une consigne, chargé à la demande (manager et responsable de service).
export default function EditHistory({ id, tags }) {
  const [state, setState] = useState({ open: false, loading: false, edits: null, error: "" });
  const tagName = (tid) => tags.find((t) => t.id === tid)?.name;

  async function toggle() {
    if (state.open) return setState((s) => ({ ...s, open: false }));
    setState((s) => ({ ...s, open: true, loading: !s.edits }));
    if (state.edits) return;
    const res = await fetch(`/api/hotel/consignes/${id}/history`);
    const data = await res.json().catch(() => ({}));
    setState((s) => ({ ...s, loading: false, edits: res.ok ? data.edits : [], error: res.ok ? "" : data.error || "Impossible de charger l'historique." }));
  }

  return (
    <div className="mt-2">
      <button type="button" onClick={toggle} aria-expanded={state.open} className="text-base font-bold text-aqua-deep underline underline-offset-4">
        {state.open ? "Masquer l'historique" : "Voir l'historique des modifications"}
      </button>
      {state.open && (
        <div className="mt-2 grid gap-3 rounded-xl bg-ink/[0.06] p-3 text-base text-ink">
          {state.loading && <p className="text-ink/60">Chargement…</p>}
          {state.error && <p className="font-bold text-terracotta-deep">{state.error}</p>}
          {state.edits?.map((e, i) => (
            <div key={i} className="border-l-4 border-aqua-deep pl-3">
              <p className="font-bold">{e.by} · {dateFmt.format(new Date(e.at))}</p>
              {changes(e.before, e.after, tagName).map((ch) => (
                <p key={ch.label} className="mt-1 break-words">
                  <span className="font-bold">{ch.label} :</span> <span className="text-ink/60 line-through">{ch.from}</span> → {ch.to}
                </p>
              ))}
              {e.after?.acksReset > 0 && <p className="mt-1 font-bold text-terracotta-deep">{e.after.acksReset} validation{e.after.acksReset > 1 ? "s" : ""} à refaire après ce changement.</p>}
            </div>
          ))}
          {state.edits && state.edits.length === 0 && !state.error && <p className="text-ink/60">Aucune modification enregistrée.</p>}
        </div>
      )}
    </div>
  );
}
