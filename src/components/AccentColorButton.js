"use client";

import { useState, useRef, useEffect } from "react";
import AccentColorPicker from "./AccentColorPicker";
import { DEFAULT_ACCENT } from "@/lib/accentPalette";

const content = {
  fr: { label: "Couleur du livret" },
  en: { label: "Livret color" },
  es: { label: "Color del livret" },
};

// Bouton compact + popover, plutôt qu'un accordéon enfoui en bas d'un long
// formulaire — le choix de couleur doit être visible tout de suite, pas
// après avoir fait défiler toutes les sections facultatives.
export default function AccentColorButton({ value, onChange, locale = "fr" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const t = content[locale];
  const color = value || DEFAULT_ACCENT;

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-sand-dim bg-sand-card py-1.5 pl-1.5 pr-3 text-xs font-bold uppercase tracking-wider text-ink/70 transition hover:border-ink/30"
      >
        <span className="h-6 w-6 rounded-full border border-ink/10" style={{ backgroundColor: color }} />
        {t.label}
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded border border-sand-dim bg-sand-card p-4 shadow-lg">
          <AccentColorPicker
            value={value}
            onChange={(hex) => {
              onChange(hex);
              setOpen(false);
            }}
            locale={locale}
          />
        </div>
      )}
    </div>
  );
}
