import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale } from "@/lib/i18n/locale";
import Hero from "@/components/Hero";

// Page de démonstration : montre à un futur hôte l'écran qu'il verrait
// vraiment dans son panel en recevant un check-in — sans avoir besoin de se
// connecter. Volontairement câblée en dur sur la seule réservation de
// démonstration, jamais sur un id fourni par l'URL : aucun risque d'exposer
// un vrai check-in client via cette page publique.
const DEMO_PROPERTY_SLUG = "exemple-premium";
export const metadata = { robots: { index: false, follow: false } };

const content = {
  fr: {
    eyebrow: "Aperçu — panel hôtelier",
    title: "Ce que voit l'hôte",
    subtitle: "Voici l'écran réel que l'hôte reçoit dès que son voyageur termine son check-in.",
    demoNotice:
      "Ceci est une démonstration : les documents sont des exemples, et les boutons ci-dessous ne modifient rien.",
    username: "Identifiant :",
    phone: "Téléphone :",
    email: "Email :",
    documentNumber: "N° de passeport / carte d'identité :",
    nationality: "Nationalité :",
    status: "Statut :",
    statusLabel: { pendiente: "En attente", aprobado: "Approuvé", rechazado: "Refusé" },
    houseRules: "Règlement intérieur :",
    houseRulesAccepted: "Accepté",
    houseRulesRejected: "Refusé",
    idDocument: "Pièce d'identité",
    selfie: "Selfie",
    idDocumentPlaceholder: "Exemple de pièce d'identité",
    selfiePlaceholder: "Exemple de selfie",
    signature: "Signature",
    signaturePlaceholder: "Exemple de signature",
    compareHint: "Comparez le document et le selfie : est-ce la même personne ? Approuvez ou refusez selon votre jugement.",
    approve: "Approuver",
    reject: "Refuser",
    backToLivret: "← Retour au livret d'exemple",
  },
  en: {
    eyebrow: "Preview — host panel",
    title: "What the host sees",
    subtitle: "This is the real screen the host gets as soon as their guest finishes check-in.",
    demoNotice: "This is a demonstration: the documents are examples, and the buttons below don't change anything.",
    username: "Username:",
    phone: "Phone:",
    email: "Email:",
    documentNumber: "Passport / ID number:",
    nationality: "Nationality:",
    status: "Status:",
    statusLabel: { pendiente: "Pending", aprobado: "Approved", rechazado: "Rejected" },
    houseRules: "House rules:",
    houseRulesAccepted: "Accepted",
    houseRulesRejected: "Rejected",
    idDocument: "ID document",
    selfie: "Selfie",
    idDocumentPlaceholder: "Example ID document",
    selfiePlaceholder: "Example selfie",
    signature: "Signature",
    signaturePlaceholder: "Example signature",
    compareHint: "Compare the document and the selfie: is it the same person? Approve or reject based on your judgment.",
    approve: "Approve",
    reject: "Reject",
    backToLivret: "← Back to the example livret",
  },
  es: {
    eyebrow: "Vista previa — panel hotelero",
    title: "Lo que ve el hotelero",
    subtitle: "Esta es la pantalla real que recibe el hotelero apenas su huésped termina el check-in.",
    demoNotice: "Esto es una demostración: los documentos son ejemplos, y los botones de abajo no modifican nada.",
    username: "Usuario:",
    phone: "Teléfono:",
    email: "Email:",
    documentNumber: "N° de pasaporte / DNI:",
    nationality: "Nacionalidad:",
    status: "Estado:",
    statusLabel: { pendiente: "Pendiente", aprobado: "Aprobado", rechazado: "Rechazado" },
    houseRules: "Normas de la casa:",
    houseRulesAccepted: "Aceptadas",
    houseRulesRejected: "Rechazadas",
    idDocument: "Documento de identidad",
    selfie: "Selfie",
    idDocumentPlaceholder: "Ejemplo de documento de identidad",
    selfiePlaceholder: "Ejemplo de selfie",
    signature: "Firma",
    signaturePlaceholder: "Ejemplo de firma",
    compareHint: "Compara el documento y el selfie: ¿es la misma persona? Aprueba o rechaza según tu criterio.",
    approve: "Aprobar",
    reject: "Rechazar",
    backToLivret: "← Volver al livret de ejemplo",
  },
};

export default async function DemoCheckinPage() {
  const locale = await getLocale();
  const t = content[locale];

  const admin = createAdminClient();
  const { data: property } = await admin
    .from("properties")
    .select("id, name, slug")
    .eq("slug", DEMO_PROPERTY_SLUG)
    .single();
  if (!property) notFound();

  const { data: reservation } = await admin
    .from("reservations")
    .select(
      "guest_name, arrival_date, departure_date, guest_accounts(username, phone, email, document_number, nationality, verification_status, house_rules_accepted)"
    )
    .eq("property_id", property.id)
    .eq("status", "check-in hecho")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!reservation) notFound();

  const ga = reservation.guest_accounts;

  return (
    <main className="flex-1">
      <Hero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <p className="mb-6 rounded border border-aqua-deep/30 bg-aqua-deep/5 p-3 text-sm text-ink/70">
          {t.demoNotice}
        </p>

        {ga && (
          <>
            <div className="rounded border border-sand-dim bg-sand-card p-5">
              <p className="text-ink">{t.username} {ga.username}</p>
              <p className="mt-1 text-ink">{t.phone} {ga.phone}</p>
              <p className="mt-1 text-ink">{t.email} {ga.email}</p>
              <p className="mt-1 text-ink">{t.documentNumber} {ga.document_number}</p>
              <p className="mt-1 text-ink">{t.nationality} {ga.nationality}</p>
              <p className="mt-3 text-ink">
                {t.status}{" "}
                <span
                  className={`font-bold ${
                    ga.verification_status === "aprobado"
                      ? "text-sage"
                      : ga.verification_status === "rechazado"
                        ? "text-terracotta-deep"
                        : "text-ink/70"
                  }`}
                >
                  {t.statusLabel[ga.verification_status] ?? ga.verification_status}
                </span>
              </p>
              {ga.house_rules_accepted !== null && (
                <p className="mt-1 text-ink">
                  {t.houseRules}{" "}
                  <span className={`font-bold ${ga.house_rules_accepted ? "text-sage" : "text-terracotta-deep"}`}>
                    {ga.house_rules_accepted ? t.houseRulesAccepted : t.houseRulesRejected}
                  </span>
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.idDocument}</span>
                <div className="mt-2 flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded border border-dashed border-sand-dim bg-sand p-4 text-center text-sm text-ink/40">
                  <svg viewBox="0 0 64 44" width="64" height="44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="60" height="40" rx="4" />
                    <circle cx="18" cy="22" r="8" />
                    <path d="M8 36c1-6 5-9 10-9s9 3 10 9" />
                    <path d="M36 14h20M36 21h20M36 28h14" />
                  </svg>
                  {t.idDocumentPlaceholder}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.selfie}</span>
                <div className="mt-2 flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded border border-dashed border-sand-dim bg-sand p-4 text-center text-sm text-ink/40">
                  <svg viewBox="0 0 44 44" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="40" height="40" rx="20" />
                    <circle cx="22" cy="18" r="7" />
                    <path d="M9 34c1.5-7 6.5-10.5 13-10.5S33.5 27 35 34" />
                  </svg>
                  {t.selfiePlaceholder}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.signature}</span>
              <div className="mt-2 flex h-24 w-full max-w-xs flex-col items-center justify-center gap-1 rounded border border-dashed border-sand-dim bg-sand p-3 text-center text-sm text-ink/40">
                <svg viewBox="0 0 64 24" width="64" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 18c4-10 8-14 11-10s2 10 6 10 6-14 10-14 4 12 8 12 5-8 9-8 3 6 7 6 5-4 9-4" />
                </svg>
                {t.signaturePlaceholder}
              </div>
            </div>

            <p className="mt-4 text-sm text-ink/60">{t.compareHint}</p>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                disabled
                className="rounded bg-sage px-5 py-2.5 font-bold text-ink opacity-60"
              >
                {t.approve}
              </button>
              <button
                type="button"
                disabled
                className="rounded border border-terracotta-deep px-5 py-2.5 font-bold text-terracotta-deep opacity-60"
              >
                {t.reject}
              </button>
            </div>
          </>
        )}

        <a
          href={`/logement/${property.slug}`}
          className="mt-8 inline-block text-sm font-bold text-aqua-deep hover:underline"
        >
          {t.backToLivret}
        </a>
      </section>
    </main>
  );
}
