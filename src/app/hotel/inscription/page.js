"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { authErrorMessage } from "@/lib/authErrors";
import { MailIcon } from "@/components/icons";
import Hero from "@/components/Hero";

const label = "text-xs font-bold uppercase tracking-wider text-ink/60";

export default function HotelInscriptionPage() {
  const [form, setForm] = useState({ hotel: "", nom: "", email: "", password: "" });
  const [accepted, setAccepted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [pendingEmail, setPendingEmail] = useState(null);
  const [resend, setResend] = useState("idle");

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!accepted) {
      setError("Vous devez accepter les Conditions d'utilisation et la Politique de confidentialité pour continuer.");
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
        // Pas de session avant la confirmation : l'hôtel est créé par
        // /auth/confirm à partir de ces informations.
        data: {
          account_type: "hotel",
          hotel_name: form.hotel,
          name: form.nom,
          accepted_terms_at: new Date().toISOString(),
        },
      },
    });
    setSending(false);

    if (signUpError) return setError(authErrorMessage(signUpError, "fr"));
    if (data.user && data.user.identities?.length === 0) {
      return setError(authErrorMessage({ code: "user_already_exists" }, "fr"));
    }
    setPendingEmail(form.email);
  }

  async function resendEmail() {
    setResend("sending");
    const supabase = createClient();
    const { error: err } = await supabase.auth.resend({
      type: "signup",
      email: pendingEmail,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    setResend(err ? "error" : "sent");
  }

  if (pendingEmail) {
    return (
      <main className="flex-1">
        <Hero backHref="/hotel" backLabel="Espace hôtels" eyebrow="Espace hôtels" title="Vérifiez votre boîte mail" />
        <section className="mx-auto max-w-sm px-6 py-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-ink">
            <MailIcon />
          </span>
          <p className="mt-5 text-ink/80">
            Nous venons d'envoyer un lien de confirmation à <strong className="break-all text-ink">{pendingEmail}</strong>.
          </p>
          <p className="mt-3 text-ink/80">
            Cliquez dessus : vous arriverez directement dans la configuration de votre hôtel, où vous pourrez ajouter
            son logo.
          </p>
          <p className="mt-3 text-sm text-ink/60">Rien reçu ? Regardez dans vos spams ou courriers indésirables.</p>
          <button
            type="button"
            onClick={resendEmail}
            disabled={resend === "sending"}
            className="mt-6 rounded border border-aqua-deep px-5 py-2.5 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card disabled:opacity-60"
          >
            {resend === "sending" ? "Envoi…" : "Renvoyer l'email"}
          </button>
          {resend === "sent" && <p className="mt-3 text-sm text-aqua-deep">Email renvoyé. Patientez une minute avant d'en redemander un.</p>}
          {resend === "error" && <p className="mt-3 text-sm text-terracotta-deep">{authErrorMessage({}, "fr")}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero
        backHref="/hotel"
        backLabel="Espace hôtels"
        eyebrow="Espace hôtels"
        title="Créer l'espace de votre hôtel"
        subtitle="Un mois d'essai gratuit, sans engagement."
      />
      <section className="mx-auto max-w-sm px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className={label}>Nom de l'hôtel</span>
            <input required value={form.hotel} onChange={update("hotel")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className={label}>Votre nom (manager)</span>
            <input required value={form.nom} onChange={update("nom")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className={label}>Email</span>
            <input required type="email" value={form.email} onChange={update("email")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className={label}>Mot de passe</span>
            <input required type="password" minLength={6} value={form.password} onChange={update("password")} className="input" />
          </label>
          <p className="text-sm text-ink/60">Vous ajouterez le logo de l'hôtel juste après la confirmation de votre email.</p>
          <label className="flex items-start gap-2 text-sm text-ink/80">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1" />
            <span>
              J'ai lu et j'accepte les{" "}
              <a href="/terminos" target="_blank" className="font-bold text-aqua-deep">
                Conditions d'utilisation et d'abonnement
              </a>{" "}
              et la{" "}
              <a href="/privacidad" target="_blank" className="font-bold text-aqua-deep">
                Politique de confidentialité
              </a>
              .
            </span>
          </label>
          <button
            type="submit"
            disabled={sending}
            className="mt-2 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {sending ? "Création…" : "Créer mon espace →"}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-ink/70">
          Déjà un espace ?{" "}
          <Link href="/hotel/connexion" className="font-bold text-aqua-deep">
            Connectez-vous
          </Link>
        </p>
      </section>
    </main>
  );
}
