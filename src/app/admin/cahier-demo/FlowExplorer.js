"use client";

import { useMemo, useState } from "react";
import { CHAPTERS } from "./flows";

const W = 1020, COLX = [170, 500, 830], TOP = 70, GAP = 150;
const SIZE = { step: [250, 92], ok: [250, 92], warn: [250, 92], ask: [290, 116], start: [270, 70], end: [270, 70] };
const TONE = {
  start: { fill: "var(--aqua-deep)", stroke: "var(--aqua-deep)", text: "#fff" },
  end: { fill: "color-mix(in srgb, var(--aqua-deep) 14%, var(--sand-card))", stroke: "var(--aqua-deep)", text: "var(--ink)" },
  step: { fill: "var(--sand-card)", stroke: "var(--ink)", text: "var(--ink)" },
  ok: { fill: "color-mix(in srgb, var(--aqua-deep) 14%, var(--sand-card))", stroke: "var(--aqua-deep)", text: "var(--ink)" },
  warn: { fill: "color-mix(in srgb, var(--terracotta) 22%, var(--sand-card))", stroke: "var(--terracotta-deep)", text: "var(--ink)" },
  ask: { fill: "var(--sand)", stroke: "var(--terracotta-deep)", text: "var(--ink)" },
};

function wrap(text, max) {
  const out = [];
  let line = "";
  for (const w of text.split(" ")) {
    if ((line + " " + w).trim().length > max) { out.push(line); line = w; } else line = (line + " " + w).trim();
  }
  if (line) out.push(line);
  return out;
}

const pos = (nd) => ({ x: COLX[nd.c], y: TOP + nd.r * GAP, w: SIZE[nd.t][0], h: SIZE[nd.t][1] });
const anchor = (p, side) => (side === "b" ? { x: p.x, y: p.y + p.h / 2 } : side === "t" ? { x: p.x, y: p.y - p.h / 2 } : side === "l" ? { x: p.x - p.w / 2, y: p.y } : { x: p.x + p.w / 2, y: p.y });

// Tracé orthogonal d'un lien, selon le côté de sortie et d'entrée.
function route(ed, P) {
  const S = anchor(P[ed.from], ed.out), E = anchor(P[ed.to], ed.into);
  let d;
  if (ed.out === "b" && ed.into === "t") d = S.x === E.x ? `M${S.x} ${S.y} V${E.y}` : `M${S.x} ${S.y} V${(S.y + E.y) / 2} H${E.x} V${E.y}`;
  else if ((ed.out === "l" || ed.out === "r") && (ed.into === "l" || ed.into === "r") && ed.out !== ed.into) d = S.y === E.y ? `M${S.x} ${S.y} H${E.x}` : `M${S.x} ${S.y} H${(S.x + E.x) / 2} V${E.y} H${E.x}`;
  else if ((ed.out === "l" || ed.out === "r") && ed.into === "t") d = `M${S.x} ${S.y} H${E.x} V${E.y}`;
  else if ((ed.out === "l" || ed.out === "r") && ed.into === "b") d = `M${S.x} ${S.y} H${E.x} V${E.y}`;
  else if (ed.out === "b" && (ed.into === "l" || ed.into === "r")) d = `M${S.x} ${S.y} V${E.y} H${E.x}`;
  else if (ed.out === "t" && (ed.into === "l" || ed.into === "r")) d = `M${S.x} ${S.y} V${E.y} H${E.x}`;
  else { const track = ed.track ?? (ed.out === "r" ? Math.max(S.x, E.x) + 60 : Math.min(S.x, E.x) - 60); d = `M${S.x} ${S.y} H${track} V${E.y} H${E.x}`; }
  const lab = ed.out === "b" ? { x: S.x + 28, y: S.y + 20 } : ed.out === "r" ? { x: S.x + 30, y: S.y - 16 } : ed.out === "l" ? { x: S.x - 30, y: S.y - 16 } : { x: S.x + 28, y: S.y - 20 };
  return { d, lab };
}

export default function FlowExplorer() {
  const [ci, setCi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [walk, setWalk] = useState(false);
  const [trail, setTrail] = useState([]); // nœuds visités en mode pas à pas
  const ch = CHAPTERS[ci];
  const P = useMemo(() => Object.fromEntries(ch.nodes.map((nd) => [nd.id, pos(nd)])), [ch]);
  const byId = useMemo(() => Object.fromEntries(ch.nodes.map((nd) => [nd.id, nd])), [ch]);
  const H = TOP + (Math.max(...ch.nodes.map((nd) => nd.r)) + 1) * GAP;
  const current = walk ? trail[trail.length - 1] : null;
  const visitedEdges = new Set(trail.slice(1).map((id, i) => `${trail[i]}>${id}`));
  const outgoing = current ? ch.edges.filter((ed) => ed.from === current) : [];
  const shown = walk ? current : selected;
  const nd = shown ? byId[shown] : null;

  function pickChapter(i) { setCi(i); setSelected(null); setWalk(false); setTrail([]); }
  function startWalk() { setWalk(true); setSelected(null); setTrail([ch.nodes[0].id]); }
  function stopWalk() { setWalk(false); setTrail([]); }
  function go(to) { setTrail((t) => [...t, to]); }
  const onNode = (id) => { if (!walk) setSelected(id === selected ? null : id); };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Chapitres du parcours">
        {CHAPTERS.map((c, i) => (
          <button key={c.id} type="button" role="tab" aria-selected={i === ci} onClick={() => pickChapter(i)} className={`rounded-full px-4 py-2 text-sm font-bold ${i === ci ? "bg-ink text-sand" : "border border-sand-dim bg-sand-card text-ink/70 hover:border-ink"}`}>
            {i + 1}. {c.title}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-lg text-ink/75">{ch.intro}</p>
        <div className="flex gap-2">
          {!walk ? (
            <button type="button" onClick={startWalk} className="rounded-xl bg-terracotta px-5 py-2.5 font-bold text-ink hover:bg-terracotta-deep">▶ Parcourir pas à pas</button>
          ) : (
            <button type="button" onClick={stopWalk} className="rounded-xl border-2 border-sand-dim px-5 py-2.5 font-bold text-ink/70 hover:border-ink">Revenir à l&apos;exploration</button>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-ink/55">{walk ? "Répondez Oui ou Non à chaque question : le cahier suit le chemin correspondant." : "Cliquez sur n'importe quelle étape pour voir ce qui s'y passe."}</p>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-x-auto rounded-2xl border border-sand-dim bg-sand-card p-3 sm:p-6">
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full min-w-[560px] max-w-[1020px]" role="group" aria-label={`Parcours : ${ch.title}`}>
            <defs>
              <marker id="fe-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style={{ fill: "var(--ink)", opacity: 0.8 }} /></marker>
              <marker id="fe-arrow-on" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" style={{ fill: "var(--terracotta-deep)" }} /></marker>
            </defs>
            {ch.edges.map((ed, i) => {
              const { d, lab } = route(ed, P);
              const on = walk && visitedEdges.has(`${ed.from}>${ed.to}`);
              const choice = walk && ed.from === current && ed.label;
              return (
                <g key={i}>
                  <path d={d} fill="none" strokeWidth={on ? 4 : 2.2} strokeDasharray={ed.loop ? "7 6" : undefined} markerEnd={`url(#${on ? "fe-arrow-on" : "fe-arrow"})`} style={{ stroke: on ? "var(--terracotta-deep)" : "var(--ink)", opacity: on ? 1 : walk ? 0.3 : 0.7 }} />
                  {ed.label && (
                    <g onClick={choice ? () => go(ed.to) : undefined} style={{ cursor: choice ? "pointer" : "default" }} role={choice ? "button" : undefined} tabIndex={choice ? 0 : undefined} aria-label={choice ? `Répondre ${ed.label}` : undefined} onKeyDown={choice ? (ev) => (ev.key === "Enter" || ev.key === " ") && go(ed.to) : undefined}>
                      <rect x={lab.x - 24} y={lab.y - 12} width="48" height="24" rx="12" style={{ fill: ed.label === "Oui" ? "var(--aqua-deep)" : "var(--terracotta-deep)", stroke: choice ? "var(--ink)" : "none" }} strokeWidth={choice ? 2 : 0} />
                      <text x={lab.x} y={lab.y} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill="#fff">{ed.label}</text>
                    </g>
                  )}
                </g>
              );
            })}
            {ch.nodes.map((n) => {
              const p = P[n.id], t = TONE[n.t], lines = wrap(n.label, n.t === "ask" ? 20 : n.t === "start" || n.t === "end" ? 30 : 25);
              const isSel = selected === n.id || current === n.id, seen = walk && trail.includes(n.id);
              const lh = 21, y0 = p.y - ((lines.length - 1) * lh) / 2;
              return (
                <g key={n.id} onClick={() => onNode(n.id)} role="button" tabIndex={0} aria-label={n.label} onKeyDown={(ev) => (ev.key === "Enter" || ev.key === " ") && (ev.preventDefault(), onNode(n.id))} style={{ cursor: walk ? "default" : "pointer", opacity: walk && !seen ? 0.4 : 1 }}>
                  {n.t === "ask" ? (
                    <polygon points={`${p.x},${p.y - p.h / 2} ${p.x + p.w / 2},${p.y} ${p.x},${p.y + p.h / 2} ${p.x - p.w / 2},${p.y}`} style={{ fill: t.fill, stroke: isSel ? "var(--terracotta-deep)" : t.stroke }} strokeWidth={isSel ? 5 : 2.5} />
                  ) : (
                    <rect x={p.x - p.w / 2} y={p.y - p.h / 2} width={p.w} height={p.h} rx={n.t === "start" || n.t === "end" ? 33 : 12} style={{ fill: t.fill, stroke: isSel ? "var(--terracotta-deep)" : t.stroke }} strokeWidth={isSel ? 5 : 2} />
                  )}
                  <text x={p.x} y={y0} textAnchor="middle" dominantBaseline="central" fontSize={n.t === "ask" ? 16 : 17} fontWeight="600" style={{ fill: t.text, pointerEvents: "none" }}>
                    {lines.map((l, i) => <tspan key={i} x={p.x} dy={i ? lh : 0}>{l}</tspan>)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="rounded-2xl border-2 border-terracotta bg-sand-card p-6 lg:sticky lg:top-24 lg:self-start" aria-live="polite">
          {nd ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta-deep">{walk ? `Étape ${trail.length}` : "Ce qui se passe ici"}</p>
              <h3 className="mt-2 font-display italic text-2xl leading-snug text-ink">{nd.label}</h3>
              <p className="mt-3 text-lg leading-snug text-ink/80">{nd.detail}</p>
              {nd.gain && <p className="mt-4 rounded-xl bg-aqua-deep/10 px-4 py-3 text-base font-bold text-aqua-deep">✓ {nd.gain}</p>}
              {walk && (
                <div className="mt-5 grid gap-2">
                  {outgoing.length === 0 ? (
                    <>
                      <p className="font-bold text-aqua-deep">Fin du parcours.</p>
                      <button type="button" onClick={() => setTrail([ch.nodes[0].id])} className="rounded-xl bg-ink px-4 py-2.5 font-bold text-sand">Recommencer</button>
                    </>
                  ) : (
                    outgoing.map((ed) => (
                      <button key={ed.to + ed.label} type="button" onClick={() => go(ed.to)} className={`rounded-xl px-4 py-2.5 text-left font-bold text-white ${ed.label === "Non" ? "bg-terracotta-deep" : "bg-aqua-deep"}`}>
                        {ed.label ? `${ed.label} →` : "Continuer →"} <span className="font-normal opacity-90">{byId[ed.to].label}</span>
                      </button>
                    ))
                  )}
                  {trail.length > 1 && <button type="button" onClick={() => setTrail((t) => t.slice(0, -1))} className="text-sm font-bold text-ink/60 underline underline-offset-4">← Étape précédente</button>}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta-deep">Mode d&apos;emploi</p>
              <h3 className="mt-2 font-display italic text-2xl text-ink">Cliquez sur une étape</h3>
              <p className="mt-3 text-lg leading-snug text-ink/75">Chaque étape explique ce qui se passe dans le cahier et ce que ça apporte à l&apos;équipe.</p>
              <ul className="mt-4 grid gap-2 text-base text-ink/70">
                <li><span className="font-bold text-aqua-deep">Rectangle</span> : une étape</li>
                <li><span className="font-bold text-terracotta-deep">Losange</span> : une question, avec Oui et Non</li>
                <li><span className="font-bold text-terracotta-deep">Pointillé</span> : un retour en arrière</li>
              </ul>
              <p className="mt-4 text-base text-ink/70">Ou lancez <strong>« Parcourir pas à pas »</strong> et répondez aux questions : le cahier suit le chemin.</p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
