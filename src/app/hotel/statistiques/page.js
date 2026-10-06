import { redirect } from "next/navigation";
import { HotelFooter, HotelHeader } from "@/components/HotelShell";
import { getHotelContext } from "@/lib/hotelAuth";
import { loadMeta } from "@/lib/hotelData";
import { computeStats, parseStatsParams } from "@/lib/hotelStats";
import { formatDayLong, parisDate } from "@/lib/hotelTime";
import StatsFilters from "./StatsFilters";
import StackedChart from "./StackedChart";
import TimelineChart from "./TimelineChart";

export const metadata = { title: "Statistiques du cahier", robots: { index: false, follow: false } };

// Couleurs des séries, validées (daltonisme, contraste, saturation) avec le
// validateur de palette : teal et orange restent distincts pour tous.
const COLORS = { written: "#0a8f87", closed: "#d9763a", prev: "#9aa5a8" };
const KIND_SERIES = [
  { id: "info", label: "Info", color: "#0a8f87" },
  { id: "tache", label: "Tâche", color: "#5b6fc7" },
  { id: "probleme", label: "Problème", color: "#d9763a" },
  { id: "plainte", label: "Plainte", color: "#b0558d" },
];
const KIND_LABELS = { info: "Info", tache: "Tâche", probleme: "Problème", plainte: "Plainte" };
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function formatDuration(hours) {
  if (hours === null) return "—";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 48) return `${hours.toFixed(1).replace(".", ",")} h`;
  return `${(hours / 24).toFixed(1).replace(".", ",")} j`;
}
const pct = (v) => (v === null ? "—" : `${Math.round(v)} %`);

// Variation par rapport à la période précédente. `lowerIsBetter` : un recul est
// une bonne nouvelle (consignes encore ouvertes, délai de clôture).
function Delta({ cur, prev, lowerIsBetter, unit }) {
  if (prev === null || prev === undefined || cur === null) return null;
  const diff = cur - prev;
  if (Math.abs(diff) < 1e-9) return <span className="text-xs text-ink/50">= période précédente</span>;
  const good = lowerIsBetter === undefined ? null : lowerIsBetter ? diff < 0 : diff > 0;
  const tone = good === null ? "text-ink/60" : good ? "text-aqua-deep" : "text-terracotta-deep";
  const text = unit === "pts" ? `${diff > 0 ? "+" : ""}${Math.round(diff)} pts` : prev === 0 ? "nouveau" : `${diff > 0 ? "+" : ""}${Math.round((diff / prev) * 100)} %`;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold ${tone}`}>
      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{diff > 0 ? <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" /> : <path d="M6 2v8M2.5 6.5 6 10l3.5-3.5" />}</svg>
      {text} <span className="font-normal text-ink/50">vs période précédente</span>
    </span>
  );
}

function Stat({ label, value, children }) {
  return (
    <div className="rounded-xl border border-sand-dim bg-sand p-5">
      <p className="text-sm font-bold text-ink/60">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-ink">{value}</p>
      <div className="mt-1 min-h-4">{children}</div>
    </div>
  );
}

function Panel({ title, hint, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-sand-dim bg-sand p-5 ${className}`}>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      {hint && <p className="mt-0.5 text-sm text-ink/60">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

// Barres horizontales triées : la valeur est au bout de la barre (étiquette
// directe), l'axe est inutile. Une seule teinte, plus long = plus fréquent.
function Bars({ rows, empty, total }) {
  if (rows.length === 0) return <p className="text-sm text-ink/60">{empty}</p>;
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="grid gap-2.5">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(5rem,9rem)_1fr_auto] items-center gap-3" title={`${r.label} : ${r.value}`}>
          <span className="truncate text-sm font-bold text-ink">{r.label}</span>
          <span className="h-5 rounded-r-[4px]" style={{ width: `${Math.max(3, (r.value / max) * 100)}%`, background: COLORS.written }} />
          <span className="text-sm tabular-nums text-ink/70">
            <strong className="text-ink">{r.value}</strong>
            {total ? <span className="text-ink/50"> · {Math.round((r.value / total) * 100)} %</span> : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Heatmap({ heat }) {
  const max = Math.max(1, ...heat.flat());
  return (
    <div>
      <div className="overflow-x-auto">
        <div className="min-w-[34rem]">
          <div className="grid grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-[2px]">
            <span />
            {Array.from({ length: 24 }, (_, h) => (
              <span key={h} className="text-center text-[10px] tabular-nums text-ink/50">{h % 3 === 0 ? `${h}h` : ""}</span>
            ))}
            {heat.map((row, d) => (
              <div key={DAYS[d]} className="contents">
                <span className="pr-2 text-right text-xs leading-6 text-ink/60">{DAYS[d]}</span>
                {row.map((v, h) => (
                  <span
                    key={h}
                    title={`${DAYS[d]} ${h}h : ${v} consigne${v > 1 ? "s" : ""}`}
                    className="h-6 rounded-[3px] bg-sand-card"
                    style={v ? { background: COLORS.written, opacity: 0.18 + 0.82 * (v / max) } : undefined}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-ink/60">
        Moins
        {[0.18, 0.4, 0.62, 0.82, 1].map((o) => <span key={o} className="h-3 w-6 rounded-[3px]" style={{ background: COLORS.written, opacity: o }} />)}
        Plus
      </div>
    </div>
  );
}

export default async function StatistiquesPage({ searchParams }) {
  const ctx = await getHotelContext();
  if (!ctx) redirect("/hotel/connexion");
  if (ctx.mode !== "manager") redirect("/hotel/cahier");

  const today = parisDate();
  const f = parseStatsParams(await searchParams, today);
  const [{ data }, meta] = await Promise.all([
    ctx.admin
      .from("consignes")
      .select("id, day, kind, body, place_name, tag_ids, priority, created_at, closed_at")
      .eq("hotel_id", ctx.hotel.id)
      .gte("day", f.compare ? f.prevFrom : f.from)
      .lte("day", f.to)
      .order("created_at", { ascending: true })
      .limit(20000),
    loadMeta(ctx.hotel.id),
  ]);
  const s = computeStats(data ?? [], f, meta.tags);
  const cur = s.current;
  const prev = s.previous;
  const period = f.from === f.to ? formatDayLong(f.from) : `du ${formatDayLong(f.from)} au ${formatDayLong(f.to)}`;
  const kindRows = s.byKind.map((r) => ({ ...r, label: KIND_LABELS[r.label] ?? r.label }));

  return (
    <main className="flex-1 bg-sand-card/50">
      <HotelHeader hotel={ctx.hotel} title="Statistiques" links={[{ href: "/hotel/cahier", label: "Cahier" }, { href: "/hotel/gestion", label: "Gestion" }]} />
      <section className="mx-auto max-w-6xl px-6 py-8">
        <StatsFilters params={f} tags={meta.tags} places={meta.places} today={today} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink/60">
          Consignes {period}
          {f.compare && <> · comparées au {formatDayLong(f.prevFrom)} → {formatDayLong(f.prevTo)}</>}
        </p>
        <a href={`/api/hotel/stats-csv?${new URLSearchParams({ range: f.range, from: f.from, to: f.to, kind: f.kinds.join(","), service: f.service, shift: f.shift, place: f.place })}`} className="inline-flex h-11 items-center gap-2 rounded-lg border border-sand-dim bg-sand px-4 text-sm font-bold text-ink/70 transition-colors hover:border-aqua-deep hover:text-aqua-deep print:hidden">
          Exporter en CSV
        </a>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Consignes écrites" value={cur.written}><Delta cur={cur.written} prev={prev?.written} /></Stat>
          <Stat label="Taux de clôture" value={pct(cur.closeRate)}><Delta cur={cur.closeRate} prev={prev?.closeRate} unit="pts" lowerIsBetter={false} /></Stat>
          <Stat label="Délai moyen de clôture" value={formatDuration(cur.avgHours)}><Delta cur={cur.avgHours} prev={prev?.avgHours} lowerIsBetter /></Stat>
          <Stat label="Pas encore clôturées" value={cur.open}><Delta cur={cur.open} prev={prev?.open} lowerIsBetter /></Stat>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Problèmes et plaintes" value={cur.issues}><Delta cur={cur.issues} prev={prev?.issues} lowerIsBetter /></Stat>
          <Stat label="Prioritaires" value={cur.priority}><Delta cur={cur.priority} prev={prev?.priority} lowerIsBetter /></Stat>
          <Stat label="Moyenne par jour" value={(cur.written / f.length).toFixed(1).replace(".", ",")}><Delta cur={cur.written / f.length} prev={prev ? prev.written / f.length : null} /></Stat>
          <Stat label="Chambres concernées" value={s.placesCount}>
            <span className="text-xs text-ink/50">lieux différents sur la période</span>
          </Stat>
        </div>

        <Panel title="Évolution" hint={s.mode === "day" ? "Par jour." : s.mode === "week" ? "Par semaine." : "Par mois."} className="mt-6">
          {cur.written === 0 && !(prev?.written) ? (
            <p className="text-sm text-ink/60">Aucune consigne avec ces filtres sur cette période.</p>
          ) : (
            <TimelineChart buckets={s.buckets} compare={f.compare} colors={COLORS} />
          )}
        </Panel>

        <Panel title="Types de consignes dans le temps" hint="Les problèmes et plaintes se détachent en orange et en rose." className="mt-6">
          {cur.written === 0 ? <p className="text-sm text-ink/60">Aucune consigne sur cette période.</p> : <StackedChart buckets={s.buckets} kinds={KIND_SERIES} />}
        </Panel>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Chambres et lieux les plus touchés" hint="Les 10 premiers, avec les filtres choisis. Filtrez sur Problème et Plainte pour repérer les chambres à risque.">
            <Bars rows={s.topPlaces} empty="Aucune consigne sur cette période." />
          </Panel>
          <Panel title="Par type">
            <Bars rows={kindRows} total={s.total} empty="Aucune consigne sur cette période." />
          </Panel>
          <Panel title="Par service" hint="Postes et étiquettes personnalisées (hors matin / soir / nuit).">
            <Bars rows={s.byService} empty="Aucune consigne n'a d'étiquette de service sur cette période." />
          </Panel>
          <Panel title="Laissées en suspens, par équipe" hint="Consignes d'une équipe (matin, soir, nuit) pas clôturées le jour même.">
            <Bars rows={s.shiftLeft} empty="Rien en suspens, ou aucune consigne n'a d'étiquette d'équipe." />
          </Panel>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Délai de clôture" hint="Combien de temps entre l'écriture et la clôture.">
            <Bars rows={s.closeDist} total={cur.closedCount} empty="Aucune consigne clôturée sur cette période." />
          </Panel>
          <Panel title="Délai moyen par service" hint="Les services où les consignes restent le plus longtemps ouvertes arrivent en premier.">
            {s.closeByService.length === 0 ? (
              <p className="text-sm text-ink/60">Pas de consigne clôturée avec une étiquette de service.</p>
            ) : (
              <ul className="grid gap-2.5">
                {s.closeByService.map((r) => (
                  <li key={r.label} className="grid grid-cols-[minmax(5rem,9rem)_1fr_auto] items-center gap-3" title={`${r.label} : ${formatDuration(r.hours)} (${r.n} consignes)`}>
                    <span className="truncate text-sm font-bold text-ink">{r.label}</span>
                    <span className="h-5 rounded-r-[4px]" style={{ width: `${Math.max(3, (r.hours / s.closeByService[0].hours) * 100)}%`, background: COLORS.written }} />
                    <span className="text-sm tabular-nums"><strong className="text-ink">{formatDuration(r.hours)}</strong> <span className="text-ink/50">· {r.n}</span></span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Par jour de la semaine">
            <Bars rows={DAYS.map((label, i) => ({ label, value: s.weekday[i] }))} empty="" />
          </Panel>
          <Panel title="Par heure de la journée" hint="Heure d'écriture, heure de Paris.">
            <div className="flex h-36 items-stretch gap-[3px]" role="img" aria-label="Consignes écrites par heure">
              {s.byHour.map((v, h) => (
                <span key={h} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${h}h : ${v} consigne${v > 1 ? "s" : ""}`}>
                  <span className="w-full max-w-6 rounded-t-[4px]" style={{ height: `${Math.max(v ? 4 : 0, (v / Math.max(1, ...s.byHour)) * 100)}%`, background: COLORS.written }} />
                </span>
              ))}
            </div>
            <div className="mt-1 flex gap-[3px] text-[10px] tabular-nums text-ink/50">
              {s.byHour.map((_, h) => <span key={h} className="flex-1 text-center">{h % 3 === 0 ? `${h}h` : ""}</span>)}
            </div>
          </Panel>
        </div>

        <Panel title="Chambres à problèmes récurrents" hint="Chambres ou lieux avec au moins 2 problèmes ou plaintes sur la période : le signe d'un défaut qui revient." className="mt-6">
          {s.recurring.length === 0 ? (
            <p className="text-sm text-ink/60">Aucune chambre avec plusieurs problèmes sur cette période.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[26rem] border-collapse text-left text-sm">
                <thead><tr className="border-b border-sand-dim text-ink/60"><th className="py-2 pr-4 font-bold">Lieu</th><th className="py-2 pr-4 text-right font-bold">Problèmes</th><th className="py-2 pr-4 text-right font-bold">Plaintes</th><th className="py-2 text-right font-bold">Dernier</th></tr></thead>
                <tbody>
                  {s.recurring.map((r) => (
                    <tr key={r.place} className="border-b border-sand-dim last:border-0">
                      <td className="py-2.5 pr-4 font-bold tabular-nums text-ink">{r.place}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{r.probleme}</td>
                      <td className="py-2.5 pr-4 text-right tabular-nums">{r.plainte}</td>
                      <td className="py-2.5 text-right text-ink/70">{formatDayLong(r.last)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Quand les consignes s'écrivent" hint="Jour de la semaine et heure d'écriture (heure de Paris). Les cases foncées montrent les moments les plus chargés." className="mt-6">
          <Heatmap heat={s.heat} />
        </Panel>

        <Panel title="Ouvertes depuis le plus longtemps" hint="Les consignes à relancer en priorité." className="mt-6">
          {s.oldestOpen.length === 0 ? (
            <p className="text-sm text-ink/60">Tout est clôturé sur cette période.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-sand-dim text-ink/60"><th className="py-2 pr-4 font-bold">Lieu</th><th className="py-2 pr-4 font-bold">Type</th><th className="py-2 pr-4 font-bold">Consigne</th><th className="py-2 text-right font-bold">Ouverte depuis</th></tr>
                </thead>
                <tbody>
                  {s.oldestOpen.map((c) => (
                    <tr key={c.id} className="border-b border-sand-dim last:border-0">
                      <td className="py-2.5 pr-4 font-bold tabular-nums text-ink">{c.place}</td>
                      <td className="py-2.5 pr-4 text-ink/70">{KIND_LABELS[c.kind]}</td>
                      <td className="max-w-md py-2.5 pr-4 text-ink/80"><span className="line-clamp-2">{c.body}</span></td>
                      <td className="py-2.5 text-right tabular-nums text-ink">{c.days} j</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </section>
      <HotelFooter />
    </main>
  );
}
