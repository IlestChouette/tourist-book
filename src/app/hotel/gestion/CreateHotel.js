"use client";

import { useState } from "react";

// Compte connecté mais sans hôtel (typiquement un hôtelier de livrets) : on
// propose de créer l'espace hôtel avec ce même compte.
export default function CreateHotel({ email }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/hotel/create", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue. Réessayez.");
      window.location.href = "/hotel/gestion";
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/hotel/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/hotel/connexion";
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <h1 className="font-display italic text-3xl text-ink">Ce compte n'a pas encore d'espace hôtel</h1>
      <p className="mt-3 text-ink/75">
        Vous êtes connecté avec <strong>{email}</strong>, qui est déjà un compte Tourist Book (livrets d'accueil). Vous pouvez créer l'espace hôtel avec ce même compte : vos livrets ne changent pas.
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Nom de l'hôtel</span>
          <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder="Ex. Hôtel Les Mimosas" className="input" />
        </label>
        <button type="submit" disabled={busy} className="rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60">
          {busy ? "Création…" : "Créer l'espace de mon hôtel"}
        </button>
        {error && <p role="alert" className="text-sm font-bold text-terracotta-deep">{error}</p>}
      </form>
      <p className="mt-6 text-sm text-ink/60">
        Ce n'est pas votre compte ?{" "}
        <button type="button" onClick={logout} className="font-bold text-aqua-deep underline">Se déconnecter</button>
      </p>
    </div>
  );
}
