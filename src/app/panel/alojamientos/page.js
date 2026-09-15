"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";
import { useClientLocale } from "@/lib/i18n/clientLocale";
import { slugify, randomCode } from "@/lib/slug";

const content = {
  fr: {
    eyebrow: "Panel hôtelier",
    title: "Vos logements",
    newProperty: "+ Nouveau logement",
    loading: "Chargement…",
    empty: "Vous n'avez pas encore ajouté de logement.",
    noSubscription: "sans abonnement",
    plan: { basico: "Essentiel", premium: "Premium" },
    duplicate: "Dupliquer",
    duplicating: "Duplication…",
    duplicateCopySuffix: "(copie)",
    duplicateFailed: (msg) => `Impossible de dupliquer : ${msg}`,
  },
  en: {
    eyebrow: "Host panel",
    title: "Your properties",
    newProperty: "+ New property",
    loading: "Loading…",
    empty: "You haven't added any property yet.",
    noSubscription: "no subscription",
    plan: { basico: "Essential", premium: "Premium" },
    duplicate: "Duplicate",
    duplicating: "Duplicating…",
    duplicateCopySuffix: "(copy)",
    duplicateFailed: (msg) => `Could not duplicate: ${msg}`,
  },
  es: {
    eyebrow: "Panel hotelero",
    title: "Tus alojamientos",
    newProperty: "+ Nuevo alojamiento",
    loading: "Cargando…",
    empty: "Todavía no has añadido ningún alojamiento.",
    noSubscription: "sin suscripción",
    plan: { basico: "Básico", premium: "Premium" },
    duplicate: "Duplicar",
    duplicating: "Duplicando…",
    duplicateCopySuffix: "(copia)",
    duplicateFailed: (msg) => `No se pudo duplicar: ${msg}`,
  },
};

export default function AlojamientosPage() {
  const locale = useClientLocale();
  const t = content[locale];
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duplicatingId, setDuplicatingId] = useState(null);
  const [duplicateError, setDuplicateError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("host_id", user.id)
        .order("created_at", { ascending: false });
      setProperties(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDuplicate(e) {
    e.preventDefault();
    e.stopPropagation();
    const property = properties.find((p) => p.id === e.currentTarget.dataset.id);
    setDuplicatingId(property.id);
    setDuplicateError("");

    const supabase = createClient();
    const newName = `${property.name} ${t.duplicateCopySuffix}`;
    const slug = `${slugify(newName)}-${Math.random().toString(36).slice(2, 6)}`;

    // Repart de toutes les infos du logement d'origine, sauf ce qui est
    // propre à cette fiche précise : identifiant, slug, code d'accès, et
    // l'abonnement (une copie n'hérite pas du paiement de l'originale).
    const {
      id: _id,
      created_at: _createdAt,
      slug: _slug,
      access_code: _accessCode,
      plan: _plan,
      subscription_status: _subscriptionStatus,
      stripe_subscription_id: _stripeSubscriptionId,
      trial_ends_at: _trialEndsAt,
      billing_cycle: _billingCycle,
      ...rest
    } = property;

    const { data: inserted, error } = await supabase
      .from("properties")
      .insert({ ...rest, name: newName, slug, access_code: randomCode() })
      .select("id")
      .single();

    if (error) {
      setDuplicatingId(null);
      setDuplicateError(t.duplicateFailed(error.message));
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    // Attend la requête avant de naviguer : sans ça, window.location.href
    // interrompt le fetch en plein envoi et la notification ne part jamais.
    await fetch("/api/property-created-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hostEmail: user?.email, propertyName: newName, city: property.city }),
    }).catch(() => {});

    window.location.href = `/panel/alojamientos/${inserted.id}/editar`;
  }

  return (
    <main className="flex-1">
      <Hero eyebrow={t.eyebrow} title={t.title} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href="/panel/alojamientos/nuevo"
          className="inline-block rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
        >
          {t.newProperty}
        </Link>

        {loading && <p className="mt-6 text-ink/60">{t.loading}</p>}
        {!loading && properties.length === 0 && (
          <p className="mt-6 text-ink/60">{t.empty}</p>
        )}
        {duplicateError && <p className="mt-3 text-sm text-terracotta-deep">{duplicateError}</p>}

        <div className="mt-6 grid gap-3">
          {properties.map((p) => {
            const active = p.plan && p.subscription_status !== "canceled";
            return (
              <Link
                key={p.id}
                href={`/panel/alojamientos/${p.id}`}
                className="relative flex items-center gap-4 rounded border border-sand-dim bg-sand-card p-4 pb-10 transition-colors hover:border-aqua-deep"
              >
                {p.photos?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photos[0]} alt="" className="h-16 w-16 rounded object-cover" />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded bg-sand" />
                )}
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{p.city}</span>
                  <p className="font-display italic text-xl text-ink">{p.name}</p>
                </div>
                <span
                  className={`shrink-0 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                    active ? "bg-sage text-ink" : "bg-terracotta text-ink"
                  }`}
                >
                  {active ? (t.plan[p.plan] ?? p.plan) : t.noSubscription}
                </span>
                <button
                  type="button"
                  onClick={handleDuplicate}
                  data-id={p.id}
                  disabled={duplicatingId === p.id}
                  className="absolute bottom-2 right-2 rounded border border-sand-dim px-2.5 py-1.5 text-xs font-bold text-ink/60 transition-colors hover:border-aqua-deep hover:text-aqua-deep disabled:opacity-50"
                >
                  {duplicatingId === p.id ? t.duplicating : t.duplicate}
                </button>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
