"use client";

import { useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import { MailIcon } from "@/components/icons";
import { useClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    home: "Accueil",
    title: "Mot de passe oublié",
    intro: "Indiquez l'email de votre compte : nous vous envoyons un lien pour choisir un nouveau mot de passe.",
    email: "Email",
    submit: "Envoyer le lien →",
    sending: "Envoi…",
    error: "Une erreur est survenue. Réessayez dans un instant.",
    sentTitle: "Vérifiez votre boîte mail",
    sent: "Si un compte existe avec cette adresse, vous allez recevoir un lien pour réinitialiser votre mot de passe.",
    spam: "Rien reçu ? Regardez dans vos spams ou courriers indésirables, puis réessayez dans une minute.",
    back: "Retour à la connexion",
  },
  en: {
    home: "Home",
    title: "Forgot your password",
    intro: "Enter your account email: we'll send you a link to choose a new password.",
    email: "Email",
    submit: "Send the link →",
    sending: "Sending…",
    error: "Something went wrong. Try again in a moment.",
    sentTitle: "Check your inbox",
    sent: "If an account exists with this address, you'll receive a link to reset your password.",
    spam: "Nothing there? Look in your spam or junk folder, then try again in a minute.",
    back: "Back to log in",
  },
  es: {
    home: "Inicio",
    title: "Contraseña olvidada",
    intro: "Indica el email de tu cuenta: te enviamos un enlace para elegir una contraseña nueva.",
    email: "Email",
    submit: "Enviar el enlace →",
    sending: "Enviando…",
    error: "Ocurrió un error. Inténtalo de nuevo en un momento.",
    sentTitle: "Revisa tu correo",
    sent: "Si existe una cuenta con esta dirección, recibirás un enlace para restablecer tu contraseña.",
    spam: "¿No ves nada? Mira en el spam o correo no deseado, y vuelve a intentarlo en un minuto.",
    back: "Volver al inicio de sesión",
  },
};

export default function OlvidePasswordPage() {
  const locale = useClientLocale();
  const t = content[locale];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="flex-1">
      <Hero backHref="/panel/login" backLabel={t.back} eyebrow="Tourist Book" title={status === "sent" ? t.sentTitle : t.title} />
      <section className="mx-auto max-w-sm px-6 py-10">
        {status === "sent" ? (
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-ink">
              <MailIcon />
            </span>
            <p className="mt-5 text-ink/80">{t.sent}</p>
            <p className="mt-3 text-sm text-ink/60">{t.spam}</p>
            <Link href="/panel/login" className="mt-6 inline-block text-sm font-bold text-aqua-deep">
              {t.back}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <p className="text-sm text-ink/70">{t.intro}</p>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.email}</span>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </label>
            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
            >
              {status === "sending" ? t.sending : t.submit}
            </button>
            {status === "error" && <p className="text-sm text-terracotta-deep">{t.error}</p>}
            <Link href="/panel/login" className="text-sm font-bold text-aqua-deep">
              {t.back}
            </Link>
          </form>
        )}
      </section>
    </main>
  );
}
