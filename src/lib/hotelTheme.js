// Apparence du cahier (couleur choisie par l'hôtel) et types de consigne.
// Module sans dépendance serveur : utilisé par le cahier (client) et la gestion.

// Palettes validées pour le contraste : le personnel lit le cahier à toute heure,
// pas de sélecteur de couleur libre.
// Chaque couleur existe en trois intensités : « clair » (pastel, très doux), standard et
// « soutenu » (un peu plus marqué). Le texte du bouton est vérifié pour rester lisible
// (contraste 4,5 minimum) ; les identifiants d'origine (aqua, ciel…) sont le standard.
export const THEMES = [
  { id: "sable-clair", label: "Sable clair", family: "sable", variant: "clair", bg: "#fffdf8", accent: "#e8a77a", accentText: "#223339", band: "#f3dcc4" },
  { id: "sable", label: "Sable", family: "sable", variant: "standard", bg: "", accent: "", accentText: "", band: "" },
  { id: "sable-soutenu", label: "Sable soutenu", family: "sable", variant: "soutenu", bg: "#f1e7d2", accent: "#b8602a", accentText: "#ffffff", band: "#e3cba0" },
  { id: "aqua-clair", label: "Turquoise clair", family: "aqua", variant: "clair", bg: "#f3faf9", accent: "#78c1bd", accentText: "#223339", band: "#b2e2dd" },
  { id: "aqua", label: "Turquoise", family: "aqua", variant: "standard", bg: "#e4f3f1", accent: "#0a8f87", accentText: "#ffffff", band: "#7fcfc6" },
  { id: "aqua-soutenu", label: "Turquoise soutenu", family: "aqua", variant: "soutenu", bg: "#c1e6e2", accent: "#08756f", accentText: "#ffffff", band: "#68c2b9" },
  { id: "ciel-clair", label: "Bleu ciel clair", family: "ciel", variant: "clair", bg: "#f2f7fd", accent: "#8badcf", accentText: "#223339", band: "#c4dbf2" },
  { id: "ciel", label: "Bleu ciel", family: "ciel", variant: "standard", bg: "#e3eefa", accent: "#2c6aa8", accentText: "#ffffff", band: "#9cc3ea" },
  { id: "ciel-soutenu", label: "Bleu ciel soutenu", family: "ciel", variant: "soutenu", bg: "#cadff4", accent: "#24578a", accentText: "#ffffff", band: "#86b1dd" },
  { id: "ardoise-clair", label: "Gris ardoise clair", family: "ardoise", variant: "clair", bg: "#f4f6f7", accent: "#909fa5", accentText: "#223339", band: "#cbd7dc" },
  { id: "ardoise", label: "Gris ardoise", family: "ardoise", variant: "standard", bg: "#e6ebee", accent: "#35515c", accentText: "#ffffff", band: "#a9bcc4" },
  { id: "ardoise-soutenu", label: "Gris ardoise soutenu", family: "ardoise", variant: "soutenu", bg: "#d1dbdf", accent: "#2b424b", accentText: "#ffffff", band: "#92a7af" },
  { id: "rose-clair", label: "Rose poudré clair", family: "rose", variant: "clair", bg: "#fcf5f4", accent: "#d49ba4", accentText: "#223339", band: "#f6d5d3" },
  { id: "rose", label: "Rose poudré", family: "rose", variant: "standard", bg: "#f8e9e6", accent: "#b04a5a", accentText: "#ffffff", band: "#f0b9b6" },
  { id: "rose-soutenu", label: "Rose poudré soutenu", family: "rose", variant: "soutenu", bg: "#f5d8d5", accent: "#903d4a", accentText: "#ffffff", band: "#e3a3a4" },
  { id: "olive-clair", label: "Vert olive clair", family: "olive", variant: "clair", bg: "#f7f8f1", accent: "#a5ae8a", accentText: "#223339", band: "#dfe5bc" },
  { id: "olive", label: "Vert olive", family: "olive", variant: "standard", bg: "#eef0e0", accent: "#5c6b2a", accentText: "#ffffff", band: "#c9d390" },
  { id: "olive-soutenu", label: "Vert olive soutenu", family: "olive", variant: "soutenu", bg: "#e1e6c4", accent: "#4b5822", accentText: "#ffffff", band: "#b3be7c" },
  { id: "lavande-clair", label: "Lavande clair", family: "lavande", variant: "clair", bg: "#f6f6fb", accent: "#a59ecc", accentText: "#223339", band: "#ddd7f3" },
  { id: "lavande", label: "Lavande", family: "lavande", variant: "standard", bg: "#eceaf6", accent: "#5b4fa3", accentText: "#ffffff", band: "#c6bdeb" },
  { id: "lavande-soutenu", label: "Lavande soutenu", family: "lavande", variant: "soutenu", bg: "#dfdaf2", accent: "#4b4186", accentText: "#ffffff", band: "#b1a7dd" },
  { id: "peche-clair", label: "Pêche clair", family: "peche", variant: "clair", bg: "#fef7f2", accent: "#d6a28a", accentText: "#223339", band: "#fadcc8" },
  { id: "peche", label: "Pêche", family: "peche", variant: "standard", bg: "#fdeee3", accent: "#b5562a", accentText: "#ffffff", band: "#f6c4a3" },
  { id: "peche-soutenu", label: "Pêche soutenu", family: "peche", variant: "soutenu", bg: "#fbdfcd", accent: "#944722", accentText: "#ffffff", band: "#e9ae8b" },
  { id: "menthe-clair", label: "Menthe clair", family: "menthe", variant: "clair", bg: "#f4fbf6", accent: "#8db8a2", accentText: "#223339", band: "#cbecd9" },
  { id: "menthe", label: "Menthe", family: "menthe", variant: "standard", bg: "#e6f6ec", accent: "#2f7d55", accentText: "#ffffff", band: "#a9dfc0" },
  { id: "menthe-soutenu", label: "Menthe soutenu", family: "menthe", variant: "soutenu", bg: "#d1eedd", accent: "#276746", accentText: "#ffffff", band: "#91cbab" },
  { id: "beurre-clair", label: "Beurre clair", family: "beurre", variant: "clair", bg: "#fdfbee", accent: "#bfaf7c", accentText: "#223339", band: "#f5ecba" },
  { id: "beurre", label: "Beurre", family: "beurre", variant: "standard", bg: "#fbf6d9", accent: "#8a6d10", accentText: "#ffffff", band: "#efe08c" },
  { id: "beurre-soutenu", label: "Beurre soutenu", family: "beurre", variant: "soutenu", bg: "#f7eebe", accent: "#71590d", accentText: "#ffffff", band: "#dbc973" },
  { id: "corail-clair", label: "Corail clair", family: "corail", variant: "clair", bg: "#fef5f3", accent: "#df9a93", accentText: "#223339", band: "#f9d1cb" },
  { id: "corail", label: "Corail", family: "corail", variant: "standard", bg: "#fde9e5", accent: "#c4483a", accentText: "#ffffff", band: "#f5b3a8" },
  { id: "corail-soutenu", label: "Corail soutenu", family: "corail", variant: "soutenu", bg: "#fad6d0", accent: "#a13b30", accentText: "#ffffff", band: "#eb9e92" },
  { id: "sauge-clair", label: "Sauge clair", family: "sauge", variant: "clair", bg: "#f6f8f4", accent: "#9eb09e", accentText: "#223339", band: "#d7e3d2" },
  { id: "sauge", label: "Sauge", family: "sauge", variant: "standard", bg: "#eaf0e6", accent: "#4f6f4f", accentText: "#ffffff", band: "#bcd0b4" },
  { id: "sauge-soutenu", label: "Sauge soutenu", family: "sauge", variant: "soutenu", bg: "#dae5d4", accent: "#415b41", accentText: "#ffffff", band: "#a6bda0" },
  { id: "lilas-clair", label: "Lilas clair", family: "lilas", variant: "clair", bg: "#faf5fb", accent: "#bf9ecc", accentText: "#223339", band: "#ead9f1" },
  { id: "lilas", label: "Lilas", family: "lilas", variant: "standard", bg: "#f3e9f6", accent: "#8a4fa3", accentText: "#ffffff", band: "#dcbfe8" },
  { id: "lilas-soutenu", label: "Lilas soutenu", family: "lilas", variant: "soutenu", bg: "#ebdaf1", accent: "#714186", accentText: "#ffffff", band: "#cca9da" },
];

// Familles de couleurs, dans l'ordre d'affichage, avec leurs trois intensités.
export const THEME_FAMILIES = Object.values(
  THEMES.reduce((acc, t) => {
    (acc[t.family] ??= { id: t.family, label: THEMES.find((x) => x.family === t.family && x.variant === "standard").label, variants: [] }).variants.push(t);
    return acc;
  }, {}),
);

// Couleurs données automatiquement aux services (inchangées : les cahiers existants gardent leur teinte).
const AUTO_THEME_IDS = ["aqua", "ciel", "ardoise", "rose", "olive", "lavande"];

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
  const colored = AUTO_THEME_IDS.map((id) => THEMES.find((t) => t.id === id));
  return colored[(Math.max(1, service.position ?? 1) - 1) % colored.length].id;
}
