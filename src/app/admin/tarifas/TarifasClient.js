"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PICKUP_OPTIONS = [
  { key: "airport", label: "Aéroport Nice Côte d'Azur" },
  { key: "train_station", label: "Gare de Nice-Ville" },
  { key: "other", label: "Autre" },
];

export default function TarifasClient({ properties }) {
  const [propertyId, setPropertyId] = useState(properties[0]?.id ?? "");
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newRate, setNewRate] = useState({ pickup_location: "airport", passengers: "4", luggage: "4", price: "" });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editRate, setEditRate] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const supabase = createClient();
    supabase
      .from("transfer_rates")
      .select("*")
      .eq("property_id", propertyId)
      .order("pickup_location", { ascending: true })
      .order("passengers", { ascending: true })
      .then(({ data }) => {
        setRates(data ?? []);
        setLoading(false);
      });
  }, [propertyId]);

  async function addRate(e) {
    e.preventDefault();
    if (!newRate.price) return;
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("transfer_rates")
      .insert({
        property_id: propertyId,
        pickup_location: newRate.pickup_location,
        passengers: Number(newRate.passengers),
        luggage: Number(newRate.luggage),
        price: Number(newRate.price),
      })
      .select()
      .single();
    setSaving(false);
    if (!error) {
      setRates((r) => [...r, data]);
      setNewRate({ pickup_location: "airport", passengers: "4", luggage: "4", price: "" });
    }
  }

  async function deleteRate(rateId) {
    const supabase = createClient();
    await supabase.from("transfer_rates").delete().eq("id", rateId);
    setRates((r) => r.filter((rate) => rate.id !== rateId));
  }

  function startEdit(rate) {
    setEditingId(rate.id);
    setEditRate({
      pickup_location: rate.pickup_location,
      passengers: String(rate.passengers),
      luggage: rate.luggage != null ? String(rate.luggage) : "",
      price: String(rate.price),
    });
  }

  async function saveEdit(rateId) {
    setSavingEdit(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("transfer_rates")
      .update({
        pickup_location: editRate.pickup_location,
        passengers: Number(editRate.passengers),
        luggage: editRate.luggage === "" ? null : Number(editRate.luggage),
        price: Number(editRate.price),
      })
      .eq("id", rateId)
      .select()
      .single();
    setSavingEdit(false);
    if (!error) {
      setRates((r) => r.map((rate) => (rate.id === rateId ? data : rate)));
      setEditingId(null);
      setEditRate(null);
    }
  }

  return (
    <main className="flex-1 bg-sand">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/admin" className="text-sm font-bold text-aqua-deep">
          ← Admin
        </Link>
        <h1 className="mt-3 font-display italic text-3xl text-ink">Tarifs de transfert</h1>
        <p className="mt-2 text-ink/70">
          Ces tarifs sont affichés directement au voyageur dans le formulaire de transfert. Les hôteliers les voient
          en lecture seule, sans pouvoir les modifier.
        </p>

        <label className="mt-6 grid gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Logement</span>
          <select value={propertyId} onChange={(e) => setPropertyId(e.target.value)} className="input">
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.city})
              </option>
            ))}
          </select>
        </label>

        {loading && <p className="mt-4 text-ink/60">Chargement…</p>}

        {!loading && (
          <>
            <div className="mt-4 grid gap-2">
              {rates.length === 0 && <p className="text-sm text-ink/60">Aucun tarif configuré pour ce logement.</p>}
              {rates.map((rate) =>
                editingId === rate.id ? (
                  <div
                    key={rate.id}
                    className="grid gap-2 rounded border border-aqua-deep bg-sand-card p-2.5 text-sm sm:grid-cols-[2fr_1fr_1fr_1fr_auto_auto] sm:items-center"
                  >
                    <select
                      value={editRate.pickup_location}
                      onChange={(e) => setEditRate((f) => ({ ...f, pickup_location: e.target.value }))}
                      className="input"
                    >
                      {PICKUP_OPTIONS.map((o) => (
                        <option key={o.key} value={o.key}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={editRate.passengers}
                      onChange={(e) => setEditRate((f) => ({ ...f, passengers: e.target.value }))}
                      className="input"
                    />
                    <input
                      type="number"
                      min="0"
                      value={editRate.luggage}
                      onChange={(e) => setEditRate((f) => ({ ...f, luggage: e.target.value }))}
                      className="input"
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editRate.price}
                      onChange={(e) => setEditRate((f) => ({ ...f, price: e.target.value }))}
                      className="input"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(rate.id)}
                      disabled={savingEdit}
                      className="rounded bg-aqua-deep px-3 py-2 text-xs font-bold text-sand-card transition-colors hover:bg-aqua-deep/90 disabled:opacity-60"
                    >
                      Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setEditRate(null);
                      }}
                      className="text-xs font-bold uppercase tracking-wide text-ink/60 hover:underline"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <div
                    key={rate.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded border border-sand-dim bg-sand-card p-2.5 text-sm"
                  >
                    <span className="text-ink">
                      {PICKUP_OPTIONS.find((o) => o.key === rate.pickup_location)?.label ?? rate.pickup_location} ·
                      jusqu&apos;à {rate.passengers} passager(s)
                      {rate.luggage != null ? ` · jusqu'à ${rate.luggage} bagage(s)` : ""} ·{" "}
                      <strong>{Number(rate.price).toFixed(2)} €</strong>
                    </span>
                    <div className="flex shrink-0 gap-3">
                      <button
                        type="button"
                        onClick={() => startEdit(rate)}
                        className="text-xs font-bold uppercase tracking-wide text-aqua-deep hover:underline"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRate(rate.id)}
                        className="text-xs font-bold uppercase tracking-wide text-terracotta-deep hover:underline"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            <form onSubmit={addRate} className="mt-4 grid gap-3 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:items-end">
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Lieu de prise en charge</span>
                <select
                  value={newRate.pickup_location}
                  onChange={(e) => setNewRate((f) => ({ ...f, pickup_location: e.target.value }))}
                  className="input"
                >
                  {PICKUP_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Jusqu&apos;à X passagers</span>
                <input
                  type="number"
                  min="1"
                  value={newRate.passengers}
                  onChange={(e) => setNewRate((f) => ({ ...f, passengers: e.target.value }))}
                  className="input"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Jusqu&apos;à X bagages</span>
                <input
                  type="number"
                  min="0"
                  value={newRate.luggage}
                  onChange={(e) => setNewRate((f) => ({ ...f, luggage: e.target.value }))}
                  className="input"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Prix (€)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newRate.price}
                  onChange={(e) => setNewRate((f) => ({ ...f, price: e.target.value }))}
                  className="input"
                />
              </label>
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-aqua-deep px-4 py-2.5 text-sm font-bold text-sand-card transition-colors hover:bg-aqua-deep/90 disabled:opacity-60"
              >
                Ajouter →
              </button>
            </form>
            <p className="mt-2 text-xs text-ink/60">
              Astuce : pensez véhicule, pas seulement passagers — une berline (4 places, ~3 bagages) et un van (8
              places, ~8 bagages) n&apos;ont pas le même prix.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
