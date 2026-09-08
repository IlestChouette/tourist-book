// Palette curée (pas de sélecteur libre) inspirée des couleurs du Sud de la
// France — chaque hôte choisit un ton pastel parmi ceux-ci pour les boutons
// et tuiles de son livret. `null` / valeur absente retombe sur le terracotta
// par défaut du site (voir DEFAULT_ACCENT ci-dessous).
export const DEFAULT_ACCENT = "#e2905f";

export const ACCENT_PALETTE = [
  { key: "terracotta", hex: "#e2905f", name: { fr: "Terracotta", en: "Terracotta", es: "Terracota" } },
  { key: "lavande", hex: "#b9a9d9", name: { fr: "Lavande", en: "Lavender", es: "Lavanda" } },
  { key: "bougainvillier", hex: "#e8a9b8", name: { fr: "Rose bougainvillier", en: "Bougainvillea pink", es: "Rosa buganvilla" } },
  { key: "aigue-marine", hex: "#9ed9ce", name: { fr: "Aigue-marine", en: "Aquamarine", es: "Aguamarina" } },
  { key: "olivier", hex: "#a8b98a", name: { fr: "Vert olivier", en: "Olive green", es: "Verde oliva" } },
  { key: "tournesol", hex: "#ebd08c", name: { fr: "Jaune tournesol", en: "Sunflower yellow", es: "Amarillo girasol" } },
  { key: "corail", hex: "#f0a78c", name: { fr: "Corail", en: "Coral", es: "Coral" } },
];

// Assombrit légèrement la couleur pour l'état hover — en CSS pur via
// color-mix(), pas besoin de calculer une teinte "deep" par couleur.
export function accentDeep(hex) {
  return `color-mix(in srgb, ${hex} 82%, black)`;
}
