"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const th = "px-3 py-2 text-left text-xs font-bold uppercase tracking-wider text-ink/60";
const td = "px-3 py-2 align-top";
const BADGE = {
  paying: "bg-[#2f7d76] text-white", free: "bg-sand-dim text-ink", trialing: "bg-[#5b6fc7] text-white",
  past_due: "bg-terracotta-deep text-white", canceled: "bg-ink/70 text-white", none: "bg-sand-dim text-ink/70",
};

// Liste des clients (livret : hôtes ; cahier : hôtels) avec leur statut et les actions : bloquer, débloquer, supprimer.
export default function ClientsTable({ rows, kind, L, locale }) {
  const eur = new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const dayFmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "2-digit", timeZone: "Europe/Paris" });
  const dt = (v) => (v ? dayFmt.format(new Date(v)) : "—");

  async function act(action, r) {
    if (action === "delete") {
      const typed = window.prompt(L.confirmDelete.replace("{name}", r.name || ""));
      if (typed?.trim().toUpperCase() !== "SUPPRIMER") return;
    } else if (action === "block" && !window.confirm(L.confirmBlock.replace("{name}", r.name || ""))) return;
    setBusy(`${action}:${r.id}`);
    setError("");
    const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, kind: r.kind, id: r.id }) });
    const data = await res.json().catch(() => ({}));
    setBusy("");
    if (!res.ok) return setError(data.error || L.error);
    router.refresh();
  }

  const btn = "rounded border px-2.5 py-1 text-xs font-bold disabled:opacity-50";
  return (
    <div>
      {error && <p className="mb-3 rounded border border-terracotta-deep/50 bg-sand-card px-4 py-3 font-bold text-terracotta-deep" role="alert">{error}</p>}
      <div className="overflow-x-auto rounded-lg border border-sand-dim bg-sand-card">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-sand-dim">
            <tr>
              <th className={th}>{L.client}</th><th className={th}>{L.status}</th><th className={`${th} text-right`}>MRR</th>
              {kind === "host" ? <th className={th}>{L.properties}</th> : <th className={`${th} text-right`}>{L.services}</th>}
              <th className={`${th} text-right`}>{kind === "host" ? L.opens30 : L.consignes30}</th>
              <th className={th}>{L.lastLogin}</th><th className={th}>{L.created}</th><th className={th} />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td className={td} colSpan={8}>{L.noClients}</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className={`border-t border-sand-dim ${r.blocked ? "bg-terracotta-deep/5" : ""}`}>
                <td className={td}>
                  <div className="font-bold text-ink">{r.name || "—"}</div>
                  <div className="text-ink/60">{r.email}{r.phone ? ` · ${r.phone}` : ""}</div>
                </td>
                <td className={td}>
                  <div className="flex flex-wrap gap-1">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${BADGE[r.status]}`}>{L.st[r.status]}</span>
                    {r.blocked && <span className="rounded-full bg-terracotta-deep px-2.5 py-0.5 text-xs font-bold text-white">{L.blocked}</span>}
                    {r.inactive && <span className="rounded-full border border-ink/40 px-2.5 py-0.5 text-xs font-bold text-ink/70">{L.inactive}</span>}
                  </div>
                </td>
                <td className={`${td} text-right tabular-nums`}>{r.mrr ? eur.format(r.mrr) : "—"}</td>
                {kind === "host" ? (
                  <td className={td}>{r.properties.length === 0 ? <span className="text-ink/50">{L.noProperty}</span> : r.properties.map((p, i) => <div key={i}>{p.name}{p.plan ? <span className="text-ink/60"> · {p.plan}</span> : null}</div>)}</td>
                ) : (
                  <td className={`${td} text-right tabular-nums`}>{r.services}</td>
                )}
                <td className={`${td} text-right tabular-nums`}>{kind === "host" ? r.opens30 : r.c30}</td>
                <td className={td}>{dt(r.lastLogin)}</td><td className={td}>{dt(r.created)}</td>
                <td className={td}>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {r.blocked ? (
                      <button type="button" disabled={Boolean(busy)} onClick={() => act("unblock", r)} className={`${btn} border-[#2f7d76] text-[#2f7d76]`}>{L.unblock}</button>
                    ) : (
                      <button type="button" disabled={Boolean(busy)} onClick={() => act("block", r)} className={`${btn} border-terracotta-deep text-terracotta-deep`}>{L.block}</button>
                    )}
                    <button type="button" disabled={Boolean(busy)} onClick={() => act("delete", r)} className={`${btn} border-ink/40 text-ink/70 hover:border-terracotta-deep hover:text-terracotta-deep`}>{L.delete}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
