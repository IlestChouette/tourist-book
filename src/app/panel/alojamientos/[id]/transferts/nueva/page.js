"use client";

import { use, useEffect, useState } from "react";
import Hero from "@/components/Hero";
import TransfertForm from "@/components/TransfertForm";
import { createClient } from "@/lib/supabase/client";
import { fullAddress } from "@/lib/address";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    eyebrow: "Panel hôtelier",
    loading: "Chargement…",
    title: "Nouvelle demande de transfert",
    subtitle: "À utiliser quand un voyageur vous contacte directement (téléphone, WhatsApp) au lieu du formulaire du livret.",
    transferts: "Demandes de transfert",
  },
  en: {
    eyebrow: "Host panel",
    loading: "Loading…",
    title: "New transfer request",
    subtitle: "Use this when a guest contacts you directly (phone, WhatsApp) instead of the livret's form.",
    transferts: "Transfer requests",
  },
  es: {
    eyebrow: "Panel hotelero",
    loading: "Cargando…",
    title: "Nueva solicitud de transfer",
    subtitle: "Úsalo cuando un huésped te contacte directamente (teléfono, WhatsApp) en vez del formulario del livret.",
    transferts: "Solicitudes de transfer",
  },
};

export default function NuevaTransfertPage({ params }) {
  const { id } = use(params);
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [property, setProperty] = useState(null);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: prop } = await supabase
        .from("properties")
        .select("slug, name, address, postal_code, city")
        .eq("id", id)
        .single();
      setProperty(prop);

      const { data: rateRows } = await supabase.from("transfer_rates").select("*").eq("property_id", id);
      setRates(rateRows ?? []);

      setLoading(false);
    }
    load();
  }, [id]);

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
        backHref={`/panel/alojamientos/${id}/transferts`}
        backLabel={t.transferts}
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <TransfertForm
          slug={property.slug}
          propertyName={property.name}
          propertyAddress={fullAddress(property)}
          locale={locale}
          rates={rates}
          hostMode
        />
      </section>
    </main>
  );
}
