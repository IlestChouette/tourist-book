import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/locale";
import { loadDashboard } from "@/lib/adminDashboard";

export const metadata = { title: "Tableau de bord", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const MONTHLY_GOAL = 5000;

const T = {
  fr: {
    title: "Tableau de bord Tourist Book", back: "Admin livrets", sub: "Livrets d'accueil, cahier de consignes et transferts, au même endroit.",
    revenue: "Revenu mensuel récurrent", mrr: "MRR total", arr: "ARR (×12)", mrrLivret: "MRR livrets", mrrCahier: "MRR cahier", goal: "Objectif mensuel", goalLeft: "Il reste", goalDone: "Objectif atteint",
    clients: "Clients", payingLivret: "Livrets payants", payingCahier: "Cahiers payants", trials: "Essais en cours", newMonth: "Nouveaux ce mois", canceledMonth: "Résiliations ce mois", commission: "Commission transferts (mois)",
    accounting: "Comptabilité", chart: "Chiffre d'affaires facturé par mois", livret: "Livrets", cahier: "Cahier", month: "Mois", billed: "Facturé", gross: "Encaissé brut", refunded: "Remboursé", fees: "Frais Stripe", net: "Net encaissé", transfers: "Commission transferts", total: "Total",
    accNote: "Facturé = factures Stripe payées. Encaissé = paiements réels (frais et remboursements inclus). Pas de TVA pour l'instant (franchise). Les commissions de transferts sont une estimation hors Stripe.",
    exportInv: "Télécharger les factures (Excel)", exportMonths: "Télécharger le résumé mensuel (Excel)",
    alerts: "À surveiller", none: "Rien à signaler.", pastDue: "Paiement en retard (hôtel)", pastDueSub: "Paiement en retard", inactiveHotel: "Hôtel sans consigne depuis 30 jours", canceling: "Résiliation à la fin de la période", trialEnding: "Fin d'essai dans moins de 7 jours",
    hotels: "Hôtels (cahier de consignes)", hotel: "Hôtel", owner: "Responsable", services: "Services", status: "Statut", renewal: "Renouvellement", c30: "Consignes 30 j", ctotal: "Total", last: "Dernière", created: "Créé le", exempt: "Offert", noHotels: "Aucun hôtel pour l'instant.",
    subs: "Abonnements Stripe", client: "Client", product: "Produit", mrrCol: "MRR", qty: "Qté", next: "Échéance",
    invoices: "Dernières factures encaissées", number: "N°", date: "Date", amount: "Montant", view: "Voir",
    leads: "Derniers contacts", name: "Nom", phone: "Téléphone", message: "Message", noLeads: "Aucun contact.",
    st: { active: "Actif", trialing: "Essai", past_due: "Impayé", canceled: "Résilié", none: "Aucun", unpaid: "Impayé", incomplete: "Incomplet" },
  },
  en: {
    title: "Tourist Book dashboard", back: "Livret admin", sub: "Welcome books, consigne notebook and transfers in one place.",
    revenue: "Monthly recurring revenue", mrr: "Total MRR", arr: "ARR (×12)", mrrLivret: "Livret MRR", mrrCahier: "Notebook MRR", goal: "Monthly goal", goalLeft: "Left", goalDone: "Goal reached",
    clients: "Customers", payingLivret: "Paying livrets", payingCahier: "Paying notebooks", trials: "Trials running", newMonth: "New this month", canceledMonth: "Cancellations this month", commission: "Transfer commission (month)",
    accounting: "Accounting", chart: "Invoiced revenue per month", livret: "Livrets", cahier: "Notebook", month: "Month", billed: "Invoiced", gross: "Gross collected", refunded: "Refunded", fees: "Stripe fees", net: "Net collected", transfers: "Transfer commission", total: "Total",
    accNote: "Invoiced = paid Stripe invoices. Collected = actual payments (fees and refunds included). No VAT for now. Transfer commissions are an estimate outside Stripe.",
    exportInv: "Download invoices (Excel)", exportMonths: "Download monthly summary (Excel)",
    alerts: "Watch list", none: "Nothing to report.", pastDue: "Payment overdue (hotel)", pastDueSub: "Payment overdue", inactiveHotel: "Hotel with no consigne in 30 days", canceling: "Cancels at period end", trialEnding: "Trial ends within 7 days",
    hotels: "Hotels (consigne notebook)", hotel: "Hotel", owner: "Owner", services: "Services", status: "Status", renewal: "Renewal", c30: "Consignes 30 d", ctotal: "Total", last: "Last", created: "Created", exempt: "Free", noHotels: "No hotel yet.",
    subs: "Stripe subscriptions", client: "Customer", product: "Product", mrrCol: "MRR", qty: "Qty", next: "Next due",
    invoices: "Latest paid invoices", number: "No.", date: "Date", amount: "Amount", view: "View",
    leads: "Latest contacts", name: "Name", phone: "Phone", message: "Message", noLeads: "No contact.",
    st: { active: "Active", trialing: "Trial", past_due: "Past due", canceled: "Canceled", none: "None", unpaid: "Unpaid", incomplete: "Incomplete" },
  },
  es: {
    title: "Panel de Tourist Book", back: "Admin livrets", sub: "Livrets, cahier de consignes y traslados, todo en un sitio.",
    revenue: "Ingreso mensual recurrente", mrr: "MRR total", arr: "ARR (×12)", mrrLivret: "MRR livrets", mrrCahier: "MRR cahier", goal: "Objetivo mensual", goalLeft: "Faltan", goalDone: "Objetivo alcanzado",
    clients: "Clientes", payingLivret: "Livrets de pago", payingCahier: "Cahiers de pago", trials: "Pruebas en curso", newMonth: "Nuevos este mes", canceledMonth: "Bajas este mes", commission: "Comisión traslados (mes)",
    accounting: "Contabilidad", chart: "Facturación por mes", livret: "Livrets", cahier: "Cahier", month: "Mes", billed: "Facturado", gross: "Cobrado bruto", refunded: "Reembolsado", fees: "Comisiones Stripe", net: "Neto cobrado", transfers: "Comisión traslados", total: "Total",
    accNote: "Facturado = facturas de Stripe pagadas. Cobrado = pagos reales (con comisiones y reembolsos). Sin IVA por ahora. Las comisiones de traslados son una estimación fuera de Stripe.",
    exportInv: "Descargar facturas (Excel)", exportMonths: "Descargar resumen mensual (Excel)",
    alerts: "Para vigilar", none: "Nada que señalar.", pastDue: "Pago atrasado (hotel)", pastDueSub: "Pago atrasado", inactiveHotel: "Hotel sin consignas en 30 días", canceling: "Se cancela al final del periodo", trialEnding: "La prueba termina en menos de 7 días",
    hotels: "Hoteles (cahier de consignes)", hotel: "Hotel", owner: "Responsable", services: "Servicios", status: "Estado", renewal: "Renovación", c30: "Consignas 30 d", ctotal: "Total", last: "Última", created: "Creado", exempt: "Gratis", noHotels: "Aún no hay hoteles.",
    subs: "Suscripciones de Stripe", client: "Cliente", product: "Producto", mrrCol: "MRR", qty: "Cant.", next: "Vence",
    invoices: "Últimas facturas cobradas", number: "N.º", date: "Fecha", amount: "Importe", view: "Ver",
    leads: "Últimos contactos", name: "Nombre", phone: "Teléfono", message: "Mensaje", noLeads: "Sin contactos.",
    st: { active: "Activo", trialing: "Prueba", past_due: "Impagado", canceled: "Cancelado", none: "Ninguno", unpaid: "Impagado", incomplete: "Incompleto" },
  },
};

const card = "rounded-lg border border-sand-dim bg-sand-card p-5";
const th = "px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-ink/60";
const td = "px-3 py-2 align-top";
const num = "px-3 py-2 text-right tabular-nums";
const LOC = { fr: "fr-FR", en: "en-GB", es: "es-ES" };

function Kpi({ label, value, hint }) {
  return (
    <div className={card}>
      <p className="text-xs font-bold uppercase tracking-wider text-ink/60">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
    </div>
  );
}

function Section({ title, children, actions }) {
  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display italic text-2xl text-ink">{title}</h2>
        {actions}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

// Barres empilées livrets / cahier par mois, dessinées en SVG (pas de bibliothèque).
function RevenueChart({ rows, L, fmtMonth }) {
  const W = 760, H = 220, pad = { l: 8, r: 8, t: 12, b: 28 };
  const max = Math.max(1, ...rows.map((r) => r.livret + r.cahier));
  const bw = (W - pad.l - pad.r) / rows.length;
  const y = (v) => pad.t + (H - pad.t - pad.b) * (1 - v / max);
  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[560px]" role="img" aria-label={L.chart}>
        <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} stroke="currentColor" strokeOpacity=".25" />
        {rows.map((r, i) => {
          const x = pad.l + i * bw + bw * 0.18, w = bw * 0.64;
          const yl = y(r.livret), yt = y(r.livret + r.cahier);
          return (
            <g key={r.month}>
              <rect x={x} y={yl} width={w} height={H - pad.b - yl} fill="#2f7d76" />
              <rect x={x} y={yt} width={w} height={Math.max(0, yl - yt)} fill="#d9763a" />
              <text x={x + w / 2} y={H - pad.b + 16} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity=".7">{fmtMonth(r.month)}</text>
              {r.livret + r.cahier > 0 && <text x={x + w / 2} y={yt - 4} textAnchor="middle" fontSize="10" fill="currentColor" fillOpacity=".8">{Math.round(r.livret + r.cahier)}</text>}
            </g>
          );
        })}
      </svg>
      <p className="mt-1 flex gap-4 text-sm text-ink/70">
        <span><span className="mr-1 inline-block h-3 w-3 align-middle" style={{ background: "#2f7d76" }} />{L.livret}</span>
        <span><span className="mr-1 inline-block h-3 w-3 align-middle" style={{ background: "#d9763a" }} />{L.cahier}</span>
      </p>
    </div>
  );
}

export default async function TableauPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) notFound();

  const locale = await getLocale();
  const L = T[locale] ?? T.fr;
  const d = await loadDashboard();
  const eur = new Intl.NumberFormat(LOC[locale] ?? "fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
  const eur0 = new Intl.NumberFormat(LOC[locale] ?? "fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const dayFmt = new Intl.DateTimeFormat(LOC[locale] ?? "fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" });
  const monthFmt = new Intl.DateTimeFormat(LOC[locale] ?? "fr-FR", { month: "short", year: "2-digit", timeZone: "UTC" });
  const fmtMonth = (m) => monthFmt.format(new Date(`${m}-15T12:00:00Z`));
  const dt = (v) => (v ? dayFmt.format(typeof v === "number" ? new Date(v * 1000) : new Date(v)) : "—");
  const { kpi } = d;
  const goalPct = Math.min(100, (kpi.mrr / MONTHLY_GOAL) * 100);
  const totals = d.revenue.reduce((a, r, i) => ({
    livret: a.livret + r.livret, cahier: a.cahier + r.cahier, gross: a.gross + r.gross, refunded: a.refunded + r.refunded, fees: a.fees + r.fees, comm: a.comm + (d.transfers[i]?.commission ?? 0),
  }), { livret: 0, cahier: 0, gross: 0, refunded: 0, fees: 0, comm: 0 });
  const alertText = (a) => {
    const base = L[a.kind] ?? a.kind;
    if (a.kind === "canceling" || a.kind === "trialEnding") return `${base} (${dt(a.detail)})`;
    if (a.kind === "inactiveHotel") return `${base}${a.detail ? ` · ${dt(a.detail)}` : ""}`;
    return base;
  };
  const btn = "inline-flex h-10 items-center rounded-lg border border-sand-dim bg-sand px-4 text-sm font-bold text-ink/70 transition-colors hover:border-aqua-deep hover:text-aqua-deep";

  return (
    <main className="flex-1 bg-sand">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 bg-[#2f7d76] px-6 py-4">
        <Link href="/" className="inline-flex shrink-0">
          <Image src="/tourist book long.png" alt="Tourist Book" width={278} height={106} className="h-14 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-20" />
        </Link>
        <span className="rounded-md bg-[#f7f1e4] px-3 py-1.5 text-sm font-bold uppercase tracking-widest text-[#2f7d76]">Admin</span>
        <Link href="/admin" className="ml-auto rounded-full bg-[#f7f1e4]/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#f7f1e4] hover:bg-[#f7f1e4] hover:text-[#2f7d76]">{L.back}</Link>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="font-display italic text-4xl text-ink">{L.title}</h1>
        <p className="mt-2 text-ink/70">{L.sub}</p>

        <Section title={L.revenue}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label={L.mrr} value={eur.format(kpi.mrr)} />
            <Kpi label={L.arr} value={eur0.format(kpi.arr)} />
            <Kpi label={L.mrrLivret} value={eur.format(kpi.mrrLivret)} />
            <Kpi label={L.mrrCahier} value={eur.format(kpi.mrrCahier)} />
          </div>
          <div className={`${card} mt-4`}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink/70">
              <span className="font-bold text-ink">{L.goal} : {eur0.format(MONTHLY_GOAL)}</span>
              <span>{kpi.mrr >= MONTHLY_GOAL ? L.goalDone : `${L.goalLeft} ${eur0.format(MONTHLY_GOAL - kpi.mrr)}`}</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-sand-dim"><div className="h-full bg-terracotta" style={{ width: `${goalPct}%` }} /></div>
          </div>
        </Section>

        <Section title={L.clients}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Kpi label={L.payingLivret} value={kpi.payingLivret} />
            <Kpi label={L.payingCahier} value={kpi.payingCahier} />
            <Kpi label={L.trials} value={kpi.trialing} />
            <Kpi label={L.newMonth} value={kpi.newThisMonth} />
            <Kpi label={L.canceledMonth} value={kpi.canceledThisMonth} />
            <Kpi label={L.commission} value={eur.format(kpi.transferCommission)} />
          </div>
        </Section>

        <Section title={L.alerts}>
          {d.alerts.length === 0 ? (
            <p className="text-ink/60">{L.none}</p>
          ) : (
            <ul className="grid gap-2">
              {d.alerts.map((a, i) => (
                <li key={i} className="rounded-lg border border-terracotta-deep/40 bg-sand-card px-4 py-3 text-ink"><strong>{a.who}</strong> · {alertText(a)}</li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          title={L.accounting}
          actions={
            <div className="flex flex-wrap gap-2">
              <a href="/api/admin/accounting-csv?type=months" className={btn}>{L.exportMonths}</a>
              <a href="/api/admin/accounting-csv?type=invoices" className={btn}>{L.exportInv}</a>
            </div>
          }
        >
          <div className={card}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">{L.chart}</h3>
            <RevenueChart rows={d.revenue} L={L} fmtMonth={fmtMonth} />
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-sand-dim">
                <tr><th className={th}>{L.month}</th><th className={`${th} text-right`}>{L.livret}</th><th className={`${th} text-right`}>{L.cahier}</th><th className={`${th} text-right`}>{L.billed}</th><th className={`${th} text-right`}>{L.gross}</th><th className={`${th} text-right`}>{L.refunded}</th><th className={`${th} text-right`}>{L.fees}</th><th className={`${th} text-right`}>{L.net}</th><th className={`${th} text-right`}>{L.transfers}</th></tr>
              </thead>
              <tbody>
                {[...d.revenue].reverse().map((r) => {
                  const i = d.revenue.indexOf(r);
                  return (
                    <tr key={r.month} className="border-t border-sand-dim">
                      <td className={td}>{fmtMonth(r.month)}</td>
                      <td className={num}>{eur.format(r.livret)}</td><td className={num}>{eur.format(r.cahier)}</td><td className={`${num} font-bold`}>{eur.format(r.livret + r.cahier)}</td>
                      <td className={num}>{eur.format(r.gross)}</td><td className={num}>{eur.format(r.refunded)}</td><td className={num}>{eur.format(r.fees)}</td><td className={`${num} font-bold`}>{eur.format(r.gross - r.refunded - r.fees)}</td>
                      <td className={num}>{eur.format(d.transfers[i]?.commission ?? 0)}</td>
                    </tr>
                  );
                })}
                <tr className="border-t-2 border-sand-dim font-bold">
                  <td className={td}>{L.total}</td><td className={num}>{eur.format(totals.livret)}</td><td className={num}>{eur.format(totals.cahier)}</td><td className={num}>{eur.format(totals.livret + totals.cahier)}</td>
                  <td className={num}>{eur.format(totals.gross)}</td><td className={num}>{eur.format(totals.refunded)}</td><td className={num}>{eur.format(totals.fees)}</td><td className={num}>{eur.format(totals.gross - totals.refunded - totals.fees)}</td><td className={num}>{eur.format(totals.comm)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-sm text-ink/60">{L.accNote}</p>
        </Section>

        <Section title={L.hotels}>
          <div className="overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-b border-sand-dim"><tr><th className={th}>{L.hotel}</th><th className={th}>{L.owner}</th><th className={`${th} text-right`}>{L.services}</th><th className={th}>{L.status}</th><th className={th}>{L.renewal}</th><th className={`${th} text-right`}>{L.c30}</th><th className={`${th} text-right`}>{L.ctotal}</th><th className={th}>{L.last}</th><th className={th}>{L.created}</th></tr></thead>
              <tbody>
                {d.hotels.length === 0 && <tr><td className={td} colSpan={9}>{L.noHotels}</td></tr>}
                {d.hotels.map((h) => (
                  <tr key={h.id} className="border-t border-sand-dim">
                    <td className={`${td} font-bold`}>{h.name}</td><td className={td}>{h.email}</td><td className={num}>{h.services_count ?? 0}</td>
                    <td className={td}>{h.billing_exempt ? L.exempt : L.st[h.billing_status] ?? h.billing_status}</td><td className={td}>{dt(h.current_period_end)}</td>
                    <td className={num}>{h.c30}</td><td className={num}>{h.total}</td><td className={td}>{dt(h.lastConsigne)}</td><td className={td}>{dt(h.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title={L.subs}>
          <div className="overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-b border-sand-dim"><tr><th className={th}>{L.client}</th><th className={th}>{L.product}</th><th className={th}>{L.status}</th><th className={`${th} text-right`}>{L.qty}</th><th className={`${th} text-right`}>{L.mrrCol}</th><th className={th}>{L.next}</th></tr></thead>
              <tbody>
                {[...d.subs].sort((a, b) => (a.status === "canceled") - (b.status === "canceled") || b.created - a.created).map((s) => (
                  <tr key={s.id} className="border-t border-sand-dim">
                    <td className={td}>{s.customer}</td><td className={td}>{s.product === "cahier" ? L.cahier : L.livret}</td><td className={td}>{L.st[s.status] ?? s.status}{s.cancelAtPeriodEnd ? " ↘" : ""}</td>
                    <td className={num}>{s.quantity}</td><td className={num}>{s.status === "active" ? eur.format(s.mrr) : "—"}</td><td className={td}>{s.status === "canceled" ? dt(s.canceledAt) : dt(s.periodEnd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title={L.invoices}>
          <div className="overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-sand-dim"><tr><th className={th}>{L.number}</th><th className={th}>{L.date}</th><th className={th}>{L.client}</th><th className={th}>{L.product}</th><th className={`${th} text-right`}>{L.amount}</th><th className={th} /></tr></thead>
              <tbody>
                {d.bills.slice(0, 25).map((b, i) => (
                  <tr key={i} className="border-t border-sand-dim">
                    <td className={td}>{b.number}</td><td className={td}>{dt(b.date)}</td><td className={td}>{b.customer}</td><td className={td}>{b.product === "cahier" ? L.cahier : L.livret}</td><td className={num}>{eur.format(b.amount)}</td>
                    <td className={td}>{b.url && <a href={b.url} target="_blank" rel="noopener noreferrer" className="font-bold text-aqua-deep underline">{L.view}</a>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title={L.leads}>
          {d.leads.length === 0 ? <p className="text-ink/60">{L.noLeads}</p> : (
            <div className="overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b border-sand-dim"><tr><th className={th}>{L.date}</th><th className={th}>{L.name}</th><th className={th}>Email</th><th className={th}>{L.phone}</th><th className={th}>{L.message}</th></tr></thead>
                <tbody>
                  {d.leads.map((l) => (
                    <tr key={l.id} className="border-t border-sand-dim"><td className={td}>{dt(l.created_at)}</td><td className={`${td} font-bold`}>{l.name}</td><td className={td}>{l.email}</td><td className={td}>{l.phone}</td><td className={`${td} max-w-xs truncate`} title={l.message ?? ""}>{(l.message ?? "").split("\n")[0]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </main>
  );
}
