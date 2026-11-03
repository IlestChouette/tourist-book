import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/locale";
import { loadDashboard, monthOf } from "@/lib/adminDashboard";
import { eventLabels } from "@/lib/livretStats";
import ClientsTable from "./ClientsTable";

export const metadata = { title: "Tableau de bord", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const MONTHLY_GOAL = 5000;
const LOC = { fr: "fr-FR", en: "en-GB", es: "es-ES" };
const LIVRET_COLOR = "#2f7d76", CAHIER_COLOR = "#d9763a";

const T = {
  fr: {
    title: "Tableau de bord Tourist Book", back: "Admin livrets", sub: "Livrets d'accueil et cahier de consignes : deux produits, deux comptes de résultat, un seul endroit.",
    tabs: { overview: "Résumé", livret: "Livrets d'accueil", cahier: "Cahier de consignes", accounting: "Comptabilité" },
    livret: "Livrets", cahier: "Cahier", mrr: "MRR", arr: "ARR (×12)", goal: "Objectif mensuel", goalLeft: "Il reste", goalDone: "Objectif atteint", total: "Total",
    payingClients: "Clients payants", trials: "Essais en cours", newMonth: "Nouveaux ce mois", canceledMonth: "Résiliations ce mois", revMonth: "CA facturé ce mois", rev12: "CA facturé sur 12 mois", commission: "Commission transferts (mois)",
    alerts: "À surveiller", none: "Rien à signaler.", pastDue: "Paiement en retard (hôtel)", pastDueSub: "Paiement en retard", inactiveHotel: "Hôtel sans consigne depuis 30 jours", canceling: "Résiliation à la fin de la période", trialEnding: "Fin d'essai dans moins de 7 jours",
    watch: "Clients à traiter", unpaidC: "Impayés", inactiveC: "Inactifs", blockedC: "Bloqués", seeList: "Voir la liste",
    revChartTitle: "Chiffre d'affaires facturé par mois", revByProduct: "Chiffre d'affaires par produit",
    month: "Mois", invoiced: "Facturé", invoicesCount: "Factures", avgInvoice: "Facture moyenne",
    stats: "Statistiques", opens30: "Ouvertures 30 j", opensTotal: "Ouvertures totales", checkins: "Check-ins", reservations: "Réservations", properties: "Logements", clientsLabel: "Clients",
    newPerMonth: "Nouveaux clients par mois", topProps: "Logements les plus consultés (30 j)", topTiles: "Boutons les plus utilisés", noData: "Pas encore de données.",
    hotelsActive: "Hôtels actifs (30 j)", services: "Services", cons30: "Consignes 30 j", consTotal: "Consignes totales", consPerDay: "Consignes écrites par jour (30 derniers jours)",
    clients: "Clients", all: "Tous", paying: "Payants", trial: "Essais", pastDueF: "Impayés", inactiveF: "Inactifs", blockedF: "Bloqués", canceledF: "Résiliés", freeF: "Offerts",
    accounting: "Comptabilité", chart: "Chiffre d'affaires facturé par mois", gross: "Encaissé brut", refunded: "Remboursé", fees: "Frais Stripe", net: "Net encaissé", transfers: "Commission transferts",
    accNote: "Facturé = factures Stripe payées, séparées par produit. Encaissé = paiements réels de tout le compte Stripe (frais et remboursements inclus), non séparés par produit. Pas de TVA pour l'instant. Les commissions de transferts sont une estimation hors Stripe.",
    exportInv: "Télécharger les factures (Excel)", exportMonths: "Télécharger le résumé mensuel (Excel)",
    subs: "Abonnements Stripe", product: "Produit", qty: "Qté", status: "Statut", next: "Échéance", invoices: "Dernières factures encaissées", number: "N°", date: "Date", amount: "Montant", view: "Voir",
    leads: "Derniers contacts", name: "Nom", phone: "Téléphone", message: "Message", noLeads: "Aucun contact.", client: "Client",
    // ClientsTable
    properties2: "Logements", services2: "Services", lastLogin: "Dernière connexion", created: "Créé le", noClients: "Aucun client dans cette vue.", noProperty: "Aucun logement",
    consignes30: "Consignes 30 j", blocked: "Bloqué", inactive: "Inactif", block: "Bloquer", unblock: "Débloquer", delete: "Supprimer", error: "Une erreur est survenue.",
    confirmBlock: "Bloquer « {name} » ? Son accès sera coupé tant que vous ne le débloquez pas.",
    confirmDelete: "SUPPRESSION DÉFINITIVE de « {name} » : toutes ses données seront effacées et c'est irréversible.\n\nTapez SUPPRIMER pour confirmer.",
    st: { paying: "Payant", free: "Offert", trialing: "Essai", past_due: "Impayé", canceled: "Résilié", none: "Sans abonnement", active: "Actif", unpaid: "Impayé", incomplete: "Incomplet" },
  },
  en: {
    title: "Tourist Book dashboard", back: "Livret admin", sub: "Welcome books and consigne notebook: two products, two P&Ls, one place.",
    tabs: { overview: "Overview", livret: "Welcome books", cahier: "Consigne notebook", accounting: "Accounting" },
    livret: "Livrets", cahier: "Notebook", mrr: "MRR", arr: "ARR (×12)", goal: "Monthly goal", goalLeft: "Left", goalDone: "Goal reached", total: "Total",
    payingClients: "Paying customers", trials: "Trials running", newMonth: "New this month", canceledMonth: "Cancellations this month", revMonth: "Invoiced this month", rev12: "Invoiced over 12 months", commission: "Transfer commission (month)",
    alerts: "Watch list", none: "Nothing to report.", pastDue: "Payment overdue (hotel)", pastDueSub: "Payment overdue", inactiveHotel: "Hotel with no consigne in 30 days", canceling: "Cancels at period end", trialEnding: "Trial ends within 7 days",
    watch: "Customers to handle", unpaidC: "Unpaid", inactiveC: "Inactive", blockedC: "Blocked", seeList: "See list",
    revChartTitle: "Invoiced revenue per month", revByProduct: "Revenue by product",
    month: "Month", invoiced: "Invoiced", invoicesCount: "Invoices", avgInvoice: "Average invoice",
    stats: "Statistics", opens30: "Opens 30 d", opensTotal: "Total opens", checkins: "Check-ins", reservations: "Reservations", properties: "Properties", clientsLabel: "Customers",
    newPerMonth: "New customers per month", topProps: "Most viewed properties (30 d)", topTiles: "Most used buttons", noData: "No data yet.",
    hotelsActive: "Active hotels (30 d)", services: "Services", cons30: "Consignes 30 d", consTotal: "Total consignes", consPerDay: "Consignes written per day (last 30 days)",
    clients: "Customers", all: "All", paying: "Paying", trial: "Trials", pastDueF: "Unpaid", inactiveF: "Inactive", blockedF: "Blocked", canceledF: "Canceled", freeF: "Free",
    accounting: "Accounting", chart: "Invoiced revenue per month", gross: "Gross collected", refunded: "Refunded", fees: "Stripe fees", net: "Net collected", transfers: "Transfer commission",
    accNote: "Invoiced = paid Stripe invoices, split by product. Collected = actual payments for the whole Stripe account (fees and refunds included), not split by product. No VAT for now. Transfer commissions are an estimate outside Stripe.",
    exportInv: "Download invoices (Excel)", exportMonths: "Download monthly summary (Excel)",
    subs: "Stripe subscriptions", product: "Product", qty: "Qty", status: "Status", next: "Next due", invoices: "Latest paid invoices", number: "No.", date: "Date", amount: "Amount", view: "View",
    leads: "Latest contacts", name: "Name", phone: "Phone", message: "Message", noLeads: "No contact.", client: "Customer",
    properties2: "Properties", services2: "Services", lastLogin: "Last login", created: "Created", noClients: "No customer in this view.", noProperty: "No property",
    consignes30: "Consignes 30 d", blocked: "Blocked", inactive: "Inactive", block: "Block", unblock: "Unblock", delete: "Delete", error: "Something went wrong.",
    confirmBlock: "Block “{name}”? Their access will be cut until you unblock them.",
    confirmDelete: "PERMANENT DELETION of “{name}”: all their data will be erased and this cannot be undone.\n\nType SUPPRIMER to confirm.",
    st: { paying: "Paying", free: "Free", trialing: "Trial", past_due: "Past due", canceled: "Canceled", none: "No subscription", active: "Active", unpaid: "Unpaid", incomplete: "Incomplete" },
  },
  es: {
    title: "Panel de Tourist Book", back: "Admin livrets", sub: "Livrets y cahier de consignes: dos productos, dos cuentas de resultados, un solo sitio.",
    tabs: { overview: "Resumen", livret: "Livrets", cahier: "Cahier de consignes", accounting: "Contabilidad" },
    livret: "Livrets", cahier: "Cahier", mrr: "MRR", arr: "ARR (×12)", goal: "Objetivo mensual", goalLeft: "Faltan", goalDone: "Objetivo alcanzado", total: "Total",
    payingClients: "Clientes de pago", trials: "Pruebas en curso", newMonth: "Nuevos este mes", canceledMonth: "Bajas este mes", revMonth: "Facturado este mes", rev12: "Facturado en 12 meses", commission: "Comisión traslados (mes)",
    alerts: "Para vigilar", none: "Nada que señalar.", pastDue: "Pago atrasado (hotel)", pastDueSub: "Pago atrasado", inactiveHotel: "Hotel sin consignas en 30 días", canceling: "Se cancela al final del periodo", trialEnding: "La prueba termina en menos de 7 días",
    watch: "Clientes a gestionar", unpaidC: "Impagados", inactiveC: "Inactivos", blockedC: "Bloqueados", seeList: "Ver lista",
    revChartTitle: "Facturación por mes", revByProduct: "Ingresos por producto",
    month: "Mes", invoiced: "Facturado", invoicesCount: "Facturas", avgInvoice: "Factura media",
    stats: "Estadísticas", opens30: "Aperturas 30 d", opensTotal: "Aperturas totales", checkins: "Check-ins", reservations: "Reservas", properties: "Alojamientos", clientsLabel: "Clientes",
    newPerMonth: "Nuevos clientes por mes", topProps: "Alojamientos más consultados (30 d)", topTiles: "Botones más usados", noData: "Aún no hay datos.",
    hotelsActive: "Hoteles activos (30 d)", services: "Servicios", cons30: "Consignas 30 d", consTotal: "Consignas totales", consPerDay: "Consignas escritas por día (últimos 30 días)",
    clients: "Clientes", all: "Todos", paying: "De pago", trial: "Pruebas", pastDueF: "Impagados", inactiveF: "Inactivos", blockedF: "Bloqueados", canceledF: "Cancelados", freeF: "Gratis",
    accounting: "Contabilidad", chart: "Facturación por mes", gross: "Cobrado bruto", refunded: "Reembolsado", fees: "Comisiones Stripe", net: "Neto cobrado", transfers: "Comisión traslados",
    accNote: "Facturado = facturas de Stripe pagadas, separadas por producto. Cobrado = pagos reales de toda la cuenta de Stripe (con comisiones y reembolsos), sin separar por producto. Sin IVA por ahora. Las comisiones de traslados son una estimación fuera de Stripe.",
    exportInv: "Descargar facturas (Excel)", exportMonths: "Descargar resumen mensual (Excel)",
    subs: "Suscripciones de Stripe", product: "Producto", qty: "Cant.", status: "Estado", next: "Vence", invoices: "Últimas facturas cobradas", number: "N.º", date: "Fecha", amount: "Importe", view: "Ver",
    leads: "Últimos contactos", name: "Nombre", phone: "Teléfono", message: "Mensaje", noLeads: "Sin contactos.", client: "Cliente",
    properties2: "Alojamientos", services2: "Servicios", lastLogin: "Última conexión", created: "Creado", noClients: "Ningún cliente en esta vista.", noProperty: "Sin alojamiento",
    consignes30: "Consignas 30 d", blocked: "Bloqueado", inactive: "Inactivo", block: "Bloquear", unblock: "Desbloquear", delete: "Eliminar", error: "Ocurrió un error.",
    confirmBlock: "¿Bloquear a «{name}»? Se le corta el acceso hasta que lo desbloquees.",
    confirmDelete: "ELIMINACIÓN DEFINITIVA de «{name}»: se borran todos sus datos y no se puede deshacer.\n\nEscribe SUPPRIMER para confirmar.",
    st: { paying: "De pago", free: "Gratis", trialing: "Prueba", past_due: "Impagado", canceled: "Cancelado", none: "Sin suscripción", active: "Activo", unpaid: "Impagado", incomplete: "Incompleto" },
  },
};

const card = "rounded-lg border border-sand-dim bg-sand-card p-5";
const th = "px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-ink/60";
const td = "px-3 py-2 align-top";
const num = "px-3 py-2 text-right tabular-nums";

const Kpi = ({ label, value, hint }) => (
  <div className={card}>
    <p className="text-xs font-bold uppercase tracking-wider text-ink/60">{label}</p>
    <p className="mt-2 font-display text-3xl text-ink tabular-nums">{value}</p>
    {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
  </div>
);

const Section = ({ title, children, actions }) => (
  <section className="mt-10">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <h2 className="font-display italic text-2xl text-ink">{title}</h2>
      {actions}
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

// Barres simples en SVG (pas de bibliothèque) : une série, ou deux séries empilées (`rows[].value2`).
function BarChart({ rows, color, color2, label, fmt = (v) => Math.round(v) }) {
  const W = 760, H = 200, pad = { l: 8, r: 8, t: 14, b: 26 };
  const max = Math.max(1, ...rows.map((r) => r.value + (r.value2 ?? 0)));
  const bw = (W - pad.l - pad.r) / rows.length;
  const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  const every = rows.length > 14 ? Math.ceil(rows.length / 10) : 1;
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[560px]" role="img" aria-label={label}>
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="currentColor" strokeOpacity=".25" />
        {rows.map((r, i) => {
          const x = pad.l + i * bw + bw * 0.15, w = bw * 0.7, y1 = y(r.value), y2 = y(r.value + (r.value2 ?? 0));
          return (
            <g key={i}>
              <rect x={x} y={y1} width={w} height={Math.max(0, H - pad.b - y1)} fill={color} />
              {r.value2 > 0 && <rect x={x} y={y2} width={w} height={Math.max(0, y1 - y2)} fill={color2} />}
              {i % every === 0 && <text x={x + w / 2} y={H - pad.b + 16} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity=".7">{r.label}</text>}
              {r.value + (r.value2 ?? 0) > 0 && <text x={x + w / 2} y={y2 - 3} textAnchor="middle" fontSize="9" fill="currentColor" fillOpacity=".8">{fmt(r.value + (r.value2 ?? 0))}</text>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const FILTERS = ["all", "paying", "trial", "pastdue", "inactive", "blocked", "canceled", "free"];
const filterRows = (rows, f) =>
  rows.filter((r) => {
    if (f === "paying") return r.status === "paying";
    if (f === "trial") return r.status === "trialing";
    if (f === "pastdue") return r.status === "past_due";
    if (f === "inactive") return r.inactive;
    if (f === "blocked") return r.blocked;
    if (f === "canceled") return r.status === "canceled";
    if (f === "free") return r.status === "free";
    return true;
  });

export default async function TableauPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) notFound();

  const sp = await searchParams;
  const view = ["overview", "livret", "cahier", "accounting"].includes(sp?.v) ? sp.v : "overview";
  const filter = FILTERS.includes(sp?.f) ? sp.f : "all";
  const locale = await getLocale();
  const L = T[locale] ?? T.fr;
  const loc = LOC[locale] ?? "fr-FR";
  const d = await loadDashboard();
  const eur = new Intl.NumberFormat(loc, { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
  const eur0 = new Intl.NumberFormat(loc, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const dayFmt = new Intl.DateTimeFormat(loc, { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" });
  const monthFmt = new Intl.DateTimeFormat(loc, { month: "short", year: "2-digit", timeZone: "UTC" });
  const fmtMonth = (m) => monthFmt.format(new Date(`${m}-15T12:00:00Z`));
  const dt = (v) => (v ? dayFmt.format(typeof v === "number" ? new Date(v * 1000) : new Date(v)) : "—");
  const { kpi, stats } = d;
  const thisMonth = d.months[d.months.length - 1];
  const subsOf = (p) => d.subs.filter((s) => s.product === p);
  const prod = (p) => {
    const rows = d.revenue.map((r) => ({ month: r.month, amount: r[p], count: r[`${p}Count`] }));
    const clients = p === "livret" ? d.livretClients : d.cahierClients;
    return {
      mrr: p === "livret" ? kpi.mrrLivret : kpi.mrrCahier,
      paying: clients.filter((c) => c.status === "paying").length,
      trial: clients.filter((c) => c.status === "trialing").length,
      pastDue: clients.filter((c) => c.status === "past_due").length,
      inactive: clients.filter((c) => c.inactive).length,
      blocked: clients.filter((c) => c.blocked).length,
      newMonth: subsOf(p).filter((s) => monthOf(s.created) === thisMonth).length,
      canceledMonth: subsOf(p).filter((s) => s.canceledAt && monthOf(s.canceledAt) === thisMonth).length,
      revMonth: rows[rows.length - 1].amount, rev12: rows.reduce((a, r) => a + r.amount, 0), rows, count: rows.reduce((a, r) => a + r.count, 0),
    };
  };
  const PL = prod("livret"), PC = prod("cahier");
  const goalPct = Math.min(100, (kpi.mrr / MONTHLY_GOAL) * 100);
  const totals = d.revenue.reduce((a, r, i) => ({ gross: a.gross + r.gross, refunded: a.refunded + r.refunded, fees: a.fees + r.fees, comm: a.comm + (d.transfers[i]?.commission ?? 0), livret: a.livret + r.livret, cahier: a.cahier + r.cahier }), { gross: 0, refunded: 0, fees: 0, comm: 0, livret: 0, cahier: 0 });
  const alertText = (a) => {
    const base = L[a.kind] ?? a.kind;
    if (a.kind === "canceling" || a.kind === "trialEnding") return `${base} (${dt(a.detail)})`;
    if (a.kind === "inactiveHotel") return `${base}${a.detail ? ` · ${dt(a.detail)}` : ""}`;
    return base;
  };
  const btn = "inline-flex h-10 items-center rounded-lg border border-sand-dim bg-sand px-4 text-sm font-bold text-ink/70 transition-colors hover:border-aqua-deep hover:text-aqua-deep";
  const href = (v, f) => `/admin/tableau?v=${v}${f && f !== "all" ? `&f=${f}` : ""}`;
  const mrrChartRows = (p) => PL && (p === "livret" ? PL : PC).rows.map((r) => ({ label: fmtMonth(r.month), value: r.amount }));
  const labelTile = (e) => (eventLabels[locale] ?? eventLabels.fr)[e] ?? e;
  const clientsLabels = { ...L, properties: L.properties2, services: L.services2 };

  const ProductKpis = ({ P, color }) => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi label={`${L.mrr}`} value={eur.format(P.mrr)} hint={`${L.arr} ${eur0.format(P.mrr * 12)}`} />
      <Kpi label={L.payingClients} value={P.paying} hint={`${L.trials} : ${P.trial}`} />
      <Kpi label={L.newMonth} value={P.newMonth} hint={`${L.canceledMonth} : ${P.canceledMonth}`} />
      <Kpi label={L.revMonth} value={eur.format(P.revMonth)} hint={`${L.rev12} : ${eur0.format(P.rev12)}`} />
      <span className="hidden" style={{ color }} />
    </div>
  );

  const ClientsBlock = ({ kind, rows, v }) => (
    <Section title={L.clients}>
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const n = filterRows(rows, f).length;
          const names = { all: L.all, paying: L.paying, trial: L.trial, pastdue: L.pastDueF, inactive: L.inactiveF, blocked: L.blockedF, canceled: L.canceledF, free: L.freeF };
          const on = f === filter;
          return (
            <Link key={f} href={href(v, f)} className={`rounded-full border px-3.5 py-1.5 text-sm font-bold ${on ? "border-ink bg-ink text-sand" : "border-sand-dim bg-sand-card text-ink/70 hover:border-ink"}`}>{names[f]} <span className="opacity-70">{n}</span></Link>
          );
        })}
      </div>
      <ClientsTable rows={filterRows(rows, filter)} kind={kind} L={clientsLabels} locale={loc} />
    </Section>
  );

  return (
    <main className="flex-1 bg-sand">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 bg-[#2f7d76] px-6 py-4">
        <Link href="/" className="inline-flex shrink-0">
          <Image src="/tourist book long.png" alt="Tourist Book" width={278} height={106} className="h-14 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-20" />
        </Link>
        <span className="rounded-md bg-[#f7f1e4] px-3 py-1.5 text-sm font-bold uppercase tracking-widest text-[#2f7d76]">Admin</span>
        <Link href="/admin/cahier-demo" className="ml-auto rounded-full bg-[#f7f1e4]/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#f7f1e4] hover:bg-[#f7f1e4] hover:text-[#2f7d76]">Présentation hôtel</Link>
        <Link href="/admin" className=" rounded-full bg-[#f7f1e4]/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#f7f1e4] hover:bg-[#f7f1e4] hover:text-[#2f7d76]">{L.back}</Link>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display italic text-4xl text-ink">{L.title}</h1>
        <p className="mt-2 text-ink/70">{L.sub}</p>

        <nav className="mt-6 flex flex-wrap gap-2 border-b border-sand-dim pb-4" aria-label="Sections">
          {Object.entries(L.tabs).map(([k, label]) => (
            <Link key={k} href={href(k)} aria-current={view === k ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-bold ${view === k ? "bg-ink text-sand" : "border border-sand-dim bg-sand-card text-ink/70 hover:border-ink"}`}>{label}</Link>
          ))}
        </nav>

        {view === "overview" && (
          <>
            <Section title={L.revByProduct}>
              <div className="grid gap-4 lg:grid-cols-2">
                {[["livret", PL, LIVRET_COLOR, L.livret], ["cahier", PC, CAHIER_COLOR, L.cahier]].map(([k, P, c, name]) => (
                  <div key={k} className={card} style={{ borderTop: `4px solid ${c}` }}>
                    <div className="flex items-baseline justify-between"><h3 className="font-display italic text-2xl text-ink">{name}</h3><Link href={href(k)} className="text-sm font-bold text-aqua-deep underline">{L.seeList}</Link></div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div><dt className="text-ink/60">{L.mrr}</dt><dd className="font-display text-2xl tabular-nums text-ink">{eur.format(P.mrr)}</dd></div>
                      <div><dt className="text-ink/60">{L.payingClients}</dt><dd className="font-display text-2xl tabular-nums text-ink">{P.paying}</dd></div>
                      <div><dt className="text-ink/60">{L.revMonth}</dt><dd className="tabular-nums text-ink">{eur.format(P.revMonth)}</dd></div>
                      <div><dt className="text-ink/60">{L.rev12}</dt><dd className="tabular-nums text-ink">{eur0.format(P.rev12)}</dd></div>
                      <div><dt className="text-ink/60">{L.trials}</dt><dd className="tabular-nums text-ink">{P.trial}</dd></div>
                      <div><dt className="text-ink/60">{L.newMonth}</dt><dd className="tabular-nums text-ink">{P.newMonth}</dd></div>
                    </dl>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Kpi label={`${L.mrr} ${L.total}`} value={eur.format(kpi.mrr)} hint={`${L.arr} ${eur0.format(kpi.arr)}`} />
                <Kpi label={`${L.revMonth} (${L.total})`} value={eur.format(PL.revMonth + PC.revMonth)} />
                <Kpi label={L.commission} value={eur.format(kpi.transferCommission)} />
              </div>
              <div className={`${card} mt-4`}>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink/70"><span className="font-bold text-ink">{L.goal} : {eur0.format(MONTHLY_GOAL)}</span><span>{kpi.mrr >= MONTHLY_GOAL ? L.goalDone : `${L.goalLeft} ${eur0.format(MONTHLY_GOAL - kpi.mrr)}`}</span></div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-sand-dim"><div className="h-full bg-terracotta" style={{ width: `${goalPct}%` }} /></div>
              </div>
              <div className={`${card} mt-4`}>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">{L.revChartTitle}</h3>
                <BarChart rows={d.revenue.map((r) => ({ label: fmtMonth(r.month), value: r.livret, value2: r.cahier }))} color={LIVRET_COLOR} color2={CAHIER_COLOR} label={L.revChartTitle} />
                <p className="mt-1 flex gap-4 text-sm text-ink/70"><span><span className="mr-1 inline-block h-3 w-3 align-middle" style={{ background: LIVRET_COLOR }} />{L.livret}</span><span><span className="mr-1 inline-block h-3 w-3 align-middle" style={{ background: CAHIER_COLOR }} />{L.cahier}</span></p>
              </div>
            </Section>

            <Section title={L.watch}>
              <div className="grid gap-4 sm:grid-cols-3">
                {[[L.unpaidC, "pastdue", PL.pastDue + PC.pastDue], [L.inactiveC, "inactive", PL.inactive + PC.inactive], [L.blockedC, "blocked", PL.blocked + PC.blocked]].map(([label, f, n]) => (
                  <div key={f} className={card}><p className="text-xs font-bold uppercase tracking-wider text-ink/60">{label}</p><p className="mt-2 font-display text-3xl tabular-nums text-ink">{n}</p>
                    <p className="mt-2 text-sm"><Link className="font-bold text-aqua-deep underline" href={href("livret", f)}>{L.livret} ({filterRows(d.livretClients, f).length})</Link> · <Link className="font-bold text-aqua-deep underline" href={href("cahier", f)}>{L.cahier} ({filterRows(d.cahierClients, f).length})</Link></p></div>
                ))}
              </div>
            </Section>

            <Section title={L.alerts}>
              {d.alerts.length === 0 ? <p className="text-ink/60">{L.none}</p> : (
                <ul className="grid gap-2">{d.alerts.map((a, i) => <li key={i} className="rounded-lg border border-terracotta-deep/40 bg-sand-card px-4 py-3 text-ink"><strong>{a.who}</strong> · {alertText(a)}</li>)}</ul>
              )}
            </Section>
          </>
        )}

        {view === "livret" && (
          <>
            <Section title={L.tabs.livret}>
              <ProductKpis P={PL} color={LIVRET_COLOR} />
              <div className={`${card} mt-4`}>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">{L.revChartTitle} — {L.livret}</h3>
                <BarChart rows={mrrChartRows("livret")} color={LIVRET_COLOR} label={L.revChartTitle} />
              </div>
              <div className="mt-4 overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
                <table className="w-full min-w-[480px] text-sm"><thead className="border-b border-sand-dim"><tr><th className={th}>{L.month}</th><th className={`${th} text-right`}>{L.invoiced}</th><th className={`${th} text-right`}>{L.invoicesCount}</th><th className={`${th} text-right`}>{L.avgInvoice}</th></tr></thead>
                  <tbody>{[...PL.rows].reverse().map((r) => <tr key={r.month} className="border-t border-sand-dim"><td className={td}>{fmtMonth(r.month)}</td><td className={`${num} font-bold`}>{eur.format(r.amount)}</td><td className={num}>{r.count}</td><td className={num}>{r.count ? eur.format(r.amount / r.count) : "—"}</td></tr>)}
                    <tr className="border-t-2 border-sand-dim font-bold"><td className={td}>{L.total}</td><td className={num}>{eur.format(PL.rev12)}</td><td className={num}>{PL.count}</td><td className={num}>{PL.count ? eur.format(PL.rev12 / PL.count) : "—"}</td></tr></tbody></table>
              </div>
            </Section>

            <Section title={L.stats}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Kpi label={L.clientsLabel} value={stats.livret.clients} /><Kpi label={L.properties} value={stats.livret.properties} /><Kpi label={L.opens30} value={stats.livret.opens30} /><Kpi label={L.opensTotal} value={stats.livret.opensTotal} /><Kpi label={L.checkins} value={stats.livret.checkins} hint={`${L.reservations} : ${stats.livret.reservations}`} />
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className={card}><h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">{L.newPerMonth}</h3><BarChart rows={stats.livret.newPerMonth.map((r) => ({ label: fmtMonth(r.label), value: r.value }))} color={LIVRET_COLOR} label={L.newPerMonth} /></div>
                <div className={card}>
                  <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">{L.topProps}</h3>
                  {stats.livret.topProps.every((p) => p.opens30 === 0) ? <p className="text-ink/60">{L.noData}</p> : <ol className="grid gap-1.5 text-sm">{stats.livret.topProps.filter((p) => p.opens30 > 0).map((p, i) => <li key={i} className="flex justify-between gap-3"><span>{p.name}{p.city ? <span className="text-ink/60"> · {p.city}</span> : null}</span><span className="tabular-nums font-bold">{p.opens30}</span></li>)}</ol>}
                  <h3 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wider text-ink/60">{L.topTiles}</h3>
                  {stats.livret.topTiles.length === 0 ? <p className="text-ink/60">{L.noData}</p> : <ol className="grid gap-1.5 text-sm">{stats.livret.topTiles.map((t) => <li key={t.event} className="flex justify-between gap-3"><span>{labelTile(t.event)}</span><span className="tabular-nums font-bold">{t.total}</span></li>)}</ol>}
                </div>
              </div>
            </Section>

            <ClientsBlock kind="host" rows={d.livretClients} v="livret" />
          </>
        )}

        {view === "cahier" && (
          <>
            <Section title={L.tabs.cahier}>
              <ProductKpis P={PC} color={CAHIER_COLOR} />
              <div className={`${card} mt-4`}>
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">{L.revChartTitle} — {L.cahier}</h3>
                <BarChart rows={mrrChartRows("cahier")} color={CAHIER_COLOR} label={L.revChartTitle} />
              </div>
              <div className="mt-4 overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
                <table className="w-full min-w-[480px] text-sm"><thead className="border-b border-sand-dim"><tr><th className={th}>{L.month}</th><th className={`${th} text-right`}>{L.invoiced}</th><th className={`${th} text-right`}>{L.invoicesCount}</th><th className={`${th} text-right`}>{L.avgInvoice}</th></tr></thead>
                  <tbody>{[...PC.rows].reverse().map((r) => <tr key={r.month} className="border-t border-sand-dim"><td className={td}>{fmtMonth(r.month)}</td><td className={`${num} font-bold`}>{eur.format(r.amount)}</td><td className={num}>{r.count}</td><td className={num}>{r.count ? eur.format(r.amount / r.count) : "—"}</td></tr>)}
                    <tr className="border-t-2 border-sand-dim font-bold"><td className={td}>{L.total}</td><td className={num}>{eur.format(PC.rev12)}</td><td className={num}>{PC.count}</td><td className={num}>{PC.count ? eur.format(PC.rev12 / PC.count) : "—"}</td></tr></tbody></table>
              </div>
            </Section>

            <Section title={L.stats}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Kpi label={L.clientsLabel} value={stats.cahier.hotels} /><Kpi label={L.hotelsActive} value={`${stats.cahier.activeHotels} / ${stats.cahier.hotels}`} /><Kpi label={L.services} value={stats.cahier.services} /><Kpi label={L.cons30} value={stats.cahier.consignes30} /><Kpi label={L.consTotal} value={stats.cahier.consignesTotal} />
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className={card}><h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">{L.consPerDay}</h3><BarChart rows={stats.cahier.perDay} color={CAHIER_COLOR} label={L.consPerDay} /></div>
                <div className={card}><h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">{L.newPerMonth}</h3><BarChart rows={stats.cahier.newPerMonth.map((r) => ({ label: fmtMonth(r.label), value: r.value }))} color={CAHIER_COLOR} label={L.newPerMonth} /></div>
              </div>
            </Section>

            <ClientsBlock kind="hotel" rows={d.cahierClients} v="cahier" />
          </>
        )}

        {view === "accounting" && (
          <>
            <Section title={L.accounting} actions={<div className="flex flex-wrap gap-2"><a href="/api/admin/accounting-csv?type=months" className={btn}>{L.exportMonths}</a><a href="/api/admin/accounting-csv?type=invoices" className={btn}>{L.exportInv}</a></div>}>
              <div className="overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
                <table className="w-full min-w-[820px] text-sm">
                  <thead className="border-b border-sand-dim"><tr><th className={th}>{L.month}</th><th className={`${th} text-right`}>{L.livret}</th><th className={`${th} text-right`}>{L.cahier}</th><th className={`${th} text-right`}>{L.invoiced}</th><th className={`${th} text-right`}>{L.gross}</th><th className={`${th} text-right`}>{L.refunded}</th><th className={`${th} text-right`}>{L.fees}</th><th className={`${th} text-right`}>{L.net}</th><th className={`${th} text-right`}>{L.transfers}</th></tr></thead>
                  <tbody>
                    {[...d.revenue].reverse().map((r) => { const i = d.revenue.indexOf(r); return (
                      <tr key={r.month} className="border-t border-sand-dim"><td className={td}>{fmtMonth(r.month)}</td><td className={num}>{eur.format(r.livret)}</td><td className={num}>{eur.format(r.cahier)}</td><td className={`${num} font-bold`}>{eur.format(r.livret + r.cahier)}</td><td className={num}>{eur.format(r.gross)}</td><td className={num}>{eur.format(r.refunded)}</td><td className={num}>{eur.format(r.fees)}</td><td className={`${num} font-bold`}>{eur.format(r.gross - r.refunded - r.fees)}</td><td className={num}>{eur.format(d.transfers[i]?.commission ?? 0)}</td></tr>); })}
                    <tr className="border-t-2 border-sand-dim font-bold"><td className={td}>{L.total}</td><td className={num}>{eur.format(totals.livret)}</td><td className={num}>{eur.format(totals.cahier)}</td><td className={num}>{eur.format(totals.livret + totals.cahier)}</td><td className={num}>{eur.format(totals.gross)}</td><td className={num}>{eur.format(totals.refunded)}</td><td className={num}>{eur.format(totals.fees)}</td><td className={num}>{eur.format(totals.gross - totals.refunded - totals.fees)}</td><td className={num}>{eur.format(totals.comm)}</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-sm text-ink/60">{L.accNote}</p>
            </Section>

            <Section title={L.subs}>
              <div className="overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="border-b border-sand-dim"><tr><th className={th}>{L.client}</th><th className={th}>{L.product}</th><th className={th}>{L.status}</th><th className={`${th} text-right`}>{L.qty}</th><th className={`${th} text-right`}>{L.mrr}</th><th className={th}>{L.next}</th></tr></thead>
                  <tbody>{[...d.subs].sort((a, b) => (a.status === "canceled") - (b.status === "canceled") || b.created - a.created).map((s) => (
                    <tr key={s.id} className="border-t border-sand-dim"><td className={td}>{s.customer}</td><td className={td}>{s.product === "cahier" ? L.cahier : L.livret}</td><td className={td}>{L.st[s.status] ?? s.status}{s.cancelAtPeriodEnd ? " ↘" : ""}</td><td className={num}>{s.quantity}</td><td className={num}>{s.status === "active" ? eur.format(s.mrr) : "—"}</td><td className={td}>{s.status === "canceled" ? dt(s.canceledAt) : dt(s.periodEnd)}</td></tr>))}</tbody>
                </table>
              </div>
            </Section>

            <Section title={L.invoices}>
              <div className="overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="border-b border-sand-dim"><tr><th className={th}>{L.number}</th><th className={th}>{L.date}</th><th className={th}>{L.client}</th><th className={th}>{L.product}</th><th className={`${th} text-right`}>{L.amount}</th><th className={th} /></tr></thead>
                  <tbody>{d.bills.slice(0, 40).map((b, i) => (
                    <tr key={i} className="border-t border-sand-dim"><td className={td}>{b.number}</td><td className={td}>{dt(b.date)}</td><td className={td}>{b.customer}</td><td className={td}>{b.product === "cahier" ? L.cahier : L.livret}</td><td className={num}>{eur.format(b.amount)}</td><td className={td}>{b.url && <a href={b.url} target="_blank" rel="noopener noreferrer" className="font-bold text-aqua-deep underline">{L.view}</a>}</td></tr>))}</tbody>
                </table>
              </div>
            </Section>

            <Section title={L.leads}>
              {d.leads.length === 0 ? <p className="text-ink/60">{L.noLeads}</p> : (
                <div className="overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="border-b border-sand-dim"><tr><th className={th}>{L.date}</th><th className={th}>{L.name}</th><th className={th}>Email</th><th className={th}>{L.phone}</th><th className={th}>{L.message}</th></tr></thead>
                    <tbody>{d.leads.map((l) => <tr key={l.id} className="border-t border-sand-dim"><td className={td}>{dt(l.created_at)}</td><td className={`${td} font-bold`}>{l.name}</td><td className={td}>{l.email}</td><td className={td}>{l.phone}</td><td className={`${td} max-w-xs truncate`} title={l.message ?? ""}>{(l.message ?? "").split("\n")[0]}</td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </Section>
          </>
        )}
      </div>
    </main>
  );
}
