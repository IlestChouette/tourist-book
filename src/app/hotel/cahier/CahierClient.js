"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, formatDayLong } from "@/lib/hotelTime";

const KINDS = [
  { id: "info", label: "Info" },
  { id: "tache", label: "Tâche" },
  { id: "probleme", label: "Problème" },
  { id: "plainte", label: "Plainte" },
];
const kindLabel = Object.fromEntries(KINDS.map((k) => [k.id, k.label]));
const kindStyle = {
  info: "bg-sand-dim text-ink/70",
  tache: "bg-aqua-deep/15 text-aqua-deep",
  probleme: "bg-terracotta text-ink",
  plainte: "bg-terracotta-deep text-sand-card",
};
const fieldLabel = "text-xs font-bold uppercase tracking-wider text-ink/60";

async function send(url, method, body) {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return res.ok ? { ok: true } : { error: data.error || "Une erreur est survenue." };
}

export default function CahierClient({ hotelName, mode, today, initialItems, tags, places }) {
  const isManager = mode === "manager";
  const [day, setDay] = useState(today);
  const [items, setItems] = useState(initialItems);
  const [tagFilter, setTagFilter] = useState(null);
  const [creating, setCreating] = useState(false);
  const [pinPrompt, setPinPrompt] = useState(null); // { action, id, until }
  const tagName = useMemo(() => Object.fromEntries(tags.map((t) => [t.id, t.name])), [tags]);

  const load = useCallback(async (d) => {
    const res = await fetch(`/api/hotel/cahier?day=${d}`, { cache: "no-store" });
    if (res.ok) setItems((await res.json()).items);
  }, []);

  useEffect(() => {
    if (day === today) return; // jour courant : déjà chargé par le serveur
    load(day);
  }, [day, today, load]);

  // Poste partagé : la page reste ouverte toute la journée, on la rafraîchit
  // pour que les consignes des autres équipes apparaissent sans recharger.
  useEffect(() => {
    const timer = setInterval(() => load(day), 60000);
    return () => clearInterval(timer);
  }, [day, load]);

  const visible = tagFilter ? items.filter((i) => i.tagIds.includes(tagFilter)) : items;
  const pinned = visible.filter((i) => i.pinned);
  const rest = visible.filter((i) => !i.pinned);
  const pending = rest
    .filter((i) => !i.done)
    .sort((a, b) => Number(b.priority || b.carried) - Number(a.priority || a.carried) || a.createdAt.localeCompare(b.createdAt));
  const done = rest.filter((i) => i.done);

  async function act(id, action, extra, pin) {
    const result = await send(`/api/hotel/consignes/${id}`, "PATCH", { action, pin, ...extra });
    if (!result.error) await load(day);
    return result;
  }

  // Sur un poste de réception, chaque action demande le PIN ; le manager
  // connecté est identifié d'office.
  function request(action, id, extra) {
    if (isManager) return act(id, action, extra);
    setPinPrompt({ action, id, extra });
  }

  const card = (c) => {
    return (
      <li key={c.id} className={`rounded border p-4 ${c.done ? "border-sand-dim bg-sand text-ink/60" : c.priority || c.carried ? "border-terracotta-deep bg-sand-card" : "border-sand-dim bg-sand-card"}`}>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {(c.priority || c.carried) && !c.done && (
            <span className="rounded bg-terracotta-deep px-2 py-0.5 font-bold uppercase tracking-wide text-sand-card">
              Prioritaire{c.carried ? ` · reportée depuis ${c.daysOpen} j` : ""}
            </span>
          )}
          <span className={`rounded px-2 py-0.5 font-bold uppercase tracking-wide ${kindStyle[c.kind]}`}>{kindLabel[c.kind]}</span>
          <span className="font-bold text-ink">{c.placeName}</span>
          {c.tagIds.map((id) => tagName[id] && (
            <span key={id} className="rounded border border-sand-dim px-2 py-0.5 text-ink/60">{tagName[id]}</span>
          ))}
          {c.pinned && c.pinnedUntil && (
            <span className="text-ink/50">épinglée jusqu'au {new Date(c.pinnedUntil).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" })}</span>
          )}
        </div>
        <p className="mt-2 whitespace-pre-wrap text-ink">{c.body}</p>
        {isManager && (
          <p className="mt-2 text-xs text-ink/50">
            Écrite par {c.createdByName}
            {c.closedByName ? ` · clôturée par ${c.closedByName}` : ""}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 print:hidden">
          {!c.done ? (
            <button type="button" onClick={() => request("close", c.id)} className="rounded bg-aqua-deep px-4 py-2 text-sm font-bold text-sand-card transition-colors hover:bg-aqua-deep/90">
              ✓ Clôturer
            </button>
          ) : isManager ? (
            <button type="button" onClick={() => request("reopen", c.id)} className="rounded border border-sand-dim px-3 py-1.5 text-sm font-bold text-ink/70 hover:border-aqua-deep">
              Rouvrir
            </button>
          ) : (
            <span className="text-sm font-bold text-sage">✓ Faite</span>
          )}
          {c.pinned ? (
            <button type="button" onClick={() => request("unpin", c.id)} className="rounded border border-sand-dim px-3 py-1.5 text-sm font-bold text-ink/70 hover:border-aqua-deep">
              Désépingler
            </button>
          ) : (
            !c.done && (
              <button type="button" onClick={() => setPinPrompt({ action: "pin", id: c.id, needsDate: true })} className="rounded border border-sand-dim px-3 py-1.5 text-sm font-bold text-ink/70 hover:border-aqua-deep">
                📌 Épingler
              </button>
            )
          )}
        </div>
      </li>
    );
  };

  const section = (title, list, empty) => (
    <div className="mt-8 print:mt-4">
      <h2 className="font-display italic text-2xl text-ink">
        {title} <span className="text-base text-ink/50">({list.length})</span>
      </h2>
      {list.length === 0 ? (
        empty && <p className="mt-2 text-sm text-ink/60">{empty}</p>
      ) : (
        <ul className="mt-3 grid gap-3">{list.map(card)}</ul>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <button type="button" onClick={() => setDay(addDays(day, -1))} aria-label="Jour précédent" className="h-11 w-11 rounded border border-sand-dim bg-sand-card text-xl font-bold text-ink hover:border-aqua-deep">‹</button>
        <input type="date" value={day} onChange={(e) => e.target.value && setDay(e.target.value)} className="input w-auto" aria-label="Choisir un jour" />
        <button type="button" onClick={() => setDay(addDays(day, 1))} aria-label="Jour suivant" className="h-11 w-11 rounded border border-sand-dim bg-sand-card text-xl font-bold text-ink hover:border-aqua-deep">›</button>
        {day !== today && (
          <button type="button" onClick={() => setDay(today)} className="rounded border border-aqua-deep px-4 py-2.5 text-sm font-bold text-aqua-deep hover:bg-aqua-deep hover:text-sand-card">
            Aujourd'hui
          </button>
        )}
      </div>

      <h1 className="mt-4 font-display italic text-3xl text-ink first-letter:uppercase">{formatDayLong(day)}</h1>
      <p className="hidden text-sm text-ink/60 print:block">{hotelName} — cahier de consignes</p>

      <div className="mt-5 flex items-stretch gap-4 print:hidden">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex aspect-square w-36 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl bg-terracotta text-ink shadow-sm transition active:scale-[0.97] hover:bg-terracotta-deep sm:w-40"
        >
          <span className="text-5xl font-light leading-none">+</span>
          <span className="px-2 text-center text-sm font-bold uppercase leading-tight tracking-wide">Nouvelle consigne</span>
        </button>
        <div className="flex flex-1 flex-col justify-between gap-3">
          <p className="text-ink/70">
            <strong className="text-ink">{pending.length + pinned.filter((i) => !i.done).length}</strong> en attente · <strong className="text-ink">{done.length}</strong> faite{done.length > 1 ? "s" : ""}
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => window.print()} className="rounded border border-aqua-deep px-4 py-2 text-sm font-bold text-aqua-deep hover:bg-aqua-deep hover:text-sand-card">
              Imprimer la journée
            </button>
            <a href={`/api/hotel/pdf?day=${day}`} className="rounded border border-sand-dim px-4 py-2 text-sm font-bold text-ink/70 hover:border-aqua-deep">
              PDF
            </a>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 print:hidden">
        <button type="button" onClick={() => setTagFilter(null)} className={`rounded-full border px-3 py-1 text-sm font-bold ${!tagFilter ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim text-ink/70"}`}>
          Tout
        </button>
        {tags.map((t) => (
          <button key={t.id} type="button" onClick={() => setTagFilter(tagFilter === t.id ? null : t.id)} className={`rounded-full border px-3 py-1 text-sm font-bold ${tagFilter === t.id ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim text-ink/70"}`}>
            {t.name}
          </button>
        ))}
      </div>

      {pinned.length > 0 && section("📌 Épinglées", pinned)}
      {section("À faire", pending, "Rien en attente : tout est clôturé.")}
      {done.length > 0 && section("Faites", done)}

      {creating && (
        <CreateModal
          isManager={isManager}
          day={day < today ? today : day}
          today={today}
          tags={tags}
          places={places}
          onClose={() => setCreating(false)}
          onCreated={async () => {
            setCreating(false);
            await load(day);
          }}
        />
      )}
      {pinPrompt && (
        <PinModal
          prompt={pinPrompt}
          today={today}
          onClose={() => setPinPrompt(null)}
          onConfirm={async (pin, until) => {
            const result = await act(pinPrompt.id, pinPrompt.action, until ? { until } : {}, pin);
            if (!result.error) setPinPrompt(null);
            return result;
          }}
        />
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6 print:hidden">
      <div className="absolute inset-0 bg-[#12202a]/60 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-sand-card p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display italic text-2xl text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fermer" className="h-10 w-10 rounded-full text-2xl text-ink/40 hover:bg-sand hover:text-ink">×</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function PinField({ value, onChange }) {
  return (
    <label className="grid gap-1.5">
      <span className={fieldLabel}>Votre PIN</span>
      <input
        required
        type="password"
        inputMode="numeric"
        autoComplete="off"
        pattern="\d{4}"
        maxLength={4}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        className="input w-32 text-center text-xl tracking-[0.5em]"
        aria-label="Votre PIN à 4 chiffres"
      />
    </label>
  );
}

function PinModal({ prompt, today, onClose, onConfirm }) {
  const [pin, setPin] = useState("");
  const [until, setUntil] = useState(addDays(today, 7));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const titles = { close: "Clôturer la consigne", pin: "Épingler la consigne", unpin: "Désépingler la consigne" };

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    const result = await onConfirm(pin, prompt.needsDate ? until : null);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      setPin("");
    }
  }

  return (
    <Modal title={titles[prompt.action]} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        {prompt.needsDate && (
          <label className="grid gap-1.5">
            <span className={fieldLabel}>Épinglée jusqu'au</span>
            <input type="date" required min={today} value={until} onChange={(e) => setUntil(e.target.value)} className="input w-auto" />
          </label>
        )}
        <PinField value={pin} onChange={setPin} />
        {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        <button type="submit" disabled={busy || pin.length !== 4} className="rounded bg-aqua-deep px-5 py-3 font-bold text-sand-card disabled:opacity-60">
          {busy ? "…" : "Valider"}
        </button>
      </form>
    </Modal>
  );
}

function CreateModal({ isManager, day, today, tags, places, onClose, onCreated }) {
  const [form, setForm] = useState({ body: "", kind: "info", place: "", tagIds: [], priority: false, day, pinnedUntil: "", pin: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const toggleTag = (id) => set("tagIds", form.tagIds.includes(id) ? form.tagIds.filter((t) => t !== id) : [...form.tagIds, id]);

  async function submit(e) {
    e.preventDefault();
    const place = places.find((p) => p.name.toLowerCase() === form.place.trim().toLowerCase());
    if (!place) return setError("Choisissez une chambre ou un lieu de la liste (ex : 214, Spa, Bar).");
    setBusy(true);
    setError("");
    const result = await send("/api/hotel/consignes", "POST", {
      body: form.body,
      kind: form.kind,
      placeId: place.id,
      tagIds: form.tagIds,
      priority: form.priority,
      day: form.day,
      pinnedUntil: form.pinnedUntil || undefined,
      pin: form.pin,
    });
    setBusy(false);
    if (result.error) {
      setError(result.error);
      set("pin", "");
      return;
    }
    onCreated();
  }

  return (
    <Modal title="Nouvelle consigne" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <label className="grid gap-1.5">
          <span className={fieldLabel}>Consigne</span>
          <textarea required autoFocus rows={4} maxLength={2000} value={form.body} onChange={(e) => set("body", e.target.value)} className="input" />
        </label>

        <div className="grid gap-1.5">
          <span className={fieldLabel}>Type</span>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button key={k.id} type="button" onClick={() => set("kind", k.id)} className={`rounded-full border px-4 py-1.5 text-sm font-bold ${form.kind === k.id ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim text-ink/70"}`}>
                {k.label}
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-1.5">
          <span className={fieldLabel}>Chambre ou lieu</span>
          <input required list="hotel-places" value={form.place} onChange={(e) => set("place", e.target.value)} placeholder="214, Spa, Bar…" className="input" />
          <datalist id="hotel-places">{places.map((p) => <option key={p.id} value={p.name} />)}</datalist>
          {places.length === 0 && <span className="text-xs text-terracotta-deep">Aucun lieu configuré : le manager doit d'abord ajouter les chambres.</span>}
        </label>

        <div className="grid gap-1.5">
          <span className={fieldLabel}>Pour qui ? (équipe, poste)</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button key={t.id} type="button" onClick={() => toggleTag(t.id)} className={`rounded-full border px-3 py-1 text-sm font-bold ${form.tagIds.includes(t.id) ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim text-ink/70"}`}>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-bold text-ink">
          <input type="checkbox" checked={form.priority} onChange={(e) => set("priority", e.target.checked)} />
          Prioritaire
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className={fieldLabel}>Pour le jour</span>
            <input type="date" min={today} value={form.day} onChange={(e) => set("day", e.target.value)} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className={fieldLabel}>Épingler jusqu'au (facultatif)</span>
            <input type="date" min={form.day} value={form.pinnedUntil} onChange={(e) => set("pinnedUntil", e.target.value)} className="input" />
          </label>
        </div>

        {!isManager && <PinField value={form.pin} onChange={(v) => set("pin", v)} />}
        {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        <button type="submit" disabled={busy || (!isManager && form.pin.length !== 4)} className="rounded bg-terracotta px-5 py-3 font-bold text-ink hover:bg-terracotta-deep disabled:opacity-60">
          {busy ? "Enregistrement…" : "Enregistrer la consigne"}
        </button>
      </form>
    </Modal>
  );
}
