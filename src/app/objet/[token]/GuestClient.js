"use client";

import { useState } from "react";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-deep";

export default function GuestClient({ token, t, closed, initialChoice }) {
  const [choice, setChoice] = useState(initialChoice);
  const [mode, setMode] = useState(null); // "ship" | "discard" : étape de confirmation
  const [form, setForm] = useState({ name: "", address: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [justSent, setJustSent] = useState(false);

  async function send(picked, extra = {}) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/lost-found/guest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, choice: picked, ...extra }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(res.status === 400 && data.error ? data.error : t.error);
      setChoice(picked);
      setMode(null);
      setJustSent(true);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  if (closed) return <p className="mt-8 rounded-xl border border-sand-dim bg-sand p-5 text-ink/80">{t.closed}</p>;

  if (choice && mode === null) {
    return (
      <div className="mt-8 rounded-2xl border border-sand-dim bg-sand p-6">
        {justSent && <p className="font-bold text-aqua-deep">{t.thanks}</p>}
        <p className="mt-1 text-ink">{t.chosen[choice]}</p>
        <button type="button" onClick={() => { setChoice(null); setJustSent(false); }} className={`mt-4 text-sm font-bold text-aqua-deep underline underline-offset-2 ${focus}`}>{t.change}</button>
      </div>
    );
  }

  const option = "flex w-full flex-col items-start rounded-2xl border border-sand-dim bg-sand p-5 text-left transition-colors hover:border-aqua-deep";

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold text-ink">{t.question}</h2>
      {mode === null && (
        <div className="mt-3 grid gap-3">
          <button type="button" disabled={busy} onClick={() => send("pickup")} className={`${option} ${focus}`}>
            <span className="text-base font-bold text-ink">{t.pickup}</span>
            <span className="mt-0.5 text-sm text-ink/60">{t.pickupHelp}</span>
          </button>
          <button type="button" onClick={() => setMode("ship")} className={`${option} ${focus}`}>
            <span className="text-base font-bold text-ink">{t.ship}</span>
            <span className="mt-0.5 text-sm text-ink/60">{t.shipHelp}</span>
          </button>
          <button type="button" onClick={() => setMode("discard")} className={`${option} ${focus}`}>
            <span className="text-base font-bold text-ink">{t.discard}</span>
            <span className="mt-0.5 text-sm text-ink/60">{t.discardHelp}</span>
          </button>
        </div>
      )}

      {mode === "ship" && (
        <form onSubmit={(e) => { e.preventDefault(); send("ship", form); }} className="mt-3 grid gap-4 rounded-2xl border border-sand-dim bg-sand p-5">
          <label className="grid gap-1.5"><span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.name}</span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input h-12" autoComplete="name" /></label>
          <label className="grid gap-1.5"><span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.address}</span><textarea required rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" autoComplete="street-address" /></label>
          <label className="grid gap-1.5"><span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.phone}</span><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input h-12" autoComplete="tel" /></label>
          {error && <p className="text-sm font-bold text-terracotta-deep" role="alert">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={busy} className={`h-12 flex-1 rounded-xl bg-terracotta font-bold text-ink hover:bg-terracotta-deep disabled:opacity-60 ${focus}`}>{t.send}</button>
            <button type="button" onClick={() => { setMode(null); setError(""); }} className={`h-12 rounded-xl border border-sand-dim px-4 font-bold text-ink/70 ${focus}`}>{t.cancel}</button>
          </div>
        </form>
      )}

      {mode === "discard" && (
        <div className="mt-3 rounded-2xl border border-sand-dim bg-sand p-5">
          <p className="text-ink">{t.discardHelp}</p>
          {error && <p className="mt-3 text-sm font-bold text-terracotta-deep" role="alert">{error}</p>}
          <div className="mt-4 flex gap-3">
            <button type="button" disabled={busy} onClick={() => send("discard")} className={`h-12 flex-1 rounded-xl bg-terracotta font-bold text-ink hover:bg-terracotta-deep disabled:opacity-60 ${focus}`}>{t.confirmDiscard}</button>
            <button type="button" onClick={() => { setMode(null); setError(""); }} className={`h-12 rounded-xl border border-sand-dim px-4 font-bold text-ink/70 ${focus}`}>{t.cancel}</button>
          </div>
        </div>
      )}
    </div>
  );
}
