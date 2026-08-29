"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";

const plans = [
  {
    key: "basico",
    name: "Libro de bienvenida",
    price: "29,99 €",
    features: ["Livret digital multilingüe", "Carnet de visita", "Carta local", "Asistente"],
  },
  {
    key: "premium",
    name: "Libro + Check-in",
    price: "49,99 €",
    features: [
      "Todo lo del plan básico",
      "Check-in electrónico por reserva",
      "Enlace único por huésped",
      "Acceso con usuario y contraseña",
    ],
  },
];

export default function SuscribirsePropiedadPage({ params }) {
  const { id } = use(params);
  const [property, setProperty] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("properties").select("name").eq("id", id).single();
      setProperty(data);
    }
    load();
  }, [id]);

  async function subscribe(plan) {
    setLoadingPlan(plan);
    setError("");

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, propertyId: id }),
    });

    if (!res.ok) {
      setLoadingPlan(null);
      setError("No se pudo iniciar el pago. Inténtalo de nuevo.");
      return;
    }

    const { url } = await res.json();
    window.location.href = url;
  }

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}`}
        backLabel={property?.name ?? "Alojamiento"}
        eyebrow="Suscripción"
        title="Elige el plan de este alojamiento"
        subtitle="Primer mes gratis en ambos planes. La suscripción es por alojamiento, no por cuenta."
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {plans.map((p) => (
            <div key={p.key} className="rounded border border-sand-dim bg-sand-card p-5">
              <h2 className="font-display italic text-2xl text-ink">{p.name}</h2>
              <p className="mt-1 text-2xl font-bold text-ink">
                {p.price} <span className="text-sm font-normal text-ink/60">/ mes</span>
              </p>
              <ul className="mt-4 grid gap-1.5 text-sm text-ink/80">
                {p.features.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => subscribe(p.key)}
                disabled={loadingPlan !== null}
                className="mt-5 w-full rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
              >
                {loadingPlan === p.key ? "Redirigiendo…" : "Empezar prueba gratuita →"}
              </button>
            </div>
          ))}
        </div>
        {error && <p className="mt-4 text-sm text-terracotta-deep">{error}</p>}
      </section>
    </main>
  );
}
