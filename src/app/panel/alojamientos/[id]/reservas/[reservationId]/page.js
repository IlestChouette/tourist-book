"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    eyebrow: "Panel hôtelier",
    loading: "Chargement…",
    notFound: "Réservation introuvable",
    reservations: "Réservations",
    noCheckinYet: "L'hôte n'a pas encore effectué son check-in.",
    username: "Identifiant :",
    phone: "Téléphone :",
    email: "Email :",
    documentNumber: "N° de passeport / carte d'identité :",
    nationality: "Nationalité :",
    status: "Statut :",
    statusLabel: { pendiente: "En attente", aprobado: "Approuvé", rechazado: "Refusé" },
    idDocument: "Pièce d'identité",
    selfie: "Selfie",
    compareHint: "Comparez le document et le selfie : est-ce la même personne ? Approuvez ou refusez selon votre jugement.",
    approve: "Approuver",
    reject: "Refuser",
  },
  en: {
    eyebrow: "Host panel",
    loading: "Loading…",
    notFound: "Booking not found",
    reservations: "Bookings",
    noCheckinYet: "The guest hasn't completed check-in yet.",
    username: "Username:",
    phone: "Phone:",
    email: "Email:",
    documentNumber: "Passport / ID number:",
    nationality: "Nationality:",
    status: "Status:",
    statusLabel: { pendiente: "Pending", aprobado: "Approved", rechazado: "Rejected" },
    idDocument: "ID document",
    selfie: "Selfie",
    compareHint: "Compare the document and the selfie: is it the same person? Approve or reject based on your judgment.",
    approve: "Approve",
    reject: "Reject",
  },
  es: {
    eyebrow: "Panel hotelero",
    loading: "Cargando…",
    notFound: "Reserva no encontrada",
    reservations: "Reservas",
    noCheckinYet: "El huésped todavía no ha completado el check-in.",
    username: "Usuario:",
    phone: "Teléfono:",
    email: "Email:",
    documentNumber: "N° de pasaporte / DNI:",
    nationality: "Nacionalidad:",
    status: "Estado:",
    statusLabel: { pendiente: "Pendiente", aprobado: "Aprobado", rechazado: "Rechazado" },
    idDocument: "Documento de identidad",
    selfie: "Selfie",
    compareHint: "Compara el documento y el selfie: ¿es la misma persona? Aprueba o rechaza según tu criterio.",
    approve: "Aprobar",
    reject: "Rechazar",
  },
};

export default function ReservaDetallePage({ params }) {
  const { id, reservationId } = use(params);
  const router = useRouter();
  const [locale] = useState(getClientLocale);
  const t = content[locale];

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
        <Hero eyebrow={t.eyebrow} title={t.loading} />
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="flex-1">
        <Hero eyebrow={t.eyebrow} title={t.notFound} />
      </main>
    );
  }

  const ga = reservation.guestAccount;

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}/reservas`}
        backLabel={t.reservations}
        eyebrow={reservation.propertyName}
        title={reservation.guestName}
        subtitle={`${reservation.arrivalDate} → ${reservation.departureDate}`}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        {!ga && (
          <p className="text-ink/60">{t.noCheckinYet}</p>
        )}

        {ga && (
          <>
            <div className="rounded border border-sand-dim bg-sand-card p-5">
              <p className="text-ink">{t.username} {ga.username}</p>
              <p className="mt-1 text-ink">{t.phone} {ga.phone}</p>
              <p className="mt-1 text-ink">{t.email} {ga.email}</p>
              <p className="mt-1 text-ink">{t.documentNumber} {ga.documentNumber}</p>
              <p className="mt-1 text-ink">{t.nationality} {ga.nationality}</p>
              <p className="mt-3 text-ink">
                {t.status}{" "}
                <span
                  className={`font-bold ${
                    ga.verificationStatus === "aprobado"
                      ? "text-sage"
                      : ga.verificationStatus === "rechazado"
                        ? "text-terracotta-deep"
                        : "text-ink/70"
                  }`}
                >
                  {t.statusLabel[ga.verificationStatus] ?? ga.verificationStatus}
                </span>
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                  {t.idDocument}
                </span>
                {ga.idDocumentUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ga.idDocumentUrl} alt="" className="mt-2 w-full rounded border border-sand-dim" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.selfie}</span>
                {ga.selfieUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ga.selfieUrl} alt="" className="mt-2 w-full rounded border border-sand-dim" />
                )}
              </div>
            </div>

            <p className="mt-4 text-sm text-ink/60">{t.compareHint}</p>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setStatus("aprobado")}
                disabled={updating}
                className="rounded bg-sage px-5 py-2.5 font-bold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {t.approve}
              </button>
              <button
                type="button"
                onClick={() => setStatus("rechazado")}
                disabled={updating}
                className="rounded border border-terracotta-deep px-5 py-2.5 font-bold text-terracotta-deep transition-colors hover:bg-terracotta hover:text-ink disabled:opacity-60"
              >
                {t.reject}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
