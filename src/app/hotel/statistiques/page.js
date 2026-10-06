import Link from "next/link";
import { redirect } from "next/navigation";
import Hero from "@/components/Hero";
import { getHotelContext } from "@/lib/hotelAuth";
import { KIND_LABELS, loadMeta } from "@/lib/hotelData";
import { addDays, parisDate } from "@/lib/hotelTime";

export const metadata = { robots: { index: false, follow: false } };

const PERIODS = { "7": "7 jours", "30": "30 jours", "90": "90 jours", "365": "12 mois" };
const KIND_FILTERS = { all: "Tout", problemes: "Problèmes et plaintes", probleme: "Problèmes", plainte: "Plaintes" };

const href = (period, kind) => `/hotel/statistiques?period=${period}&kind=${kind}`;

function Chip({ active, to, children }) {
  return (
    <Link
      href={to}
      className={`rounded-full border px-3 py-1 text-sm font-bold ${active ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim text-ink/70"}`}
    >
      {children}
    </Link>
  );
}

function Bars({ rows, empty }) {
  if (rows.length === 0) return <p className="text-sm text-ink/60">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="grid gap-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between text-sm">
            <span className="font-bold text-ink">{r.label}</span>
            <span className="tabular-nums text-ink/60">{r.value}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-sand-dim">
            <div className="h-2 rounded-full bg-aqua-deep" style={{ width: `${Math.max(4, (r.value / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

const countBy = (list, keyFn) => {
  const map = new Map();
  for (const item of list) for (const key of [].concat(keyFn(item))) map.set(key, (map.get(key) ?? 0) + 1);
  return [...map].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};

function formatDuration(hours) {
  if (hours === null) return "—";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${hours.toFixed(1).replace(".", ",")} h`;
  return `${(hours / 24).toFixed(1).replace(".", ",")} j`;
}

export default async function StatistiquesPage({ searchParams }) {
  const ctx = await getHotelContext();
  if (!ctx) redirect("/hotel/connexion");
  if (ctx.mode !== "manager") redirect("/hotel/cahier");

  const sp = await searchParams;
  const period = PERIODS[sp.period] ? sp.period : "30";
  const kind = KIND_FILTERS[sp.kind] ? sp.kind : "all";
  const today = parisDate();
  const from = addDays(today, -(Number(period) - 1));

  const [{ data }, meta] = await Promise.all([
    ctx.admin
      .from("consignes")
      .select("day, kind, place_name, tag_ids, created_at, closed_at")
      .eq("hotel_id", ctx.hotel.id)
      .gte("day", from),
    loadMeta(ctx.hotel.id),
  ]);
  const all = data ?? [];
  const tagById = Object.fromEntries(meta.tags.map((t) => [t.id, t]));

  const kinds = { problemes: ["probleme", "plainte"], probleme: ["probleme"], plainte: ["plainte"] }[kind];
  const filtered = kinds ? all.filter((c) => kinds.includes(c.kind)) : all;

  const open = all.filter((c) => !c.closed_at);
  const closeHours = all.filter((c) => c.closed_at).map((c) => (Date.parse(c.closed_at) - Date.parse(c.created_at)) / 3600000);
  const avgClose = closeHours.length ? closeHours.reduce((a, b) => a + b, 0) / closeHours.length : null;

  const byKind = countBy(all, (c) => KIND_LABELS[c.kind]);
  const byService = countBy(filtered, (c) =>
    c.tag_ids.map((id) => tagById[id]).filter((t) => t && t.kind !== "shift").map((t) => t.name),
  );
  const topPlaces = countBy(filtered, (c) => c.place_name).slice(0, 10);
  const leftByShift = countBy(
    all.filter((c) => !c.closed_at || parisDate(new Date(c.closed_at)) > c.day),
    (c) => c.tag_ids.map((id) => tagById[id]).filter((t) => t?.kind === "shift").map((t) => t.name),
  );

  return (
    <main className="flex-1">
      <Hero backHref="/hotel/gestion" backLabel="Gestion" eyebrow={ctx.hotel.name} title="Statistiques" logo={ctx.hotel.logo_url} />
      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex flex-wrap gap-2">
          {Object.entries(PERIODS).map(([key, text]) => (
            <Chip key={key} to={href(key, kind)} active={key === period}>{text}</Chip>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(KIND_FILTERS).map(([key, text]) => (
            <Chip key={key} to={href(period, key)} active={key === kind}>{text}</Chip>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            [all.length, "Consignes écrites"],
            [open.length, "Pas encore clôturées"],
            [formatDuration(avgClose), "Délai moyen de clôture"],
          ].map(([value, text]) => (
            <div key={text} className="rounded-xl border border-sand-dim bg-sand-card p-5 text-center">
              <div className="font-display italic text-4xl tabular-nums text-terracotta-deep">{value}</div>
              <div className="mt-2 text-xs font-bold uppercase tracking-wider text-ink/60">{text}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-display italic text-2xl text-ink">Chambres et lieux les plus touchés</h2>
        <p className="mb-3 text-sm text-ink/60">Filtre : {KIND_FILTERS[kind].toLowerCase()}.</p>
        <Bars rows={topPlaces} empty="Aucune consigne sur cette période." />

        <h2 className="mt-10 font-display italic text-2xl text-ink">Par type</h2>
        <div className="mt-3">
          <Bars rows={byKind} empty="Aucune consigne sur cette période." />
        </div>

        <h2 className="mt-10 font-display italic text-2xl text-ink">Par service</h2>
        <div className="mt-3">
          <Bars rows={byService} empty="Aucune consigne n'a d'étiquette de service sur cette période." />
        </div>

        <h2 className="mt-10 font-display italic text-2xl text-ink">Laissées en suspens, par équipe</h2>
        <p className="mb-3 text-sm text-ink/60">
          Consignes écrites par une équipe (matin, soir, nuit) et pas clôturées le jour même.
        </p>
        <Bars rows={leftByShift} empty="Rien en suspens, ou aucune consigne n'a d'étiquette d'équipe." />
      </section>
    </main>
  );
}
