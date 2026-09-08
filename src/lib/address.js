// Aucune dépendance serveur ici (contrairement à lib/properties.js) — ce
// helper est importé aussi bien par des Server Components que par des
// composants client (CarteInteractive), et un import de code serveur
// (createAdminClient) depuis un composant client serait une erreur de build.

// Une adresse seule ("72 Rue Grande") est ambiguë pour un géocodeur — que ce
// soit Google Maps ou la détection automatique d'adresses de Safari/iOS —
// sans la ville ni le code postal : ça retombe parfois sur une rue du même
// nom dans une tout autre commune. Toujours inclure les trois.
export function fullAddress(property) {
  return [property.address, property.postal_code, property.city].filter(Boolean).join(", ");
}
