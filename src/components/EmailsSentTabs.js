"use client";

import { useState } from "react";

// Une pestaña par type d'email plutôt que tous les tableaux empilés — la
// liste grandit avec le temps (plus de 10 types déjà) et faisait défiler
// l'admin sur une page entière rien que pour ça.
export default function EmailsSentTabs({ groups, dateLocale, t }) {
  const [activeKey, setActiveKey] = useState(groups[0]?.key ?? null);
  const active = groups.find((g) => g.key === activeKey) ?? groups[0];

  if (!active) return null;

  return (
    <div className="mt-6">
      <div className="flex gap-1 overflow-x-auto">
        {groups.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setActiveKey(g.key)}
            className={`relative shrink-0 whitespace-nowrap rounded-t-lg border px-4 py-2 text-xs font-bold transition-colors ${
              g.key === active.key
                ? "-mb-px border-sand-dim border-b-sand-card bg-sand-card text-ink"
                : "border-transparent bg-sand text-ink/50 hover:text-ink/80"
            }`}
          >
            {g.label} <span className={g.key === active.key ? "text-ink/40" : "text-ink/30"}>({g.emails.length})</span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-b-lg rounded-tr-lg border border-sand-dim bg-sand-card">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-sand-dim bg-sand-card text-left">
              <th className="px-4 py-2 font-bold text-ink/70">{t.sentAt}</th>
              <th className="px-4 py-2 font-bold text-ink/70">{t.recipient}</th>
              <th className="px-4 py-2 font-bold text-ink/70">{t.subject}</th>
              <th className="px-4 py-2 font-bold text-ink/70">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {active.emails.map((e) => (
              <tr key={e.id} className="border-b border-sand-dim last:border-0">
                <td className="px-4 py-2 whitespace-nowrap text-ink/70">
                  {new Date(e.created_at).toLocaleString(dateLocale)}
                </td>
                <td className="px-4 py-2 text-ink">{e.recipient}</td>
                <td className="px-4 py-2 text-ink/70">{e.subject}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${
                      e.status === "sent" ? "bg-sage text-ink" : "bg-terracotta text-ink"
                    }`}
                    title={e.error ?? undefined}
                  >
                    {e.status === "sent" ? t.emailStatusSent : t.emailStatusFailed}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
