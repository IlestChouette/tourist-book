// Apparence du cahier (couleur choisie par l'hôtel) et types de consigne.
// Module sans dépendance serveur : utilisé par le cahier (client) et la gestion.

// Palettes validées pour le contraste : le personnel lit le cahier à toute heure,
// pas de sélecteur de couleur libre.
export const THEMES = [
  { id: "sable", label: "Sable", bg: "", accent: "", accentText: "", band: "" },
  { id: "aqua", label: "Turquoise", bg: "#e4f3f1", accent: "#0a8f87", accentText: "#ffffff", band: "#7fcfc6" },
  { id: "ciel", label: "Bleu ciel", bg: "#e3eefa", accent: "#2c6aa8", accentText: "#ffffff", band: "#9cc3ea" },
  { id: "ardoise", label: "Gris ardoise", bg: "#e6ebee", accent: "#35515c", accentText: "#ffffff", band: "#a9bcc4" },
  { id: "rose", label: "Rose poudré", bg: "#f8e9e6", accent: "#b04a5a", accentText: "#ffffff", band: "#f0b9b6" },
  { id: "olive", label: "Vert olive", bg: "#eef0e0", accent: "#5c6b2a", accentText: "#ffffff", band: "#c9d390" },
  { id: "lavande", label: "Lavande", bg: "#eceaf6", accent: "#5b4fa3", accentText: "#ffffff", band: "#c6bdeb" },
];

export function themeById(id) {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}

// Variables CSS posées sur <main> ; vide pour le thème par défaut.
export function themeStyle(id) {
  const t = themeById(id);
  if (!t.bg) return undefined;
  return { "--cahier-bg": t.bg, "--cahier-accent": t.accent, "--cahier-accent-text": t.accentText };
}

export const TONES = {
  neutre: "bg-ink/[0.08] text-ink",
  aqua: "bg-aqua-deep/10 text-aqua-deep",
  terracotta: "bg-terracotta/30 text-terracotta-deep",
  rouge: "bg-terracotta-deep text-sand-card",
  violet: "bg-[#5b4fa3]/15 text-[#5b4fa3]",
  bleu: "bg-[#2c6aa8]/15 text-[#2c6aa8]",
  vert: "bg-[#5c6b2a]/15 text-[#5c6b2a]",
};
export const TONE_LABELS = { neutre: "Gris", aqua: "Turquoise", terracotta: "Orange", rouge: "Rouge", violet: "Violet", bleu: "Bleu", vert: "Vert" };

// Icônes proposées pour un type propre (voir CahierIcons).
export const TYPE_ICONS = ["info", "tache", "probleme", "plainte", "star", "tool", "bed", "linge", "key", "bell", "food", "phone", "calendar", "heart", "drop", "bolt"];

export const BASE_KINDS = ["info", "tache", "probleme", "plainte"];
export const KIND_BASE_LABELS = { info: "Une information", tache: "Quelque chose à faire", probleme: "Un problème", plainte: "Une plainte client" };

// Les 4 types d'origine, toujours présents.
export const BUILTIN_TYPES = [
  { id: "info", kind: "info", label: "Une information", short: "Information", hint: "À savoir, à transmettre", icon: "info", tone: "aqua" },
  { id: "tache", kind: "tache", label: "Quelque chose à faire", short: "À faire", hint: "Une tâche pour un collègue", icon: "tache", tone: "neutre" },
  { id: "probleme", kind: "probleme", label: "Un problème", short: "Problème", hint: "Panne, fuite, objet cassé…", icon: "probleme", tone: "terracotta" },
  { id: "plainte", kind: "plainte", label: "Une plainte client", short: "Plainte client", hint: "Un client n'est pas content", icon: "plainte", tone: "rouge" },
];

export const MAX_CUSTOM_TYPES = 8;
const LABEL_MAX = 24;

// Nettoie la liste de types propres venue du formulaire ou de la base.
export function cleanCustomTypes(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const t of list) {
    const id = typeof t?.id === "string" && /^c[a-z0-9]{3,12}$/.test(t.id) ? t.id : null;
    const label = String(t?.label ?? "").trim().slice(0, LABEL_MAX);
    if (!id || !label || seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      label,
      icon: TYPE_ICONS.includes(t.icon) ? t.icon : "info",
      tone: TONES[t.tone] ? t.tone : "neutre",
      kind: BASE_KINDS.includes(t.kind) ? t.kind : "info",
      active: t.active !== false,
    });
    if (out.length >= MAX_CUSTOM_TYPES) break;
  }
  return out;
}

// Types à proposer pour écrire une consigne : les 4 d'origine + les propres actifs.
export function selectableTypes(custom) {
  return [
    ...BUILTIN_TYPES,
    ...cleanCustomTypes(custom)
      .filter((t) => t.active)
      .map((t) => ({ id: t.id, kind: t.kind, label: t.label, short: t.label, hint: KIND_BASE_LABELS[t.kind], icon: t.icon, tone: t.tone })),
  ];
}

// Étiquette et ton d'une consigne existante. Un type propre désactivé reste
// affiché tel quel sur les consignes déjà écrites ; un type inconnu retombe
// sur le type de base.
export function typeOf(custom, kind, typeId) {
  const found = typeId ? cleanCustomTypes(custom).find((t) => t.id === typeId) : null;
  if (found) return { label: found.label, short: found.label, icon: found.icon, tone: found.tone, kind: found.kind };
  const b = BUILTIN_TYPES.find((t) => t.id === kind) ?? BUILTIN_TYPES[0];
  return { label: b.label, short: b.short, icon: b.icon, tone: b.tone, kind: b.kind };
}

// Couleur d'un service : sa couleur choisie si elle existe, sinon une palette
// (hors "sable") selon sa position, pour que deux cahiers voisins se distinguent.
export function serviceThemeId(service) {
  if (!service) return null;
  if (service.color && THEMES.some((t) => t.id === service.color)) return service.color;
  const colored = THEMES.filter((t) => t.id !== "sable");
  return colored[(Math.max(1, service.position ?? 1) - 1) % colored.length].id;
}
