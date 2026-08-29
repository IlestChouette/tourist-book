"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default function PanelNav() {
  const pathname = usePathname();
  if (pathname === "/panel/login" || pathname === "/panel/registro") return null;

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-sand-dim bg-sand-card px-6 py-3">
      <div className="flex flex-wrap gap-4">
        <Link href="/panel" className="text-xs font-bold uppercase tracking-wider text-ink/70 hover:text-terracotta-deep">
          Panel
        </Link>
        <Link
          href="/panel/alojamientos"
          className="text-xs font-bold uppercase tracking-wider text-ink/70 hover:text-terracotta-deep"
        >
          Alojamientos
        </Link>
        <Link
          href="/panel/perfil"
          className="text-xs font-bold uppercase tracking-wider text-ink/70 hover:text-terracotta-deep"
        >
          Perfil
        </Link>
      </div>
      <LogoutButton />
    </nav>
  );
}
