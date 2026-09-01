import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { monthlyRevenue } from "@/lib/pricing";
import LogoutButton from "@/components/LogoutButton";
import { getLocale } from "@/lib/i18n/locale";

export const metadata = { robots: { index: false, follow: false } };

const dateLocale = { fr: "fr-FR", en: "en-GB", es: "es-ES" };

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
      .select("id, name, city, host_id, plan, billing_cycle, subscription_status, created_at, hosts(name, email)")
      .order("created_at", { ascending: false }),
    admin
      .from("cancellation_requests")
      .select("id, reason, status, created_at, properties(name), hosts(name, email)")
      .order("created_at", { ascending: false }),
  ]);

  const activeProperties = (properties ?? []).filter(
    (p) => p.plan && p.subscription_status && p.subscription_status !== "canceled"
  );
  const mrr = activeProperties.reduce((sum, p) => sum + monthlyRevenue(p.plan, p.billing_cycle), 0);
  const pendingRequests = (requests ?? []).filter((r) => r.status === "pendiente");

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
        <LogoutButton className="text-xs font-bold uppercase tracking-wider text-[#f7f1e4]/70 hover:text-[#f7f1e4]" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display italic text-3xl text-ink">{t.summary}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Stat label={t.clients} value={hosts?.length ?? 0} />
          <Stat label={t.activeProperties} value={activeProperties.length} />
          <Stat label={t.mrr} value={`${mrr.toFixed(2)} €`} />
          <Stat label={t.arr} value={`${(mrr * 12).toFixed(0)} €`} />
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
