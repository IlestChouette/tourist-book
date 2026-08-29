"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";

const statusLabel = {
  pendiente: "Pendiente",
  aprobado: "Aprobado",
  rechazado: "Rechazado",
};

export default function ReservasPage({ params }) {
  const { id } = use(params);
  const [property, setProperty] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: prop } = await supabase.from("properties").select("*").eq("id", id).single();
      setProperty(prop);

      const res = await fetch(`/api/reservations?propertyId=${id}`);
      setReservations(res.ok ? await res.json() : []);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <main className="flex-1">
        <Hero eyebrow="Panel hotelero" title="Cargando…" />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}`}
        backLabel={property?.name ?? "Alojamiento"}
        eyebrow="Check-in"
        title="Reservas"
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href={`/panel/alojamientos/${id}/reservas/nueva`}
          className="inline-block rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
        >
          + Nueva reserva
        </Link>

        {reservations.length === 0 && (
          <p className="mt-6 text-ink/60">Todavía no has creado ninguna reserva.</p>
        )}

        <div className="mt-6 grid gap-3">
          {reservations.map((r) => {
            const verif = r.guest_accounts?.verification_status;
            return (
              <Link
                key={r.id}
                href={`/panel/alojamientos/${id}/reservas/${r.id}`}
                className="flex items-center justify-between rounded border border-sand-dim bg-sand-card p-4 transition-colors hover:border-aqua-deep"
              >
                <div>
                  <p className="font-display italic text-xl text-ink">{r.guest_name}</p>
                  <p className="text-sm text-ink/70">
                    {r.arrival_date} → {r.departure_date}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                    verif === "aprobado"
                      ? "bg-sage text-ink"
                      : verif === "rechazado"
                        ? "bg-terracotta-deep text-sand-card"
                        : "bg-sand-dim text-ink/70"
                  }`}
                >
                  {r.status === "pendiente" ? "Sin check-in" : statusLabel[verif] ?? "Pendiente"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
