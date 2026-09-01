"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function EntrerForm({ params }) {
  const { slug } = use(params);
  const [property, setProperty] = useState(null);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || `/logement/${slug}`;
  const [mode, setMode] = useState(searchParams.get("mode") === "login" ? "login" : "code");

  const codeFromQr = searchParams.get("code");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!!codeFromQr);

  useEffect(() => {
    fetch(`/api/properties/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setProperty)
      .catch(() => setProperty(null));
  }, [slug]);

  // QR code imprimé : le code est déjà dans le lien, pas besoin de le taper.
  useEffect(() => {
    if (!codeFromQr) return;
    submitCode(codeFromQr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeFromQr]);

  async function submitCode(value) {
    setLoading(true);
    setError(false);

    const res = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, code: value }),
    });

    if (res.ok) {
      // Navigation complète (pas router.push) : évite que le cache client de Next.js
      // serve une redirection périmée datant d'avant la pose du cookie d'accès.
      window.location.href = next;
    } else {
      setLoading(false);
      setError(true);
    }
  }

  function handleCodeSubmit(e) {
    e.preventDefault();
    submitCode(code);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const res = await fetch("/api/guest-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, username, password }),
    });

    if (res.ok) {
      window.location.href = next;
    } else {
      setLoading(false);
      setError(true);
    }
  }

  if (codeFromQr && loading && !error) {
    return (
      <main className="flex flex-1 items-center justify-center bg-aqua px-6 py-14">
        <p className="text-sand-card">Ouverture du livret…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-aqua px-6 py-14">
      <div className="w-full max-w-sm rounded border border-sand-dim bg-sand-card p-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-ink/60">
          Livret d&apos;accueil
        </span>
        <h1 className="mt-2 font-display italic text-3xl text-ink">
          {property ? property.name : "Accès au livret"}
        </h1>

        {mode === "code" ? (
          <>
            <p className="mt-2 text-sm text-ink/70">
              Entre le code d&apos;accès transmis par ton hôte pour consulter le livret.
            </p>
            <form onSubmit={handleCodeSubmit} className="mt-5 grid gap-3">
              <input
                required
                autoFocus
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input text-center text-lg tracking-[0.3em]"
                placeholder="••••"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
              >
                {loading ? "Vérification…" : "Accéder au livret →"}
              </button>
              {error && <p className="text-sm text-terracotta-deep">Code incorrect, réessaie.</p>}
            </form>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(false);
              }}
              className="mt-4 text-xs font-bold uppercase tracking-wider text-ink/50 hover:text-ink"
            >
              Déjà fait ton check-in ? Connecte-toi avec ton identifiant →
            </button>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-ink/70">
              Connecte-toi avec l&apos;identifiant et le mot de passe reçus à la fin de ton check-in.
            </p>
            <form onSubmit={handleLoginSubmit} className="mt-5 grid gap-3">
              <input
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input text-center"
                placeholder="Identifiant"
              />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input text-center"
                placeholder="Mot de passe"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
              >
                {loading ? "Vérification…" : "Se connecter →"}
              </button>
              {error && <p className="text-sm text-terracotta-deep">Identifiant ou mot de passe incorrect.</p>}
            </form>
            <button
              type="button"
              onClick={() => {
                setMode("code");
                setError(false);
              }}
              className="mt-4 text-xs font-bold uppercase tracking-wider text-ink/50 hover:text-ink"
            >
              ← J&apos;ai plutôt un code d&apos;accès
            </button>
          </>
        )}
      </div>
    </main>
  );
}
