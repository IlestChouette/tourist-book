import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTransferCommissionPct } from "@/lib/transferPricing";

// Prix Stripe du cahier de consignes (voir hotelBilling.js) : permet de séparer
// ce qui vient du cahier de ce qui vient des livrets.
const CAHIER_KEY = "tb_hotel_cahier_service_monthly";
const TZ = "Europe/Paris";
const monthFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit" });
export const monthOf = (unixOrIso) => {
  const d = typeof unixOrIso === "number" ? new Date(unixOrIso * 1000) : new Date(unixOrIso);
  const [y, m] = monthFmt.format(d).split("-");
  return `${y}-${m}`;
};
export const lastMonths = (n) => {
  const out = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) out.push(monthOf(new Date(now.getFullYear(), now.getMonth() - i, 15).toISOString()));
  return out;
};

// Une facture appartient au cahier si son abonnement, ou l'un de ses prix, est celui du cahier
// (le prix « cahier » peut avoir été recréé : on ne se fie pas qu'à la clé de recherche).
const invoiceSub = (i) => i.subscription ?? i.parent?.subscription_details?.subscription ?? null;
const linePriceId = (l) => l.price?.id ?? l.pricing?.price_details?.price ?? null;

// Tout ce qui vient de Stripe : abonnements, factures encaissées, encaissements réels (frais, remboursements).
async function loadStripe(sinceUnix) {
  const [subs, invoices, charges] = await Promise.all([
    stripe.subscriptions.list({ status: "all", limit: 100, expand: ["data.items.data.price", "data.customer"] }).autoPagingToArray({ limit: 2000 }),
    stripe.invoices.list({ status: "paid", created: { gte: sinceUnix }, limit: 100, expand: ["data.lines.data.price", "data.customer"] }).autoPagingToArray({ limit: 5000 }),
    stripe.charges.list({ created: { gte: sinceUnix }, limit: 100, expand: ["data.balance_transaction"] }).autoPagingToArray({ limit: 5000 }),
  ]);

  const mrrOf = async (sub) => {
    // Montant réel de la prochaine facture (coupons compris), ramené au mois.
    try {
      const inv = await stripe.invoices.createPreview({ subscription: sub.id });
      const interval = sub.items.data[0]?.price?.recurring?.interval;
      return (interval === "year" ? inv.total / 12 : inv.total) / 100;
    } catch {
      const it = sub.items.data[0];
      const unit = ((it?.price?.unit_amount ?? 0) * (it?.quantity ?? 1)) / 100;
      return it?.price?.recurring?.interval === "year" ? unit / 12 : unit;
    }
  };

  const subscriptions = await Promise.all(
    subs.map(async (s) => ({
      id: s.id,
      status: s.status,
      product: s.items.data.some((i) => i.price?.lookup_key === CAHIER_KEY) ? "cahier" : "livret",
      quantity: s.items.data.reduce((a, i) => a + (i.quantity ?? 1), 0),
      customer: typeof s.customer === "object" ? s.customer?.name || s.customer?.email || s.customer?.id : s.customer,
      email: typeof s.customer === "object" ? s.customer?.email ?? null : null,
      created: s.created,
      canceledAt: s.canceled_at ?? null,
      cancelAtPeriodEnd: Boolean(s.cancel_at_period_end),
      periodEnd: s.items.data[0]?.current_period_end ?? null,
      trialEnd: s.trial_end ?? null,
      mrr: s.status === "active" ? await mrrOf(s) : 0,
    }))
  );

  const subProduct = new Map(subs.map((s) => [s.id, s.items.data.some((i) => i.price?.lookup_key === CAHIER_KEY) ? "cahier" : "livret"]));
  const cahierPrices = new Set(subs.flatMap((s) => s.items.data.filter((i) => i.price?.lookup_key === CAHIER_KEY).map((i) => i.price.id)));
  const productOf = (i) => {
    const sid = typeof invoiceSub(i) === "object" ? invoiceSub(i)?.id : invoiceSub(i);
    if (sid && subProduct.has(sid)) return subProduct.get(sid);
    return i.lines.data.some((l) => cahierPrices.has(linePriceId(l)) || l.price?.lookup_key === CAHIER_KEY) ? "cahier" : "livret";
  };
  const bills = invoices
    .filter((i) => i.amount_paid > 0)
    .map((i) => ({
      number: i.number,
      date: i.created,
      customer: typeof i.customer === "object" ? i.customer?.name || i.customer?.email || i.customer?.id : i.customer,
      email: typeof i.customer === "object" ? i.customer?.email ?? "" : "",
      product: productOf(i),
      amount: i.amount_paid / 100,
      url: i.hosted_invoice_url ?? "",
    }))
    .sort((a, b) => b.date - a.date);

  const cash = charges
    .filter((c) => c.paid && c.status === "succeeded")
    .map((c) => ({ date: c.created, gross: c.amount / 100, refunded: c.amount_refunded / 100, fee: (c.balance_transaction?.fee ?? 0) / 100 }));

  return { subscriptions, bills, cash };
}

// Tableau de bord global : livrets + cahier de consignes + transferts, comptabilité comprise.
export async function loadDashboard() {
  const admin = createAdminClient();
  const months = lastMonths(12);
  const since = Math.floor(new Date(`${months[0]}-01T00:00:00Z`).getTime() / 1000);
  const thirtyAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  const [stripeData, hotelsRes, consignes30, leadsRes, requestsRes, commissionPct] = await Promise.all([
    loadStripe(since),
    admin.from("hotels").select("id, owner_id, name, created_at, billing_status, billing_exempt, services_count, current_period_end, past_due_since, retention_months"),
    admin.from("consignes").select("hotel_id, created_at").gte("created_at", thirtyAgo).limit(100000),
    admin.from("contact_leads").select("id, name, email, phone, message, created_at").order("created_at", { ascending: false }).limit(15),
    admin.from("requests").select("created_at, details").eq("type", "transfert").gte("created_at", new Date(`${months[0]}-01T00:00:00Z`).toISOString()),
    getTransferCommissionPct(),
  ]);

  const hotels = hotelsRes.data ?? [];
  // Propriétaire (email) et activité de chaque hôtel.
  const owners = new Map();
  await Promise.all([...new Set(hotels.map((h) => h.owner_id))].map(async (id) => {
    const { data } = await admin.auth.admin.getUserById(id);
    owners.set(id, data?.user?.email ?? "");
  }));
  const last30 = new Map();
  for (const c of consignes30.data ?? []) last30.set(c.hotel_id, (last30.get(c.hotel_id) ?? 0) + 1);
  const totals = new Map();
  const lastAt = new Map();
  await Promise.all(hotels.map(async (h) => {
    const [{ count }, { data: last }] = await Promise.all([
      admin.from("consignes").select("id", { count: "exact", head: true }).eq("hotel_id", h.id),
      admin.from("consignes").select("created_at").eq("hotel_id", h.id).order("created_at", { ascending: false }).limit(1),
    ]);
    totals.set(h.id, count ?? 0);
    lastAt.set(h.id, last?.[0]?.created_at ?? null);
  }));
  const hotelRows = hotels
    .map((h) => ({ ...h, email: owners.get(h.owner_id) ?? "", c30: last30.get(h.id) ?? 0, total: totals.get(h.id) ?? 0, lastConsigne: lastAt.get(h.id) }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  // Chiffre d'affaires par mois (factures encaissées) et encaissements réels (frais Stripe, remboursements).
  const revenue = months.map((m) => ({ month: m, livret: 0, cahier: 0, count: 0, gross: 0, refunded: 0, fees: 0 }));
  const byMonth = new Map(revenue.map((r) => [r.month, r]));
  for (const b of stripeData.bills) {
    const r = byMonth.get(monthOf(b.date));
    if (r) { r[b.product] += b.amount; r.count += 1; }
  }
  for (const c of stripeData.cash) {
    const r = byMonth.get(monthOf(c.date));
    if (r) { r.gross += c.gross; r.refunded += c.refunded; r.fees += c.fee; }
  }

  // Commission transferts (estimée : le taux actuel s'applique à tout l'historique).
  const share = commissionPct / (100 + commissionPct);
  const transfers = months.map((m) => ({ month: m, count: 0, total: 0, commission: 0 }));
  const tByMonth = new Map(transfers.map((t) => [t.month, t]));
  for (const r of requestsRes.data ?? []) {
    const t = tByMonth.get(monthOf(r.created_at));
    if (!t) continue;
    t.count += 1;
    const price = Number(r.details?.prixEstime);
    if (Number.isFinite(price)) { t.total += price; t.commission += price * share; }
  }

  const subs = stripeData.subscriptions;
  const live = subs.filter((s) => ["active", "trialing", "past_due"].includes(s.status));
  const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
  const thisMonth = months[months.length - 1];
  const kpi = {
    mrrLivret: sum(subs.filter((s) => s.product === "livret"), (s) => s.mrr),
    mrrCahier: sum(subs.filter((s) => s.product === "cahier"), (s) => s.mrr),
    payingLivret: subs.filter((s) => s.product === "livret" && s.status === "active" && s.mrr > 0).length,
    payingCahier: subs.filter((s) => s.product === "cahier" && s.status === "active" && s.mrr > 0).length,
    trialing: subs.filter((s) => s.status === "trialing").length,
    pastDue: subs.filter((s) => s.status === "past_due"),
    newThisMonth: subs.filter((s) => monthOf(s.created) === thisMonth).length,
    canceledThisMonth: subs.filter((s) => s.canceledAt && monthOf(s.canceledAt) === thisMonth).length,
    canceling: subs.filter((s) => s.status === "active" && s.cancelAtPeriodEnd),
    transferCommission: transfers[transfers.length - 1]?.commission ?? 0,
    totalActive: live.length,
  };
  kpi.mrr = kpi.mrrLivret + kpi.mrrCahier;
  kpi.arr = kpi.mrr * 12;

  const alerts = [];
  for (const h of hotelRows) {
    if (h.billing_exempt) continue;
    if (h.billing_status === "past_due") alerts.push({ kind: "pastDue", who: h.name, detail: h.past_due_since });
    if (h.billing_status === "active" && h.c30 === 0) alerts.push({ kind: "inactiveHotel", who: h.name, detail: h.lastConsigne });
  }
  for (const s of kpi.pastDue) alerts.push({ kind: "pastDueSub", who: s.customer, detail: s.product });
  for (const s of kpi.canceling) alerts.push({ kind: "canceling", who: s.customer, detail: s.periodEnd });
  for (const s of subs.filter((x) => x.status === "trialing" && x.trialEnd && x.trialEnd * 1000 - Date.now() < 7 * 86400000)) alerts.push({ kind: "trialEnding", who: s.customer, detail: s.trialEnd });

  return { months, revenue, transfers, commissionPct, subs, kpi, bills: stripeData.bills, hotels: hotelRows, leads: leadsRes.data ?? [], alerts };
}
