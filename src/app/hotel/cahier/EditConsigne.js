"use client";

import { useState } from "react";
import { Icon } from "./CahierIcons";
import PinPad from "./PinPad";
import { TONES } from "@/lib/hotelTheme";

const BASE = ["info", "tache", "probleme", "plainte"];
const field = "w-full rounded-2xl border-2 border-sand-dim bg-sand px-4 py-3 text-lg text-ink focus:border-aqua-deep focus:outline focus:outline-2 focus:outline-aqua-deep";

// Modifier une consigne : on garde l'ancienne version dans l'historique, et le code personnel
// dit qui a modifié. Les personnes qui avaient déjà validé la devront refaire si le texte change.
export default function EditConsigne({ c, tags, places, types, isManager, managerHasPin, onClose, onSaved }) {
  const [form, setForm] = useState({
    body: c.body,
    placeId: places.find((p) => p.name === c.placeName)?.id ?? "",
    typeId: c.typeId ?? c.kind,
    tagIds: c.tagIds ?? [],
    priority: Boolean(c.priority),
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const toggleTag = (id) => set({ tagIds: form.tagIds.includes(id) ? form.tagIds.filter((x) => x !== id) : [...form.tagIds, id] });
  const textChanges = form.body.trim() !== c.body;
  const acksAtRisk = textChanges && c.requireAll && (c.ack?.acked ?? 0) > 0;
  const needsPin = !(isManager && !managerHasPin);
  const canSave = form.body.trim().length > 0 && form.placeId;

  async function save(pin) {
    if (!canSave) return setError("Écrivez la consigne et choisissez un lieu.");
    setBusy(true);
    setError("");
    const builtin = BASE.includes(form.typeId);
    const res = await fetch(`/api/hotel/consignes/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "edit",
        body: form.body.trim(),
        placeId: form.placeId,
        ...(builtin ? { kind: form.typeId } : { typeId: form.typeId }),
        tagIds: form.tagIds,
        priority: form.priority,
        pin,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(res.status === 403 && data.error === "PIN incorrect." ? "Ce code n'est pas bon. Essayez encore." : data.error || "Une erreur est survenue. Réessayez.");
    onSaved(data);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#12202a]/60 sm:items-center print:hidden" role="dialog" aria-modal="true" aria-label="Modifier la consigne">
      <div className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-sand-card p-6 sm:rounded-2xl">
        <h2 className="text-2xl font-bold text-ink">Modifier la consigne</h2>
        <p className="mt-1 text-base text-ink/70">L’ancienne version reste dans l’historique, avec le nom de la personne qui modifie.</p>

        <label className="mt-5 grid gap-2">
          <span className="text-base font-bold text-ink">Texte</span>
          <textarea value={form.body} onChange={(e) => set({ body: e.target.value })} rows={4} maxLength={2000} className={field} />
        </label>

        <label className="mt-4 grid gap-2">
          <span className="text-base font-bold text-ink">Chambre ou lieu</span>
          <select value={form.placeId} onChange={(e) => set({ placeId: e.target.value })} className={field}>
            {!form.placeId && <option value="">Choisir…</option>}
            {places.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>

        <div className="mt-4">
          <span className="text-base font-bold text-ink">Type</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {types.map((t) => (
              <button key={t.id} type="button" aria-pressed={form.typeId === t.id} onClick={() => set({ typeId: t.id })} className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-base font-bold ${TONES[t.tone] ?? TONES.neutre} ${form.typeId === t.id ? "ring-2 ring-aqua-deep ring-offset-2" : "opacity-70"}`}>
                <Icon name={t.icon} className="h-5 w-5" /> {t.short}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <span className="text-base font-bold text-ink">Pour</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((t) => (
              <button key={t.id} type="button" aria-pressed={form.tagIds.includes(t.id)} onClick={() => toggleTag(t.id)} className={`rounded-full border px-3 py-1.5 text-base font-bold ${form.tagIds.includes(t.id) ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim text-ink/70"}`}>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <label className="mt-4 flex items-center gap-3 text-lg font-bold text-ink">
          <input type="checkbox" checked={form.priority} onChange={(e) => set({ priority: e.target.checked })} className="h-6 w-6 accent-[#0a8f87]" />
          Prioritaire
        </label>

        {acksAtRisk && (
          <p className="mt-4 rounded-xl border-2 border-terracotta-deep p-3 text-base font-bold text-terracotta-deep" role="alert">
            Le texte change : les {c.ack.acked} validation{c.ack.acked > 1 ? "s" : ""} déjà donnée{c.ack.acked > 1 ? "s" : ""} seront à refaire.
          </p>
        )}

        <div className="mt-6">
          {needsPin ? (
            <>
              <p className="mb-3 text-center text-base font-bold text-ink">Votre code personnel pour enregistrer</p>
              <PinPad busy={busy} message={error} onComplete={save} />
            </>
          ) : (
            <>
              <button type="button" disabled={busy || !canSave} onClick={() => save(undefined)} className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-aqua-deep px-4 text-lg font-bold text-sand-card disabled:opacity-60">Enregistrer</button>
              {error && <p className="mt-3 text-center text-base font-bold text-terracotta-deep" role="alert">{error}</p>}
            </>
          )}
        </div>
        <button type="button" onClick={onClose} className="mt-5 w-full text-base font-bold text-ink/70 underline underline-offset-4">Annuler</button>
      </div>
    </div>
  );
}
