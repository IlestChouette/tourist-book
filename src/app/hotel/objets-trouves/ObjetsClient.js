"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { resizeImage } from "@/lib/uploadMedia";
import { CATEGORIES, CHOICE_LABELS, STATUSES } from "@/lib/lostFound";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-deep";
const label = "text-xs font-bold uppercase tracking-wider text-ink/60";
const ghost = `inline-flex h-11 items-center gap-2 rounded-lg border border-sand-dim bg-sand px-4 text-sm font-bold text-ink/70 transition-colors hover:border-aqua-deep hover:text-aqua-deep ${focus}`;
const primary = `inline-flex h-11 items-center gap-2 rounded-lg bg-aqua-deep px-5 text-sm font-bold text-sand-card transition-colors hover:bg-aqua-deep/90 disabled:opacity-60 ${focus}`;

const statusTone = {
  a_traiter: "bg-terracotta-deep text-sand-card",
  garde: "bg-aqua-deep/10 text-aqua-deep",
  client_averti: "bg-[#5b6fc7]/15 text-[#3d4f9f]",
  rendu: "bg-ink/[0.07] text-ink/70",
  envoye: "bg-ink/[0.07] text-ink/70",
  detruit: "bg-ink/[0.07] text-ink/70",
};
const dayFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" });
const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const toInputDate = (iso) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(iso));

async function call(url, method, body) {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return res.ok ? { ok: true } : { error: data.error || "Une erreur est survenue." };
}

function overRetention(item, months) {
  const limit = new Date(item.found_at);
  limit.setMonth(limit.getMonth() + months);
  return !item.closed_at && limit < new Date();
}

export default function ObjetsClient({ initialItems, retentionMonths, isManager }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState("open");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);
  const [adding, setAdding] = useState(false);

  const reload = useCallback(async () => {
    const res = await fetch("/api/lost-found/items", { cache: "no-store" });
    if (res.ok) setItems((await res.json()).items);
  }, []);

  // Écran partagé : le registre se met à jour tout seul, sans recharger.
  useEffect(() => {
    const t = setInterval(reload, 30000);
    return () => clearInterval(t);
  }, [reload]);

  const counts = useMemo(
    () => ({
      a_traiter: items.filter((i) => i.status === "a_traiter").length,
      garde: items.filter((i) => i.status === "garde").length,
      client_averti: items.filter((i) => i.status === "client_averti").length,
      closed: items.filter((i) => i.closed_at).length,
      replies: items.filter((i) => i.guest_choice && !i.closed_at).length,
    }),
    [items],
  );

  const q = query.trim().toLowerCase();
  const visible = items
    .filter((i) => {
      if (filter === "open" && i.closed_at) return false;
      if (filter === "closed" && !i.closed_at) return false;
      if (["a_traiter", "garde", "client_averti"].includes(filter) && i.status !== filter) return false;
      if (!q) return true;
      return [i.number, i.room_text, i.description, i.category, i.storage_location, i.guest_name, i.guest_email, i.notes].some((v) => String(v ?? "").toLowerCase().includes(q));
    })
    .sort((a, b) => (a.status === "a_traiter") !== (b.status === "a_traiter") ? (a.status === "a_traiter" ? -1 : 1) : b.found_at.localeCompare(a.found_at));

  const chip = (id, text, n) => (
    <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-bold transition-colors ${focus} ${filter === id ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim bg-sand text-ink/70 hover:border-aqua-deep"}`}>
      {text}
      {n !== undefined && <span className={`rounded-md px-1.5 text-xs tabular-nums ${filter === id ? "bg-sand-card/25" : "bg-ink/[0.07]"}`}>{n}</span>}
    </button>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display italic text-3xl text-ink sm:text-4xl">Objets trouvés</h1>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setAdding((v) => !v)} className={primary}>{adding ? "Fermer" : "+ Nouvel objet"}</button>
          <a href="/api/lost-found/export" className={ghost}>Exporter (Excel)</a>
        </div>
      </div>

      {adding && <NewItem isManager={isManager} onDone={() => { setAdding(false); reload(); }} />}

      {counts.a_traiter > 0 && (
        <p className="mt-5 rounded-xl border border-terracotta-deep/50 bg-sand p-4 font-bold text-terracotta-deep" role="status">
          {counts.a_traiter} objet{counts.a_traiter > 1 ? "s" : ""} à traiter : complétez la chambre, le rangement, puis passez-les en « Gardé ».
        </p>
      )}
      {counts.replies > 0 && (
        <p className="mt-3 rounded-xl border border-aqua-deep/40 bg-sand p-4 font-bold text-aqua-deep" role="status">
          {counts.replies} client{counts.replies > 1 ? "s ont" : " a"} répondu : ouvrez l'objet pour voir son choix.
        </p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {chip("open", "En cours", items.length - counts.closed)}
        {chip("a_traiter", "À traiter", counts.a_traiter)}
        {chip("garde", "Gardés", counts.garde)}
        {chip("client_averti", "Clients avertis", counts.client_averti)}
        {chip("closed", "Clôturés", counts.closed)}
        {chip("all", "Tout")}
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Chercher : chambre, objet, nom…" aria-label="Rechercher" className="input ml-auto h-10 w-full sm:w-72" />
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-sand-dim bg-sand p-10 text-center text-ink/60">Aucun objet ne correspond.</div>
      ) : (
        <ul className="mt-4 grid gap-3">
          {visible.map((i) => (
            <ItemRow key={i.id} item={i} open={openId === i.id} onToggle={() => setOpenId(openId === i.id ? null : i.id)} isManager={isManager} retentionMonths={retentionMonths} onSaved={reload} />
          ))}
        </ul>
      )}
    </div>
  );
}

function PinField({ value, onChange }) {
  return (
    <label className="grid gap-1.5">
      <span className={label}>Votre PIN</span>
      <input type="password" inputMode="numeric" autoComplete="off" maxLength={4} pattern="\d{4}" value={value} onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))} className="input h-12 w-32 text-center text-xl tracking-[0.5em]" aria-label="Votre PIN à 4 chiffres" />
    </label>
  );
}

function NewItem({ isManager, onDone }) {
  const [form, setForm] = useState({ room: "", description: "", pin: "" });
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!photo && !form.description.trim()) return setError("Ajoutez une photo ou une description.");
    setBusy(true);
    setError("");
    const body = new FormData();
    body.append("room", form.room);
    body.append("description", form.description);
    body.append("pin", form.pin);
    if (photo) body.append("photo", await resizeImage(photo));
    const res = await fetch("/api/lost-found/capture", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error || "Une erreur est survenue.");
    onDone();
  }

  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 rounded-xl border border-sand-dim bg-sand p-5 sm:grid-cols-2">
      <label className="grid gap-1.5 sm:col-span-2"><span className={label}>Photo</span><input type="file" accept="image/*" capture="environment" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} /></label>
      <label className="grid gap-1.5"><span className={label}>Chambre</span><input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="input h-11" placeholder="Ex : 214" /></label>
      <label className="grid gap-1.5"><span className={label}>Objet</span><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} className="input h-11" placeholder="Ex : lunettes noires" /></label>
      {!isManager && <PinField value={form.pin} onChange={(v) => setForm({ ...form, pin: v })} />}
      {error && <p className="text-sm font-bold text-terracotta-deep sm:col-span-2" role="alert">{error}</p>}
      <div className="sm:col-span-2"><button type="submit" disabled={busy || (!isManager && form.pin.length !== 4)} className={primary}>{busy ? "Enregistrement…" : "Enregistrer l'objet"}</button></div>
    </form>
  );
}

function ItemRow({ item: i, open, onToggle, isManager, retentionMonths, onSaved }) {
  const late = overRetention(i, retentionMonths);
  return (
    <li className={`rounded-xl border bg-sand ${i.status === "a_traiter" ? "border-terracotta-deep/50" : "border-sand-dim"} ${i.closed_at ? "text-ink/60" : ""}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} className={`flex w-full items-center gap-4 rounded-xl p-4 text-left ${focus}`}>
        {i.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={i.photo_url} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-sand-dim object-cover" />
        ) : (
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-sand-dim text-xs text-ink/40">Pas de photo</span>
        )}
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs tabular-nums text-ink/50">N° {i.number}</span>
            {i.room_text ? (
              <span className={`rounded-md px-2 py-0.5 text-sm font-bold tabular-nums ${i.room_confirmed ? "bg-ink text-sand" : "bg-terracotta/25 text-terracotta-deep"}`} title={i.room_confirmed ? "" : "Chambre à confirmer"}>{i.room_text}{i.room_confirmed ? "" : " ?"}</span>
            ) : (
              <span className="rounded-md bg-terracotta/25 px-2 py-0.5 text-sm font-bold text-terracotta-deep">Chambre ?</span>
            )}
            <span className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${statusTone[i.status]}`}>{STATUSES[i.status]}</span>
            {i.guest_choice && !i.closed_at && <span className="rounded-md bg-aqua-deep px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-sand-card">{CHOICE_LABELS[i.guest_choice]}</span>}
            {late && <span className="rounded-md bg-terracotta-deep px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-sand-card">Délai de conservation dépassé</span>}
          </span>
          <span className="mt-1 block truncate font-bold text-ink">{i.description || "(sans description)"}</span>
          <span className="block text-sm text-ink/60">
            {dayFmt.format(new Date(i.found_at))} · {timeFmt.format(new Date(i.found_at))}
            {i.storage_location ? ` · rangé : ${i.storage_location}` : ""}
          </span>
        </span>
        <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 text-ink/50 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && <Editor item={i} isManager={isManager} onSaved={onSaved} />}
    </li>
  );
}

function Editor({ item: i, isManager, onSaved }) {
  const [f, setF] = useState({
    room: i.room_text ?? "",
    description: i.description ?? "",
    category: i.category ?? "",
    storage: i.storage_location ?? "",
    foundAt: toInputDate(i.found_at),
    guestName: i.guest_name ?? "",
    guestEmail: i.guest_email ?? "",
    notes: i.notes ?? "",
    status: i.status,
    pin: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const needsPin = !isManager;
  const pinOk = !needsPin || f.pin.length === 4;

  async function save(extra = {}, okText = "Enregistré.") {
    setBusy(true);
    setMsg(null);
    const result = await call("/api/lost-found/items", "PATCH", {
      id: i.id,
      pin: f.pin,
      patch: {
        room: f.room,
        description: f.description,
        category: f.category,
        storageLocation: f.storage,
        foundAt: f.foundAt && f.foundAt !== toInputDate(i.found_at) ? `${f.foundAt}T12:00:00` : undefined,
        guestName: f.guestName,
        guestEmail: f.guestEmail,
        notes: f.notes,
        status: f.status,
        ...extra,
      },
    });
    setBusy(false);
    if (result.error) {
      setMsg({ text: result.error, error: true });
      setF((x) => ({ ...x, pin: "" }));
      return false;
    }
    if (extra.status) setF((x) => ({ ...x, status: extra.status }));
    setMsg({ text: okText });
    onSaved();
    return true;
  }

  async function notify() {
    setBusy(true);
    setMsg(null);
    if (!(await save({}, "")) ) return setBusy(false);
    const result = await call("/api/lost-found/notify", "POST", { id: i.id, pin: f.pin });
    setBusy(false);
    if (result.error) return setMsg({ text: result.error, error: true });
    setF((x) => ({ ...x, status: x.status === "a_traiter" || x.status === "garde" ? "client_averti" : x.status }));
    setMsg({ text: "Le client a été averti par email." });
    onSaved();
  }

  const quick = (status, text) => (
    <button type="button" disabled={busy || !pinOk} onClick={() => window.confirm(`${text} cet objet ?`) && save({ status }, `Objet marqué : ${STATUSES[status]}.`)} className={ghost}>{text}</button>
  );

  return (
    <div className="border-t border-sand-dim p-5">
      {i.guest_choice && (
        <div className="mb-5 rounded-lg bg-aqua-deep/10 p-4 text-ink">
          <p className="font-bold text-aqua-deep">Choix du client : {CHOICE_LABELS[i.guest_choice]}</p>
          {i.guest_choice_at && <p className="text-sm text-ink/60">le {dayFmt.format(new Date(i.guest_choice_at))} à {timeFmt.format(new Date(i.guest_choice_at))}</p>}
          {i.guest_address && <p className="mt-2 whitespace-pre-wrap text-sm"><strong>Adresse d'envoi :</strong> {i.guest_address}{i.guest_phone ? ` · ${i.guest_phone}` : ""}</p>}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5"><span className={label}>Chambre</span><input value={f.room} onChange={set("room")} className="input h-11" placeholder="Ex : 214" /></label>
        <label className="grid gap-1.5"><span className={label}>Date où l'objet a été trouvé</span><input type="date" value={f.foundAt} onChange={set("foundAt")} className="input h-11" /></label>
        <label className="grid gap-1.5 sm:col-span-2"><span className={label}>Objet</span><input value={f.description} onChange={set("description")} maxLength={500} className="input h-11" /></label>
        <label className="grid gap-1.5"><span className={label}>Catégorie</span>
          <select value={f.category} onChange={set("category")} className="input h-11"><option value="">—</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label className="grid gap-1.5"><span className={label}>Rangé à (emplacement)</span><input value={f.storage} onChange={set("storage")} className="input h-11" placeholder="Armoire 2, étagère B" /></label>
        <label className="grid gap-1.5"><span className={label}>Nom du client</span><input value={f.guestName} onChange={set("guestName")} className="input h-11" /></label>
        <label className="grid gap-1.5"><span className={label}>Email du client</span><input type="email" value={f.guestEmail} onChange={set("guestEmail")} className="input h-11" /></label>
        <label className="grid gap-1.5 sm:col-span-2"><span className={label}>Notes</span><textarea rows={2} value={f.notes} onChange={set("notes")} className="input" placeholder="Ex : client prévenu par téléphone, passe lundi" /></label>
        <label className="grid gap-1.5"><span className={label}>Statut</span>
          <select value={f.status} onChange={set("status")} className="input h-11">{Object.entries(STATUSES).map(([k, t]) => <option key={k} value={k}>{t}</option>)}</select>
        </label>
        {needsPin && <PinField value={f.pin} onChange={(v) => setF({ ...f, pin: v })} />}
      </div>

      {msg && <p className={`mt-4 text-sm font-bold ${msg.error ? "text-terracotta-deep" : "text-aqua-deep"}`} role="status">{msg.text}</p>}

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" disabled={busy || !pinOk} onClick={() => save()} className={primary}>Enregistrer</button>
        <button type="button" disabled={busy || !pinOk || !f.guestEmail} onClick={notify} className={ghost} title={f.guestEmail ? "" : "Ajoutez l'email du client"}>Avertir le client</button>
        <a href={`/hotel/objets-trouves/etiquette/${i.id}`} target="_blank" rel="noopener noreferrer" className={ghost}>Étiquette</a>
        {!i.closed_at && (
          <>
            {quick("rendu", "Rendu")}
            {quick("envoye", "Envoyé")}
            {quick("detruit", "Détruit / donné")}
          </>
        )}
      </div>
    </div>
  );
}
