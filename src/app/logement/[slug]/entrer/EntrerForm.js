"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const content = {
  fr: {
    eyebrow: "Livret d'accueil",
    defaultTitle: "Accès au livret",
    codeIntro: "Entre le code d'accès transmis par ton hôte pour consulter le livret.",
    codePlaceholder: "••••",
    verifying: "Vérification…",
    accessSubmit: "Accéder au livret →",
    switchToLogin: "Déjà fait ton check-in ? Connecte-toi avec ton identifiant →",
    loginIntro: "Connecte-toi avec l'identifiant et le mot de passe reçus à la fin de ton check-in.",
    usernamePlaceholder: "Identifiant",
    passwordPlaceholder: "Mot de passe",
    loginSubmit: "Se connecter →",
    switchToCode: "← J'ai plutôt un code d'accès",
    opening: "Ouverture du livret…",
    errorUnavailable: "Ce livret n'est pas encore disponible — contacte ton hôte.",
    errorCode: "Code incorrect, réessaie.",
    errorLogin: "Identifiant ou mot de passe incorrect.",
  },
  en: {
    eyebrow: "Welcome book",
    defaultTitle: "Access the welcome book",
    codeIntro: "Enter the access code your host sent you to view the welcome book.",
    codePlaceholder: "••••",
    verifying: "Checking…",
    accessSubmit: "Open the welcome book →",
    switchToLogin: "Already checked in? Log in with your username →",
    loginIntro: "Log in with the username and password you received at the end of your check-in.",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    loginSubmit: "Log in →",
    switchToCode: "← I have an access code instead",
    opening: "Opening the welcome book…",
    errorUnavailable: "This welcome book isn't available yet — contact your host.",
    errorCode: "Incorrect code, try again.",
    errorLogin: "Incorrect username or password.",
  },
  es: {
    eyebrow: "Livret de bienvenida",
    defaultTitle: "Acceso al livret",
    codeIntro: "Ingresa el código de acceso que te dio tu anfitrión para ver el livret.",
    codePlaceholder: "••••",
    verifying: "Verificando…",
    accessSubmit: "Acceder al livret →",
    switchToLogin: "¿Ya hiciste tu check-in? Inicia sesión con tu usuario →",
    loginIntro: "Inicia sesión con el usuario y la contraseña que recibiste al terminar tu check-in.",
    usernamePlaceholder: "Usuario",
    passwordPlaceholder: "Contraseña",
    loginSubmit: "Iniciar sesión →",
    switchToCode: "← Tengo un código de acceso",
    opening: "Abriendo el livret…",
    errorUnavailable: "Este livret todavía no está disponible — contacta a tu anfitrión.",
    errorCode: "Código incorrecto, intenta de nuevo.",
    errorLogin: "Usuario o contraseña incorrectos.",
  },
};

export default function EntrerForm({ params, locale = "fr" }) {
  const t = content[locale];
  const { slug } = use(params);
  const [property, setProperty] = useState(null);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || `/logement/${slug}`;
  const [mode, setMode] = useState(searchParams.get("mode") === "login" ? "login" : "code");

  const codeFromQr = searchParams.get("code");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
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
    setError(null);

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
      setError(res.status === 403 ? t.errorUnavailable : t.errorCode);
    }
  }

  function handleCodeSubmit(e) {
    e.preventDefault();
    submitCode(code);
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/guest-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, username, password }),
    });

    if (res.ok) {
      window.location.href = next;
    } else {
      setLoading(false);
      setError(res.status === 403 ? t.errorUnavailable : t.errorLogin);
    }
  }

  if (codeFromQr && loading && !error) {
    return (
      <main className="flex flex-1 items-center justify-center bg-aqua px-6 py-14">
        <p className="text-sand-card">{t.opening}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-aqua px-6 py-14">
      <div className="w-full max-w-sm rounded border border-sand-dim bg-sand-card p-6 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-ink/60">{t.eyebrow}</span>
        <h1 className="mt-2 font-display italic text-3xl text-ink">
          {property ? property.name : t.defaultTitle}
        </h1>

        {mode === "code" ? (
          <>
            <p className="mt-2 text-sm text-ink/70">{t.codeIntro}</p>
            <form onSubmit={handleCodeSubmit} className="mt-5 grid gap-3">
              <input
                required
                autoFocus
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input text-center text-lg tracking-[0.3em]"
                placeholder={t.codePlaceholder}
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
              >
                {loading ? t.verifying : t.accessSubmit}
              </button>
              {error && <p className="text-sm text-terracotta-deep">{error}</p>}
            </form>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className="mt-4 text-xs font-bold uppercase tracking-wider text-ink/50 hover:text-ink"
            >
              {t.switchToLogin}
            </button>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-ink/70">{t.loginIntro}</p>
            <form onSubmit={handleLoginSubmit} className="mt-5 grid gap-3">
              <input
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input text-center"
                placeholder={t.usernamePlaceholder}
              />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input text-center"
                placeholder={t.passwordPlaceholder}
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
              >
                {loading ? t.verifying : t.loginSubmit}
              </button>
              {error && <p className="text-sm text-terracotta-deep">{error}</p>}
            </form>
            <button
              type="button"
              onClick={() => {
                setMode("code");
                setError(null);
              }}
              className="mt-4 text-xs font-bold uppercase tracking-wider text-ink/50 hover:text-ink"
            >
              {t.switchToCode}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
