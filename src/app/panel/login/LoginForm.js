"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";
import { useClientLocale } from "@/lib/i18n/clientLocale";
import { authErrorMessage } from "@/lib/authErrors";

const content = {
  fr: {
    home: "Accueil",
    title: "Se connecter",
    email: "Email",
    password: "Mot de passe",
    submitting: "Connexion…",
    submit: "Entrer →",
    error: "Email ou mot de passe incorrect.",
    confirmError:
      "Ce lien de confirmation a déjà été utilisé ou a expiré. Si votre compte est déjà activé, connectez-vous ci-dessous.",
    resend: "Renvoyer l'email de confirmation",
    resent: "Email de confirmation renvoyé. Vérifiez aussi vos spams.",
    forgot: "Mot de passe oublié ?",
    noAccount: "Vous n'avez pas encore de compte ?",
    register: "Inscrivez-vous",
    notFound: "Aucun compte n'est enregistré avec cet email.",
    createAccount: "Créer un compte gratuitement →",
    wrongPassword: "Mot de passe incorrect.",
  },
  en: {
    home: "Home",
    title: "Log in",
    email: "Email",
    password: "Password",
    submitting: "Logging in…",
    submit: "Log in →",
    error: "Incorrect email or password.",
    confirmError:
      "This confirmation link has already been used or has expired. If your account is already active, log in below.",
    resend: "Resend the confirmation email",
    resent: "Confirmation email resent. Check your spam folder too.",
    forgot: "Forgot your password?",
    noAccount: "Don't have an account yet?",
    register: "Sign up",
    notFound: "No account is registered with this email.",
    createAccount: "Create a free account →",
    wrongPassword: "Incorrect password.",
  },
  es: {
    home: "Inicio",
    title: "Iniciar sesión",
    email: "Email",
    password: "Contraseña",
    submitting: "Entrando…",
    submit: "Entrar →",
    error: "Email o contraseña incorrectos.",
    confirmError:
      "Este enlace de confirmación ya se usó o ha caducado. Si tu cuenta ya está activa, inicia sesión abajo.",
    resend: "Reenviar el email de confirmación",
    resent: "Email de confirmación reenviado. Revisa también el spam.",
    forgot: "¿Olvidaste tu contraseña?",
    noAccount: "¿Todavía no tienes cuenta?",
    register: "Regístrate",
    notFound: "No hay ninguna cuenta registrada con este email.",
    createAccount: "Crear una cuenta gratis →",
    wrongPassword: "Contraseña incorrecta.",
  },
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/panel";
  const locale = useClientLocale();
  const t = content[locale];

  const [form, setForm] = useState({ email: "", password: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [resent, setResent] = useState(false);
  const confirmError = searchParams.get("confirm") === "error";

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    setNotFound(false);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setNeedsConfirm(signInError.code === "email_not_confirmed");
      let message = authErrorMessage(signInError, locale);
      // Email ou mot de passe faux : on dit lequel des deux, et si l'email n'a
      // pas de compte on invite à en créer un. Si la vérification échoue, on
      // garde le message générique.
      if (signInError.code === "invalid_credentials") {
        try {
          const res = await fetch("/api/account-exists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.email }),
          });
          if (res.ok) {
            const { exists } = await res.json();
            if (exists) message = t.wrongPassword;
            else {
              message = t.notFound;
              setNotFound(true);
            }
          }
        } catch {
          // message générique
        }
      }
      setSending(false);
      setError(message);
      return;
    }

    window.location.href = next;
  }

  async function resendConfirmation() {
    const supabase = createClient();
    const { error: resendErr } = await supabase.auth.resend({
      type: "signup",
      email: form.email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    if (resendErr) {
      setError(authErrorMessage(resendErr, locale));
      return;
    }
    setResent(true);
  }

  return (
    <main className="flex-1">
      <Hero backHref="/" backLabel={t.home} eyebrow="Tourist Book" title={t.title} />
      <section className="mx-auto max-w-sm px-6 py-10">
        {confirmError && (
          <p className="mb-5 rounded border border-sand-dim bg-sand-card p-3 text-sm text-ink/80">{t.confirmError}</p>
        )}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.email}</span>
            <input required type="email" value={form.email} onChange={update("email")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.password}</span>
            <input
              required
              type="password"
              value={form.password}
              onChange={update("password")}
              className="input"
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="mt-2 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {sending ? t.submitting : t.submit}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
          {notFound && (
            <Link href="/panel/registro" className="justify-self-start rounded border border-aqua-deep px-4 py-2 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card">
              {t.createAccount}
            </Link>
          )}
          {needsConfirm && !resent && (
            <button
              type="button"
              onClick={resendConfirmation}
              className="justify-self-start text-sm font-bold text-aqua-deep underline-offset-4 hover:underline"
            >
              {t.resend}
            </button>
          )}
          {resent && <p className="text-sm text-aqua-deep">{t.resent}</p>}
          <Link href="/panel/olvide-password" className="justify-self-start text-sm font-bold text-aqua-deep">
            {t.forgot}
          </Link>
        </form>
        <p className="mt-4 text-sm text-ink/70">
          {t.noAccount}{" "}
          <Link href="/panel/registro" className="font-bold text-aqua-deep">
            {t.register}
          </Link>
        </p>
      </section>
    </main>
  );
}
