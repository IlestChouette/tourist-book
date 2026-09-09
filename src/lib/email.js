import { Resend } from "resend";
import { formatTransferWhatsAppMessage } from "./transferMessage";
import { createAdminClient } from "./supabase/admin";

// Journalise chaque tentative d'envoi (succès ou échec) pour que l'admin
// puisse voir l'historique complet depuis /admin, sans devoir aller chercher
// dans le dashboard Resend. Ne doit jamais faire échouer l'envoi lui-même :
// une erreur d'écriture du log est juste logguée dans la console.
async function logEmail({ recipient, subject, template, status, error }) {
  try {
    const admin = createAdminClient();
    await admin.from("email_log").insert({ recipient, subject, template, status, error: error ?? null });
  } catch (err) {
    console.error("logEmail failed:", err);
  }
}

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

  const subject = `Nouvelle demande de transfert — ${propertyName}`;
  const { error } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: hostEmail,
    subject,
    text: `${lines.join("\n")}\n\n— Message prêt à copier pour WhatsApp —\n\n${whatsappMessage}`,
  });

  // resend.emails.send() ne lève pas d'exception en cas d'erreur API — elle
  // renvoie { data: null, error } que le SDK laisserait passer silencieusement
  // si on ne le vérifie pas explicitement ici.
  if (error) {
    await logEmail({ recipient: hostEmail, subject, template: "transfer_request_notification", status: "failed", error: error.message });
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }

  await logEmail({ recipient: hostEmail, subject, template: "transfer_request_notification", status: "sent" });
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

  const subject = `Nouveau contact — ${name}`;
  const { error } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: lines.join("\n"),
  });

  if (error) {
    await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "contact_lead_notification", status: "failed", error: error.message });
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }

  await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "contact_lead_notification", status: "sent" });
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

  const subject = `Nouvelle inscription — ${name || email}`;
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: lines.join("\n"),
  });

  if (sendError) {
    await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "host_signup_notification", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "host_signup_notification", status: "sent" });
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

On a remarqué que vous n'avez pas encore créé votre logement. Pas de souci, ça prend à peine 5 minutes avec les informations essentielles (vous pourrez compléter le reste plus tard, à votre rythme, depuis la page de modification).

Pour vous donner une idée de ce que ça donne une fois en ligne, voici deux exemples concrets, un pour chaque offre :

Exemple Essentiel : https://tourist-book.com/logement/exemple/entrer?code=0000
Exemple Premium (avec check-in électronique) : https://tourist-book.com/logement/exemple-premium/entrer?code=0000

Petit rappel : vous avez 30 jours d'essai gratuit pour tester tranquillement, sans engagement.

Une question, un doute ? Répondez directement à cet email, on est là pour vous aider.

À très vite,
L'équipe Tourist Book`;

  const subject = "Bienvenue sur Tourist Book — créez votre premier livret";
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: email,
    replyTo: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text,
  });

  if (sendError) {
    await logEmail({ recipient: email, subject, template: "no_property_reminder", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: email, subject, template: "no_property_reminder", status: "sent" });
  return { sent: true };
}

// Prévient Fernando à chaque déclenchement du cron de relance — sans ça,
// il n'a aucune visibilité sur qui a reçu quoi (le reply_to de l'email
// voyageur ne lui envoie rien tant que le voyageur ne répond pas).
export async function sendReminderBatchNotification({ sentTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || sentTo.length === 0) return { sent: false, reason: "not_configured_or_empty" };

  const resend = new Resend(apiKey);

  const lines = [
    "Relance automatique \"créez votre logement\" envoyée à :",
    "",
    ...sentTo.map((h) => `- ${h.name || "(sans nom)"} — ${h.email}`),
  ];

  const subject = `Relance envoyée à ${sentTo.length} hôtelier${sentTo.length > 1 ? "s" : ""}`;
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: lines.join("\n"),
  });

  if (sendError) {
    await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "reminder_batch_notification", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "reminder_batch_notification", status: "sent" });
  return { sent: true };
}

// Message de bienvenue/conseils envoyé une fois (cf. hosts.listing_tips_sent_at)
// aux hôteliers qui ont déjà créé au moins un logement — les encourage à
// remplir les sections facultatives et à choisir leur couleur, avec un
// exemple complet en référence.
export async function sendListingTipsEmail({ name, email }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);
  const greeting = name?.trim() ? `Bonjour ${name.trim()},` : "Bonjour,";

  const text = `${greeting}

Merci infiniment pour votre confiance et votre soutien dans ce projet. Voir des hôtes comme vous rejoindre Tourist Book, c'est ce qui nous motive chaque jour.

On veut vous accompagner à chaque étape. Un conseil simple pour commencer : pour que votre livret soit aussi clair et complet que possible pour vos voyageurs, pensez à remplir chaque section depuis la page « Modifier » de votre logement : message de bienvenue, règles, gestion des poubelles, informations générales, recommandations locales, récupération des clés... Tout est facultatif, mais plus vous en ajoutez, moins vos voyageurs auront de questions à vous poser pendant leur séjour. Vous pouvez aussi y choisir la couleur des boutons de votre livret, pour lui donner votre touche personnelle.

Pour vous donner une idée de ce que ça donne une fois tout rempli, voici un exemple complet avec toutes les informations en place :
https://tourist-book.com/logement/exemple-premium/entrer?code=0000

N'hésitez pas à nous écrire si vous avez la moindre question, on est là pour vous aider à en tirer le meilleur.

Merci encore, et à très vite,
L'équipe Tourist Book`;

  const subject = "Merci de faire partie de l'aventure Tourist Book";
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: email,
    replyTo: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text,
  });

  if (sendError) {
    await logEmail({ recipient: email, subject, template: "listing_tips", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: email, subject, template: "listing_tips", status: "sent" });
  return { sent: true };
}

// Même principe que sendReminderBatchNotification, pour le cron listing-tips.
export async function sendListingTipsBatchNotification({ sentTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || sentTo.length === 0) return { sent: false, reason: "not_configured_or_empty" };

  const resend = new Resend(apiKey);

  const lines = [
    "Email de bienvenue/conseils envoyé à :",
    "",
    ...sentTo.map((h) => `- ${h.name || "(sans nom)"} — ${h.email}`),
  ];

  const subject = `Email de bienvenue envoyé à ${sentTo.length} hôtelier${sentTo.length > 1 ? "s" : ""}`;
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: lines.join("\n"),
  });

  if (sendError) {
    await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "listing_tips_batch_notification", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "listing_tips_batch_notification", status: "sent" });
  return { sent: true };
}
