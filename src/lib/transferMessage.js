// Texte du message prêt à envoyer à l'entreprise de transport — utilisé à
// la fois dans l'email de notification à l'hôtelier et dans le bouton
// "Copier le message" du panel.
export function formatTransferWhatsAppMessage({ propertyName, propertyAddress, nom, telephone, details }) {
  const d = details || {};
  return [
    "Nouvelle demande de transfert 🚗",
    `Logement : ${propertyName}${propertyAddress ? ` — ${propertyAddress}` : ""}`,
    `Date : ${d.date || "-"} à ${d.heure || "-"}`,
    `Lieu de prise en charge : ${d.lieu || "-"}`,
    `Passagers : ${d.passagers || "-"}`,
    `Voyageur : ${nom}`,
    `Téléphone : ${telephone || "-"}`,
    "",
    "Merci de confirmer la disponibilité et le tarif.",
  ].join("\n");
}
