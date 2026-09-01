"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/uploadMedia";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    home: "Accueil",
    title: "Créer un compte hôtelier",
    name: "Nom",
    email: "Email",
    password: "Mot de passe",
    logoLabel: "Logo (facultatif — apparaîtra lors du check-in de vos hôtes)",
    acceptPrefix: "J'ai lu et j'accepte les",
    terms: "Conditions d'utilisation et d'abonnement",
    and: "et la",
    privacy: "Politique de confidentialité",
    submitting: "Création…",
    submit: "Créer un compte →",
    alreadyHaveAccount: "Vous avez déjà un compte ?",
    login: "Connectez-vous",
    mustAcceptTerms: "Vous devez accepter les Conditions d'utilisation et la Politique de confidentialité pour continuer.",
    confirmEmail:
      "Compte créé, mais il faut confirmer l'email. Vérifiez votre boîte de réception (ou désactivez \"Confirm email\" dans Supabase pendant les tests).",
  },
  en: {
    home: "Home",
    title: "Create a host account",
    name: "Name",
    email: "Email",
    password: "Password",
    logoLabel: "Logo (optional — will appear during your guests' check-in)",
    acceptPrefix: "I have read and accept the",
    terms: "Terms of use and subscription",
    and: "and the",
    privacy: "Privacy policy",
    submitting: "Creating…",
    submit: "Create account →",
    alreadyHaveAccount: "Already have an account?",
    login: "Log in",
    mustAcceptTerms: "You must accept the Terms of use and the Privacy policy to continue.",
    confirmEmail:
      "Account created, but the email still needs confirming. Check your inbox (or disable \"Confirm email\" in Supabase while testing).",
  },
  es: {
    home: "Inicio",
    title: "Crear cuenta de hotelero",
    name: "Nombre",
    email: "Email",
    password: "Contraseña",
    logoLabel: "Logo (opcional — aparecerá en el check-in de tus huéspedes)",
    acceptPrefix: "He leído y acepto los",
    terms: "Términos de uso y suscripción",
    and: "y la",
    privacy: "Política de privacidad",
    submitting: "Creando…",
    submit: "Crear cuenta →",
    alreadyHaveAccount: "¿Ya tienes cuenta?",
    login: "Inicia sesión",
    mustAcceptTerms: "Debes aceptar los Términos de uso y la Política de privacidad para continuar.",
    confirmEmail:
      "Cuenta creada, pero falta confirmar el email. Revisa tu bandeja de entrada (o desactiva \"Confirm email\" en Supabase mientras probamos).",
  },
};

export default function RegistroPage() {
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [logo, setLogo] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!acceptedTerms) {
      setError(t.mustAcceptTerms);
      return;
    }

    setSending(true);
    setError("");

    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      setSending(false);
      setError(signUpError.message);
      return;
    }

    if (!data.session) {
      setSending(false);
      setError(t.confirmEmail);
      return;
    }

    let logoUrl = null;
    if (logo) {
      try {
        const ext = logo.name.split(".").pop();
        logoUrl = await uploadMedia(`${data.user.id}/logo.${ext}`, logo);
      } catch {
        // El logo es opcional: si falla la subida, seguimos sin bloquear el registro.
      }
    }

    const { error: insertError } = await supabase.from("hosts").insert({
      id: data.user.id,
      email: form.email,
      name: form.nombre,
      logo_url: logoUrl,
      accepted_terms_at: new Date().toISOString(),
    });

    setSending(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    window.location.href = "/panel";
  }

  return (
    <main className="flex-1">
      <Hero backHref="/" backLabel={t.home} eyebrow="Tourist Book" title={t.title} />
      <section className="mx-auto max-w-sm px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.name}</span>
            <input required value={form.nombre} onChange={update("nombre")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.email}</span>
            <input required type="email" value={form.email} onChange={update("email")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.password}</span>
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={update("password")}
              className="input"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.logoLabel}</span>
            <div className="flex items-center gap-3">
              {logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(logo)}
                  alt=""
                  className="h-12 w-12 rounded object-contain bg-sand-card border border-sand-dim"
                />
              )}
              <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
            </div>
          </label>

          <label className="flex items-start gap-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />
            <span>
              {t.acceptPrefix}{" "}
              <a href="/terminos" target="_blank" className="font-bold text-aqua-deep">
                {t.terms}
              </a>{" "}
              {t.and}{" "}
              <a href="/privacidad" target="_blank" className="font-bold text-aqua-deep">
                {t.privacy}
              </a>
              .
            </span>
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
          {t.alreadyHaveAccount}{" "}
          <Link href="/panel/login" className="font-bold text-aqua-deep">
            {t.login}
          </Link>
        </p>
      </section>
    </main>
  );
}
