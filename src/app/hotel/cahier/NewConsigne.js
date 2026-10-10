"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays } from "@/lib/hotelTime";
import { Icon } from "./CahierIcons";
import PinPad from "./PinPad";

const KINDS = [
  { id: "info", label: "Une information", hint: "À savoir, à transmettre" },
  { id: "tache", label: "Quelque chose à faire", hint: "Une tâche pour un collègue" },
  { id: "probleme", label: "Un problème", hint: "Panne, fuite, objet cassé…" },
  { id: "plainte", label: "Une plainte client", hint: "Un client n'est pas content" },
];
const focus = "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-aqua-deep";
const big = `flex min-h-16 w-full items-center gap-4 rounded-2xl border-2 px-5 py-3 text-left text-xl font-bold transition active:scale-[0.98] ${focus}`;
const tile = (on) => `${big} ${on ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim bg-sand text-ink hover:border-aqua-deep"}`;
// Pas la classe « input » du site : sa taille de texte (15 px) écrase les tailles ici.
const field = "w-full rounded-2xl border-2 border-sand-dim bg-sand px-5 py-3 text-ink focus:border-aqua-deep focus:outline focus:outline-4 focus:outline-aqua-deep/30";
const SHIFTS = [
  { name: "matin", label: "Équipe du matin" },
  { name: "soir", label: "Équipe du soir" },
  { name: "nuit", label: "Équipe de nuit" },
];

// Une seule question par écran, des gros boutons, des mots simples : on peut
// y arriver sans jamais avoir utilisé un ordinateur. Aucune étape n'oblige à
// comprendre ce qui précède ou ce qui suit.
export default function NewConsigne({ isManager, today, defaultDay, tags, places, onClose, onCreated }) {
  const steps = isManager ? ["kind", "place", "message", "who"] : ["kind", "place", "message", "who", "pin"];
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ kind: null, placeName: "", body: "", shift: "", roleIds: [], urgent: false, day: defaultDay, pinDays: 0 });
  const [showMore, setShowMore] = useState(false);
  const [showRoles, setShowRoles] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const current = steps[step];

  const place = useMemo(() => places.find((p) => p.name.toLowerCase() === form.placeName.trim().toLowerCase()), [places, form.placeName]);
  const roles = tags.filter((t) => t.kind !== "shift");
  const shiftTag = (name) => tags.find((t) => t.kind === "shift" && t.name === name);
  const areas = places.filter((p) => p.kind === "area");
  const typed = form.placeName.trim().toLowerCase();
  const suggestions = typed ? places.filter((p) => p.name.toLowerCase().includes(typed)).slice(0, 8) : [];

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(onCreated, 1600);
    return () => clearTimeout(t);
  }, [saved, onCreated]);

  const canNext =
    (current === "kind" && form.kind) ||
    (current === "place" && place) ||
    (current === "message" && form.body.trim().length > 0) ||
    current === "who";

  async function send(pin) {
    setBusy(true);
    setError("");
    const tagIds = [
      ...(form.shift ? [shiftTag(form.shift)?.id].filter(Boolean) : []),
      ...form.roleIds,
    ];
    const res = await fetch("/api/hotel/consignes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: form.body.trim(),
        kind: form.kind,
        placeId: place.id,
        tagIds,
        priority: form.urgent,
        day: form.day,
        pinnedUntil: form.pinDays ? addDays(form.day, form.pinDays) : undefined,
        pin,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(res.status === 403 ? "Ce code n'est pas bon. Essayez encore." : data.error || "Une erreur est survenue. Réessayez.");
      return;
    }
    setSaved(true);
  }

  const next = () => (step < steps.length - 1 ? setStep(step + 1) : null);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-sand-card print:hidden" role="dialog" aria-modal="true" aria-label="Nouvelle consigne">
      <div className="flex items-center justify-between gap-3 border-b-2 border-sand-dim bg-sand px-5 py-3">
        {step > 0 && !saved ? (
          <button type="button" onClick={() => { setError(""); setStep(step - 1); }} className={`flex h-14 items-center gap-2 rounded-xl px-3 text-lg font-bold text-ink ${focus}`}>
            <Icon name="back" /> Retour
          </button>
        ) : (
          <span />
        )}
        {!saved && <span className="text-lg font-bold text-ink/60">Étape {step + 1} sur {steps.length}</span>}
        <button type="button" onClick={onClose} className={`flex h-14 items-center gap-2 rounded-xl px-3 text-lg font-bold text-ink/70 ${focus}`}>
          <Icon name="close" /> Annuler
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        <div className="mx-auto w-full max-w-xl">
          {saved && (
            <div className="mt-16 text-center">
              <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-aqua-deep text-sand-card"><Icon name="check" className="h-14 w-14" /></span>
              <p className="mt-6 text-3xl font-bold text-ink">C'est enregistré !</p>
              <p className="mt-2 text-xl text-ink/70">Vos collègues le verront tout de suite.</p>
            </div>
          )}

          {!saved && current === "kind" && (
            <>
              <h2 className="text-3xl font-bold text-ink">Que voulez-vous signaler ?</h2>
              <div className="mt-6 grid gap-3">
                {KINDS.map((k) => (
                  <button key={k.id} type="button" aria-pressed={form.kind === k.id} onClick={() => { set({ kind: k.id }); setStep(1); }} className={tile(form.kind === k.id)}>
                    <Icon name={k.id} className="h-9 w-9 shrink-0" />
                    <span>
                      {k.label}
                      <span className={`block text-base font-normal ${form.kind === k.id ? "text-sand-card/85" : "text-ink/60"}`}>{k.hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {!saved && current === "place" && (
            <>
              <h2 className="text-3xl font-bold text-ink">C'est où ?</h2>
              <p className="mt-2 text-xl text-ink/70">Tapez le numéro de la chambre.</p>
              <input
                autoFocus
                inputMode="numeric"
                autoComplete="off"
                value={form.placeName}
                onChange={(e) => set({ placeName: e.target.value })}
                placeholder="Ex : 214"
                aria-label="Numéro de chambre"
                className={`${field} mt-5 h-20 text-center text-4xl font-bold`}
              />
              {form.placeName && !place && suggestions.length === 0 && (
                <p className="mt-4 text-xl font-bold text-terracotta-deep">Je ne trouve pas « {form.placeName} ». Vérifiez le numéro.</p>
              )}
              {suggestions.length > 0 && !place && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {suggestions.map((p) => (
                    <button key={p.id} type="button" onClick={() => set({ placeName: p.name })} className={`${tile(false)} justify-center text-2xl`}>{p.name}</button>
                  ))}
                </div>
              )}
              {place && (
                <p className="mt-4 flex items-center justify-center gap-2 text-2xl font-bold text-aqua-deep"><Icon name="check" className="h-8 w-8" /> {place.kind === "room" ? `Chambre ${place.name}` : place.name}</p>
              )}
              {areas.length > 0 && !place && (
                <>
                  <p className="mt-8 text-xl font-bold text-ink">Ou un autre endroit :</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {areas.map((p) => (
                      <button key={p.id} type="button" onClick={() => set({ placeName: p.name })} className={`${tile(false)} justify-center`}>{p.name}</button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {!saved && current === "message" && (
            <>
              <h2 className="text-3xl font-bold text-ink">Que faut-il savoir ?</h2>
              <p className="mt-2 text-xl text-ink/70">Écrivez comme si vous parliez à un collègue.</p>
              <textarea
                autoFocus
                rows={6}
                maxLength={2000}
                value={form.body}
                onChange={(e) => set({ body: e.target.value })}
                aria-label="Votre message"
                className={`${field} mt-5 text-2xl leading-snug`}
                placeholder="Ex : Le client demande une serviette en plus avant 18 h."
              />
              <p className="mt-2 text-base text-ink/60">Astuce : sur un téléphone ou une tablette, le micro du clavier écrit à votre place.</p>
            </>
          )}

          {!saved && current === "who" && (
            <>
              <h2 className="text-3xl font-bold text-ink">Pour qui ?</h2>
              <div className="mt-6 grid gap-3">
                <button type="button" aria-pressed={form.shift === "" && form.roleIds.length === 0} onClick={() => set({ shift: "", roleIds: [] })} className={tile(form.shift === "" && form.roleIds.length === 0)}>
                  <Icon name="user" className="h-8 w-8 shrink-0" /> Pour tout le monde
                </button>
                {SHIFTS.filter((s) => shiftTag(s.name)).map((s) => (
                  <button key={s.name} type="button" aria-pressed={form.shift === s.name} onClick={() => set({ shift: s.name })} className={tile(form.shift === s.name)}>
                    {s.label}
                  </button>
                ))}
              </div>
              {roles.length > 0 && (
                <div className="mt-4">
                  <button type="button" onClick={() => setShowRoles((v) => !v)} className={`text-xl font-bold text-aqua-deep underline underline-offset-4 ${focus}`}>
                    {showRoles ? "Cacher les postes" : "Pour un poste précis ? (réception, technique…)"}
                  </button>
                  {showRoles && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {roles.map((r) => {
                        const on = form.roleIds.includes(r.id);
                        return (
                          <button key={r.id} type="button" aria-pressed={on} onClick={() => set({ roleIds: on ? form.roleIds.filter((x) => x !== r.id) : [...form.roleIds, r.id] })} className={`${tile(on)} justify-center text-lg`}>{r.name}</button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <h3 className="mt-8 text-2xl font-bold text-ink">Est-ce urgent ?</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button type="button" aria-pressed={!form.urgent} onClick={() => set({ urgent: false })} className={`${tile(!form.urgent)} justify-center`}>Non</button>
                <button type="button" aria-pressed={form.urgent} onClick={() => set({ urgent: true })} className={`${tile(form.urgent)} justify-center`}>Oui, urgent</button>
              </div>

              <div className="mt-8">
                <button type="button" onClick={() => setShowMore((v) => !v)} className={`text-lg font-bold text-ink/60 underline underline-offset-4 ${focus}`}>
                  {showMore ? "Moins d'options" : "Plus d'options (autre jour, garder en haut)"}
                </button>
                {showMore && (
                  <div className="mt-4 grid gap-5 rounded-2xl border-2 border-sand-dim bg-sand p-4">
                    <div>
                      <p className="text-xl font-bold text-ink">Pour quel jour ?</p>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => set({ day: today })} aria-pressed={form.day === today} className={`${tile(form.day === today)} justify-center`}>Aujourd'hui</button>
                        <button type="button" onClick={() => set({ day: addDays(today, 1) })} aria-pressed={form.day === addDays(today, 1)} className={`${tile(form.day === addDays(today, 1))} justify-center`}>Demain</button>
                      </div>
                      <label className="mt-3 block text-lg text-ink/70">Un autre jour :
                        <input type="date" min={today} value={form.day} onChange={(e) => e.target.value && set({ day: e.target.value })} className={`${field} mt-1 h-14 text-xl`} />
                      </label>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-ink">Garder en haut de la page ?</p>
                      <p className="text-base text-ink/60">Pour une information que tout le monde doit voir.</p>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        {[[0, "Non"], [1, "1 jour"], [7, "1 semaine"], [30, "1 mois"]].map(([n, text]) => (
                          <button key={n} type="button" aria-pressed={form.pinDays === n} onClick={() => set({ pinDays: n })} className={`${tile(form.pinDays === n)} justify-center`}>{text}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!saved && current === "pin" && (
            <>
              <h2 className="text-center text-3xl font-bold text-ink">Votre code personnel</h2>
              <p className="mb-6 mt-2 text-center text-xl text-ink/70">4 chiffres. Le message part tout seul.</p>
              <PinPad busy={busy} message={error} onComplete={send} />
            </>
          )}

          {!saved && error && current !== "pin" && <p className="mt-4 text-xl font-bold text-terracotta-deep" role="alert">{error}</p>}
        </div>
      </div>

      {!saved && current !== "kind" && current !== "pin" && (
        <div className="border-t-2 border-sand-dim bg-sand px-5 py-4">
          <div className="mx-auto max-w-xl">
            {current === "who" && isManager ? (
              <button type="button" disabled={busy} onClick={() => send("")} className={`flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-terracotta text-2xl font-bold text-ink hover:bg-terracotta-deep disabled:opacity-60 ${focus}`}>
                <Icon name="check" className="h-8 w-8" /> {busy ? "Envoi…" : "Envoyer"}
              </button>
            ) : (
              <button type="button" disabled={!canNext} onClick={next} className={`flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-terracotta text-2xl font-bold text-ink hover:bg-terracotta-deep disabled:opacity-40 ${focus}`}>
                Suivant <Icon name="next" className="h-8 w-8" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
