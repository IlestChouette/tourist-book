"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AssistantPanel from "./AssistantPanel";

function ChatIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="22"
      height="22"
    >
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9z" />
    </svg>
  );
}

const content = {
  fr: { open: "Ouvrir l'assistant", label: "Assistant" },
  en: { open: "Open the assistant", label: "Assistant" },
  es: { open: "Abrir el asistente", label: "Asistente" },
};

// Le chat reste monté (dans AssistantPanel) même quand ce widget est
// démonté par une navigation entre sous-pages du livret n'existe plus pour
// l'instant, mais l'état local `open` suffit à garder la conversation tant
// que l'invité reste sur la page — fermer le panneau ne la vide pas.
export default function AssistantWidget({ slug, locale = "fr" }) {
  const t = content[locale];
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  if (pathname.endsWith("/entrer")) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.open}
        className={`fixed right-0 top-1/2 z-30 flex -translate-y-1/2 items-center gap-2 rounded-l-2xl bg-[var(--host-accent)] py-4 pl-4 pr-3 text-ink shadow-lg transition-all hover:bg-[var(--host-accent-deep)] ${
          open ? "pointer-events-none translate-x-full opacity-0" : ""
        }`}
      >
        <ChatIcon />
        <span className="text-[11px] font-bold uppercase tracking-wide [writing-mode:vertical-rl]">{t.label}</span>
      </button>
      <AssistantPanel slug={slug} locale={locale} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
