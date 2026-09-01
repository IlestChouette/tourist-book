import PanelNav from "@/components/PanelNav";

// Pas de noindex global ici : /panel/login et /panel/registro sont des
// pages publiques (connexion et inscription hôtelier) qu'on veut indexer.
// Les pages privées (/panel, /panel/perfil, /panel/alojamientos/*) posent
// leur propre noindex individuellement.
export default function PanelLayout({ children }) {
  return (
    <>
      <PanelNav />
      {children}
    </>
  );
}
