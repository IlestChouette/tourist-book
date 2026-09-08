import { Resend } from "resend";
import { formatTransferWhatsAppMessage } from "./transferMessage";

// Notifie l'hôtelier par email dès qu'une demande de transfert arrive.
// Tant que RESEND_API_KEY n'est pas configurée, cette fonction ne fait
// rien — la demande reste enregistrée normalement, seul l'email est
// désactivé.
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
    from: "Tourist Book <notifications@tourist-book.com>",
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

const CONTACT_NOTIFICATION_EMAIL = "allo@ilestchouette.fr";

// Notifie Fernando dès qu'un futur client remplit le formulaire de contact
// de la landing page.
export async function sendContactLeadNotification({ name, phone, email, propertiesCount }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);

  const lines = [
    "Nouveau contact depuis tourist-book.com",
    "",
    `Nom : ${name}`,
    `Téléphone : ${phone}`,
    `Email : ${email}`,
    `Logements gérés : ${propertiesCount ?? "-"}`,
  ];

  const { error } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject: `Nouveau contact — ${name}`,
    text: lines.join("\n"),
  });

  if (error) {
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }

  return { sent: true };
}

// Notifie Fernando dès qu'un hôtelier crée un compte, pour savoir qui vient
// de s'inscrire sans devoir aller vérifier la page admin.
export async function sendHostSignupNotification({ name, email, phone }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);

  const lines = [
    "Nouvelle inscription hôtelier sur tourist-book.com",
    "",
    `Nom : ${name || "-"}`,
    `Email : ${email}`,
    `Téléphone : ${phone || "-"}`,
  ];

  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject: `Nouvelle inscription — ${name || email}`,
    text: lines.join("\n"),
  });

  if (sendError) {
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  return { sent: true };
}

// Relance automatique (une seule fois, cf. hosts.no_property_reminder_sent_at)
// envoyée aux hôteliers inscrits depuis plus de 48h qui n'ont encore créé
// aucun logement — pour qu'ils voient à quoi ressemble le livret avant
// d'oublier le projet.
export async function sendNoPropertyReminder({ name, email }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);
  const greeting = name?.trim() ? `Bonjour ${name.trim()},` : "Bonjour,";

  const text = `${greeting}

Bienvenue sur Tourist Book, et merci de faire partie de l'aventure !

On a remarqué que vous n'avez pas encore créé votre logement — pas de souci, ça prend à peine 5 minutes avec les informations essentielles (vous pourrez compléter le reste plus tard, à votre rythme, depuis la page de modification).

Pour vous donner une idée de ce que ça donne une fois en ligne, voici deux exemples concrets, un pour chaque offre :

Exemple Essentiel : https://tourist-book.com/logement/exemple/entrer?code=0000
Exemple Premium (avec check-in électronique) : https://tourist-book.com/logement/exemple-premium/entrer?code=0000

Petit rappel : vous avez 30 jours d'essai gratuit pour tester tranquillement, sans engagement.

Une question, un doute ? Répondez directement à cet email, on est là pour vous aider.

À très vite,
L'équipe Tourist Book`;

  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: email,
    replyTo: CONTACT_NOTIFICATION_EMAIL,
    subject: "Bienvenue sur Tourist Book — créez votre premier livret",
    text,
  });

  if (sendError) {
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  return { sent: true };
}
