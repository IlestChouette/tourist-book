"use client";

import { use, useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    checkin: "Check-in",
    created: "Réservation créée",
    sendLink: "Envoyez ce lien à l'hôte pour qu'il fasse son check-in :",
    backToReservations: "← Retour aux réservations",
    reservations: "Réservations",
    title: "Nouvelle réservation",
    guestName: "Nom de l'hôte",
    arrival: "Arrivée",
    departure: "Départ",
    creating: "Création…",
    submit: "Créer la réservation et générer le lien →",
    error: "Impossible de créer la réservation.",
  },
  en: {
    checkin: "Check-in",
    created: "Booking created",
    sendLink: "Send this link to the guest so they can check in:",
    backToReservations: "← Back to bookings",
    reservations: "Bookings",
    title: "New booking",
    guestName: "Guest name",
    arrival: "Check-in",
    departure: "Check-out",
    creating: "Creating…",
    submit: "Create booking and generate link →",
    error: "Could not create the booking.",
  },
  es: {
    checkin: "Check-in",
    created: "Reserva creada",
    sendLink: "Envía este enlace al huésped para que haga su check-in:",
    backToReservations: "← Volver a las reservas",
    reservations: "Reservas",
    title: "Nueva reserva",
    guestName: "Nombre del huésped",
    arrival: "Llegada",
    departure: "Salida",
    creating: "Creando…",
    submit: "Crear reserva y generar enlace →",
    error: "No se pudo crear la reserva.",
  },
};

export default function NuevaReservaPage({ params }) {
  const { id } = use(params);
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [form, setForm] = useState({ guestName: "", arrivalDate: "", departureDate: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: id, ...form }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || t.error);
      return;
    }

    setLink(`${window.location.origin}/checkin/${data.token}`);
  }

  if (link) {
    return (
      <main className="flex-1">
        <Hero eyebrow={t.checkin} title={t.created} />
        <section className="mx-auto max-w-2xl px-6 py-10">
          <div className="rounded border border-sand-dim bg-sand-card p-5">
            <p className="text-ink">{t.sendLink}</p>
            <p className="mt-3 break-all rounded bg-sand px-4 py-3 font-mono text-sm text-ink">{link}</p>
          </div>
          <Link href={`/panel/alojamientos/${id}/reservas`} className="mt-4 inline-block font-bold text-aqua-deep">
            {t.backToReservations}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero backHref={`/panel/alojamientos/${id}/reservas`} backLabel={t.reservations} eyebrow={t.checkin} title={t.title} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.guestName}</span>
            <input required value={form.guestName} onChange={update("guestName")} className="input" />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.arrival}</span>
              <input required type="date" value={form.arrivalDate} onChange={update("arrivalDate")} className="input" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.departure}</span>
              <input
                required
                type="date"
                value={form.departureDate}
                onChange={update("departureDate")}
                className="input"
              />
            </label>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {saving ? t.creating : t.submit}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        </form>
      </section>
    </main>
  );
}
