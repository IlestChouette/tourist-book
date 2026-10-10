// Chronologie d'une sélection : un point par consigne, une ligne par service,
// le temps de gauche à droite. Orange = problème ou plainte récurrent, teal =
// première fois, gris = info ou tâche. Le survol (et le lecteur d'écran) donne
// la date et le texte de chaque point.
const W = 760;
const LANE = 36;
const M = { top: 10, right: 16, bottom: 28, left: 112 };

const toTime = (d) => Date.parse(`${d}T12:00:00Z`);
const tickFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

export default function Chronology({ items, from, to, colors }) {
  const laneOf = (c) => c.tags.find((t) => !["matin", "soir", "nuit"].includes(t)) ?? "Sans service";
  const lanes = [...new Set(items.map(laneOf))];
  const H = M.top + lanes.length * LANE + M.bottom;
  const t0 = toTime(from);
  const t1 = Math.max(toTime(to), t0 + 86400000);
  const x = (iso) => M.left + ((Math.min(Math.max(Date.parse(iso), t0), t1) - t0) / (t1 - t0)) * (W - M.left - M.right);
  const ticks = [0, 1, 2, 3, 4].map((i) => new Date(t0 + ((t1 - t0) * i) / 4));

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Chronologie des consignes par service">
        {lanes.map((lane, i) => {
          const y = M.top + i * LANE + LANE / 2;
          return (
            <g key={lane}>
              <line x1={M.left} x2={W - M.right} y1={y} y2={y} stroke="var(--sand-dim)" strokeWidth="1" />
              <text x={M.left - 10} y={y + 4} textAnchor="end" fontSize="12" fontWeight="700" fill="var(--ink)" fillOpacity="0.75">{lane.length > 14 ? `${lane.slice(0, 13)}…` : lane}</text>
            </g>
          );
        })}
        {ticks.map((d, i) => (
          <text key={i} x={M.left + (i / 4) * (W - M.left - M.right)} y={H - 8} textAnchor={i === 0 ? "start" : i === 4 ? "end" : "middle"} fontSize="11" fill="var(--ink)" fillOpacity="0.6">{tickFmt.format(d)}</text>
        ))}
        {items.map((c) => {
          const y = M.top + lanes.indexOf(laneOf(c)) * LANE + LANE / 2;
          const recurrent = c.issue && c.priorCount > 0;
          const fill = recurrent ? colors.recurrent : c.issue ? colors.first : colors.other;
          return (
            <circle key={c.id} cx={x(c.createdAt)} cy={y} r={recurrent ? 7 : 6} fill={fill} stroke="var(--sand)" strokeWidth="2">
              <title>{`${dateFmt.format(new Date(c.createdAt))} — ${c.body.slice(0, 80)}${recurrent ? ` (récurrent, ${c.priorCount + 1}e fois)` : c.issue ? " (première fois)" : ""}`}</title>
            </circle>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink/70">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: colors.recurrent }} />Récurrent</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: colors.first }} />Première fois</span>
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: colors.other }} />Info ou tâche</span>
      </div>
    </div>
  );
}
