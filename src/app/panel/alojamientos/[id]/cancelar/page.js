"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Hero from "@/components/Hero";

export default function CancelarPage({ params }) {
  const { id } = use(params);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [step, setStep] = useState("form");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("properties")
        .select("name, plan, billing_cycle")
        .eq("id", id)
        .single();
      setProperty(data);
      setLoading(false);
    }
    load();
  }, [id]);

  function handleReasonSubmit(e) {
    e.preventDefault();
    if (!reason.trim()) return;
    setStep("confirm1");
  }

  async function sendRequest() {
    setSending(true);
    setError("");
    const res = await fetch("/api/cancellation-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId: id, reason }),
    });
    setSending(false);
    if (!res.ok) {
      setError("No se pudo enviar la solicitud. Inténtalo de nuevo.");
      return;
    }
    setStep("sent");
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

  const isAnual = property.billing_cycle === "anual";

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}`}
        backLabel={property.name}
        eyebrow="Suscripción"
        title="Solicitar cancelación"
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        {step === "form" && (
          <form onSubmit={handleReasonSubmit} className="grid gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                Cuéntanos por qué te vas
              </span>
              <textarea
                required
                rows={5}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ayúdanos a mejorar: ¿qué te ha hecho decidir cancelar?"
                className="input"
              />
            </label>
            <button
              type="submit"
              className="rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              Continuar →
            </button>
          </form>
        )}

        {step === "confirm1" && (
          <div className="rounded border border-sand-dim bg-sand-card p-5">
            <p className="text-ink">
              ¿Seguro que quieres cancelar la suscripción de <strong>{property.name}</strong>? Tus
              huéspedes dejarán de tener acceso al livret{property.plan === "premium" ? " y al check-in electrónico" : ""} cuando la cancelación se haga efectiva.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStep("confirm2")}
                className="rounded border border-terracotta-deep px-5 py-2.5 font-bold text-terracotta-deep transition-colors hover:bg-terracotta hover:text-ink"
              >
                Sí, quiero cancelar
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
              >
                No, mantener mi suscripción
              </button>
            </div>
          </div>
        )}

        {step === "confirm2" && (
          <div className="rounded border border-terracotta-deep bg-sand-card p-5">
            <p className="text-ink">
              <strong>Última confirmación.</strong>{" "}
              {isAnual
                ? "Tu plan es anual: la cancelación solo puede hacerse efectiva al finalizar el año en curso, sin reembolso de lo ya facturado."
                : "Tu plan es por temporada: la cancelación se hará efectiva al final del mes ya facturado."}
              {" "}Esto enviará tu solicitud, no la cancela automáticamente — te contactaremos para confirmarlo.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={sendRequest}
                disabled={sending}
                className="rounded border border-terracotta-deep px-5 py-2.5 font-bold text-terracotta-deep transition-colors hover:bg-terracotta hover:text-ink disabled:opacity-60"
              >
                {sending ? "Enviando…" : "Sí, enviar solicitud de cancelación"}
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
              >
                No, mantener mi suscripción
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-terracotta-deep">{error}</p>}
          </div>
        )}

        {step === "sent" && (
          <div className="rounded border border-sand-dim bg-sand-card p-5">
            <p className="text-ink">
              Hemos recibido tu solicitud de cancelación para <strong>{property.name}</strong>. La
              revisaremos y nos pondremos en contacto contigo antes de hacerla efectiva.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
