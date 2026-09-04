"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";
import { formatTransferWhatsAppMessage } from "@/lib/transferMessage";

const content = {
  fr: {
    eyebrow: "Panel hôtelier",
    loading: "Chargement…",
    title: "Demandes de transfert",
    property: "Logement",
    empty: "Aucune demande de transfert pour le moment.",
    passengers: "passager(s)",
    whatsappSent: "Envoyée par WhatsApp ✓",
    whatsappNotSent: "Non envoyée automatiquement",
    flight: "Vol",
    bags: "Bagages",
    notes: "Remarques",
    copy: "Copier le message",
    copied: "Copié !",
    ratesTitle: "Tarifs (privé)",
    ratesHint: "Visible uniquement par vous — jamais montré au voyageur ni au transporteur. Sert de mémo pour répondre vite.",
    ratesEmpty: "Aucun tarif enregistré pour l'instant.",
    pickupLocation: "Lieu de prise en charge",
    pickupPlaceholder: "Ex : Aéroport Nice Côte d'Azur",
    passengersLabel: "Passagers",
    price: "Prix (€)",
    addRate: "Ajouter →",
    delete: "Supprimer",
  },
  en: {
    eyebrow: "Host panel",
    loading: "Loading…",
    title: "Transfer requests",
    property: "Property",
    empty: "No transfer requests yet.",
    passengers: "passenger(s)",
    whatsappSent: "Sent via WhatsApp ✓",
    whatsappNotSent: "Not sent automatically",
    flight: "Flight",
    bags: "Bags",
    notes: "Notes",
    copy: "Copy message",
    copied: "Copied!",
    ratesTitle: "Rates (private)",
    ratesHint: "Only visible to you — never shown to the guest or the driver. A quick reference to answer fast.",
    ratesEmpty: "No rate saved yet.",
    pickupLocation: "Pickup location",
    pickupPlaceholder: "E.g.: Nice Côte d'Azur Airport",
    passengersLabel: "Passengers",
    price: "Price (€)",
    addRate: "Add →",
    delete: "Delete",
  },
  es: {
    eyebrow: "Panel hotelero",
    loading: "Cargando…",
    title: "Solicitudes de transfer",
    property: "Alojamiento",
    empty: "Todavía no hay solicitudes de transfer.",
    passengers: "pasajero(s)",
    whatsappSent: "Enviada por WhatsApp ✓",
    whatsappNotSent: "No enviada automáticamente",
    flight: "Vuelo",
    bags: "Equipaje",
    notes: "Comentarios",
    copy: "Copiar mensaje",
    copied: "¡Copiado!",
    ratesTitle: "Tarifas (privado)",
    ratesHint: "Solo lo ves tú — nunca se muestra al huésped ni al transportista. Sirve de referencia rápida para responder rápido.",
    ratesEmpty: "Todavía no hay ninguna tarifa guardada.",
    pickupLocation: "Lugar de recogida",
    pickupPlaceholder: "Ej: Aeropuerto Niza Costa Azul",
    passengersLabel: "Pasajeros",
    price: "Precio (€)",
    addRate: "Agregar →",
    delete: "Eliminar",
  },
};

export default function TransfertsPage({ params }) {
  const { id } = use(params);
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [property, setProperty] = useState(null);
  const [requests, setRequests] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [newRate, setNewRate] = useState({ pickup_location: "", passengers: "1", price: "" });
  const [savingRate, setSavingRate] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: prop } = await supabase.from("properties").select("name, address").eq("id", id).single();
      setProperty(prop);

      const res = await fetch(`/api/requests?propertyId=${id}`);
      setRequests(res.ok ? await res.json() : []);

      const { data: rateRows } = await supabase
        .from("transfer_rates")
        .select("*")
        .eq("property_id", id)
        .order("created_at", { ascending: true });
      setRates(rateRows ?? []);

      setLoading(false);
    }
    load();
  }, [id]);

  async function addRate(e) {
    e.preventDefault();
    if (!newRate.pickup_location || !newRate.price) return;
    setSavingRate(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("transfer_rates")
      .insert({
        property_id: id,
        pickup_location: newRate.pickup_location,
        passengers: Number(newRate.passengers),
        price: Number(newRate.price),
      })
      .select()
      .single();
    setSavingRate(false);
    if (!error) {
      setRates((r) => [...r, data]);
      setNewRate({ pickup_location: "", passengers: "1", price: "" });
    }
  }

  async function deleteRate(rateId) {
    const supabase = createClient();
    await supabase.from("transfer_rates").delete().eq("id", rateId);
    setRates((r) => r.filter((rate) => rate.id !== rateId));
  }

  async function copyMessage(r) {
    const message = formatTransferWhatsAppMessage({
      propertyName: property?.name ?? "",
      nom: r.nom,
      telephone: r.telephone,
      details: r.details,
    });
    try {
      await navigator.clipboard.writeText(message);
      setCopiedId(r.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Presse-papiers indisponible (permissions navigateur) : on ignore silencieusement.
    }
  }

  if (loading) {
    return (
      <main className="flex-1">
        <Hero eyebrow={t.eyebrow} title={t.loading} />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}`}
        backLabel={property?.name ?? t.property}
        eyebrow={t.eyebrow}
        title={t.title}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-sand-dim bg-sand-card p-4">
          <h2 className="font-display italic text-xl text-ink">{t.ratesTitle}</h2>
          <p className="mt-1 text-xs text-ink/60">{t.ratesHint}</p>

          {rates.length === 0 && <p className="mt-3 text-sm text-ink/60">{t.ratesEmpty}</p>}
          {rates.length > 0 && (
            <div className="mt-3 grid gap-2">
              {rates.map((rate) => (
                <div key={rate.id} className="flex items-center justify-between gap-2 rounded border border-sand-dim bg-sand p-2.5 text-sm">
                  <span className="text-ink">
                    {rate.pickup_location} · {rate.passengers} {t.passengers} · <strong>{Number(rate.price).toFixed(2)} €</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteRate(rate.id)}
                    className="shrink-0 text-xs font-bold uppercase tracking-wide text-terracotta-deep hover:underline"
                  >
                    {t.delete}
                  </button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={addRate} className="mt-4 grid gap-2 sm:grid-cols-[2fr_1fr_1fr_auto]">
            <input
              placeholder={t.pickupPlaceholder}
              value={newRate.pickup_location}
              onChange={(e) => setNewRate((f) => ({ ...f, pickup_location: e.target.value }))}
              className="input"
            />
            <input
              type="number"
              min="1"
              placeholder={t.passengersLabel}
              value={newRate.passengers}
              onChange={(e) => setNewRate((f) => ({ ...f, passengers: e.target.value }))}
              className="input"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder={t.price}
              value={newRate.price}
              onChange={(e) => setNewRate((f) => ({ ...f, price: e.target.value }))}
              className="input"
            />
            <button
              type="submit"
              disabled={savingRate}
              className="rounded bg-aqua-deep px-4 py-2 text-sm font-bold text-sand-card transition-colors hover:bg-aqua-deep/90 disabled:opacity-60"
            >
              {t.addRate}
            </button>
          </form>
        </div>

        <h2 className="mt-8 font-display italic text-xl text-ink">{t.title}</h2>
        {requests.length === 0 && <p className="mt-2 text-ink/60">{t.empty}</p>}

        <div className="grid gap-3">
          {requests.map((r) => {
            const d = r.details || {};
            return (
              <div key={r.id} className="rounded border border-sand-dim bg-sand-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-display italic text-xl text-ink">{r.nom}</span>
                  <span
                    className={`shrink-0 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                      r.whatsapp_sent ? "bg-sage text-ink" : "bg-sand-dim text-ink/70"
                    }`}
                  >
                    {r.whatsapp_sent ? t.whatsappSent : t.whatsappNotSent}
                  </span>
                </div>
                <p className="mt-2 text-ink/80">
                  {d.date} · {d.heure} · {d.lieu}
                </p>
                <p className="mt-1 text-sm text-ink/70">
                  {d.passagers} {t.passengers}
                  {d.vol ? ` · ${t.flight}: ${d.vol}` : ""}
                  {(d.bagagesGrands || d.bagagesPetits) ? ` · ${t.bags}: ${d.bagagesGrands ?? 0}+${d.bagagesPetits ?? 0}` : ""}
                </p>
                {r.telephone && <p className="mt-1 text-sm text-ink/70">{r.telephone}</p>}
                {d.remarques && (
                  <p className="mt-2 text-sm text-ink/70">
                    {t.notes}: {d.remarques}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => copyMessage(r)}
                    className="rounded border border-aqua-deep px-4 py-2 text-xs font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card"
                  >
                    {copiedId === r.id ? t.copied : t.copy}
                  </button>
                  <p className="text-xs text-ink/50">{new Date(r.created_at).toLocaleString(locale)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
