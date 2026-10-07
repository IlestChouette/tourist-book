"use client";

import { useState } from "react";

const W = 760;
const H = 280;
const M = { top: 16, right: 16, bottom: 34, left: 36 };

function niceMax(v) {
  // Un maximum divisible par 4, pour que les 5 repères de l'axe soient des nombres ronds.
  const step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 5000].find((s) => s * 4 >= v) ?? Math.ceil(v / 4);
  return step * 4;
}

// Courbe des consignes écrites (aire) et clôturées (ligne), avec, si demandé,
// la période précédente en gris. Un repère vertical suit le pointeur et une
// bulle donne toutes les valeurs du point ; le tableau sous le graphique
// donne les mêmes chiffres sans survol.
export default function TimelineChart({ buckets, compare, colors }) {
  const [hover, setHover] = useState(null);
  const n = buckets.length;
  const max = niceMax(Math.max(1, ...buckets.map((b) => Math.max(b.written, b.closed, b.prev ?? 0))));
  const iw = W - M.left - M.right;
  const ih = H - M.top - M.bottom;
  const x = (i) => M.left + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (v) => M.top + ih - (v / max) * ih;
  const path = (key) => buckets.map((b, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(b[key] ?? 0).toFixed(1)}`).join(" ");
  const area = `${path("written")} L${x(n - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`;
  const ticks = [0, 1, 2, 3, 4].map((t) => (max / 4) * t);
  const labelEvery = Math.max(1, Math.ceil(n / 7));

  function onMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - M.left) / iw) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, n === 1 ? 0 : i)));
  }
  const b = hover === null ? null : buckets[hover];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-ink/70">
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 rounded" style={{ background: colors.written }} />Écrites</span>
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 rounded" style={{ background: colors.closed }} />Clôturées</span>
        {compare && <span className="inline-flex items-center gap-2"><span className="h-0.5 w-5 rounded" style={{ background: colors.prev }} />Période précédente</span>}
      </div>
      <div className="relative mt-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-pan-y"
          role="img"
          aria-label="Évolution des consignes écrites et clôturées"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} stroke="var(--sand-dim)" strokeWidth="1" />
              <text x={M.left - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--ink)" fillOpacity="0.6">{Math.round(t)}</text>
            </g>
          ))}
          {buckets.map((bk, i) =>
            i % labelEvery === 0 ? (
              <text key={bk.key} x={x(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="var(--ink)" fillOpacity="0.6">
                {bk.short}
              </text>
            ) : null,
          )}
          <path d={area} fill={colors.written} fillOpacity="0.1" />
          {compare && <path d={path("prev")} fill="none" stroke={colors.prev} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />}
          <path d={path("closed")} fill="none" stroke={colors.closed} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          <path d={path("written")} fill="none" stroke={colors.written} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {n <= 45 && buckets.map((bk, i) => bk.written > 0 && <circle key={bk.key} cx={x(i)} cy={y(bk.written)} r="3" fill={colors.written} stroke="var(--sand)" strokeWidth="2" />)}
          {b && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={M.top} y2={M.top + ih} stroke="var(--ink)" strokeOpacity="0.25" strokeWidth="1" />
              <circle cx={x(hover)} cy={y(b.written)} r="4.5" fill={colors.written} stroke="var(--sand)" strokeWidth="2" />
              <circle cx={x(hover)} cy={y(b.closed)} r="4.5" fill={colors.closed} stroke="var(--sand)" strokeWidth="2" />
            </g>
          )}
        </svg>
        {b && (
          <div
            className="pointer-events-none absolute top-2 z-10 min-w-40 rounded-lg border border-sand-dim bg-sand p-3 text-sm shadow-lg"
            style={{ left: `${(x(hover) / W) * 100}%`, transform: hover > n / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)" }}
          >
            <p className="text-xs text-ink/60">{b.label}</p>
            <p className="mt-1 flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 text-ink/70"><span className="h-0.5 w-3" style={{ background: colors.written }} />Écrites</span><strong className="tabular-nums text-ink">{b.written}</strong></p>
            <p className="flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 text-ink/70"><span className="h-0.5 w-3" style={{ background: colors.closed }} />Clôturées</span><strong className="tabular-nums text-ink">{b.closed}</strong></p>
            {compare && b.prev !== null && (
              <p className="flex items-center justify-between gap-4"><span className="inline-flex items-center gap-2 text-ink/70"><span className="h-0.5 w-3" style={{ background: colors.prev }} />Avant</span><strong className="tabular-nums text-ink">{b.prev}</strong></p>
            )}
          </div>
        )}
      </div>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-bold text-aqua-deep">Voir en tableau</summary>
        <div className="mt-2 max-h-64 overflow-auto rounded border border-sand-dim">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 bg-sand-card">
              <tr><th className="px-3 py-1.5">Période</th><th className="px-3 py-1.5 text-right">Écrites</th><th className="px-3 py-1.5 text-right">Clôturées</th>{compare && <th className="px-3 py-1.5 text-right">Avant</th>}</tr>
            </thead>
            <tbody>
              {buckets.map((bk) => (
                <tr key={bk.key} className="border-t border-sand-dim"><td className="px-3 py-1.5">{bk.label}</td><td className="px-3 py-1.5 text-right tabular-nums">{bk.written}</td><td className="px-3 py-1.5 text-right tabular-nums">{bk.closed}</td>{compare && <td className="px-3 py-1.5 text-right tabular-nums">{bk.prev}</td>}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
