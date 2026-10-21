"use client";

import { useState } from "react";

// Déconnexion du manager : visible dans l'en-tête de toutes les pages manager.
export default function HotelLogoutButton() {
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/hotel/logout", { method: "POST" });
    } catch {
      // Hors ligne : on retourne quand même à l'accueil.
    }
    window.location.href = "/hotel";
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className="rounded-full bg-sand-card/85 px-4 py-2 text-xs font-bold uppercase tracking-widest text-ink/70 transition-colors hover:bg-sand-card disabled:opacity-60 print:hidden"
    >
      {busy ? "…" : "Déconnexion"}
    </button>
  );
}
