"use client";

import { useState } from "react";

const label = "text-xs font-bold uppercase tracking-wider text-ink/60";
const btn = "rounded bg-aqua-deep px-4 py-2 text-sm font-bold text-sand-card hover:bg-aqua-deep/90 disabled:opacity-60";
const btnGhost = "rounded border border-sand-dim px-3 py-1.5 text-sm font-bold text-ink/70 hover:border-aqua-deep";

// Un accès (email + mot de passe) par service. La personne se connecte sur
// /hotel/connexion ; l'appareil est alors activé pour ce service.
export default function ServiceAccounts({ services, accounts, busy, call }) {
  const [drafts, setDrafts] = useState({});
  const [linkEmails, setLinkEmails] = useState({});
  const draft = (id) => drafts[id] ?? { email: "", password: "" };
  const setDraft = (id, patch) => setDrafts((d) => ({ ...d, [id]: { ...draft(id), ...patch } }));

  return (
    <ul className="grid gap-3">
      {services.map((s) => {
        const email = accounts[s.id];
        const d = draft(s.id);
        return (
          <li key={s.id} className="rounded border border-sand-dim p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-ink">{s.name}</strong>
              {email && <span className="rounded bg-aqua-deep/10 px-2 py-0.5 text-sm font-bold text-aqua-deep">{email}</span>}
            </div>
            {email ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  className={btnGhost}
                  onClick={() => {
                    const password = window.prompt(`Nouveau mot de passe pour ${s.name} (8 caractères au minimum) :`);
                    if (password) call({ action: "set_service_password", serviceId: s.id, password }, "Mot de passe modifié.");
                  }}
                >
                  Changer le mot de passe
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className={btnGhost}
                  onClick={() => window.confirm(`Déconnecter tous les appareils du service « ${s.name} » ?`) && call({ action: "revoke_service_devices", serviceId: s.id }, "Appareils déconnectés.")}
                >
                  Déconnecter les appareils
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className={btnGhost}
                  onClick={() => window.confirm(`Supprimer l'accès de « ${s.name} » ? Les appareils déjà activés restent connectés jusqu'à ce que vous les déconnectiez.`) && call({ action: "delete_service_account", serviceId: s.id }, "Accès supprimé.")}
                >
                  Supprimer l'accès
                </button>
              </div>
            ) : (
              <form
                className="mt-3 flex flex-wrap items-end gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  call({ action: "create_service_account", serviceId: s.id, email: d.email, password: d.password }, "Accès créé.").then((ok) => ok && setDraft(s.id, { email: "", password: "" }));
                }}
              >
                <label className="grid gap-1.5">
                  <span className={label}>Email</span>
                  <input required type="email" value={d.email} onChange={(e) => setDraft(s.id, { email: e.target.value })} placeholder={`${s.key.startsWith("x-") ? "service" : s.key}@votrehotel.com`} className="input" />
                </label>
                <label className="grid gap-1.5">
                  <span className={label}>Mot de passe</span>
                  <input required type="text" minLength={8} value={d.password} onChange={(e) => setDraft(s.id, { password: e.target.value })} placeholder="8 caractères minimum" className="input" autoComplete="off" />
                </label>
                <button type="submit" disabled={busy} className={btn}>Créer l'accès</button>
              </form>
            )}
            <form
              className="mt-4 flex flex-wrap items-end gap-3 border-t border-sand-dim pt-3"
              onSubmit={(e) => {
                e.preventDefault();
                call({ action: "send_activation_link", serviceId: s.id, email: linkEmails[s.id] ?? "" }, "Lien envoyé.").then((ok) => ok && setLinkEmails((l) => ({ ...l, [s.id]: "" })));
              }}
            >
              <label className="grid gap-1.5">
                <span className={label}>Ou envoyer un lien par email (sans mot de passe)</span>
                <input required type="email" value={linkEmails[s.id] ?? ""} onChange={(e) => setLinkEmails((l) => ({ ...l, [s.id]: e.target.value }))} placeholder="adresse du service ou du responsable" className="input" />
              </label>
              <button type="submit" disabled={busy} className={btnGhost}>Envoyer le lien</button>
              <p className="basis-full text-sm text-ink/60">Le lien active l'ordinateur sur lequel il est ouvert, une seule fois, pendant 24 h. Aucun compte à créer.</p>
            </form>
          </li>
        );
      })}
    </ul>
  );
}
