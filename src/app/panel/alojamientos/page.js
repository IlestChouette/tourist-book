"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";

export default function AlojamientosPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("host_id", user.id)
        .order("created_at", { ascending: false });
      setProperties(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <main className="flex-1">
      <Hero eyebrow="Panel hotelero" title="Tus alojamientos" />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href="/panel/alojamientos/nuevo"
          className="inline-block rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
        >
          + Nuevo alojamiento
        </Link>

        {loading && <p className="mt-6 text-ink/60">Cargando…</p>}
        {!loading && properties.length === 0 && (
          <p className="mt-6 text-ink/60">Todavía no has añadido ningún alojamiento.</p>
        )}

        <div className="mt-6 grid gap-3">
          {properties.map((p) => {
            const active = p.plan && p.subscription_status !== "canceled";
            return (
              <Link
                key={p.id}
                href={`/panel/alojamientos/${p.id}`}
                className="flex items-center gap-4 rounded border border-sand-dim bg-sand-card p-4 transition-colors hover:border-aqua-deep"
              >
                {p.photos?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.photos[0]} alt="" className="h-16 w-16 rounded object-cover" />
                ) : (
                  <div className="h-16 w-16 shrink-0 rounded bg-sand" />
                )}
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{p.city}</span>
                  <p className="font-display italic text-xl text-ink">{p.name}</p>
                </div>
                <span
                  className={`shrink-0 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                    active ? "bg-sage text-ink" : "bg-terracotta text-ink"
                  }`}
                >
                  {active ? p.plan : "sin suscripción"}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
