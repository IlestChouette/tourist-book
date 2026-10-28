// Sujets qui reviennent dans les problèmes et plaintes, repérés dans le texte des consignes
// (pas de catégorie à choisir à l'écriture). Lexique du vocabulaire d'hôtel, sans accents ;
// un mot-clé vaut pour tous les mots qui commencent par lui. Une consigne compte une fois par
// sujet ; celles qui n'en touchent aucun vont dans « Autres sujets ».
const TOPICS = [
  { label: "Fuite et humidité", words: ["fuite", "fuit", "humid", "infiltr", "degat des eaux", "degats des eaux", "plomb", "robinet", "tuyau", "bouche", "debord", "inond", "chasse d eau"] },
  { label: "Climatisation et chauffage", words: ["clim", "chauffage", "radiateur", "ventilat", "thermostat", "temperature", "trop chaud", "trop froid"] },
  { label: "Serrure, porte et clés", words: ["serrure", "cle", "clef", "badge", "carte magnetique", "porte", "verrou", "coffre"] },
  { label: "Bruit", words: ["bruit", "bruyant", "tapage", "vacarme", "nuisance sonore", "musique"] },
  { label: "Propreté et linge", words: ["sale", "proprete", "menage", "drap", "linge", "serviette", "poussiere", "tache", "odeur", "cheveux"] },
  { label: "Électricité et éclairage", words: ["ampoule", "lumiere", "eclairage", "prise", "electri", "disjoncteur", "interrupteur", "courant"] },
  { label: "TV, wifi et téléphone", words: ["tv", "tele", "wifi", "internet", "telephone", "ecran"] },
  { label: "Nuisibles", words: ["punaise", "cafard", "insecte", "souris", "moustique", "fourmi"] },
  { label: "Petit-déjeuner et restauration", words: ["petit dej", "petit-dej", "repas", "restaurant", "buffet", "cuisine"] },
  { label: "Service et attente", words: ["attente", "retard", "lent", "impoli", "accueil", "personnel"] },
  { label: "Panne ou casse", words: ["panne", "hors service", "casse", "defectueux", "ne marche", "ne fonctionne"] },
];

const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const PATTERNS = TOPICS.map((t) => ({ label: t.label, re: new RegExp(`(^|[^a-z0-9])(${t.words.map(escape).join("|")})`) }));

// rows : consignes (avec body et kind). Renvoie [{ label, value }], du plus fréquent au moins fréquent.
export function problemTopics(rows, { limit = 6 } = {}) {
  const issues = rows.filter((c) => c.kind === "probleme" || c.kind === "plainte");
  const counts = new Map();
  let other = 0;
  for (const c of issues) {
    const text = norm(c.body);
    const hit = PATTERNS.filter((p) => p.re.test(text));
    if (hit.length === 0) other += 1;
    for (const p of hit) counts.set(p.label, (counts.get(p.label) ?? 0) + 1);
  }
  const out = [...counts.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label)).slice(0, limit);
  if (other > 0) out.push({ label: "Autres sujets", value: other });
  return out;
}
