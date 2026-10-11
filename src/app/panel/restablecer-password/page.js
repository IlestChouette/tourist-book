"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";
import { useClientLocale } from "@/lib/i18n/clientLocale";
import { authErrorMessage } from "@/lib/authErrors";

const content = {
  fr: {
    title: "Nouveau mot de passe",
    password: "Nouveau mot de passe",
    confirm: "Confirmez le mot de passe",
    submit: "Enregistrer →",
    saving: "Enregistrement…",
    mismatch: "Les deux mots de passe ne sont pas identiques.",
    done: "Mot de passe mis à jour. Vous allez arriver dans votre espace…",
    goPanel: "Accéder à mon espace →",
    invalidTitle: "Lien invalide ou expiré",
    invalid: "Ce lien a déjà été utilisé ou a expiré. Demandez-en un nouveau :",
    askNew: "Recevoir un nouveau lien",
  },
  en: {
    title: "New password",
    password: "New password",
    confirm: "Confirm the password",
    submit: "Save →",
    saving: "Saving…",
    mismatch: "The two passwords don't match.",
    done: "Password updated. Taking you to your space…",
    goPanel: "Go to my space →",
    invalidTitle: "Invalid or expired link",
    invalid: "This link has already been used or has expired. Ask for a new one:",
    askNew: "Get a new link",
  },
  es: {
    title: "Nueva contraseña",
    password: "Nueva contraseña",
    confirm: "Confirma la contraseña",
    submit: "Guardar →",
    saving: "Guardando…",
    mismatch: "Las dos contraseñas no coinciden.",
    done: "Contraseña actualizada. Te llevamos a tu espacio…",
    goPanel: "Ir a mi espacio →",
    invalidTitle: "Enlace no válido o caducado",
    invalid: "Este enlace ya se usó o ha caducado. Pide uno nuevo:",
    askNew: "Recibir un enlace nuevo",
  },
};

export default function RestablecerPasswordPage() {
  const router = useRouter();
  const locale = useClientLocale();
  const t = content[locale];
  const [hasSession, setHasSession] = useState(null);
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setHasSession(Boolean(data.user)));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError(t.mismatch);
      return;
    }
    setSaving(true);
    setError("");
    const { data: updated, error: updateError } = await createClient().auth.updateUser({ password: form.password });
    if (updateError) {
      setSaving(false);
      setError(authErrorMessage(updateError, locale));
      return;
    }
    setDone(true);
    // Un compte hôtel (créé depuis l'espace hôtels) n'a pas de profil hôtelier : retour à son espace.
    const home = updated?.user?.user_metadata?.account_type === "hotel" ? "/hotel/gestion" : "/panel";
    setTimeout(() => router.push(home), 2000);
  }

  if (hasSession === false) {
    return (
      <main className="flex-1">
        <Hero backHref="/panel/login" backLabel="Tourist Book" eyebrow="Tourist Book" title={t.invalidTitle} />
        <section className="mx-auto max-w-sm px-6 py-10 text-center">
          <p className="text-ink/80">{t.invalid}</p>
          <Link
            href="/panel/olvide-password"
            className="mt-5 inline-block rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
          >
            {t.askNew}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero backHref="/panel/login" backLabel="Tourist Book" eyebrow="Tourist Book" title={t.title} />
      <section className="mx-auto max-w-sm px-6 py-10">
        {done ? (
          <div className="text-center">
            <p className="text-ink/80">{t.done}</p>
            <Link href="/panel" className="mt-4 inline-block text-sm font-bold text-aqua-deep">
              {t.goPanel}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.password}</span>
              <input
                required
                type="password"
                minLength={6}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.confirm}</span>
              <input
                required
                type="password"
                minLength={6}
                autoComplete="new-password"
                value={form.confirm}
                onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                className="input"
              />
            </label>
            <button
              type="submit"
              disabled={saving || hasSession === null}
              className="mt-2 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
            >
              {saving ? t.saving : t.submit}
            </button>
            {error && <p className="text-sm text-terracotta-deep">{error}</p>}
          </form>
        )}
      </section>
    </main>
  );
}
