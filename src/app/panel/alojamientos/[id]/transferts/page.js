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
    ratesTitle: "Tarifs de transfert",
    ratesHint: "Ces tarifs sont fixés par Tourist Book et affichés directement à vos voyageurs dans le formulaire de transfert. Pour les modifier, contactez-nous.",
    ratesEmpty: "Aucun tarif configuré pour l'instant — contactez-nous pour les mettre en place.",
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
    ratesTitle: "Transfer rates",
    ratesHint: "These rates are set by Tourist Book and shown directly to your guests in the transfer form. Contact us to change them.",
    ratesEmpty: "No rate configured yet — contact us to set them up.",
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
    ratesTitle: "Tarifas de transfer",
    ratesHint: "Estas tarifas las fija Tourist Book y se muestran directamente a tus huéspedes en el formulario de transfer. Para modificarlas, contáctanos.",
    ratesEmpty: "Todavía no hay ninguna tarifa configurada — contáctanos para configurarlas.",
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
                </div>
              ))}
            </div>
          )}
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
                  {d.prixEstime ? ` · ${Number(d.prixEstime).toFixed(2)} €` : ""}
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
