"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    eyebrow: "Tourist Book",
    title: "Réserver un transfert",
    name: "Nom du voyageur",
    phone: "Téléphone",
    date: "Date",
    time: "Heure",
    pickupLocation: "Lieu de prise en charge",
    airport: "Aéroport Nice Côte d'Azur",
    trainStation: "Gare de Nice-Ville",
    other: "Autre",
    otherLocation: "Précisez le lieu",
    passengers: "Passagers",
    flightNumber: "N° de vol (optionnel)",
    bigBags: "Bagages grands",
    smallBags: "Bagages petits",
    notes: "Remarques (optionnel)",
    sending: "Envoi…",
    submit: "Envoyer la demande →",
    sentMessage: "Ta demande a bien été reçue. Nous te contacterons sous peu pour te confirmer le tarif et l'organisation.",
    error: "Impossible d'envoyer la demande. Réessaie dans un instant.",
  },
  en: {
    eyebrow: "Tourist Book",
    title: "Book a transfer",
    name: "Traveller's name",
    phone: "Phone",
    date: "Date",
    time: "Time",
    pickupLocation: "Pickup location",
    airport: "Nice Côte d'Azur Airport",
    trainStation: "Nice-Ville Train Station",
    other: "Other",
    otherLocation: "Specify the location",
    passengers: "Passengers",
    flightNumber: "Flight number (optional)",
    bigBags: "Large bags",
    smallBags: "Small bags",
    notes: "Notes (optional)",
    sending: "Sending…",
    submit: "Send request →",
    sentMessage: "Your request has been received. We'll contact you shortly to confirm the price and arrangements.",
    error: "Could not send the request. Please try again in a moment.",
  },
  es: {
    eyebrow: "Tourist Book",
    title: "Reservar un transfer",
    name: "Nombre del viajero",
    phone: "Teléfono",
    date: "Fecha",
    time: "Hora",
    pickupLocation: "Lugar de recogida",
    airport: "Aeropuerto Niza Costa Azul",
    trainStation: "Estación Nice-Ville",
    other: "Otro",
    otherLocation: "Especifica el lugar",
    passengers: "Pasajeros",
    flightNumber: "N.º de vuelo (opcional)",
    bigBags: "Maletas grandes",
    smallBags: "Maletas pequeñas",
    notes: "Comentarios (opcional)",
    sending: "Enviando…",
    submit: "Enviar solicitud →",
    sentMessage: "Tu solicitud fue recibida. Te contactaremos en unos instantes para confirmarte la tarifa y la organización.",
    error: "No se pudo enviar la solicitud. Intenta de nuevo en un momento.",
  },
};

const PICKUP_KEYS = ["airport", "train_station", "other"];

export default function TransferIndependientePage() {
  const [locale] = useState(getClientLocale);
  const t = content[locale];
  const pickupLabels = { airport: t.airport, train_station: t.trainStation, other: t.other };

  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    date: "",
    heure: "",
    pickupKey: "airport",
    lieuAutre: "",
    passagers: "1",
    bagagesGrands: "0",
    bagagesPetits: "0",
    vol: "",
    remarques: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError("");

    const lieu = form.pickupKey === "other" ? form.lieuAutre : pickupLabels[form.pickupKey];

    try {
      const res = await fetch("/api/transfer-independiente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lieu }),
      });
      if (!res.ok) throw new Error("failed");
      setSent(true);
    } catch {
      setError(t.error);
    }
    setSending(false);
  }

  if (sent) {
    return (
      <main className="flex-1">
        <Hero eyebrow={t.eyebrow} title={t.title} />
        <section className="mx-auto max-w-2xl px-6 py-10">
          <div className="rounded border border-sand-dim bg-sand-card p-5">
            <p className="text-ink">{t.sentMessage}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero eyebrow={t.eyebrow} title={t.title} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Field label={t.name}>
            <input required value={form.nom} onChange={update("nom")} className="input" />
          </Field>

          <Field label={t.phone}>
            <input
              required
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={form.telephone}
              onChange={update("telephone")}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t.date}>
              <input required type="date" value={form.date} onChange={update("date")} className="input" />
            </Field>
            <Field label={t.time}>
              <input required type="time" value={form.heure} onChange={update("heure")} className="input" />
            </Field>
          </div>

          <Field label={t.pickupLocation}>
            <select
              value={form.pickupKey}
              onChange={(e) => setForm((f) => ({ ...f, pickupKey: e.target.value }))}
              className="input"
            >
              {PICKUP_KEYS.map((key) => (
                <option key={key} value={key}>
                  {pickupLabels[key]}
                </option>
              ))}
            </select>
          </Field>

          {form.pickupKey === "other" && (
            <Field label={t.otherLocation}>
              <input required value={form.lieuAutre} onChange={update("lieuAutre")} className="input" />
            </Field>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label={t.passengers}>
              <input type="number" min="1" value={form.passagers} onChange={update("passagers")} className="input" />
            </Field>
            <Field label={t.flightNumber}>
              <input value={form.vol} onChange={update("vol")} className="input" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label={t.bigBags}>
              <input
                type="number"
                min="0"
                value={form.bagagesGrands}
                onChange={update("bagagesGrands")}
                className="input"
              />
            </Field>
            <Field label={t.smallBags}>
              <input
                type="number"
                min="0"
                value={form.bagagesPetits}
                onChange={update("bagagesPetits")}
                className="input"
              />
            </Field>
          </div>

          <Field label={t.notes}>
            <textarea value={form.remarques} onChange={update("remarques")} rows={3} className="input" />
          </Field>

          <button
            type="submit"
            disabled={sending}
            className="mt-2 rounded bg-terracotta px-5 py-4 text-center font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {sending ? t.sending : t.submit}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        </form>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{label}</span>
      {children}
    </label>
  );
}
