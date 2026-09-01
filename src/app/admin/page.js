import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { monthlyRevenue } from "@/lib/pricing";
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
const MONTHLY_GOAL = 5000;

const motivationTiers = {
  fr: [
    "Chaque client compte — le premier est toujours le plus important 🚀",
    "C'est parti ! Continue comme ça 💪",
    "Un quart du chemin parcouru — le rythme est bon 🔥",
    "Plus de la moitié ! Tu es en bonne voie 🎯",
    "Presque là — l'objectif est à portée de main ✨",
    "🎉 Objectif atteint ! Beau travail.",
  ],
  en: [
    "Every client counts — the first one is always the hardest 🚀",
    "You're off and running — keep going 💪",
    "A quarter of the way there — good pace 🔥",
    "Over halfway! You're on track 🎯",
    "Almost there — the goal is within reach ✨",
    "🎉 Goal reached! Great work.",
  ],
  es: [
    "Cada cliente cuenta — el primero siempre es el más difícil 🚀",
    "¡Ya arrancaste! Sigue así 💪",
    "Un cuarto del camino recorrido — buen ritmo 🔥",
    "¡Más de la mitad! Vas por buen camino 🎯",
    "Casi lo logras — el objetivo está a la vuelta de la esquina ✨",
    "🎉 ¡Objetivo alcanzado! Gran trabajo.",
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
    noSubscription: "sans abonnement",
    name: "Nom",
    email: "Email",
    joined: "Inscription",
    analytics: "Analytics →",
    searchConsole: "Search Console →",
    goalLabel: "Objectif mensuel",
    remaining: (amount) => `Il reste ${amount.toFixed(0)} € pour atteindre l'objectif`,
    clientsNeeded: (n) => `≈ ${n} client${n > 1 ? "s" : ""} de plus au rythme actuel`,
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
    noSubscription: "no subscription",
    name: "Name",
    email: "Email",
    joined: "Joined",
    analytics: "Analytics →",
    searchConsole: "Search Console →",
    goalLabel: "Monthly goal",
    remaining: (amount) => `${amount.toFixed(0)} € left to reach the goal`,
    clientsNeeded: (n) => `≈ ${n} more client${n > 1 ? "s" : ""} at the current rate`,
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
    noSubscription: "sin suscripción",
    name: "Nombre",
    email: "Email",
    joined: "Alta",
    analytics: "Analytics →",
    searchConsole: "Search Console →",
    goalLabel: "Objetivo mensual",
    remaining: (amount) => `Faltan ${amount.toFixed(0)} € para llegar al objetivo`,
    clientsNeeded: (n) => `≈ ${n} cliente${n > 1 ? "s" : ""} más al ritmo actual`,
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

  const [{ data: hosts }, { data: properties }, { data: requests }] = await Promise.all([
    admin.from("hosts").select("id, name, email, created_at").eq("is_admin", false).order("created_at", { ascending: false }),
    admin
      .from("properties")
      .select(
        "id, name, city, host_id, plan, billing_cycle, subscription_status, stripe_subscription_id, created_at, hosts(name, email)"
      )
      .order("created_at", { ascending: false }),
    admin
      .from("cancellation_requests")
      .select("id, reason, status, created_at, properties(name), hosts(name, email)")
      .order("created_at", { ascending: false }),
  ]);

  const activeProperties = (properties ?? []).filter(
    (p) => p.plan && p.subscription_status && p.subscription_status !== "canceled"
  );
  // "trialing" ne rapporte encore rien : seul "active" compte pour le chiffre réel.
  const payingProperties = activeProperties.filter((p) => p.subscription_status === "active");
  const mrr = (await Promise.all(payingProperties.map(realMonthlyRevenue))).reduce((sum, v) => sum + v, 0);
  const pendingRequests = (requests ?? []).filter((r) => r.status === "pendiente");

  const goalPercent = Math.min((mrr / MONTHLY_GOAL) * 100, 100);
  const goalRemaining = Math.max(MONTHLY_GOAL - mrr, 0);
  const avgRevenuePerClient = payingProperties.length > 0 ? mrr / payingProperties.length : null;
  const clientsNeeded =
    avgRevenuePerClient && goalRemaining > 0 ? Math.ceil(goalRemaining / avgRevenuePerClient) : null;

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display italic text-2xl text-ink">{t.clients}</h2>
        <div className="mt-4 overflow-x-auto rounded border border-sand-dim">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-sand-dim bg-sand-card text-left">
                <th className="px-4 py-2 font-bold text-ink/70">{t.name}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.email}</th>
                <th className="px-4 py-2 font-bold text-ink/70">{t.joined}</th>
              </tr>
            </thead>
            <tbody>
              {(hosts ?? []).map((h) => (
                <tr key={h.id} className="border-b border-sand-dim last:border-0">
                  <td className="px-4 py-2 text-ink">{h.name}</td>
                  <td className="px-4 py-2 text-ink/70">{h.email}</td>
                  <td className="px-4 py-2 text-ink/70">{new Date(h.created_at).toLocaleDateString(dateLocale[locale])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
