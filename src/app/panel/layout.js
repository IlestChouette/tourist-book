import PanelNav from "@/components/PanelNav";

export default function PanelLayout({ children }) {
  return (
    <>
      <PanelNav />
      {children}
    </>
  );
}
