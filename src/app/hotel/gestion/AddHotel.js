"use client";

import { useState } from "react";

// Ajouter un autre hôtel au même compte (groupe) : il aura son propre logo, ses services, son équipe et son abonnement.
export default function AddHotel() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/hotel/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Une erreur est survenue. Réessayez.");
      setBusy(false);
      return;
    }
    window.location.href = "/hotel/gestion";
  }

  return (
    <section className="mt-10 rounded-lg border border-sand-dim bg-sand-card p-5">
      <h2 className="font-display italic text-2xl text-ink">Un autre hôtel ?</h2>
      <p className="mt-2 text-ink/70">Même compte, même email : ajoutez un autre hôtel (ou plusieurs hôtels d'un même groupe). Chacun a son logo, ses services, son équipe, ses consignes et son abonnement.</p>
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="mt-4 rounded border border-aqua-deep px-5 py-3 font-bold text-aqua-deep hover:bg-aqua-deep hover:text-sand-card">Ajouter un hôtel</button>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Nom du nouvel hôtel</span>
            <input required minLength={2} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </label>
          <button type="submit" disabled={busy} className="rounded bg-aqua-deep px-5 py-3 font-bold text-sand-card hover:bg-aqua-deep/90 disabled:opacity-60">{busy ? "Création…" : "Créer l'hôtel"}</button>
          {error && <p className="basis-full font-bold text-terracotta-deep">{error}</p>}
        </form>
      )}
    </section>
  );
}
