// Recherche dans le cahier : sans accents ni majuscules, tous les mots doivent
// se trouver (dans le texte, le lieu, les étiquettes ou le type). Module sans
// dépendance serveur, utilisé par l'API et par l'affichage (mise en évidence).

export const MIN_QUERY = 2;
export const MAX_TERMS = 6;

export function normalize(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function searchTerms(query) {
  return [...new Set(normalize(query).split(/[^a-z0-9]+/).filter(Boolean))].slice(0, MAX_TERMS);
}

// Parties d'un texte à mettre en évidence : [{ text, hit }].
export function highlightParts(text, terms) {
  const norm = normalize(text);
  if (norm.length !== text.length || terms.length === 0) return [{ text, hit: false }];
  const marks = new Array(text.length).fill(false);
  for (const t of terms) {
    for (let i = norm.indexOf(t); i !== -1; i = norm.indexOf(t, i + 1)) {
      for (let k = i; k < i + t.length; k++) marks[k] = true;
    }
  }
  const parts = [];
  for (let i = 0; i < text.length; ) {
    let j = i;
    while (j < text.length && marks[j] === marks[i]) j++;
    parts.push({ text: text.slice(i, j), hit: marks[i] });
    i = j;
  }
  return parts;
}
