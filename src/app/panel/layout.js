import PanelNav from "@/components/PanelNav";

export const metadata = { robots: { index: false, follow: false } };

export default function PanelLayout({ children }) {
  return (
    <>
      <PanelNav />
      {children}
    </>
  );
}
