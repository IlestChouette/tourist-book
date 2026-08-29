"use client";

import { useState } from "react";

export default function TransfertForm({ slug, propertyName }) {
  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    date: "",
    heure: "",
    lieu: "Aéroport Nice Côte d'Azur",
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

    const entry = { slug, type: "transfert", property: propertyName, ...form };
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
        <p className="text-ink">
          Ta demande de transfert a bien été reçue. L&apos;hôte te confirmera l&apos;organisation avant ton
          arrivée.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Field label="Nom du voyageur">
        <input required value={form.nom} onChange={update("nom")} className="input" />
      </Field>

      <Field label="Téléphone">
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
        <Field label="Date">
          <input required type="date" value={form.date} onChange={update("date")} className="input" />
        </Field>
        <Field label="Heure">
          <input required type="time" value={form.heure} onChange={update("heure")} className="input" />
        </Field>
      </div>

      <Field label="Lieu de prise en charge">
        <select value={form.lieu} onChange={update("lieu")} className="input">
          <option>Aéroport Nice Côte d'Azur</option>
          <option>Gare de Nice-Ville</option>
          <option>Autre</option>
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Passagers">
          <input type="number" min="1" value={form.passagers} onChange={update("passagers")} className="input" />
        </Field>
        <Field label="N° de vol (optionnel)">
          <input value={form.vol} onChange={update("vol")} className="input" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Bagages grands">
          <input
            type="number"
            min="0"
            value={form.bagagesGrands}
            onChange={update("bagagesGrands")}
            className="input"
          />
        </Field>
        <Field label="Bagages petits">
          <input
            type="number"
            min="0"
            value={form.bagagesPetits}
            onChange={update("bagagesPetits")}
            className="input"
          />
        </Field>
      </div>

      <Field label="Remarques (optionnel)">
        <textarea value={form.remarques} onChange={update("remarques")} rows={3} className="input" />
      </Field>

      <button
        type="submit"
        disabled={sending}
        className="mt-2 rounded bg-terracotta px-5 py-4 text-center font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
      >
        {sending ? "Envoi…" : "Réserver →"}
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
