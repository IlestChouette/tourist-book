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
  },
};

export default function TransfertsPage({ params }) {
  const { id } = use(params);
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [property, setProperty] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: prop } = await supabase.from("properties").select("name").eq("id", id).single();
      setProperty(prop);

      const res = await fetch(`/api/requests?propertyId=${id}`);
      setRequests(res.ok ? await res.json() : []);
      setLoading(false);
    }
    load();
  }, [id]);

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
        {requests.length === 0 && <p className="text-ink/60">{t.empty}</p>}

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
