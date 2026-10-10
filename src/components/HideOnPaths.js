"use client";

import { usePathname } from "next/navigation";

// Les pages de l'application hôtelière (cahier, gestion, statistiques) sont
// aux couleurs de l'hôtel : ni le pied de page Tourist Book ni la bannière
// cookies/Analytics du site public n'y ont leur place.
export default function HideOnPaths({ prefixes, children }) {
  const pathname = usePathname();
  if (prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  // /hotel/<nom-de-l-hotel>/cahier : l'adresse propre à chaque hôtel.
  if (/^\/hotel\/[^/]+\/cahier(\/|$)/.test(pathname)) return null;
  return children;
}
