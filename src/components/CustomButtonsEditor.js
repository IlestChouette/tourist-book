"use client";

import FormattableTextarea from "./FormattableTextarea";
import {
  CustomIcon,
  ICON_KEYS,
  iconLabel,
  MAX_CUSTOM_BUTTONS,
  MAX_LABEL,
  MAX_TEXT,
} from "@/lib/customButtons";

const t = {
  fr: {
    title: "Boutons personnalisés",
    hint: "Ajoutez vos propres boutons au livret (lave-linge, TV, piscine…) avec un texte et/ou une vidéo YouTube.",
    add: "+ Ajouter un bouton",
    label: "Nom du bouton",
    labelPlaceholder: "Ex. Lave-linge",
    icon: "Icône",
    text: "Texte",
    textPlaceholder: "Explications pour le voyageur…",
    video: "Vidéo YouTube (facultatif)",
    remove: "Supprimer ce bouton",
    needContent: "Ajoutez un texte ou une vidéo : sinon le bouton ne sera pas affiché.",
  },
  en: {
    title: "Custom buttons",
    hint: "Add your own buttons to the guide (washer, TV, pool…) with text and/or a YouTube video.",
    add: "+ Add a button",
    label: "Button name",
    labelPlaceholder: "E.g. Washing machine",
    icon: "Icon",
    text: "Text",
    textPlaceholder: "Instructions for the guest…",
    video: "YouTube video (optional)",
    remove: "Remove this button",
    needContent: "Add text or a video, otherwise the button won't be shown.",
  },
  es: {
    title: "Botones personalizados",
    hint: "Añade tus propios botones al libro (lavadora, TV, piscina…) con un texto y/o un vídeo de YouTube.",
    add: "+ Añadir un botón",
    label: "Nombre del botón",
    labelPlaceholder: "Ej. Lavadora",
    icon: "Icono",
    text: "Texto",
    textPlaceholder: "Explicaciones para el huésped…",
    video: "Vídeo de YouTube (opcional)",
    remove: "Eliminar este botón",
    needContent: "Añade un texto o un vídeo; si no, el botón no se mostrará.",
  },
};

export default function CustomButtonsEditor({ value, onChange, locale = "fr" }) {
  const l = t[locale] ?? t.fr;

  function patch(i, field, v) {
    onChange(value.map((b, j) => (j === i ? { ...b, [field]: v } : b)));
  }

  function add() {
    onChange([...value, { id: Math.random().toString(36).slice(2, 10), icon: "info", label: "", text: "", video: "" }]);
  }

  return (
    <details open={value.length > 0} className="group rounded border border-sand-dim [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-sand-card p-4 text-sm font-bold uppercase tracking-wider text-ink/70">
        {l.title}
        <span className="shrink-0 text-xl text-ink/40 transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="grid gap-4 p-4">
        <p className="text-xs text-ink/50">{l.hint}</p>

        {value.map((b, i) => (
          <div key={b.id} className="grid gap-3 rounded border border-sand-dim p-3">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{l.label}</span>
              <input
                value={b.label}
                maxLength={MAX_LABEL}
                placeholder={l.labelPlaceholder}
                onChange={(e) => patch(i, "label", e.target.value)}
                className="input"
              />
            </label>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{l.icon}</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {ICON_KEYS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    title={iconLabel(k, locale)}
                    aria-label={iconLabel(k, locale)}
                    aria-pressed={b.icon === k}
                    onClick={() => patch(i, "icon", k)}
                    className={`flex h-10 w-10 items-center justify-center rounded border p-2 transition-colors ${
                      b.icon === k
                        ? "border-aqua-deep bg-aqua-deep text-sand-card"
                        : "border-sand-dim text-ink/60 hover:border-aqua-deep"
                    }`}
                  >
                    <CustomIcon name={k} />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{l.text}</span>
              <FormattableTextarea
                rows={3}
                placeholder={l.textPlaceholder}
                value={b.text}
                onChange={(e) => patch(i, "text", e.target.value.slice(0, MAX_TEXT))}
                locale={locale}
              />
            </div>

            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{l.video}</span>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={b.video}
                onChange={(e) => patch(i, "video", e.target.value)}
                className="input"
              />
            </label>

            {b.label && !b.text.trim() && !b.video.trim() && (
              <p className="text-xs text-terracotta-deep">{l.needContent}</p>
            )}

            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="justify-self-start text-xs font-bold text-terracotta-deep hover:underline"
            >
              {l.remove}
            </button>
          </div>
        ))}

        {value.length < MAX_CUSTOM_BUTTONS && (
          <button
            type="button"
            onClick={add}
            className="justify-self-start rounded border border-aqua-deep px-4 py-2 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card"
          >
            {l.add}
          </button>
        )}
      </div>
    </details>
  );
}
