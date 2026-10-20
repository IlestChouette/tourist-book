"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/authErrors";
import Hero from "@/components/Hero";

export default function HotelConnexionPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    setNotFound(false);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword(form);
    if (err) {
      let message = authErrorMessage(err, "fr");
      // Email ou mot de passe faux : on dit lequel, et si l'email n'a pas de
      // compte on invite à créer l'espace de l'hôtel.
      if (err.code === "invalid_credentials") {
        try {
          const res = await fetch("/api/account-exists", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: form.email }) });
          if (res.ok) {
            const { exists } = await res.json();
            message = exists ? "Mot de passe incorrect." : "Aucun compte n'est enregistré avec cet email.";
            setNotFound(!exists);
          }
        } catch {
          // message générique
        }
      }
      setSending(false);
      return setError(message);
    }
    // Compte d'un service : l'appareil est activé pour ce service et on ouvre son cahier.
    try {
      const res = await fetch("/api/hotel/service-login", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        await fetch("/api/hotel/logout", { method: "POST" }).catch(() => {});
        setSending(false);
        return setError(data.error || "Impossible d'ouvrir le cahier. Réessayez.");
      }
      if (data.service) {
        window.location.href = data.slug ? `/hotel/${data.slug}/cahier` : "/hotel/cahier";
        return;
      }
    } catch {
      // Hors ligne ou erreur réseau : on suit le chemin du manager.
    }
    window.location.href = "/hotel/gestion";
  }

  return (
    <main className="flex-1">
      <Hero backHref="/hotel" backLabel="Espace hôtels" eyebrow="Espace hôtels" title="Connexion" />
      <section className="mx-auto max-w-sm px-6 py-10">
        <p className="mb-5 text-sm text-ink/70">Manager de l'hôtel, ou accès d'un service (réception, conciergerie…) créé par votre manager.</p>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Email</span>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Mot de passe</span>
            <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input" />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="mt-2 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {sending ? "Connexion…" : "Se connecter →"}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
          {notFound && (
            <Link href="/hotel/inscription" className="justify-self-start rounded border border-aqua-deep px-4 py-2 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card">
              Créer l'espace de mon hôtel →
            </Link>
          )}
        </form>
        <p className="mt-4 text-sm text-ink/70">
          <Link href="/panel/olvide-password" className="font-bold text-aqua-deep">
            Mot de passe oublié ?
          </Link>
        </p>
        <p className="mt-2 text-sm text-ink/70">
          Pas encore d'espace ?{" "}
          <Link href="/hotel/inscription" className="font-bold text-aqua-deep">
            Créer l'espace de mon hôtel
          </Link>
        </p>
      </section>
    </main>
  );
}
