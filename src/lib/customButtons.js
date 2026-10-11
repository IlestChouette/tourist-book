// Boutons personnalisés du livret (lave-linge, TV, piscine…) : l'hôte choisit
// un nom, une icône et un texte et/ou une vidéo YouTube. Stockés en jsonb
// dans properties.custom_buttons : [{ id, icon, label, text, video }].
// Module sans dépendance serveur : utilisé par l'éditeur ET par LivretMenu.

export const MAX_CUSTOM_BUTTONS = 8;
export const MAX_LABEL = 30;
export const MAX_TEXT = 1500;

// [clé, tracé SVG (viewBox 24, trait), fr, en, es]
const ICONS = [
  ["washer", "M5 3h14a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM7.5 6.5h1M11 6.5h1", "Lave-linge", "Washer", "Lavadora"],
  ["tv", "M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM8 21h8M12 17v4", "Télévision", "TV", "Televisión"],
  ["snow", "M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9", "Climatisation", "Air conditioning", "Aire acondicionado"],
  ["flame", "M12 3c1 3.5 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.3 1.5 1 2 1.5 2C10.5 7.5 11 5 12 3z", "Chauffage", "Heating", "Calefacción"],
  ["coffee", "M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9zM16 10h2a2.5 2.5 0 0 1 0 5h-2M7 3v2M11 3v2", "Café", "Coffee", "Café"],
  ["kitchen", "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1.5-3 4-3 7h3v11", "Cuisine", "Kitchen", "Cocina"],
  ["key", "M8 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 12l9-9M16 7l3 3", "Clé", "Key", "Llave"],
  ["bed", "M3 19V6M3 15h18v4M21 15v-2a3 3 0 0 0-3-3h-8v5", "Chambre", "Bedroom", "Habitación"],
  ["drop", "M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z", "Eau chaude", "Hot water", "Agua caliente"],
  ["plug", "M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v4", "Électricité", "Electricity", "Electricidad"],
  ["thermo", "M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z", "Thermostat", "Thermostat", "Termostato"],
  ["bike", "M6 20.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18 20.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM6 17l4-8h5l3 8M9 6h3", "Vélo", "Bike", "Bicicleta"],
  ["pool", "M3 10c2 0 2-1.5 4.5-1.5S10 10 12 10s2.5-1.5 4.5-1.5S19 10 21 10M3 15c2 0 2-1.5 4.5-1.5S10 15 12 15s2.5-1.5 4.5-1.5S19 15 21 15", "Piscine", "Pool", "Piscina"],
  ["shirt", "M8 3l-5 4 3 3 2-1.5V21h8V8.5L18 10l3-3-5-4a4 4 0 0 1-8 0z", "Linge", "Linen", "Ropa de cama"],
  ["sun", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5", "Terrasse", "Terrace", "Terraza"],
  ["book", "M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4zM5 17a3 3 0 0 1 3-3h11", "Livres", "Books", "Libros"],
  ["star", "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8L12 3.5z", "Favori", "Favourite", "Favorito"],
  ["alert", "M12 4l9 16H3L12 4zM12 10v4M12 17h.01", "Important", "Important", "Importante"],
  ["info", "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01", "Information", "Information", "Información"],
];

export const ICON_KEYS = ICONS.map((i) => i[0]);
const BY_KEY = Object.fromEntries(ICONS.map((i) => [i[0], i]));

export function iconLabel(key, locale) {
  const row = BY_KEY[key];
  if (!row) return "";
  return row[{ fr: 2, en: 3, es: 4 }[locale] ?? 2];
}

export function CustomIcon({ name, className = "h-full w-full" }) {
  const d = (BY_KEY[name] ?? BY_KEY.info)[1];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={d} />
    </svg>
  );
}

// Nettoie ce qui vient du formulaire (ou de la base) : bornes de longueur,
// icône connue, id stable (marge x2/x3 : une traduction peut rallonger). Un bouton sans nom ou sans contenu est écarté.
export function cleanCustomButtons(list) {
  if (!Array.isArray(list)) return [];
  return list
    .slice(0, MAX_CUSTOM_BUTTONS)
    .map((b, i) => ({
      id: typeof b?.id === "string" && b.id ? b.id.slice(0, 20) : `b${i}`,
      icon: ICON_KEYS.includes(b?.icon) ? b.icon : "info",
      label: String(b?.label ?? "").trim().slice(0, MAX_LABEL * 2),
      text: String(b?.text ?? "").trim().slice(0, MAX_TEXT * 3),
      video: String(b?.video ?? "").trim().slice(0, 300),
    }))
    .filter((b) => b.label && (b.text || b.video));
}
