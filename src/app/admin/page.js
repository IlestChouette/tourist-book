import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { monthlyRevenue, PRICES } from "@/lib/pricing";
import { stripe } from "@/lib/stripe";
import LogoutButton from "@/components/LogoutButton";
import { getLocale } from "@/lib/i18n/locale";

// Vrai MRR calculé depuis Stripe plutôt que depuis le prix de liste local —
// reflète les coupons/réductions réellement appliqués sur chaque abonnement.
// Si Stripe échoue pour un abonnement (ou qu'il n'a pas encore d'ID Stripe,
// ex. données de test créées à la main), on retombe sur l'estimation locale
// pour cette ligne uniquement, plutôt que de compter 0€.
async function realMonthlyRevenue(property) {
  if (!property.stripe_subscription_id) {
    return monthlyRevenue(property.plan, property.billing_cycle);
  }
  try {
    const invoice = await stripe.invoices.createPreview({ subscription: property.stripe_subscription_id });
    const amount = invoice.total / 100;
    // L'aperçu Stripe donne le montant de la prochaine échéance — pour un
    // cycle annuel, c'est le prix de l'année entière, à ramener au mois.
    return property.billing_cycle === "anual" ? amount / 12 : amount;
  } catch (err) {
    console.error(`Stripe invoice preview failed for subscription ${property.stripe_subscription_id}:`, err);
    return monthlyRevenue(property.plan, property.billing_cycle);
  }
}

export const metadata = { robots: { index: false, follow: false } };

const dateLocale = { fr: "fr-FR", en: "en-GB", es: "es-ES" };

// Ordre d'affichage des groupes dans "Emails sent" : les emails aux hôtes
// eux-mêmes d'abord (plus intéressants à suivre au quotidien), puis les
// notifications internes. Tout template inconnu est ajouté à la fin.
const EMAIL_TEMPLATE_ORDER = [
  "no_property_reminder",
  "listing_tips",
  "transfer_request_notification",
  "host_signup_notification",
  "contact_lead_notification",
  "reminder_batch_notification",
  "listing_tips_batch_notification",
  "other",
];

const emailTemplateLabels = {
  fr: {
    no_property_reminder: "Relance — premier logement pas encore créé",
    listing_tips: "Conseils logement — hôtes déjà inscrits",
    transfer_request_notification: "Demandes de transfert",
    host_signup_notification: "Nouvelles inscriptions",
    contact_lead_notification: "Contacts — formulaire landing page",
    reminder_batch_notification: "Résumé cron — relance premier logement",
    listing_tips_batch_notification: "Résumé cron — conseils logement",
    other: "Autres",
  },
  en: {
    no_property_reminder: "Reminder — first listing not created yet",
    listing_tips: "Listing tips — existing hosts",
    transfer_request_notification: "Transfer requests",
    host_signup_notification: "New signups",
    contact_lead_notification: "Contacts — landing page form",
    reminder_batch_notification: "Cron summary — no-listing reminder",
    listing_tips_batch_notification: "Cron summary — listing tips",
    other: "Other",
  },
  es: {
    no_property_reminder: "Recordatorio — primer alojamiento sin crear",
    listing_tips: "Consejos de alojamiento — hoteleros ya inscritos",
    transfer_request_notification: "Solicitudes de transporte",
    host_signup_notification: "Nuevas inscripciones",
    contact_lead_notification: "Contactos — formulario landing page",
    reminder_batch_notification: "Resumen cron — recordatorio primer alojamiento",
    listing_tips_batch_notification: "Resumen cron — consejos de alojamiento",
    other: "Otros",
  },
};
const MONTHLY_GOAL = 5000;
// Estimation utilisée pour "combien de clients en plus" tant qu'il n'y a pas
// encore de vrai client payant — moyenne mensuelle des 4 combinaisons prix/cycle.
const planMonthlyPrices = Object.entries(PRICES).flatMap(([plan, cycles]) =>
  Object.keys(cycles).map((cycle) => monthlyRevenue(plan, cycle))
);
const FALLBACK_AVG_MONTHLY_PRICE =
  planMonthlyPrices.reduce((sum, p) => sum + p, 0) / planMonthlyPrices.length;

const motivationTiers = {
  fr: [
    "Chaque client compte — le premier est toujours le plus important.",
    "C'est parti ! Continue comme ça.",
    "Un quart du chemin parcouru — le rythme est bon.",
    "Plus de la moitié ! Tu es en bonne voie.",
    "Presque là — l'objectif est à portée de main.",
    "Objectif atteint ! Beau travail.",
  ],
  en: [
    "Every client counts — the first one is always the hardest.",
    "You're off and running — keep going.",
    "A quarter of the way there — good pace.",
    "Over halfway! You're on track.",
    "Almost there — the goal is within reach.",
    "Goal reached! Great work.",
  ],
  es: [
    "Cada cliente cuenta — el primero siempre es el más difícil.",
    "Ya arrancaste. Sigue así.",
    "Un cuarto del camino recorrido — buen ritmo.",
    "Más de la mitad. Vas por buen camino.",
    "Casi lo logras — el objetivo está a la vuelta de la esquina.",
    "Objetivo alcanzado. Gran trabajo.",
  ],
};

function motivationMessage(percent, locale) {
  const tiers = motivationTiers[locale];
  if (percent >= 100) return tiers[5];
  if (percent >= 75) return tiers[4];
  if (percent >= 50) return tiers[3];
  if (percent >= 25) return tiers[2];
  if (percent > 0) return tiers[1];
  return tiers[0];
}

const subscriptionStatusLabel = {
  fr: { trialing: "En essai", active: "Actif", canceled: "Résilié", past_due: "Paiement en retard" },
  en: { trialing: "Trialing", active: "Active", canceled: "Cancelled", past_due: "Payment overdue" },
  es: { trialing: "En prueba", active: "Activo", canceled: "Cancelado", past_due: "Pago pendiente" },
};

const requestStatusLabel = {
  fr: { pendiente: "En attente", gestionada: "Traitée" },
  en: { pendiente: "Pending", gestionada: "Resolved" },
  es: { pendiente: "Pendiente", gestionada: "Gestionada" },
};

const content = {
  fr: {
    summary: "Résumé",
    clients: "Clients",
    activeProperties: "Logements actifs",
    mrr: "MRR estimé",
    arr: "ARR estimé",
    cancellationRequests: "Demandes de résiliation",
    pending: "en attente",
    noRequests: "Aucune demande.",
    resolve: "Marquer comme traitée",
    properties: "Logements",
    property: "Logement",
    host: "Hôtelier",
    plan: "Offre",
    cycle: "Cycle",
    status: "Statut",
    created: "Créé le",
    noSubscription: "sans abonnement",
    viewLivret: "Voir le livret →",
    name: "Nom",
    email: "Email",
    phone: "Téléphone",
    hostProperties: "Logements",
    noProperties: "Aucun",
    joined: "Inscription",
    analytics: "Analytics →",
    searchConsole: "Search Console →",
    identityLookup: "Retrouver un check-in →",
    goalLabel: "Objectif mensuel",
    remaining: (amount) => `Il reste ${amount.toFixed(0)} € pour atteindre l'objectif`,
    clientsNeeded: (n) => `≈ ${n} client${n > 1 ? "s" : ""} de plus au rythme actuel`,
    emailsSent: "Emails envoyés",
    noEmails: "Aucun email envoyé.",
    recipient: "Destinataire",
    subject: "Sujet",
    template: "Type",
    sentAt: "Date",
    emailStatusSent: "Envoyé",
    emailStatusFailed: "Échec",
    trialPipeline: (n, amount) =>
      `${n} logement${n > 1 ? "s" : ""} en essai gratuit — ${amount.toFixed(2)} € de revenu potentiel une fois l'essai terminé`,
  },
  en: {
    summary: "Summary",
    clients: "Clients",
    activeProperties: "Active properties",
    mrr: "Estimated MRR",
    arr: "Estimated ARR",
    cancellationRequests: "Cancellation requests",
    pending: "pending",
    noRequests: "No requests.",
    resolve: "Mark as resolved",
    properties: "Properties",
    property: "Property",
    host: "Host",
    plan: "Plan",
    cycle: "Cycle",
    status: "Status",
    created: "Created",
    noSubscription: "no subscription",
    viewLivret: "View livret →",
    name: "Name",
    email: "Email",
    phone: "Phone",
    hostProperties: "Properties",
    noProperties: "None",
    joined: "Joined",
    analytics: "Analytics →",
    searchConsole: "Search Console →",
    identityLookup: "Find a check-in →",
    goalLabel: "Monthly goal",
    remaining: (amount) => `${amount.toFixed(0)} € left to reach the goal`,
    clientsNeeded: (n) => `≈ ${n} more client${n > 1 ? "s" : ""} at the current rate`,
    emailsSent: "Emails sent",
    noEmails: "No emails sent yet.",
    recipient: "Recipient",
    subject: "Subject",
    template: "Type",
    sentAt: "Date",
    emailStatusSent: "Sent",
    emailStatusFailed: "Failed",
    trialPipeline: (n, amount) =>
      `${n} propert${n > 1 ? "ies" : "y"} in free trial — €${amount.toFixed(2)} in potential revenue once the trial ends`,
  },
  es: {
    summary: "Resumen",
    clients: "Clientes",
    activeProperties: "Alojamientos activos",
    mrr: "MRR estimado",
    arr: "ARR estimado",
    cancellationRequests: "Solicitudes de cancelación",
    pending: "pendientes",
    noRequests: "No hay solicitudes.",
    resolve: "Marcar como gestionada",
    properties: "Alojamientos",
    property: "Alojamiento",
    host: "Hotelero",
    plan: "Plan",
    cycle: "Ciclo",
    status: "Estado",
    created: "Creado el",
    noSubscription: "sin suscripción",
    viewLivret: "Ver el livret →",
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    hostProperties: "Alojamientos",
    noProperties: "Ninguno",
    joined: "Alta",
    analytics: "Analytics →",
    searchConsole: "Search Console →",
    identityLookup: "Buscar un check-in →",
    goalLabel: "Objetivo mensual",
    remaining: (amount) => `Faltan ${amount.toFixed(0)} € para llegar al objetivo`,
    clientsNeeded: (n) => `≈ ${n} cliente${n > 1 ? "s" : ""} más al ritmo actual`,
    emailsSent: "Emails enviados",
    noEmails: "Aún no se ha enviado ningún email.",
    recipient: "Destinatario",
    subject: "Asunto",
    template: "Tipo",
    sentAt: "Fecha",
    emailStatusSent: "Enviado",
    emailStatusFailed: "Fallido",
    trialPipeline: (n, amount) =>
      `${n} alojamiento${n > 1 ? "s" : ""} en prueba gratuita — ${amount.toFixed(2)} € de ingreso potencial cuando termine la prueba`,
  },
};

export default async function AdminPage() {
  const locale = await getLocale();
  const t = content[locale];
  const statusLabel = subscriptionStatusLabel[locale];
  const reqStatusLabel = requestStatusLabel[locale];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) notFound();

  const admin = createAdminClient();

  const [{ data: hosts }, { data: properties }, { data: requests }, { data: emailLog }] = await Promise.all([
    admin
      .from("hosts")
      .select("id, name, email, phone, created_at")
      .eq("is_admin", false)
      .order("created_at", { ascending: false }),
    admin
      .from("properties")
      .select(
        "id, name, city, slug, host_id, plan, billing_cycle, subscription_status, stripe_subscription_id, created_at, hosts(name, email, is_admin)"
      )
      .order("created_at", { ascending: false }),
    admin
      .from("cancellation_requests")
      .select("id, reason, status, created_at, properties(name), hosts(name, email)")
      .order("created_at", { ascending: false }),
    admin
      .from("email_log")
      .select("id, recipient, subject, template, status, error, created_at")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  // Les alojamientos "exemple" appartiennent au compte admin (is_admin=true)
  // et n'ont jamais de vrai abonnement Stripe — on les exclut des stats pour
  // ne pas gonfler artificiellement le nombre de clients ou le MRR.
  const realProperties = (properties ?? []).filter((p) => !p.hosts?.is_admin);
  const activeProperties = realProperties.filter(
    (p) => p.plan && p.subscription_status && p.subscription_status !== "canceled"
  );
  // "trialing" ne rapporte encore rien : seul "active" compte pour le chiffre réel.
  const payingProperties = activeProperties.filter((p) => p.subscription_status === "active");
  const mrr = (await Promise.all(payingProperties.map(realMonthlyRevenue))).reduce((sum, v) => sum + v, 0);
  // Pipeline des essais gratuits en cours : ne compte pas dans le MRR (Stripe
  // ne facture rien pendant l'essai) mais on veut quand même voir que ces
  // clients existent et ce qu'ils rapporteront une fois l'essai terminé.
  const trialingProperties = activeProperties.filter((p) => p.subscription_status === "trialing");
  const potentialMrr = trialingProperties.reduce((sum, p) => sum + monthlyRevenue(p.plan, p.billing_cycle), 0);
  const pendingRequests = (requests ?? []).filter((r) => r.status === "pendiente");

  // Regroupe le journal d'emails par type plutôt qu'une seule liste
  // chronologique — plus facile de suivre un fil (ex. toutes les relances
  // "premier logement") sans le mélanger avec les demandes de transfert.
  const emailsByTemplate = new Map();
  for (const e of emailLog ?? []) {
    const key = e.template ?? "other";
    if (!emailsByTemplate.has(key)) emailsByTemplate.set(key, []);
    emailsByTemplate.get(key).push(e);
  }
  const orderedEmailTemplates = [
    ...EMAIL_TEMPLATE_ORDER.filter((key) => emailsByTemplate.has(key)),
    ...[...emailsByTemplate.keys()].filter((key) => !EMAIL_TEMPLATE_ORDER.includes(key)),
  ];

  const propertiesByHost = new Map();
  for (const p of properties ?? []) {
    if (!propertiesByHost.has(p.host_id)) propertiesByHost.set(p.host_id, []);
    propertiesByHost.get(p.host_id).push(p.name);
  }

  const goalPercent = Math.min((mrr / MONTHLY_GOAL) * 100, 100);
  const goalRemaining = Math.max(MONTHLY_GOAL - mrr, 0);
  const avgRevenuePerClient = payingProperties.length > 0 ? mrr / payingProperties.length : FALLBACK_AVG_MONTHLY_PRICE;
  const clientsNeeded = goalRemaining > 0 ? Math.ceil(goalRemaining / avgRevenuePerClient) : null;

  return (
    <main className="flex-1 bg-sand">
      <div className="flex items-center justify-between bg-[#2f7d76] px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src="/tourist book long.png"
            alt="Tourist Book"
            width={278}
            height={106}
            className="h-20 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-24"
          />
          <span className="text-xs font-bold uppercase tracking-wider text-[#f7f1e4]/70">Admin</span>
        </div>
        <div className="flex items-center gap-5">
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-[#f7f1e4]/70 hover:text-[#f7f1e4]"
          >
            {t.analytics}
          </a>
          <a
            href="https://search.google.com/search-console?resource_id=sc-domain:tourist-book.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold uppercase tracking-wider text-[#f7f1e4]/70 hover:text-[#f7f1e4]"
          >
            {t.searchConsole}
          </a>
          <Link
            href="/admin/identidad"
            className="text-xs font-bold uppercase tracking-wider text-[#f7f1e4]/70 hover:text-[#f7f1e4]"
          >
            {t.identityLookup}
          </Link>
          <LogoutButton className="text-xs font-bold uppercase tracking-wider text-[#f7f1e4]/70 hover:text-[#f7f1e4]" />
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display italic text-3xl text-ink">{t.summary}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Stat label={t.clients} value={hosts?.length ?? 0} />
          <Stat label={t.activeProperties} value={activeProperties.length} />
          <Stat label={t.mrr} value={`${mrr.toFixed(2)} €`} />
          <Stat label={t.arr} value={`${(mrr * 12).toFixed(0)} €`} />
        </div>

        <div className="mt-6 rounded-2xl border border-sand-dim bg-gradient-to-br from-sand-card to-sand p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.goalLabel}</span>
              <p className="mt-1 font-display italic text-3xl text-ink">
                {mrr.toFixed(0)} € <span className="text-lg not-italic text-ink/40">/ {MONTHLY_GOAL} €</span>
              </p>
            </div>
            <span className="font-display text-4xl font-bold text-aqua-deep">{goalPercent.toFixed(0)}%</span>
          </div>

          <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-sand-dim">
            <div
              className="h-full rounded-full bg-gradient-to-r from-terracotta to-terracotta-deep transition-all duration-700"
              style={{ width: `${goalPercent}%` }}
            />
          </div>

          <p className="mt-4 text-sm font-bold text-ink">{motivationMessage(goalPercent, locale)}</p>
          {goalRemaining > 0 && (
            <p className="mt-1 text-xs text-ink/60">
              {t.remaining(goalRemaining)}
              {clientsNeeded && ` — ${t.clientsNeeded(clientsNeeded)}`}
            </p>
          )}
          {trialingProperties.length > 0 && (
            <p className="mt-2 text-xs font-bold text-terracotta-deep">
              {t.trialPipeline(trialingProperties.length, potentialMrr)}
            </p>
          )}
        </div>

        <h2 className="mt-12 font-display italic text-2xl text-ink">
          {t.cancellationRequests} {pendingRequests.length > 0 && `(${pendingRequests.length} ${t.pending})`}
        </h2>
        <div className="mt-4 grid gap-3">
          {(requests ?? []).length === 0 && <p className="text-ink/60">{t.noRequests}</p>}
          {(requests ?? []).map((r) => (
            <div key={r.id} className="rounded border border-sand-dim bg-sand-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-ink">{r.properties?.name}</span>
                  <span className="ml-2 text-sm text-ink/60">
                    {r.hosts?.name} · {r.hosts?.email}
                  </span>
                </div>
                <span
                  className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                    r.status === "pendiente" ? "bg-terracotta text-ink" : "bg-sage text-ink"
                  }`}
                >
                  {reqStatusLabel[r.status] ?? r.status}
                </span>
              </div>
              <p className="mt-2 text-ink/80">{r.reason}</p>
              <p className="mt-2 text-xs text-ink/50">{new Date(r.created_at).toLocaleString(dateLocale[locale])}</p>
              {r.status === "pendiente" && (
                <form action={`/api/admin/cancellation-requests/${r.id}/resolve`} method="POST" className="mt-3">
                  <button
                    type="submit"
                    className="rounded border border-aqua-deep px-4 py-1.5 text-xs font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card"
                  >
                    {t.resolve}
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display italic text-2xl text-ink">{t.properties}</h2>
        <div className="mt-4 overflow-x-auto rounded border border-sand-dim">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-sand-dim bg-sand-card text-left">
                <th className="px-4 py-2 font-bold text-ink/70">{t.property}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.host}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.plan}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.cycle}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.status}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.created}</th>
                <th className="px-4 py-2 font-bold text-ink/70"></th>
              </tr>
            </thead>
            <tbody>
              {(properties ?? []).map((p) => (
                <tr key={p.id} className="border-b border-sand-dim last:border-0">
                  <td className="px-4 py-2 text-ink">{p.name} <span className="text-ink/50">({p.city})</span></td>
                  <td className="px-4 py-2 text-ink/70">{p.hosts?.name} · {p.hosts?.email}</td>
                  <td className="px-4 py-2 text-ink/70">{p.plan ?? "—"}</td>
                  <td className="px-4 py-2 text-ink/70">{p.billing_cycle ?? "—"}</td>
                  <td className="px-4 py-2 text-ink/70">{statusLabel[p.subscription_status] ?? p.subscription_status ?? t.noSubscription}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-ink/70">
                    {new Date(p.created_at).toLocaleString(dateLocale[locale])}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={`/logement/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-aqua-deep hover:underline"
                    >
                      {t.viewLivret}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display italic text-2xl text-ink">{t.clients}</h2>
        <div className="mt-4 overflow-x-auto rounded border border-sand-dim">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-sand-dim bg-sand-card text-left">
                <th className="px-4 py-2 font-bold text-ink/70">{t.name}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.email}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.phone}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.hostProperties}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.joined}</th>
              </tr>
            </thead>
            <tbody>
              {(hosts ?? []).map((h) => (
                <tr key={h.id} className="border-b border-sand-dim last:border-0">
                  <td className="px-4 py-2 text-ink">{h.name}</td>
                  <td className="px-4 py-2 text-ink/70">{h.email}</td>
                  <td className="px-4 py-2 text-ink/70">{h.phone || "—"}</td>
                  <td className="px-4 py-2 text-ink/70">{(propertiesByHost.get(h.id) ?? []).join(", ") || t.noProperties}</td>
                  <td className="px-4 py-2 text-ink/70">{new Date(h.created_at).toLocaleDateString(dateLocale[locale])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display italic text-2xl text-ink">{t.emailsSent}</h2>
        {(emailLog ?? []).length === 0 && <p className="mt-4 text-ink/60">{t.noEmails}</p>}
        {orderedEmailTemplates.map((templateKey) => (
          <div key={templateKey} className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-ink/60">
              {emailTemplateLabels[locale]?.[templateKey] ?? templateKey}{" "}
              <span className="text-ink/40">({emailsByTemplate.get(templateKey).length})</span>
            </h3>
            <div className="mt-2 overflow-x-auto rounded border border-sand-dim">
              <table className="w-full min-w-[600px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-sand-dim bg-sand-card text-left">
                    <th className="px-4 py-2 font-bold text-ink/70">{t.sentAt}</th>
                    <th className="px-4 py-2 font-bold text-ink/70">{t.recipient}</th>
                    <th className="px-4 py-2 font-bold text-ink/70">{t.subject}</th>
                    <th className="px-4 py-2 font-bold text-ink/70">{t.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {emailsByTemplate.get(templateKey).map((e) => (
                    <tr key={e.id} className="border-b border-sand-dim last:border-0">
                      <td className="px-4 py-2 whitespace-nowrap text-ink/70">
                        {new Date(e.created_at).toLocaleString(dateLocale[locale])}
                      </td>
                      <td className="px-4 py-2 text-ink">{e.recipient}</td>
                      <td className="px-4 py-2 text-ink/70">{e.subject}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                            e.status === "sent" ? "bg-sage text-ink" : "bg-terracotta text-ink"
                          }`}
                          title={e.error ?? undefined}
                        >
                          {e.status === "sent" ? t.emailStatusSent : t.emailStatusFailed}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded border border-sand-dim bg-sand-card p-4">
      <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{label}</span>
      <p className="mt-1 font-display text-2xl text-ink">{value}</p>
    </div>
  );
}
