"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, formatDayLong } from "@/lib/hotelTime";

// Une seule famille d'icônes, trait de 1.75 : les glyphes Unicode (✓ ‹ 📌)
// changent d'aspect d'un poste à l'autre, pas ces tracés.
function Icon({ children, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}
const I = {
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>,
  tache: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  probleme: <><path d="M12 4 3 19.5h18L12 4Z" /><path d="M12 10v4.5" /><path d="M12 17.5h.01" /></>,
  plainte: <><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /><path d="M8.5 9.5h7" /><path d="M8.5 12.5h4" /></>,
  pin: <><path d="M9 4h6l-1 5 3 3v1.5H7V12l3-3-1-5Z" /><path d="M12 13.5V20" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  prev: <path d="m14 6-6 6 6 6" />,
  next: <path d="m10 6 6 6-6 6" />,
  print: <><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="8" rx="2" /><path d="M7 14h10v6H7z" /></>,
  download: <><path d="M12 4v10" /><path d="m8 11 4 4 4-4" /><path d="M5 19h14" /></>,
  close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  undo: <><path d="M9 7 4 12l5 5" /><path d="M4 12h10a6 6 0 0 1 0 12" transform="translate(0 -5)" /></>,
};

const KINDS = [
  { id: "info", label: "Info" },
  { id: "tache", label: "Tâche" },
  { id: "probleme", label: "Problème" },
  { id: "plainte", label: "Plainte" },
];
const kindLabel = Object.fromEntries(KINDS.map((k) => [k.id, k.label]));
const kindTone = {
  info: "bg-aqua-deep/10 text-aqua-deep",
  tache: "bg-ink/[0.07] text-ink/80",
  probleme: "bg-terracotta/25 text-terracotta-deep",
  plainte: "bg-terracotta-deep text-sand-card",
};

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-deep";
const fieldLabel = "text-xs font-bold uppercase tracking-wider text-ink/60";
const iconBtn = `flex h-11 w-11 items-center justify-center rounded-lg border border-sand-dim bg-sand text-ink/70 transition-colors hover:border-aqua-deep hover:text-aqua-deep ${focus}`;
const ghostBtn = `inline-flex h-11 items-center gap-2 rounded-lg border border-sand-dim bg-sand px-4 text-sm font-bold text-ink/70 transition-colors hover:border-aqua-deep hover:text-aqua-deep ${focus}`;

const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });

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
  const [pinPrompt, setPinPrompt] = useState(null);
  const tagName = useMemo(() => Object.fromEntries(tags.map((t) => [t.id, t.name])), [tags]);

  const load = useCallback(async (d) => {
    const res = await fetch(`/api/hotel/cahier?day=${d}`, { cache: "no-store" });
    if (res.ok) setItems((await res.json()).items);
  }, []);

  useEffect(() => {
    if (day === today) return;
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
  const urgent = (i) => i.priority || i.carried;
  const pending = rest
    .filter((i) => !i.done)
    .sort((a, b) => Number(urgent(b)) - Number(urgent(a)) || a.createdAt.localeCompare(b.createdAt));
  const done = rest.filter((i) => i.done);
  const counts = {
    pending: items.filter((i) => !i.done).length,
    urgent: items.filter((i) => !i.done && urgent(i)).length,
    pinned: items.filter((i) => i.pinned).length,
    done: items.filter((i) => i.done).length,
  };

  async function act(id, action, extra, pin) {
    const result = await send(`/api/hotel/consignes/${id}`, "PATCH", { action, pin, ...extra });
    if (!result.error) await load(day);
    return result;
  }
  function request(action, id) {
    if (isManager) return act(id, action);
    setPinPrompt({ action, id });
  }

  const card = (c) => (
    <li
      key={c.id}
      className={`rounded-xl border bg-sand p-4 print:break-inside-avoid ${
        c.done ? "border-sand-dim text-ink/60" : urgent(c) ? "border-terracotta-deep/50" : "border-sand-dim"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${kindTone[c.kind]}`} title={kindLabel[c.kind]}>
          <Icon>{I[c.kind]}</Icon>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="rounded-md bg-ink px-2.5 py-0.5 text-base font-bold tabular-nums text-sand">{c.placeName}</span>
            <span className="text-sm font-bold text-ink/70">{kindLabel[c.kind]}</span>
            {urgent(c) && !c.done && (
              <span className="inline-flex items-center gap-1 rounded-md bg-terracotta-deep px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-sand-card">
                Prioritaire{c.carried ? ` · ouverte depuis ${c.daysOpen} j` : ""}
              </span>
            )}
            <span className="ml-auto text-xs tabular-nums text-ink/50">
              {c.carried ? `${dateFmt.format(new Date(`${c.day}T12:00:00Z`))} · ` : ""}
              {timeFmt.format(new Date(c.createdAt))}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap break-words text-ink">{c.body}</p>
          {(c.tagIds.length > 0 || c.pinnedUntil) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              {c.tagIds.map((id) => tagName[id] && (
                <span key={id} className="rounded-md bg-sand-card px-2 py-0.5 font-bold text-ink/60">{tagName[id]}</span>
              ))}
              {c.pinned && c.pinnedUntil && (
                <span className="text-ink/50">épinglée jusqu'au {dateFmt.format(new Date(c.pinnedUntil))}</span>
              )}
            </div>
          )}
          {isManager && (
            <p className="mt-2 text-xs text-ink/50">
              Écrite par {c.createdByName}
              {c.closedByName ? ` · clôturée par ${c.closedByName}${c.closedAt ? ` à ${timeFmt.format(new Date(c.closedAt))}` : ""}` : ""}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 print:hidden">
        {!c.done ? (
          <button type="button" onClick={() => request("close", c.id)} className={`inline-flex h-11 items-center gap-2 rounded-lg bg-aqua-deep px-5 text-sm font-bold text-sand-card transition-colors hover:bg-aqua-deep/90 ${focus}`}>
            <Icon className="h-4 w-4">{I.check}</Icon> Clôturer
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-aqua-deep">
            <Icon className="h-4 w-4">{I.check}</Icon> Faite{!isManager && c.closedAt ? ` à ${timeFmt.format(new Date(c.closedAt))}` : ""}
          </span>
        )}
        {c.done && isManager && (
          <button type="button" onClick={() => request("reopen", c.id)} className={`${ghostBtn} h-9 px-3`}>
            <Icon className="h-4 w-4">{I.undo}</Icon> Rouvrir
          </button>
        )}
        {c.pinned ? (
          <button type="button" onClick={() => request("unpin", c.id)} className={`${ghostBtn} h-9 px-3`}>
            <Icon className="h-4 w-4">{I.pin}</Icon> Désépingler
          </button>
        ) : (
          !c.done && (
            <button type="button" onClick={() => setPinPrompt({ action: "pin", id: c.id, needsDate: true })} className={`${ghostBtn} h-9 px-3`} title="Épingler pour toutes les équipes">
              <Icon className="h-4 w-4">{I.pin}</Icon> Épingler
            </button>
          )
        )}
      </div>
    </li>
  );

  const column = (title, list, count, empty) => (
    <section className="min-w-0 print:mt-4">
      <h2 className="flex items-baseline gap-2 text-lg font-bold text-ink">
        {title} <span className="text-sm font-normal tabular-nums text-ink/50">{count}</span>
      </h2>
      {list.length === 0 ? (
        empty
      ) : (
        <ul className="mt-3 grid gap-3">{list.map(card)}</ul>
      )}
    </section>
  );

  const filterChip = (id, label) => (
    <button
      key={id ?? "all"}
      type="button"
      onClick={() => setTagFilter(tagFilter === id ? null : id)}
      aria-pressed={tagFilter === id}
      className={`rounded-lg border px-3 py-1.5 text-sm font-bold transition-colors ${focus} ${
        tagFilter === id ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim bg-sand text-ink/70 hover:border-aqua-deep"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setDay(addDays(day, -1))} aria-label="Jour précédent" className={iconBtn}>
            <Icon>{I.prev}</Icon>
          </button>
          <input type="date" value={day} onChange={(e) => e.target.value && setDay(e.target.value)} className="input h-11 w-auto" aria-label="Choisir un jour" />
          <button type="button" onClick={() => setDay(addDays(day, 1))} aria-label="Jour suivant" className={iconBtn}>
            <Icon>{I.next}</Icon>
          </button>
          {day !== today && (
            <button type="button" onClick={() => setDay(today)} className={ghostBtn}>Aujourd'hui</button>
          )}
        </div>
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={() => window.print()} className={ghostBtn}>
            <Icon className="h-4 w-4">{I.print}</Icon> Imprimer la journée
          </button>
          <a href={`/api/hotel/pdf?day=${day}`} className={ghostBtn}>
            <Icon className="h-4 w-4">{I.download}</Icon> PDF
          </a>
        </div>
      </div>

      <h1 className="mt-5 font-display italic text-3xl text-ink first-letter:uppercase sm:text-4xl">{formatDayLong(day)}</h1>
      <p className="hidden text-sm text-ink/60 print:block">{hotelName} — cahier de consignes</p>

      <button
        type="button"
        onClick={() => setCreating(true)}
        className={`mt-6 flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-terracotta text-ink shadow-[0_6px_16px_-8px_rgba(120,60,20,0.5)] transition active:scale-[0.99] hover:bg-terracotta-deep print:hidden ${focus}`}
      >
        <Icon className="h-7 w-7">{I.plus}</Icon>
        <span className="text-base font-bold uppercase tracking-wide">Nouvelle consigne</span>
      </button>

      <div className="mt-6 grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside className="flex flex-col gap-5 print:hidden">
          <div>
            <dl className="grid content-start gap-1.5 text-sm">
              {[
                ["À faire", counts.pending, ""],
                ["Prioritaires", counts.urgent, counts.urgent > 0 ? "text-terracotta-deep" : ""],
                ["Épinglées", counts.pinned, ""],
                ["Faites", counts.done, "text-aqua-deep"],
              ].map(([label, value, tone]) => (
                <div key={label} className="flex items-baseline justify-between gap-3 border-b border-sand-dim pb-1.5">
                  <dt className="text-ink/70">{label}</dt>
                  <dd className={`text-xl font-bold tabular-nums ${tone || "text-ink"}`}>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <p className={fieldLabel}>Filtrer</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {filterChip(null, "Tout")}
              {tags.map((t) => filterChip(t.id, t.name))}
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          {pinned.length > 0 && (
            <section className="mb-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <Icon className="h-5 w-5 text-terracotta-deep">{I.pin}</Icon> Pour toutes les équipes
                <span className="text-sm font-normal tabular-nums text-ink/50">{pinned.length}</span>
              </h2>
              <ul className="mt-3 grid gap-3 md:grid-cols-2">{pinned.map(card)}</ul>
            </section>
          )}

          <div className="grid gap-8 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] print:block">
            {column(
              "À faire",
              pending,
              pending.length,
              <div className="mt-3 rounded-xl border border-dashed border-sand-dim bg-sand p-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-aqua-deep/10 text-aqua-deep">
                  <Icon className="h-6 w-6">{I.check}</Icon>
                </span>
                <p className="mt-3 font-bold text-ink">Rien en attente</p>
                <p className="mt-1 text-sm text-ink/60">Tout est clôturé pour {day === today ? "aujourd'hui" : "ce jour"}.</p>
              </div>,
            )}
            {column(
              "Faites",
              done,
              done.length,
              <p className="mt-3 text-sm text-ink/60">Les consignes clôturées apparaissent ici.</p>,
            )}
          </div>
        </div>
      </div>

      {creating && (
        <CreateDrawer
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
        <PinDrawer
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

// Panneau latéral : le cahier reste visible derrière, on écrit sans perdre
// le contexte de la journée. Échap ferme.
function Drawer({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex justify-end print:hidden">
      <div className="absolute inset-0 bg-[#12202a]/50" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative z-10 flex h-full w-full max-w-md flex-col overflow-y-auto bg-sand-card p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display italic text-2xl text-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Fermer" className={iconBtn}>
            <Icon>{I.close}</Icon>
          </button>
        </div>
        <div className="mt-5">{children}</div>
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
        className="input h-14 w-40 text-center text-2xl tracking-[0.5em]"
        aria-label="Votre PIN à 4 chiffres"
      />
    </label>
  );
}

function PinDrawer({ prompt, today, onClose, onConfirm }) {
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
    <Drawer title={titles[prompt.action]} onClose={onClose}>
      <form onSubmit={submit} className="grid gap-5">
        {prompt.needsDate && (
          <label className="grid gap-1.5">
            <span className={fieldLabel}>Épinglée jusqu'au</span>
            <input type="date" required min={today} value={until} onChange={(e) => setUntil(e.target.value)} className="input h-11 w-auto" />
          </label>
        )}
        <PinField value={pin} onChange={setPin} />
        {error && <p className="text-sm font-bold text-terracotta-deep" role="alert">{error}</p>}
        <button type="submit" disabled={busy || pin.length !== 4} className={`h-12 rounded-lg bg-aqua-deep px-5 font-bold text-sand-card disabled:opacity-50 ${focus}`}>
          {busy ? "…" : "Valider"}
        </button>
      </form>
    </Drawer>
  );
}

function CreateDrawer({ isManager, day, today, tags, places, onClose, onCreated }) {
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

  const chip = (active) =>
    `inline-flex min-h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-bold transition-colors ${focus} ${
      active ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim bg-sand text-ink/70 hover:border-aqua-deep"
    }`;

  return (
    <Drawer title="Nouvelle consigne" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-5">
        <label className="grid gap-1.5">
          <span className={fieldLabel}>Consigne</span>
          <textarea required autoFocus rows={4} maxLength={2000} value={form.body} onChange={(e) => set("body", e.target.value)} className="input" />
        </label>

        <div className="grid gap-1.5">
          <span className={fieldLabel}>Type</span>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button key={k.id} type="button" aria-pressed={form.kind === k.id} onClick={() => set("kind", k.id)} className={chip(form.kind === k.id)}>
                <Icon className="h-4 w-4">{I[k.id]}</Icon> {k.label}
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-1.5">
          <span className={fieldLabel}>Chambre ou lieu</span>
          <input required list="hotel-places" value={form.place} onChange={(e) => set("place", e.target.value)} placeholder="214, Spa, Bar…" className="input h-11" />
          <datalist id="hotel-places">{places.map((p) => <option key={p.id} value={p.name} />)}</datalist>
          {places.length === 0 && <span className="text-xs text-terracotta-deep">Aucun lieu configuré : le manager doit d'abord ajouter les chambres.</span>}
        </label>

        <div className="grid gap-1.5">
          <span className={fieldLabel}>Pour qui ? (équipe, poste)</span>
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <button key={t.id} type="button" aria-pressed={form.tagIds.includes(t.id)} onClick={() => toggleTag(t.id)} className={chip(form.tagIds.includes(t.id))}>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <label className="flex min-h-10 items-center gap-3 text-sm font-bold text-ink">
          <input type="checkbox" checked={form.priority} onChange={(e) => set("priority", e.target.checked)} className="h-5 w-5 accent-[var(--terracotta-deep)]" />
          Prioritaire
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className={fieldLabel}>Pour le jour</span>
            <input type="date" min={today} value={form.day} onChange={(e) => set("day", e.target.value)} className="input h-11" />
          </label>
          <label className="grid gap-1.5">
            <span className={fieldLabel}>Épingler jusqu'au</span>
            <input type="date" min={form.day} value={form.pinnedUntil} onChange={(e) => set("pinnedUntil", e.target.value)} className="input h-11" />
          </label>
        </div>

        {!isManager && <PinField value={form.pin} onChange={(v) => set("pin", v)} />}
        {error && <p className="text-sm font-bold text-terracotta-deep" role="alert">{error}</p>}
        <button type="submit" disabled={busy || (!isManager && form.pin.length !== 4)} className={`h-12 rounded-lg bg-terracotta px-5 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-50 ${focus}`}>
          {busy ? "Enregistrement…" : "Enregistrer la consigne"}
        </button>
      </form>
    </Drawer>
  );
}
