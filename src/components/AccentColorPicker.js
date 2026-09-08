"use client";

import { ACCENT_PALETTE } from "@/lib/accentPalette";

export default function AccentColorPicker({ value, onChange, locale = "fr" }) {
  return (
    <div className="flex flex-wrap gap-3">
      {ACCENT_PALETTE.map((swatch) => {
        const selected = (value || ACCENT_PALETTE[0].hex) === swatch.hex;
        return (
          <button
            key={swatch.key}
            type="button"
            onClick={() => onChange(swatch.hex)}
            aria-label={swatch.name[locale] ?? swatch.name.fr}
            aria-pressed={selected}
            className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
              selected ? "border-ink" : "border-transparent hover:border-ink/30"
            }`}
            style={{ backgroundColor: swatch.hex }}
          >
            {selected && (
              <svg viewBox="0 0 20 20" width="16" height="16" className="text-ink">
                <path
                  d="M4 10.5l3.5 3.5L16 5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}
