"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getClientLocale } from "@/lib/i18n/clientLocale";
import navDict from "@/lib/i18n/dictionaries/nav";

export default function PanelNav() {
  const pathname = usePathname();
  const [locale] = useState(getClientLocale);
  const t = navDict[locale];

  // Sur login/inscription, pas encore de session hôtelier — on affiche quand
  // même le sélecteur de langue : un hôte qui ne lit ni le français ni
  // l'espagnol doit pouvoir changer la langue avant même de se connecter,
  // sans avoir à faire défiler jusqu'au pied de page.
  if (pathname === "/panel/login" || pathname === "/panel/registro") {
    return (
      <nav className="flex items-center justify-end border-b border-sand-dim bg-sand-card px-6 py-3">
        <LanguageSwitcher locale={locale} className="text-ink/70" />
      </nav>
    );
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-dim bg-sand-card px-6 py-3">
      <div className="flex flex-wrap items-center gap-4">
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
        <LanguageSwitcher locale={locale} className="text-ink/70" />
      </div>
      <LogoutButton />
    </nav>
  );
}
