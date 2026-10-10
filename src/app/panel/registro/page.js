"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/uploadMedia";
import { authErrorMessage } from "@/lib/authErrors";
import { MailIcon } from "@/components/icons";
import Hero from "@/components/Hero";
import { useClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    home: "Accueil",
    title: "Créer un compte hôtelier",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    phonePlaceholder: "Ex : +33 6 12 34 56 78",
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
    subtitle: "Votre livret prêt en 5 minutes. Offre annuelle : 1 mois offert.",
    checkTitle: "Vérifiez votre boîte mail",
    checkSentTo: "Nous venons d'envoyer un lien de confirmation à",
    checkAfter: "Cliquez dessus : votre compte sera activé et vous arriverez directement dans votre espace.",
    checkSpam: "Rien reçu ? Regardez dans vos spams ou courriers indésirables.",
    logoLater: "Vous pourrez ajouter votre logo depuis votre profil, une fois connecté.",
    resend: "Renvoyer l'email",
    resending: "Envoi…",
    resent: "Email renvoyé. Patientez une minute avant d'en redemander un.",
  },
  en: {
    home: "Home",
    title: "Create a host account",
    name: "Name",
    email: "Email",
    phone: "Phone",
    phonePlaceholder: "E.g.: +33 6 12 34 56 78",
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
    subtitle: "Your livret ready in 5 minutes. Annual plan: 1 month free.",
    checkTitle: "Check your inbox",
    checkSentTo: "We just sent a confirmation link to",
    checkAfter: "Click it: your account will be activated and you'll land straight in your space.",
    checkSpam: "Nothing there? Look in your spam or junk folder.",
    logoLater: "You'll be able to add your logo from your profile once you're logged in.",
    resend: "Resend the email",
    resending: "Sending…",
    resent: "Email resent. Wait a minute before asking for another one.",
  },
  es: {
    home: "Inicio",
    title: "Crear cuenta de hotelero",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    phonePlaceholder: "Ej: +33 6 12 34 56 78",
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
    subtitle: "Tu livret listo en 5 minutos. Plan anual: 1 mes gratis.",
    checkTitle: "Revisa tu correo",
    checkSentTo: "Acabamos de enviar un enlace de confirmación a",
    checkAfter: "Haz clic en él: tu cuenta quedará activada y entrarás directamente a tu espacio.",
    checkSpam: "¿No ves nada? Mira en el spam o correo no deseado.",
    logoLater: "Podrás añadir tu logo desde tu perfil una vez dentro.",
    resend: "Reenviar el email",
    resending: "Enviando…",
    resent: "Email reenviado. Espera un minuto antes de pedir otro.",
  },
};

export default function RegistroPage() {
  const locale = useClientLocale();
  const t = content[locale];

  const [form, setForm] = useState({ nombre: "", email: "", phone: "", password: "" });
  const [logo, setLogo] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);
  const [resendState, setResendState] = useState("idle");
  const [resendError, setResendError] = useState("");

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
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        // Sans session avant la confirmation, le profil ne peut pas être écrit
        // ici : nom, téléphone et acceptation voyagent avec le compte et sont
        // enregistrés par /auth/confirm quand l'hôtelier clique sur le lien.
        data: { name: form.nombre, phone: form.phone, accepted_terms_at: new Date().toISOString() },
      },
    });

    if (signUpError) {
      setSending(false);
      setError(authErrorMessage(signUpError, locale));
      return;
    }

    // Email déjà inscrit et confirmé : Supabase répond "succès" sans rien
    // envoyer (pour ne pas révéler quels emails ont un compte).
    if (data.user && data.user.identities?.length === 0) {
      setSending(false);
      setError(authErrorMessage({ code: "user_already_exists" }, locale));
      return;
    }

    // Vérification d'email activée : pas de session tant que le lien n'est
    // pas cliqué. Ce n'est pas une erreur — on l'explique.
    if (!data.session) {
      setSending(false);
      setPending({ email: form.email, logoSkipped: Boolean(logo) });
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
      phone: form.phone,
      logo_url: logoUrl,
      accepted_terms_at: new Date().toISOString(),
    });

    setSending(false);

    if (insertError) {
      console.error("hosts insert failed:", insertError);
      setError(authErrorMessage({}, locale));
      return;
    }

    // Attend la requête avant de naviguer : sans ça, window.location.href
    // interrompt le fetch en plein envoi et la notification ne part jamais.
    await fetch("/api/host-signup-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.nombre, email: form.email, phone: form.phone }),
    }).catch(() => {});

    window.location.href = "/panel";
  }

  async function resendEmail() {
    setResendState("sending");
    setResendError("");
    const supabase = createClient();
    const { error: resendErr } = await supabase.auth.resend({
      type: "signup",
      email: pending.email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    if (resendErr) {
      setResendState("idle");
      setResendError(authErrorMessage(resendErr, locale));
      return;
    }
    setResendState("sent");
  }

  if (pending) {
    return (
      <main className="flex-1">
        <Hero backHref="/" backLabel={t.home} eyebrow="Tourist Book" title={t.checkTitle} />
        <section className="mx-auto max-w-sm px-6 py-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-ink">
            <MailIcon />
          </span>
          <p className="mt-5 text-ink/80">
            {t.checkSentTo} <strong className="break-all text-ink">{pending.email}</strong>.
          </p>
          <p className="mt-3 text-ink/80">{t.checkAfter}</p>
          <p className="mt-3 text-sm text-ink/60">{t.checkSpam}</p>
          {pending.logoSkipped && <p className="mt-3 text-sm text-ink/60">{t.logoLater}</p>}
          <button
            type="button"
            onClick={resendEmail}
            disabled={resendState === "sending"}
            className="mt-6 rounded border border-aqua-deep px-5 py-2.5 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card disabled:opacity-60"
          >
            {resendState === "sending" ? t.resending : t.resend}
          </button>
          {resendState === "sent" && <p className="mt-3 text-sm text-aqua-deep">{t.resent}</p>}
          {resendError && <p className="mt-3 text-sm text-terracotta-deep">{resendError}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero backHref="/" backLabel={t.home} eyebrow="Tourist Book" title={t.title} subtitle={t.subtitle} />
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
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.phone}</span>
            <input
              required
              type="tel"
              placeholder={t.phonePlaceholder}
              value={form.phone}
              onChange={update("phone")}
              className="input"
            />
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
