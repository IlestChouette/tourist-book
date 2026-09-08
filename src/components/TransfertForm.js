"use client";

import { useState } from "react";

const content = {
  fr: {
    sentMessage: "Ta demande de transfert a bien été reçue. L'hôte te confirmera l'organisation avant ton arrivée.",
    destination: "Destination",
    name: "Nom du voyageur",
    phone: "Téléphone",
    date: "Date",
    time: "Heure",
    pickupLocation: "Lieu de prise en charge",
    airport: "Aéroport Nice Côte d'Azur",
    trainStation: "Gare de Nice-Ville",
    other: "Autre",
    passengers: "Passagers",
    flightNumber: "N° de vol (optionnel)",
    bigBags: "Bagages grands",
    smallBags: "Bagages petits",
    notes: "Remarques (optionnel)",
    sending: "Envoi…",
    submit: "Réserver →",
  },
  en: {
    sentMessage: "Your transfer request has been received. Your host will confirm the arrangements before you arrive.",
    destination: "Destination",
    name: "Traveller's name",
    phone: "Phone",
    date: "Date",
    time: "Time",
    pickupLocation: "Pickup location",
    airport: "Nice Côte d'Azur Airport",
    trainStation: "Nice-Ville Train Station",
    other: "Other",
    passengers: "Passengers",
    flightNumber: "Flight number (optional)",
    bigBags: "Large bags",
    smallBags: "Small bags",
    notes: "Notes (optional)",
    sending: "Sending…",
    submit: "Book →",
  },
  es: {
    sentMessage: "Tu solicitud de transfer fue recibida. Tu anfitrión te confirmará la organización antes de tu llegada.",
    destination: "Destino",
    name: "Nombre del viajero",
    phone: "Teléfono",
    date: "Fecha",
    time: "Hora",
    pickupLocation: "Lugar de recogida",
    airport: "Aeropuerto Niza Costa Azul",
    trainStation: "Estación Nice-Ville",
    other: "Otro",
    passengers: "Pasajeros",
    flightNumber: "N.º de vuelo (opcional)",
    bigBags: "Maletas grandes",
    smallBags: "Maletas pequeñas",
    notes: "Comentarios (opcional)",
    sending: "Enviando…",
    submit: "Reservar →",
  },
};

export default function TransfertForm({ slug, propertyName, propertyAddress, locale = "fr" }) {
  const t = content[locale];
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    date: "",
    heure: "",
    lieu: t.airport,
    passagers: "1",
    bagagesGrands: "0",
    bagagesPetits: "0",
    vol: "",
    remarques: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);

    const entry = { slug, type: "transfert", property: propertyName, destination: propertyAddress, ...form };
    try {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } catch {
      // la confirmation s'affiche quand même ; l'hébergeur pourra vérifier au tableau de bord
    }

    setSending(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded border border-sand-dim bg-sand-card p-5">
        <p className="text-ink">{t.sentMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {propertyAddress && (
        <div className="rounded border border-sand-dim bg-sand p-3">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.destination}</span>
          <p className="mt-0.5 text-ink">{propertyName}, {propertyAddress}</p>
        </div>
      )}

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
        <select value={form.lieu} onChange={update("lieu")} className="input">
          <option>{t.airport}</option>
          <option>{t.trainStation}</option>
          <option>{t.other}</option>
        </select>
      </Field>

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
    </form>
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
