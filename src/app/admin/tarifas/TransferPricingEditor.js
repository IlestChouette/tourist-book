"use client";

import { useState } from "react";
import { clientPrice } from "@/lib/transferCityRates";

function PriceCell({ net, pct }) {
  const valid = Number(net) > 0;
  const price = valid ? clientPrice(net, pct) : null;
  return (
    <td className="px-3 py-2 text-ink">
      {price != null ? (
        <>
          <strong>{price} €</strong>
          <span className="ml-1 text-xs text-ink/50">(+{(price - Number(net)).toFixed(0)} €)</span>
        </>
      ) : (
        "—"
      )}
    </td>
  );
}

export default function TransferPricingEditor({ initial }) {
  const [pct, setPct] = useState(String(initial.commissionPct));
  const [rows, setRows] = useState(
    initial.cities.map((c) => ({ ...c, net_small: String(Number(c.net_small)), net_large: String(Number(c.net_large)) }))
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  function update(city, field, value) {
    setRows((rs) => rs.map((r) => (r.city === city ? { ...r, [field]: value } : r)));
    setMessage(null);
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/transfer-pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commissionPct: pct, cities: rows }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    setMessage(
      res.ok
        ? { ok: true, text: `Enregistré — ${data.updatedProperties} logement(s) mis à jour.` }
        : { ok: false, text: data.error || "Erreur lors de l'enregistrement." }
    );
  }

  return (
    <section className="mt-8 rounded border border-sand-dim bg-sand-card p-5">
      <h2 className="font-display italic text-2xl text-ink">Tarifs standard par ville</h2>
      <p className="mt-1 text-sm text-ink/70">
        Saisissez le prix <strong>net du conducteur</strong>. Le prix client = net + commission, arrondi au multiple de
        5 supérieur. À l&apos;enregistrement, les nouveaux prix s&apos;appliquent immédiatement à tous les logements de
        ces villes (et remplacent un tarif aéroport personnalisé plus bas). Les autres villes restent « sur demande ».
      </p>

      <label className="mt-4 flex items-center gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Commission</span>
        <input
          type="number"
          min="0"
          max="100"
          step="1"
          value={pct}
          onChange={(e) => {
            setPct(e.target.value);
            setMessage(null);
          }}
          className="input w-24"
        />
        <span className="text-ink/70">%</span>
      </label>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-sand-dim text-left">
              <th className="px-3 py-2 font-bold text-ink/70">Ville</th>
              <th className="px-3 py-2 font-bold text-ink/70">Net 1–3 pers. (2 bag.)</th>
              <th className="px-3 py-2 font-bold text-ink/70">Prix client</th>
              <th className="px-3 py-2 font-bold text-ink/70">Net 3–6 pers. (6 bag.)</th>
              <th className="px-3 py-2 font-bold text-ink/70">Prix client</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.city} className="border-b border-sand-dim last:border-0">
                <td className="px-3 py-2 font-bold text-ink">{r.label}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={r.net_small}
                    onChange={(e) => update(r.city, "net_small", e.target.value)}
                    className="input w-24"
                    aria-label={`${r.label} — net 1 à 3 passagers`}
                  />
                </td>
                <PriceCell net={r.net_small} pct={pct} />
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={r.net_large}
                    onChange={(e) => update(r.city, "net_large", e.target.value)}
                    className="input w-24"
                    aria-label={`${r.label} — net 3 à 6 passagers`}
                  />
                </td>
                <PriceCell net={r.net_large} pct={pct} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded bg-aqua-deep px-5 py-2.5 text-sm font-bold text-sand-card transition-colors hover:bg-aqua-deep/90 disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer les tarifs"}
        </button>
        {message && (
          <p className={`text-sm ${message.ok ? "text-aqua-deep" : "text-terracotta-deep"}`}>{message.text}</p>
        )}
      </div>
    </section>
  );
}
