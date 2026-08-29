"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";

export default function ReservaDetallePage({ params }) {
  const { id, reservationId } = use(params);
  const router = useRouter();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function load() {
    const res = await fetch(`/api/reservations/${reservationId}`);
    setReservation(res.ok ? await res.json() : null);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationId]);

  async function setStatus(status) {
    setUpdating(true);
    await fetch(`/api/reservations/${reservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verificationStatus: status }),
    });
    router.push(`/panel/alojamientos/${id}/reservas`);
  }

  if (loading) {
    return (
      <main className="flex-1">
        <Hero eyebrow="Panel hotelero" title="Cargando…" />
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="flex-1">
        <Hero eyebrow="Panel hotelero" title="Reserva no encontrada" />
      </main>
    );
  }

  const ga = reservation.guestAccount;

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}/reservas`}
        backLabel="Reservas"
        eyebrow={reservation.propertyName}
        title={reservation.guestName}
        subtitle={`${reservation.arrivalDate} → ${reservation.departureDate}`}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        {!ga && (
          <p className="text-ink/60">El huésped todavía no ha completado el check-in.</p>
        )}

        {ga && (
          <>
            <div className="rounded border border-sand-dim bg-sand-card p-5">
              <p className="text-ink">Usuario: {ga.username}</p>
              <p className="mt-1 text-ink">Teléfono: {ga.phone}</p>
              <p className="mt-1 text-ink">Email: {ga.email}</p>
              <p className="mt-1 text-ink">N° de pasaporte / DNI: {ga.documentNumber}</p>
              <p className="mt-1 text-ink">Nacionalidad: {ga.nationality}</p>
              <p className="mt-3 text-ink">
                Estado:{" "}
                <span
                  className={`font-bold ${
                    ga.verificationStatus === "aprobado"
                      ? "text-sage"
                      : ga.verificationStatus === "rechazado"
                        ? "text-terracotta-deep"
                        : "text-ink/70"
                  }`}
                >
                  {ga.verificationStatus}
                </span>
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                  Documento de identidad
                </span>
                {ga.idDocumentUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ga.idDocumentUrl} alt="Documento" className="mt-2 w-full rounded border border-sand-dim" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Selfie</span>
                {ga.selfieUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ga.selfieUrl} alt="Selfie" className="mt-2 w-full rounded border border-sand-dim" />
                )}
              </div>
            </div>

            <p className="mt-4 text-sm text-ink/60">
              Compara el documento y el selfie: ¿es la misma persona? Aprueba o rechaza según tu criterio.
            </p>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStatus("aprobado")}
                disabled={updating}
                className="rounded bg-sage px-5 py-2.5 font-bold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                Aprobar
              </button>
              <button
                type="button"
                onClick={() => setStatus("rechazado")}
                disabled={updating}
                className="rounded border border-terracotta-deep px-5 py-2.5 font-bold text-terracotta-deep transition-colors hover:bg-terracotta hover:text-ink disabled:opacity-60"
              >
                Rechazar
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
