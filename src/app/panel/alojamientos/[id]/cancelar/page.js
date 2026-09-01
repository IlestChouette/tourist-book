"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    eyebrow: "Panel hôtelier",
    loading: "Chargement…",
    notFound: "Logement introuvable",
    subscriptionEyebrow: "Abonnement",
    title: "Demander la résiliation",
    reasonLabel: "Dites-nous pourquoi vous partez",
    reasonPlaceholder: "Aidez-nous à nous améliorer : qu'est-ce qui vous a fait décider d'annuler ?",
    continue: "Continuer →",
    confirm1: (name, premium) =>
      `Voulez-vous vraiment résilier l'abonnement de ${name} ? Vos hôtes n'auront plus accès au livret${premium ? " ni au check-in électronique" : ""} une fois la résiliation effective.`,
    yesCancel: "Oui, je veux résilier",
    noKeep: "Non, garder mon abonnement",
    confirm2Title: "Dernière confirmation.",
    confirm2Annual: "Votre offre est annuelle : la résiliation ne peut prendre effet qu'à la fin de l'année en cours, sans remboursement de ce qui a déjà été facturé.",
    confirm2Seasonal: "Votre offre est saisonnière : la résiliation prendra effet à la fin du mois déjà facturé.",
    confirm2Footer: "Ceci envoie votre demande, elle ne résilie pas automatiquement — nous vous contacterons pour confirmer.",
    sending: "Envoi…",
    sendRequest: "Oui, envoyer la demande de résiliation",
    sendError: "Impossible d'envoyer la demande. Réessayez.",
    sent: (name) => `Nous avons bien reçu votre demande de résiliation pour ${name}. Nous l'examinerons et vous contacterons avant qu'elle prenne effet.`,
  },
  en: {
    eyebrow: "Host panel",
    loading: "Loading…",
    notFound: "Property not found",
    subscriptionEyebrow: "Subscription",
    title: "Request cancellation",
    reasonLabel: "Tell us why you're leaving",
    reasonPlaceholder: "Help us improve: what made you decide to cancel?",
    continue: "Continue →",
    confirm1: (name, premium) =>
      `Are you sure you want to cancel the subscription for ${name}? Your guests will lose access to the welcome book${premium ? " and electronic check-in" : ""} once the cancellation takes effect.`,
    yesCancel: "Yes, I want to cancel",
    noKeep: "No, keep my subscription",
    confirm2Title: "Final confirmation.",
    confirm2Annual: "Your plan is annual: cancellation can only take effect at the end of the current year, with no refund for what has already been billed.",
    confirm2Seasonal: "Your plan is seasonal: cancellation will take effect at the end of the already-billed month.",
    confirm2Footer: "This sends your request, it does not cancel automatically — we will contact you to confirm.",
    sending: "Sending…",
    sendRequest: "Yes, send the cancellation request",
    sendError: "Could not send the request. Please try again.",
    sent: (name) => `We've received your cancellation request for ${name}. We'll review it and contact you before it takes effect.`,
  },
  es: {
    eyebrow: "Panel hotelero",
    loading: "Cargando…",
    notFound: "Alojamiento no encontrado",
    subscriptionEyebrow: "Suscripción",
    title: "Solicitar cancelación",
    reasonLabel: "Cuéntanos por qué te vas",
    reasonPlaceholder: "Ayúdanos a mejorar: ¿qué te ha hecho decidir cancelar?",
    continue: "Continuar →",
    confirm1: (name, premium) =>
      `¿Seguro que quieres cancelar la suscripción de ${name}? Tus huéspedes dejarán de tener acceso al livret${premium ? " y al check-in electrónico" : ""} cuando la cancelación se haga efectiva.`,
    yesCancel: "Sí, quiero cancelar",
    noKeep: "No, mantener mi suscripción",
    confirm2Title: "Última confirmación.",
    confirm2Annual: "Tu plan es anual: la cancelación solo puede hacerse efectiva al finalizar el año en curso, sin reembolso de lo ya facturado.",
    confirm2Seasonal: "Tu plan es por temporada: la cancelación se hará efectiva al final del mes ya facturado.",
    confirm2Footer: "Esto enviará tu solicitud, no la cancela automáticamente — te contactaremos para confirmarlo.",
    sending: "Enviando…",
    sendRequest: "Sí, enviar solicitud de cancelación",
    sendError: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
    sent: (name) => `Hemos recibido tu solicitud de cancelación para ${name}. La revisaremos y nos pondremos en contacto contigo antes de hacerla efectiva.`,
  },
};

export default function CancelarPage({ params }) {
  const { id } = use(params);
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [step, setStep] = useState("form");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("properties")
        .select("name, plan, billing_cycle")
        .eq("id", id)
        .single();
      setProperty(data);
      setLoading(false);
    }
    load();
  }, [id]);

  function handleReasonSubmit(e) {
    e.preventDefault();
    if (!reason.trim()) return;
    setStep("confirm1");
  }

  async function sendRequest() {
    setSending(true);
    setError("");
    const res = await fetch("/api/cancellation-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: id, reason }),
    });
    setSending(false);
    if (!res.ok) {
      setError(t.sendError);
      return;
    }
    setStep("sent");
  }

  if (loading) {
    return (
      <main className="flex-1">
        <Hero eyebrow={t.eyebrow} title={t.loading} />
      </main>
    );
  }

  if (!property) {
    return (
      <main className="flex-1">
        <Hero eyebrow={t.eyebrow} title={t.notFound} />
      </main>
    );
  }

  const isAnual = property.billing_cycle === "anual";

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}`}
        backLabel={property.name}
        eyebrow={t.subscriptionEyebrow}
        title={t.title}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        {step === "form" && (
          <form onSubmit={handleReasonSubmit} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.reasonLabel}</span>
              <textarea
                required
                rows={5}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t.reasonPlaceholder}
                className="input"
              />
            </label>
            <button
              type="submit"
              className="rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              {t.continue}
            </button>
          </form>
        )}

        {step === "confirm1" && (
          <div className="rounded border border-sand-dim bg-sand-card p-5">
            <p className="text-ink">{t.confirm1(property.name, property.plan === "premium")}</p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("confirm2")}
                className="rounded border border-terracotta-deep px-5 py-2.5 font-bold text-terracotta-deep transition-colors hover:bg-terracotta hover:text-ink"
              >
                {t.yesCancel}
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
              >
                {t.noKeep}
              </button>
            </div>
          </div>
        )}

        {step === "confirm2" && (
          <div className="rounded border border-terracotta-deep bg-sand-card p-5">
            <p className="text-ink">
              <strong>{t.confirm2Title}</strong> {isAnual ? t.confirm2Annual : t.confirm2Seasonal} {t.confirm2Footer}
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={sendRequest}
                disabled={sending}
                className="rounded border border-terracotta-deep px-5 py-2.5 font-bold text-terracotta-deep transition-colors hover:bg-terracotta hover:text-ink disabled:opacity-60"
              >
                {sending ? t.sending : t.sendRequest}
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
              >
                {t.noKeep}
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-terracotta-deep">{error}</p>}
          </div>
        )}

        {step === "sent" && (
          <div className="rounded border border-sand-dim bg-sand-card p-5">
            <p className="text-ink">{t.sent(property.name)}</p>
          </div>
        )}
      </section>
    </main>
  );
}
