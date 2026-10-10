"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, formatDayLong } from "@/lib/hotelTime";
import { Icon } from "./CahierIcons";
import NewConsigne from "./NewConsigne";
import PinPad from "./PinPad";

const KIND_LABEL = { info: "Information", tache: "À faire", probleme: "Problème", plainte: "Plainte client" };
const KIND_TONE = {
  info: "bg-aqua-deep/10 text-aqua-deep",
  tache: "bg-ink/[0.08] text-ink",
  probleme: "bg-terracotta/30 text-terracotta-deep",
  plainte: "bg-terracotta-deep text-sand-card",
};
const focus = "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-aqua-deep";
const bigBtn = `flex min-h-14 items-center justify-center gap-3 rounded-2xl px-5 text-xl font-bold transition active:scale-[0.98] ${focus}`;
const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

async function patch(id, body) {
  const res = await fetch(`/api/hotel/consignes/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  return res.ok ? { ok: true } : { error: res.status === 403 ? "Ce code n'est pas bon. Essayez encore." : data.error || "Une erreur est survenue. Réessayez." };
}

// Un écran, une action principale : écrire. Le reste se lit de haut en bas :
// d'abord ce qui est important pour tous, puis ce qu'il reste à faire.
export default function CahierClient({ hotelName, mode, today, initialItems, tags, places }) {
  const isManager = mode === "manager";
  const [day, setDay] = useState(today);
  const [items, setItems] = useState(initialItems);
  const [creating, setCreating] = useState(false);
  const [sheet, setSheet] = useState(null); // { id, action, until? }
  const [sheetError, setSheetError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [team, setTeam] = useState("");
  const [notice, setNotice] = useState("");
  const tagName = useMemo(() => Object.fromEntries(tags.map((t) => [t.id, t.name])), [tags]);
  const shifts = tags.filter((t) => t.kind === "shift");

  const load = useCallback(async (d) => {
    const res = await fetch(`/api/hotel/cahier?day=${d}`, { cache: "no-store" });
    if (res.ok) setItems((await res.json()).items);
  }, []);

  useEffect(() => {
    if (day === today) return;
    load(day);
  }, [day, today, load]);

  // Le poste de réception reste ouvert toute la journée : la page se met à jour
  // toute seule pour que les messages des autres équipes apparaissent.
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") load(day);
    }, 60000);
    return () => clearInterval(timer);
  }, [day, load]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const scoped = team ? items.filter((i) => i.tagIds.some((id) => tagName[id] === team)) : items;
  // Une consigne importante déjà terminée n'a plus à rester en haut de page.
  const pinned = scoped.filter((i) => i.pinned && !i.done);
  const rest = scoped.filter((i) => !(i.pinned && !i.done));
  const urgent = (i) => i.priority || i.carried;
  const pending = rest.filter((i) => !i.done).sort((a, b) => Number(urgent(b)) - Number(urgent(a)) || a.createdAt.localeCompare(b.createdAt));
  const done = rest.filter((i) => i.done);
  const todoCount = scoped.filter((i) => !i.done).length;

  async function run(id, body) {
    setBusy(true);
    setSheetError("");
    const result = await patch(id, body);
    setBusy(false);
    if (result.error) {
      setSheetError(result.error);
      return false;
    }
    await load(day);
    return true;
  }

  // Le manager est identifié d'office ; sur le poste de réception, on demande
  // le code à 4 chiffres, une fois par action.
  async function request(id, action, extra = {}) {
    if (isManager && !(action === "pin" && !extra.until)) {
      const ok = await run(id, { action, ...extra });
      if (ok) setNotice(action === "close" ? "C'est noté, merci !" : "C'est fait.");
      return;
    }
    setSheetError("");
    setSheet({ id, action, ...extra });
  }

  async function confirmWithPin(pin) {
    const ok = await run(sheet.id, { action: sheet.action, until: sheet.until, pin });
    if (ok) {
      setNotice(sheet.action === "close" ? "C'est noté, merci !" : "C'est fait.");
      setSheet(null);
    }
  }

  const dayLabel = day === today ? "Aujourd'hui" : day === addDays(today, -1) ? "Hier" : day === addDays(today, 1) ? "Demain" : null;

  const card = (c) => (
    <li key={c.id} className={`rounded-3xl border-2 bg-sand p-5 print:break-inside-avoid ${c.done ? "border-sand-dim" : urgent(c) ? "border-terracotta-deep" : "border-sand-dim"}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="rounded-xl bg-ink px-3 py-1 text-2xl font-bold tabular-nums text-sand">{c.placeName}</span>
        <span className={`rounded-xl px-3 py-1 text-lg font-bold ${KIND_TONE[c.kind]}`}>{KIND_LABEL[c.kind]}</span>
        {urgent(c) && !c.done && (
          <span className="rounded-xl bg-terracotta-deep px-3 py-1 text-lg font-bold text-sand-card">
            {c.carried ? `Pas fait depuis ${c.daysOpen} jour${c.daysOpen > 1 ? "s" : ""}` : "Urgent"}
          </span>
        )}
        <span className="ml-auto text-lg tabular-nums text-ink/60">{timeFmt.format(new Date(c.createdAt))}</span>
      </div>
      <p className="mt-3 whitespace-pre-wrap break-words text-2xl leading-snug text-ink">{c.body}</p>
      {c.tagIds.length > 0 && (
        <p className="mt-2 text-lg text-ink/60">Pour : {c.tagIds.map((id) => tagName[id]).filter(Boolean).join(", ")}</p>
      )}
      {isManager && (c.createdByName || c.closedByName) && (
        <p className="mt-1 text-base text-ink/50">
          Écrit par {c.createdByName}
          {c.closedByName ? ` · terminé par ${c.closedByName}` : ""}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3 print:hidden">
        {!c.done ? (
          <button type="button" onClick={() => request(c.id, "close")} className={`${bigBtn} w-full bg-aqua-deep text-sand-card hover:bg-aqua-deep/90 sm:w-auto`}>
            <Icon name="check" className="h-7 w-7" /> C'est fait
          </button>
        ) : (
          <span className="flex items-center gap-2 text-xl font-bold text-aqua-deep">
            <Icon name="check" className="h-7 w-7" /> Terminé{c.closedAt ? ` à ${timeFmt.format(new Date(c.closedAt))}` : ""}
          </span>
        )}
        {c.done && isManager && (
          <button type="button" onClick={() => request(c.id, "reopen")} className={`${bigBtn} border-2 border-sand-dim text-ink/70`}>Remettre à faire</button>
        )}
        {c.pinned ? (
          <button type="button" onClick={() => request(c.id, "unpin")} className={`${bigBtn} border-2 border-sand-dim text-ink/70`}>Ne plus garder en haut</button>
        ) : (
          !c.done && (
            <button type="button" onClick={() => request(c.id, "pin")} className={`${bigBtn} border-2 border-sand-dim text-ink/70`}>
              <Icon name="pin" className="h-6 w-6" /> Garder en haut
            </button>
          )
        )}
      </div>
    </li>
  );

  return (
    <div>
      {notice && (
        <div role="status" className="fixed inset-x-0 top-4 z-50 mx-auto w-fit max-w-[90vw] rounded-2xl bg-ink px-6 py-4 text-xl font-bold text-sand shadow-xl print:hidden">
          <span className="flex items-center gap-3"><Icon name="check" className="h-7 w-7" /> {notice}</span>
        </div>
      )}

      <h1 className="text-4xl font-bold text-ink">{dayLabel ?? formatDayLong(day)}</h1>
      {dayLabel && <p className="mt-1 text-2xl capitalize text-ink/70">{formatDayLong(day)}</p>}
      <p className="mt-3 text-2xl font-bold text-ink">
        {todoCount === 0 ? (
          <span className="text-aqua-deep">Tout est à jour. Merci !</span>
        ) : (
          <>Il reste {todoCount} chose{todoCount > 1 ? "s" : ""} à faire.</>
        )}
      </p>

      <button type="button" onClick={() => setCreating(true)} className={`mt-6 flex h-24 w-full items-center justify-center gap-4 rounded-3xl bg-terracotta text-3xl font-bold text-ink shadow-[0_8px_20px_-10px_rgba(120,60,20,0.6)] transition active:scale-[0.99] hover:bg-terracotta-deep print:hidden ${focus}`}>
        <Icon name="plus" className="h-10 w-10" /> Écrire une consigne
      </button>

      <div className="mt-4 flex flex-wrap gap-3 print:hidden">
        <button type="button" onClick={() => setDay(addDays(day, -1))} className={`${bigBtn} border-2 border-sand-dim bg-sand text-ink`}><Icon name="back" className="h-6 w-6" /> Hier</button>
        {day !== today && <button type="button" onClick={() => setDay(today)} className={`${bigBtn} border-2 border-aqua-deep bg-sand text-aqua-deep`}>Aujourd'hui</button>}
        <button type="button" onClick={() => setDay(addDays(day, 1))} className={`${bigBtn} border-2 border-sand-dim bg-sand text-ink`}>Demain <Icon name="next" className="h-6 w-6" /></button>
        <button type="button" onClick={() => setShowDate((v) => !v)} className={`${bigBtn} text-ink/70 underline underline-offset-4`}>Choisir un autre jour</button>
      </div>
      {showDate && (
        <input type="date" value={day} onChange={(e) => e.target.value && (setDay(e.target.value), setShowDate(false))} aria-label="Choisir un jour" className="mt-3 h-16 w-auto rounded-2xl border-2 border-sand-dim bg-sand px-5 text-xl text-ink print:hidden" />
      )}

      {pinned.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-3 text-3xl font-bold text-ink"><Icon name="pin" className="h-8 w-8 text-terracotta-deep" /> Important pour tout le monde</h2>
          <ul className="mt-4 grid gap-4">{pinned.map(card)}</ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-3xl font-bold text-ink">À faire <span className="text-ink/50">({pending.length})</span></h2>
        {pending.length === 0 ? (
          <p className="mt-4 rounded-3xl border-2 border-dashed border-sand-dim bg-sand p-8 text-center text-2xl text-ink/70">Rien à faire pour le moment.</p>
        ) : (
          <ul className="mt-4 grid gap-4">{pending.map(card)}</ul>
        )}
      </section>

      {done.length > 0 && (
        <section className="mt-10">
          <button type="button" onClick={() => setShowDone((v) => !v)} aria-expanded={showDone} className={`flex w-full items-center justify-between rounded-2xl border-2 border-sand-dim bg-sand px-5 py-4 text-left text-2xl font-bold text-ink print:hidden ${focus}`}>
            <span>Déjà fait ({done.length})</span>
            <span className="text-lg text-aqua-deep">{showDone ? "Cacher" : "Voir"}</span>
          </button>
          <ul className={`mt-4 grid gap-4 ${showDone ? "" : "hidden print:grid"}`}>{done.map(card)}</ul>
        </section>
      )}

      <section className="mt-12 print:hidden">
        <button type="button" onClick={() => setShowTools((v) => !v)} aria-expanded={showTools} className={`${bigBtn} border-2 border-sand-dim bg-sand text-ink`}>
          <Icon name="print" className="h-6 w-6" /> Imprimer ou télécharger
        </button>
        {showTools && (
          <div className="mt-4 grid gap-3 rounded-3xl border-2 border-sand-dim bg-sand p-5">
            <button type="button" onClick={() => window.print()} className={`${bigBtn} justify-start border-2 border-sand-dim bg-sand text-ink`}><Icon name="print" className="h-7 w-7" /> Imprimer cette journée</button>
            <a href={`/api/hotel/pdf?day=${day}`} className={`${bigBtn} justify-start border-2 border-sand-dim bg-sand text-ink`}><Icon name="download" className="h-7 w-7" /> Télécharger en PDF</a>
            <a href={`/api/hotel/cahier-csv?day=${day}`} className={`${bigBtn} justify-start border-2 border-sand-dim bg-sand text-ink`}><Icon name="download" className="h-7 w-7" /> Télécharger pour Excel</a>
            {shifts.length > 0 && (
              <div className="mt-2">
                <p className="text-xl font-bold text-ink">Voir seulement une équipe :</p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button type="button" aria-pressed={team === ""} onClick={() => setTeam("")} className={`${bigBtn} border-2 ${team === "" ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim bg-sand text-ink"}`}>Tout le monde</button>
                  {shifts.map((s) => (
                    <button key={s.id} type="button" aria-pressed={team === s.name} onClick={() => setTeam(s.name)} className={`${bigBtn} border-2 ${team === s.name ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim bg-sand text-ink"}`}>{s.name[0].toUpperCase() + s.name.slice(1)}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {creating && (
        <NewConsigne
          isManager={isManager}
          today={today}
          defaultDay={day < today ? today : day}
          tags={tags}
          places={places}
          onClose={() => setCreating(false)}
          onCreated={() => { setCreating(false); setNotice("C'est enregistré !"); load(day); }}
        />
      )}

      {sheet && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#12202a]/60 sm:items-center print:hidden" role="dialog" aria-modal="true">
          <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-sand-card p-6 sm:rounded-3xl">
            {sheet.action === "pin" && !sheet.until ? (
              <>
                <h2 className="text-3xl font-bold text-ink">Garder en haut combien de temps ?</h2>
                <div className="mt-5 grid gap-3">
                  {[[1, "1 jour"], [7, "1 semaine"], [30, "1 mois"]].map(([n, text]) => (
                    <button key={n} type="button" onClick={() => (isManager ? (setSheet(null), run(sheet.id, { action: "pin", until: addDays(today, n) }).then((ok) => ok && setNotice("C'est fait."))) : setSheet({ ...sheet, until: addDays(today, n) }))} className={`${bigBtn} border-2 border-sand-dim bg-sand text-ink hover:border-aqua-deep`}>{text}</button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-center text-3xl font-bold text-ink">
                  {sheet.action === "close" ? "Qui a fait ça ?" : "Votre code personnel"}
                </h2>
                <p className="mb-5 mt-2 text-center text-xl text-ink/70">Tapez votre code à 4 chiffres.</p>
                <PinPad busy={busy} message={sheetError} onComplete={confirmWithPin} />
              </>
            )}
            <button type="button" onClick={() => setSheet(null)} className={`${bigBtn} mt-6 w-full text-ink/70 underline underline-offset-4`}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
}
