"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";
import QrCodeButton from "@/components/QrCodeButton";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    eyebrow: "Panel hôtelier",
    loading: "Chargement…",
    notFound: "Logement introuvable",
    backLabel: "Vos logements",
    address: "Adresse :",
    accessCode: "Code d'accès :",
    plan: "Offre :",
    noSubscription: "sans abonnement",
    viewLivret: "Voir le livret →",
    edit: "Modifier →",
    activate: "Activer l'abonnement →",
    reservations: "Réservations et check-in →",
    transferts: "Demandes de transfert →",
    requestCancel: "Demander la résiliation",
    deleting: "Suppression…",
    delete: "Supprimer le logement",
    confirmDelete: (name) =>
      `Voulez-vous vraiment supprimer "${name}" ? Cette action est irréversible — ses données seront perdues et son abonnement ne sera pas résilié automatiquement sur Stripe.`,
    deleteFailed: (msg) => `Impossible de supprimer : ${msg}`,
  },
  en: {
    eyebrow: "Host panel",
    loading: "Loading…",
    notFound: "Property not found",
    backLabel: "Your properties",
    address: "Address:",
    accessCode: "Access code:",
    plan: "Plan:",
    noSubscription: "no subscription",
    viewLivret: "View livret →",
    edit: "Edit →",
    activate: "Activate subscription →",
    reservations: "Bookings and check-in →",
    transferts: "Transfer requests →",
    requestCancel: "Request cancellation",
    deleting: "Deleting…",
    delete: "Delete property",
    confirmDelete: (name) =>
      `Are you sure you want to delete "${name}"? This cannot be undone — its data will be lost and its subscription is not automatically cancelled on Stripe.`,
    deleteFailed: (msg) => `Could not delete: ${msg}`,
  },
  es: {
    eyebrow: "Panel hotelero",
    loading: "Cargando…",
    notFound: "Alojamiento no encontrado",
    backLabel: "Tus alojamientos",
    address: "Dirección:",
    accessCode: "Código de acceso:",
    plan: "Plan:",
    noSubscription: "sin suscripción",
    viewLivret: "Ver livret →",
    edit: "Editar →",
    activate: "Activar suscripción →",
    reservations: "Reservas y check-in →",
    transferts: "Solicitudes de transfer →",
    requestCancel: "Solicitar cancelación",
    deleting: "Eliminando…",
    delete: "Eliminar alojamiento",
    confirmDelete: (name) =>
      `¿Seguro que quieres eliminar "${name}"? Esta acción no se puede deshacer — se perderán sus datos y su suscripción no se cancela automáticamente en Stripe.`,
    deleteFailed: (msg) => `No se pudo eliminar: ${msg}`,
  },
};

export default function AlojamientoDetallePage({ params }) {
  const { id } = use(params);
  const [locale] = useState(getClientLocale);
  const t = content[locale];
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("properties").select("*").eq("id", id).single();
      setProperty(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleViewLivret() {
    try {
      await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: property.slug, code: property.access_code }),
      });
    } catch {
      // Si ça échoue, l'onglet ouvre quand même — au pire il faudra entrer le code manuellement.
    }
    window.open(`/logement/${property.slug}`, "_blank");
  }

  async function handleDelete() {
    const confirmed = window.confirm(t.confirmDelete(property.name));
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      setDeleting(false);
      alert(t.deleteFailed(error.message));
      return;
    }
    window.location.href = "/panel/alojamientos";
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

  const active = property.plan && property.subscription_status !== "canceled";

  return (
    <main className="flex-1">
      <Hero
        backHref="/panel/alojamientos"
        backLabel={t.backLabel}
        eyebrow={property.city}
        title={property.name}
        photo={property.photos?.[0] ?? null}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        {property.photos?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {property.photos.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                className="h-20 w-28 shrink-0 rounded object-cover border border-sand-dim"
              />
            ))}
          </div>
        )}

        <div className="mt-4 rounded border border-sand-dim bg-sand-card p-5">
          <p className="text-ink">{t.address} {property.address}</p>
          <p className="mt-1 text-ink">{t.accessCode} {property.access_code}</p>
          <p className="mt-3 text-ink">
            {t.plan}{" "}
            {active ? (
              <span className="font-bold text-sage">
                {property.plan}
                {property.billing_cycle ? ` · ${property.billing_cycle}` : ""} ·{" "}
                {property.subscription_status}
              </span>
            ) : (
              <span className="font-bold text-terracotta-deep">{t.noSubscription}</span>
            )}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleViewLivret}
            className="inline-block rounded bg-aqua-deep px-5 py-3 font-bold text-sand-card transition-colors hover:bg-aqua-deep/90"
          >
            {t.viewLivret}
          </button>
          <QrCodeButton slug={property.slug} accessCode={property.access_code} propertyName={property.name} />
          <Link
            href={`/panel/alojamientos/${id}/editar`}
            className="inline-block rounded border border-aqua-deep px-5 py-3 font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card"
          >
            {t.edit}
          </Link>
          {!active && (
            <Link
              href={`/panel/alojamientos/${id}/suscribirse`}
              className="inline-block rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              {t.activate}
            </Link>
          )}
          {active && property.plan === "premium" && (
            <Link
              href={`/panel/alojamientos/${id}/reservas`}
              className="inline-block rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              {t.reservations}
            </Link>
          )}
          {active && (
            <Link
              href={`/panel/alojamientos/${id}/transferts`}
              className="inline-block rounded border border-aqua-deep px-5 py-3 font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card"
            >
              {t.transferts}
            </Link>
          )}
          {active && (
            <Link
              href={`/panel/alojamientos/${id}/cancelar`}
              className="inline-block rounded border border-sand-dim px-5 py-3 font-bold text-ink/60 transition-colors hover:border-terracotta-deep hover:text-terracotta-deep"
            >
              {t.requestCancel}
            </Link>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded border border-terracotta-deep px-5 py-3 font-bold text-terracotta-deep transition-colors hover:bg-terracotta hover:text-ink disabled:opacity-60"
          >
            {deleting ? t.deleting : t.delete}
          </button>
        </div>
      </section>
    </main>
  );
}
