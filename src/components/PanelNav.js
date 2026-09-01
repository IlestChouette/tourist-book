"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { getClientLocale } from "@/lib/i18n/clientLocale";
import navDict from "@/lib/i18n/dictionaries/nav";

export default function PanelNav() {
  const pathname = usePathname();
  const [locale] = useState(getClientLocale);
  const t = navDict[locale];

  if (pathname === "/panel/login" || pathname === "/panel/registro") return null;

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-dim bg-sand-card px-6 py-3">
      <div className="flex flex-wrap gap-4">
        <Link href="/panel" className="text-xs font-bold uppercase tracking-wider text-ink/70 hover:text-terracotta-deep">
          {t.panel}
        </Link>
        <Link
          href="/panel/alojamientos"
          className="text-xs font-bold uppercase tracking-wider text-ink/70 hover:text-terracotta-deep"
        >
          {t.properties}
        </Link>
        <Link
          href="/panel/perfil"
          className="text-xs font-bold uppercase tracking-wider text-ink/70 hover:text-terracotta-deep"
        >
          {t.profile}
        </Link>
      </div>
      <LogoutButton />
    </nav>
  );
}
