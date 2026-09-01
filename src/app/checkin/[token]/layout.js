// Formulaire de check-in électronique lié à une réservation précise — pas
// destiné à être indexé par les moteurs de recherche.
export const metadata = { robots: { index: false, follow: false } };

export default function CheckinLayout({ children }) {
  return children;
}
