"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: { email: "Email", password: "Mot de passe", submitting: "Connexion…", submit: "Entrer →", error: "Email ou mot de passe incorrect." },
  en: { email: "Email", password: "Password", submitting: "Logging in…", submit: "Log in →", error: "Incorrect email or password." },
  es: { email: "Email", password: "Contraseña", submitting: "Entrando…", submit: "Entrar →", error: "Email o contraseña incorrectos." },
};

export default function AdminLoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";
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
    <main className="flex flex-1 flex-col items-center justify-center bg-[#223339] px-6 py-14">
      <Image
        src="/tourist book long.png"
        alt="Tourist Book"
        width={278}
        height={106}
        className="mb-6 h-20 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-24"
      />
      <div className="w-full max-w-sm rounded border border-sand-dim bg-sand-card p-6">
        <h1 className="font-display italic text-2xl text-ink">Admin</h1>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
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
      </div>
    </main>
  );
}
