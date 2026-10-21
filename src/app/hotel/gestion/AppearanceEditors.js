"use client";

import { useState } from "react";
import { Icon } from "../cahier/CahierIcons";
import {
  BASE_KINDS,
  BUILTIN_TYPES,
  KIND_BASE_LABELS,
  MAX_CUSTOM_TYPES,
  THEME_FAMILIES,
  TONES,
  TONE_LABELS,
  TYPE_ICONS,
} from "@/lib/hotelTheme";

const label = "text-xs font-bold uppercase tracking-wider text-ink/60";
const btn = "rounded bg-aqua-deep px-4 py-2 text-sm font-bold text-sand-card hover:bg-aqua-deep/90 disabled:opacity-60";
const btnGhost = "rounded border border-sand-dim px-3 py-1.5 text-sm font-bold text-ink/70 hover:border-aqua-deep";

// Palettes de couleur du cahier : des pastilles, jamais de sélecteur libre. Chaque couleur
// existe en trois intensités (clair, standard, soutenu).
const VARIANT_LABELS = { clair: "Clair", standard: "Standard", soutenu: "Soutenu" };

export function ThemePicker({ value, busy, onPick }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {THEME_FAMILIES.map((f) => (
        <div key={f.id} className="rounded border border-sand-dim p-2">
          <span className="block px-1 pb-1.5 text-sm font-bold text-ink">{f.label}</span>
          <div className="grid grid-cols-3 gap-2">
            {f.variants.map((t) => {
              const on = value === t.id || (!value && t.id === "sable");
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={busy}
                  aria-pressed={on}
                  aria-label={`${f.label} ${VARIANT_LABELS[t.variant].toLowerCase()}`}
                  onClick={() => onPick(t.id)}
                  className={`rounded border-2 p-1.5 text-left transition ${on ? "border-aqua-deep" : "border-sand-dim hover:border-aqua-deep/60"}`}
                >
                  <span className="flex h-10 items-end justify-end rounded p-1.5" style={{ background: t.bg || "#f7f1e4" }}>
                    <span className="h-4 w-7 rounded" style={{ background: t.accent || "#d9763a" }} />
                  </span>
                  <span className="mt-1 block text-xs font-bold text-ink">{VARIANT_LABELS[t.variant]}{on ? " ✓" : ""}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const newId = () => "c" + Math.random().toString(36).slice(2, 8).padEnd(6, "0");

// Types de consigne : les quatre d'origine (fixes) et ceux de l'hôtel, tous visibles ici, à
// modifier, désactiver ou supprimer.
export function TypesEditor({ initial, busy, onSave }) {
  const [types, setTypes] = useState(initial);
  const [openId, setOpenId] = useState(null);
  const patch = (id, p) => setTypes((list) => list.map((t) => (t.id === id ? { ...t, ...p } : t)));
  const dirty = JSON.stringify(types) !== JSON.stringify(initial);

  function remove(t) {
    if (!window.confirm(`Supprimer le type « ${t.label || "sans nom"} » ? S'il a déjà servi à des consignes, il sera seulement désactivé pour qu'elles gardent leur nom.`)) return;
    const next = types.filter((x) => x.id !== t.id);
    setTypes(next);
    onSave(next);
  }

  return (
    <div className="grid gap-4">
      <div>
        <span className={label}>Types d'origine (toujours proposés)</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {BUILTIN_TYPES.map((t) => (
            <span key={t.id} className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-sm font-bold ${TONES[t.tone]}`}>
              <Icon name={t.icon} className="h-4 w-4" /> {t.short}
            </span>
          ))}
        </div>
      </div>

      <div>
        <span className={label}>Vos types ({types.length} sur {MAX_CUSTOM_TYPES})</span>
        {types.length === 0 && <p className="mt-2 text-sm text-ink/60">Aucun type à vous pour l'instant : le cahier propose les quatre types d'origine.</p>}
      </div>

      {types.map((t) => {
        const open = openId === t.id;
        return (
          <div key={t.id} className={`grid gap-3 rounded border border-sand-dim p-3 ${t.active ? "" : "opacity-70"}`}>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-2 rounded-xl px-3 py-1 text-base font-bold ${TONES[t.tone]}`}>
                <Icon name={t.icon} className="h-5 w-5" /> {t.label || "Nouveau type"}
              </span>
              <span className="text-xs text-ink/55">{KIND_BASE_LABELS[t.kind]}</span>
              {!t.active && <span className="text-xs font-bold uppercase text-ink/50">Désactivé</span>}
              <span className="ml-auto flex flex-wrap gap-2">
                <button type="button" onClick={() => setOpenId(open ? null : t.id)} aria-expanded={open} className={btnGhost}>{open ? "Fermer" : "Modifier"}</button>
                <button type="button" disabled={busy} onClick={() => patch(t.id, { active: !t.active })} className={btnGhost}>{t.active ? "Désactiver" : "Réactiver"}</button>
                <button type="button" disabled={busy} onClick={() => remove(t)} className={`${btnGhost} text-terracotta-deep`}>Supprimer</button>
              </span>
            </div>

            {open && (
              <>
                <label className="grid gap-1.5">
                  <span className={label}>Nom (24 caractères maximum)</span>
                  <input value={t.label} maxLength={24} onChange={(e) => patch(t.id, { label: e.target.value })} className="input" placeholder="Ex. Client VIP" />
                </label>

                <div>
                  <span className={label}>Icône</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TYPE_ICONS.map((name) => (
                      <button
                        key={name}
                        type="button"
                        aria-pressed={t.icon === name}
                        aria-label={name}
                        onClick={() => patch(t.id, { icon: name })}
                        className={`flex h-10 w-10 items-center justify-center rounded border p-2 ${t.icon === name ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim text-ink/60 hover:border-aqua-deep"}`}
                      >
                        <Icon name={name} className="h-full w-full" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className={label}>Couleur</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.keys(TONES).map((tone) => (
                      <button
                        key={tone}
                        type="button"
                        aria-pressed={t.tone === tone}
                        onClick={() => patch(t.id, { tone })}
                        className={`rounded-xl px-3 py-1 text-sm font-bold ${TONES[tone]} ${t.tone === tone ? "ring-2 ring-aqua-deep ring-offset-2" : ""}`}
                      >
                        {TONE_LABELS[tone]}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="grid gap-1.5">
                  <span className={label}>Se comporte comme (pour les statistiques)</span>
                  <select value={t.kind} onChange={(e) => patch(t.id, { kind: e.target.value })} className="input">
                    {BASE_KINDS.map((k) => <option key={k} value={k}>{KIND_BASE_LABELS[k]}</option>)}
                  </select>
                </label>
              </>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-3">
        {types.length < MAX_CUSTOM_TYPES && (
          <button
            type="button"
            onClick={() => {
              const id = newId();
              setTypes([...types, { id, label: "", icon: "star", tone: "violet", kind: "info", active: true }]);
              setOpenId(id);
            }}
            className={btnGhost}
          >
            + Ajouter un type
          </button>
        )}
        <button type="button" disabled={busy || !dirty} onClick={() => onSave(types)} className={btn}>Enregistrer les types</button>
      </div>
      <p className="text-xs text-ink/50">Un type désactivé n'est plus proposé pour les nouvelles consignes ; les consignes déjà écrites gardent leur nom.</p>
    </div>
  );
}
