"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";

export default function AlojamientoDetallePage({ params }) {
  const { id } = use(params);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("properties").select("*").eq("id", id).single();
      setProperty(data);
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${property.name}"? Esta acción no se puede deshacer — se perderán sus datos y su suscripción no se cancela automáticamente en Stripe.`
    );
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      setDeleting(false);
      alert(`No se pudo eliminar: ${error.message}`);
      return;
    }
    window.location.href = "/panel/alojamientos";
  }

  if (loading) {
    return (
      <main className="flex-1">
        <Hero eyebrow="Panel hotelero" title="Cargando…" />
      </main>
    );
  }

  if (!property) {
    return (
      <main className="flex-1">
        <Hero eyebrow="Panel hotelero" title="Alojamiento no encontrado" />
      </main>
    );
  }

  const active = property.plan && property.subscription_status !== "canceled";

  return (
    <main className="flex-1">
      <Hero
        backHref="/panel/alojamientos"
        backLabel="Tus alojamientos"
        eyebrow={property.city}
        title={property.name}
        photo={property.photos?.[0] ?? null}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-sand-dim bg-sand-card p-5">
          <p className="text-ink">Dirección: {property.address}</p>
          <p className="mt-1 text-ink">Código de acceso: {property.access_code}</p>
          <p className="mt-3 text-ink">
            Plan:{" "}
            {active ? (
              <span className="font-bold text-sage">
                {property.plan} · {property.subscription_status}
              </span>
            ) : (
              <span className="font-bold text-terracotta-deep">sin suscripción</span>
            )}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {!active && (
            <Link
              href={`/panel/alojamientos/${id}/suscribirse`}
              className="inline-block rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              Activar suscripción →
            </Link>
          )}
          {active && property.plan === "premium" && (
            <Link
              href={`/panel/alojamientos/${id}/reservas`}
              className="inline-block rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              Reservas y check-in →
            </Link>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded border border-terracotta-deep px-5 py-3 font-bold text-terracotta-deep transition-colors hover:bg-terracotta hover:text-ink disabled:opacity-60"
          >
            {deleting ? "Eliminando…" : "Eliminar alojamiento"}
          </button>
        </div>
      </section>
    </main>
  );
}
