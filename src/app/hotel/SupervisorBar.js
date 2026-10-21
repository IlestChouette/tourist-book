"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Vue « responsable » sur un poste de service : un code personnel montre qui a
// écrit et validé les consignes de son service. Le personnel ne voit que les faits.
export default function SupervisorBar({ active, name }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function unlock(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/hotel/supervisor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error || "Une erreur est survenue.");
    setPin("");
    setOpen(false);
    router.refresh();
  }
  async function lock() {
    await fetch("/api/hotel/supervisor", { method: "DELETE" });
    router.refresh();
  }

  const chip = "inline-flex h-10 items-center rounded-xl border-2 border-sand-dim px-4 text-sm font-bold text-ink/70 hover:bg-sand-card";
  if (active) {
    return (
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-6 pt-4 print:hidden">
        <span className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-sand">Vue responsable · {name}</span>
        <Link href="/hotel/suivi" className={chip}>Suivi de mon service</Link>
        <button type="button" onClick={lock} className={chip}>Quitter</button>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-6xl px-6 pt-4 print:hidden">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className={chip}>Vue responsable</button>
      ) : (
        <form onSubmit={unlock} className="flex flex-wrap items-center gap-3">
          <input required autoFocus type="password" inputMode="numeric" maxLength={4} pattern="\d{4}" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} className="input h-10 w-32 text-center tracking-[0.5em]" aria-label="Code personnel du responsable" />
          <button type="submit" disabled={busy || pin.length !== 4} className="inline-flex h-10 items-center rounded-xl bg-ink px-4 text-sm font-bold text-sand disabled:opacity-60">Ouvrir</button>
          <button type="button" onClick={() => { setOpen(false); setPin(""); setError(""); }} className={chip}>Annuler</button>
          {error && <span className="text-sm font-bold text-terracotta-deep" role="alert">{error}</span>}
        </form>
      )}
    </div>
  );
}
