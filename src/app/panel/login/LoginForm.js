"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    home: "Accueil",
    title: "Se connecter",
    email: "Email",
    password: "Mot de passe",
    submitting: "Connexion…",
    submit: "Entrer →",
    error: "Email ou mot de passe incorrect.",
    noAccount: "Vous n'avez pas encore de compte ?",
    register: "Inscrivez-vous",
  },
  en: {
    home: "Home",
    title: "Log in",
    email: "Email",
    password: "Password",
    submitting: "Logging in…",
    submit: "Log in →",
    error: "Incorrect email or password.",
    noAccount: "Don't have an account yet?",
    register: "Sign up",
  },
  es: {
    home: "Inicio",
    title: "Iniciar sesión",
    email: "Email",
    password: "Contraseña",
    submitting: "Entrando…",
    submit: "Entrar →",
    error: "Email o contraseña incorrectos.",
    noAccount: "¿Todavía no tienes cuenta?",
    register: "Regístrate",
  },
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/panel";
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [form, setForm] = useState({ email: "", password: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setSending(false);
      setError(t.error);
      return;
    }

    window.location.href = next;
  }

  return (
    <main className="flex-1">
      <Hero backHref="/" backLabel={t.home} eyebrow="Tourist Book" title={t.title} />
      <section className="mx-auto max-w-sm px-6 py-10">
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
