"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function AssistantFab({ slug }) {
  const pathname = usePathname();
  if (pathname.endsWith("/assistant") || pathname.endsWith("/entrer")) return null;

  return (
    <Link
      href={`/logement/${slug}/assistant`}
      aria-label="Ouvrir l'assistant"
      className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 items-center gap-2 rounded-l-2xl bg-terracotta py-4 pl-4 pr-3 text-ink shadow-lg transition-colors hover:bg-terracotta-deep"
    >
      <ChatIcon />
      <span className="text-[11px] font-bold uppercase tracking-wide [writing-mode:vertical-rl]">
        Assistant
      </span>
    </Link>
  );
}
