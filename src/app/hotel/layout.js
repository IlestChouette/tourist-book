export const metadata = { robots: { index: false, follow: false } };

// L'espace hôtel reste en thème clair, même si l'ordinateur est en mode sombre :
// les couleurs choisies par l'hôtel (fond, bandeau) sont pensées pour un fond clair.
export default function HotelLayout({ children }) {
  return <div className="hotel-light flex flex-1 flex-col bg-sand text-ink">{children}</div>;
}
