"use client";

import { useRef } from "react";

const labels = {
  fr: { bold: "Gras", italic: "Italique", heading: "Titre", words: (n) => `${n} mot${n > 1 ? "s" : ""}` },
  en: { bold: "Bold", italic: "Italic", heading: "Title", words: (n) => `${n} word${n > 1 ? "s" : ""}` },
  es: { bold: "Negrilla", italic: "Cursiva", heading: "Título", words: (n) => `${n} palabra${n > 1 ? "s" : ""}` },
};

// Purement indicatif — passé ce seuil, le compteur change de couleur pour
// suggérer de répartir le texte dans les champs dédiés plutôt que de tout
// mettre ici, sans jamais bloquer la saisie.
const LONG_TEXT_THRESHOLD = 120;

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// Barre de mise en forme minimale au-dessus d'un textarea — pas d'éditeur
// riche ni de dépendance externe : les boutons entourent la sélection avec
// des marqueurs légers (**gras**, *italique*, ## Titre en début de ligne),
// que FormattedText sait ensuite afficher correctement côté livret.
export default function FormattableTextarea({ value, onChange, placeholder, rows = 3, className = "input", locale = "fr" }) {
  const t = labels[locale] ?? labels.fr;
  const ref = useRef(null);

  function fireChange(newValue) {
    onChange({ target: { value: newValue } });
  }

  function wrapSelection(marker) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const newValue = value.slice(0, start) + marker + selected + marker + value.slice(end);
    fireChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + marker.length, end + marker.length);
    });
  }

  function toggleHeadingLine() {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
    const lineEndIdx = value.indexOf("\n", pos);
    const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx;
    const line = value.slice(lineStart, lineEnd);
    const isHeading = line.startsWith("## ");
    const newLine = isHeading ? line.slice(3) : `## ${line}`;
    const delta = isHeading ? -3 : 3;
    const newValue = value.slice(0, lineStart) + newLine + value.slice(lineEnd);
    fireChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(pos + delta, pos + delta);
    });
  }

  return (
    <div className="w-full">
      <div className="mb-1 flex gap-1">
        <button
          type="button"
          onClick={() => wrapSelection("**")}
          title={t.bold}
          aria-label={t.bold}
          className="rounded border border-sand-dim px-2.5 py-1 text-xs font-bold text-ink/70 transition-colors hover:bg-sand-card"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("*")}
          title={t.italic}
          aria-label={t.italic}
          className="rounded border border-sand-dim px-2.5 py-1 text-xs italic text-ink/70 transition-colors hover:bg-sand-card"
        >
          I
        </button>
        <button
          type="button"
          onClick={toggleHeadingLine}
          title={t.heading}
          aria-label={t.heading}
          className="rounded border border-sand-dim px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-ink/70 transition-colors hover:bg-sand-card"
        >
          {t.heading[0]}
        </button>
      </div>
      <textarea
        ref={ref}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => fireChange(e.target.value)}
        className={`w-full ${className}`}
      />
      {value && (
        <span
          className={`mt-1 block text-right text-xs ${
            countWords(value) > LONG_TEXT_THRESHOLD ? "text-terracotta-deep" : "text-ink/40"
          }`}
        >
          {t.words(countWords(value))}
        </span>
      )}
    </div>
  );
}
