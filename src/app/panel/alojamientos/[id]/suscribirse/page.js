"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    property: "Logement",
    eyebrow: "Abonnement",
    title: "Choisissez l'offre de ce logement",
    subtitle: "L'abonnement est par logement, pas par compte.",
    cycles: [
      { key: "anual", label: "Annuel" },
      { key: "temporada", label: "Saisonnier" },
    ],
    cycleInfo: {
      anual: "1 mois offert la première fois (par compte). Se renouvelle chaque année ; vous ne pouvez annuler le renouvellement qu'une fois l'année en cours terminée.",
      temporada: "Sans période d'essai. Facturation mensuelle, résiliable à tout moment.",
    },
    plans: [
      {
        key: "basico",
        name: "Livret d'accueil",
        price: { anual: "39,99 €", temporada: "7 €" },
        period: { anual: "/ an", temporada: "/ mois" },
        features: ["Livret numérique multilingue", "Livre d'or", "Guide local", "Assistant"],
      },
      {
        key: "premium",
        name: "Livret + Check-in",
        price: { anual: "59,99 €", temporada: "10 €" },
        period: { anual: "/ an", temporada: "/ mois" },
        features: [
          "Tout ce qui est inclus dans l'offre Essentiel",
          "Check-in électronique par réservation",
          "Lien unique par hôte",
          "Accès avec identifiant et mot de passe",
        ],
      },
    ],
    redirecting: "Redirection…",
    startTrial: "Démarrer l'essai gratuit →",
    subscribe: "S'abonner →",
    checkoutError: "Impossible de démarrer le paiement. Réessayez.",
  },
  en: {
    property: "Property",
    eyebrow: "Subscription",
    title: "Choose this property's plan",
    subtitle: "The subscription is per property, not per account.",
    cycles: [
      { key: "anual", label: "Annual" },
      { key: "temporada", label: "Seasonal" },
    ],
    cycleInfo: {
      anual: "1 month free the first time (per account). Renews every year; you can only cancel the renewal once the current year is over.",
      temporada: "No trial period. Monthly billing, cancel anytime.",
    },
    plans: [
      {
        key: "basico",
        name: "Welcome book",
        price: { anual: "€39.99", temporada: "€7" },
        period: { anual: "/ year", temporada: "/ month" },
        features: ["Multilingual digital welcome book", "Guestbook", "Local guide", "Assistant"],
      },
      {
        key: "premium",
        name: "Book + Check-in",
        price: { anual: "€59.99", temporada: "€10" },
        period: { anual: "/ year", temporada: "/ month" },
        features: [
          "Everything in the Essential plan",
          "Electronic check-in per booking",
          "Unique link per guest",
          "Login with username and password",
        ],
      },
    ],
    redirecting: "Redirecting…",
    startTrial: "Start free trial →",
    subscribe: "Subscribe →",
    checkoutError: "Could not start checkout. Please try again.",
  },
  es: {
    property: "Alojamiento",
    eyebrow: "Suscripción",
    title: "Elige el plan de este alojamiento",
    subtitle: "La suscripción es por alojamiento, no por cuenta.",
    cycles: [
      { key: "anual", label: "Anual" },
      { key: "temporada", label: "Por temporada" },
    ],
    cycleInfo: {
      anual: "1 mes gratis la primera vez (por cuenta). Se renueva cada año; solo puedes cancelar la renovación una vez transcurrido el año en curso.",
      temporada: "Sin periodo de prueba. Facturación mensual, cancela cuando quieras.",
    },
    plans: [
      {
        key: "basico",
        name: "Libro de bienvenida",
        price: { anual: "39,99 €", temporada: "7 €" },
        period: { anual: "/ año", temporada: "/ mes" },
        features: ["Livret digital multilingüe", "Libro de oro", "Carta local", "Asistente"],
      },
      {
        key: "premium",
        name: "Libro + Check-in",
        price: { anual: "59,99 €", temporada: "10 €" },
        period: { anual: "/ año", temporada: "/ mes" },
        features: [
          "Todo lo del plan Básico",
          "Check-in electrónico por reserva",
          "Enlace único por huésped",
          "Acceso con usuario y contraseña",
        ],
      },
    ],
    redirecting: "Redirigiendo…",
    startTrial: "Empezar prueba gratuita →",
    subscribe: "Suscribirse →",
    checkoutError: "No se pudo iniciar el pago. Inténtalo de nuevo.",
  },
};

export default function SuscribirsePropiedadPage({ params }) {
  const { id } = use(params);
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [property, setProperty] = useState(null);
  const [cycle, setCycle] = useState("anual");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("properties").select("name").eq("id", id).single();
      setProperty(data);
    }
    load();
  }, [id]);

  async function subscribe(plan) {
    setLoadingPlan(plan);
    setError("");

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, cycle, propertyId: id }),
    });

    if (!res.ok) {
      setLoadingPlan(null);
      setError(t.checkoutError);
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}`}
        backLabel={property?.name ?? t.property}
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="flex justify-center">
          <div className="inline-flex rounded-full border border-sand-dim bg-sand-card p-1">
            {t.cycles.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCycle(c.key)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                  cycle === c.key ? "bg-terracotta text-ink" : "text-ink/60 hover:text-ink"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center text-sm text-ink/60">{t.cycleInfo[cycle]}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {t.plans.map((p) => (
            <div key={p.key} className="rounded border border-sand-dim bg-sand-card p-5">
              <h2 className="font-display italic text-2xl text-ink">{p.name}</h2>
              <p className="mt-1 text-2xl font-bold text-ink">
                {p.price[cycle]} <span className="text-sm font-normal text-ink/60">{p.period[cycle]}</span>
              </p>
              <ul className="mt-4 grid gap-1.5 text-sm text-ink/80">
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => subscribe(p.key)}
                disabled={loadingPlan !== null}
                className="mt-5 w-full rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
              >
                {loadingPlan === p.key ? t.redirecting : cycle === "anual" ? t.startTrial : t.subscribe}
              </button>
            </div>
          ))}
        </div>
        {error && <p className="mt-4 text-sm text-terracotta-deep">{error}</p>}
      </section>
    </main>
  );
}
