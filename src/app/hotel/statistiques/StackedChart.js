"use client";

import { useState } from "react";

const H = 240;
const M = { top: 12, right: 12, bottom: 30, left: 36 };

function niceMax(v) {
  // Un maximum divisible par 4, pour que les 5 repères de l'axe soient des nombres ronds.
  const step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000].find((s) => s * 4 >= v) ?? Math.ceil(v / 4);
  return step * 4;
}

// Colonnes empilées : répartition des consignes écrites par type dans le temps.
// Chaque segment est séparé du suivant par un filet de 2 px, les 4 teintes
// restent distinctes en cas de daltonisme (palette validée).
export default function StackedChart({ buckets, kinds, width = 760 }) {
  const W = width;
  const [hover, setHover] = useState(null);
  const n = buckets.length;
  const max = niceMax(Math.max(1, ...buckets.map((b) => b.written)));
  const iw = W - M.left - M.right;
  const ih = H - M.top - M.bottom;
  const slot = iw / n;
  const bw = Math.min(24, Math.max(3, slot * 0.7));
  const y = (v) => M.top + ih - (v / max) * ih;
  const ticks = [0, 1, 2, 3, 4].map((t) => (max / 4) * t);
  const labelEvery = Math.max(1, Math.ceil(n / (W < 600 ? 4 : 7)));
  const b = hover === null ? null : buckets[hover];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink/70">
        {kinds.map((k) => (
          <span key={k.id} className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-[3px]" style={{ background: k.color }} />{k.label}</span>
        ))}
      </div>
      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Consignes écrites par type dans le temps" onPointerLeave={() => setHover(null)}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke="var(--sand-dim)" strokeWidth="1" />
              <text x={M.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--ink)" fillOpacity="0.6">{Math.round(t)}</text>
            </g>
          ))}
          {buckets.map((bk, i) => {
            const cx = M.left + slot * i + slot / 2;
            let acc = 0;
            return (
              <g key={bk.key} onPointerMove={() => setHover(i)}>
                <rect x={M.left + slot * i} y={M.top} width={slot} height={ih} fill="transparent" />
                {kinds.map((k, ki) => {
                  const v = bk.kinds[k.id];
                  if (!v) return null;
                  const top = y(acc + v);
                  const h = y(acc) - top;
                  acc += v;
                  const isTop = kinds.slice(ki + 1).every((o) => !bk.kinds[o.id]);
                  return <rect key={k.id} x={cx - bw / 2} y={top} width={bw} height={Math.max(0, h - 2)} rx={isTop ? 3 : 0} fill={k.color} opacity={hover === null || hover === i ? 1 : 0.55} />;
                })}
                {i % labelEvery === 0 && (
                  <text x={cx} y={H - 9} textAnchor="middle" fontSize="11" fill="var(--ink)" fillOpacity="0.6">{bk.short}</text>
                )}
              </g>
            );
          })}
        </svg>
        {b && (
          <div
            className="pointer-events-none absolute top-1 z-10 min-w-40 rounded-lg border border-sand-dim bg-sand p-3 text-sm shadow-lg"
            style={{ left: `${((M.left + slot * hover + slot / 2) / W) * 100}%`, transform: hover > n / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}
          >
            <p className="text-xs text-ink/60">{b.label}</p>
            {kinds.map((k) => (
              <p key={k.id} className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-ink/70"><span className="h-0.5 w-3" style={{ background: k.color }} />{k.label}</span>
                <strong className="tabular-nums text-ink">{b.kinds[k.id]}</strong>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
