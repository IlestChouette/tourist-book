import { Resend } from "resend";
import { formatTransferWhatsAppMessage } from "./transferMessage";

// Notifie l'hôtelier par email dès qu'une demande de transfert arrive.
// Tant que RESEND_API_KEY n'est pas configurée, cette fonction ne fait
// rien — la demande reste enregistrée normalement, seul l'email est
// désactivé. Sans domaine vérifié sur Resend, l'email ne peut être livré
// qu'à l'adresse du compte Resend lui-même (limite du mode sandbox).
export async function sendTransferRequestNotification({ hostEmail, propertyName, propertyAddress, request }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !hostEmail) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);
  const d = request.details || {};

  const lines = [
    `Nouvelle demande de transfert pour ${propertyName}`,
    propertyAddress ? `Adresse : ${propertyAddress}` : null,
    "",
    `Voyageur : ${request.nom}`,
    `Téléphone : ${request.telephone || "-"}`,
    `Date : ${d.date || "-"} à ${d.heure || "-"}`,
    `Lieu de prise en charge : ${d.lieu || "-"}`,
    `Passagers : ${d.passagers || "-"}`,
    d.vol ? `N° de vol : ${d.vol}` : null,
    d.bagagesGrands || d.bagagesPetits
      ? `Bagages : ${d.bagagesGrands ?? 0} grand(s), ${d.bagagesPetits ?? 0} petit(s)`
      : null,
    d.remarques ? `Remarques : ${d.remarques}` : null,
  ].filter(Boolean);

  const whatsappMessage = formatTransferWhatsAppMessage({
    propertyName,
    propertyAddress,
    nom: request.nom,
    telephone: request.telephone,
    details: d,
  });

  const { error } = await resend.emails.send({
    from: "Tourist Book <onboarding@resend.dev>",
    to: hostEmail,
    subject: `Nouvelle demande de transfert — ${propertyName}`,
    text: `${lines.join("\n")}\n\n— Message prêt à copier pour WhatsApp —\n\n${whatsappMessage}`,
  });

  // resend.emails.send() ne lève pas d'exception en cas d'erreur API — elle
  // renvoie { data: null, error } que le SDK laisserait passer silencieusement
  // si on ne le vérifie pas explicitement ici.
  if (error) {
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }

  return { sent: true };
}
