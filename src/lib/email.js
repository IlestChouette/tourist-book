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

  // Un seul message, celui déjà prêt à transférer tel quel au transporteur
  // (WhatsApp ou copier-coller) — inutile de le répéter deux fois avec des
  // infos qui se chevauchent.
  const message = formatTransferWhatsAppMessage({
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
    text: message,
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
export async function sendContactLeadNotification({ name, phone, email, propertiesCount, message }) {
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
    ...(message ? ["", "Message :", message] : []),
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

// Notifie Fernando dès qu'un hôtelier crée un logement, pour savoir qui
// avance dans le parcours sans devoir aller vérifier la page admin.
export async function sendPropertyCreatedNotification({ hostName, hostEmail, propertyName, city }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);

  const lines = [
    "Nouveau logement créé sur tourist-book.com",
    "",
    `Logement : ${propertyName}${city ? ` (${city})` : ""}`,
    `Hôtelier : ${hostName || "-"} — ${hostEmail || "-"}`,
  ];

  const subject = `Nouveau logement — ${propertyName}`;
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: lines.join("\n"),
  });

  if (sendError) {
    await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "property_created_notification", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "property_created_notification", status: "sent" });
  return { sent: true };
}

// Notifie Fernando dès qu'un hôtelier termine un checkout Stripe (essai
// gratuit ou paiement immédiat selon le cycle) pour un logement.
export async function sendSubscriptionStartedNotification({ hostEmail, propertyName, plan, cycle, trialing }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);

  const lines = [
    "Nouvel abonnement démarré sur tourist-book.com",
    "",
    `Logement : ${propertyName}`,
    `Hôtelier : ${hostEmail || "-"}`,
    `Offre : ${plan || "-"} · ${cycle || "-"}`,
    trialing ? "Statut : essai gratuit en cours (pas encore facturé)" : "Statut : paiement immédiat",
  ];

  const subject = `Nouvel abonnement — ${propertyName}`;
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: lines.join("\n"),
  });

  if (sendError) {
    await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "subscription_started_notification", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "subscription_started_notification", status: "sent" });
  return { sent: true };
}

// Notifie Fernando quand l'essai gratuit d'un logement se termine et que
// l'abonnement passe réellement en facturation active (premier vrai revenu).
export async function sendSubscriptionActivatedNotification({ hostEmail, propertyName, plan, cycle }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);

  const lines = [
    "Fin d'essai — abonnement maintenant actif et facturé",
    "",
    `Logement : ${propertyName}`,
    `Hôtelier : ${hostEmail || "-"}`,
    `Offre : ${plan || "-"} · ${cycle || "-"}`,
  ];

  const subject = `Abonnement actif — ${propertyName}`;
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: lines.join("\n"),
  });

  if (sendError) {
    await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "subscription_activated_notification", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "subscription_activated_notification", status: "sent" });
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

// Envoyé au voyageur juste après qu'il ait terminé son check-in électronique —
// lui donne le lien du livret et ses identifiants par écrit, pour ne pas les
// perdre s'il ferme l'onglet avant de les noter.
export async function sendGuestCheckinCredentials({ email, firstName, propertyName, propertySlug, username, password }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);
  const greeting = firstName?.trim() ? `Bonjour ${firstName.trim()},` : "Bonjour,";
  const livretUrl = `https://tourist-book.com/logement/${propertySlug}`;

  const text = `${greeting}

Votre check-in pour "${propertyName}" est bien enregistré.

Vous pouvez dès maintenant accéder au livret d'accueil de votre logement :
${livretUrl}

Vos identifiants (à conserver, ils vous permettront de vous reconnecter depuis n'importe quel appareil) :
Identifiant : ${username}
Mot de passe : ${password}

Bon séjour,
L'équipe Tourist Book`;

  const subject = `Votre livret d'accueil — ${propertyName}`;
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: email,
    subject,
    text,
  });

  if (sendError) {
    await logEmail({ recipient: email, subject, template: "guest_checkin_credentials", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: email, subject, template: "guest_checkin_credentials", status: "sent" });
  return { sent: true };
}

// Reçu via la page indépendante de demande de transfert (sans logement lié —
// pour un voyageur qui n'est pas hébergé via Tourist Book). Envoyé
// uniquement à l'admin, il n'y a pas d'hôtelier concerné ici.
export async function sendIndependentTransferRequest({ nom, telephone, date, heure, lieu, passagers, bagagesGrands, bagagesPetits, vol, remarques }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const resend = new Resend(apiKey);

  const lines = [
    "Nouvelle demande de transfert indépendante (sans logement Tourist Book)",
    "",
    `Voyageur : ${nom}`,
    `Téléphone : ${telephone || "-"}`,
    `Date : ${date || "-"} à ${heure || "-"}`,
    `Lieu de prise en charge : ${lieu || "-"}`,
    `Passagers : ${passagers || "-"}`,
    vol ? `N° de vol : ${vol}` : null,
    bagagesGrands || bagagesPetits ? `Bagages : ${bagagesGrands ?? 0} grand(s), ${bagagesPetits ?? 0} petit(s)` : null,
    remarques ? `Remarques : ${remarques}` : null,
  ].filter(Boolean);

  const subject = `Nouvelle demande de transfert indépendante — ${nom}`;
  const { error: sendError } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: lines.join("\n"),
  });

  if (sendError) {
    await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "independent_transfer_request", status: "failed", error: sendError.message });
    throw new Error(`Resend API error: ${sendError.name} — ${sendError.message}`);
  }

  await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "independent_transfer_request", status: "sent" });
  return { sent: true };
}

const PASSWORD_RESET_COPY = {
  fr: {
    subject: "Réinitialisez votre mot de passe Tourist Book",
    body: (link) => [
      "Bonjour,",
      "",
      "Vous avez demandé à réinitialiser votre mot de passe Tourist Book. Cliquez sur ce lien pour en choisir un nouveau :",
      "",
      link,
      "",
      "Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email : votre mot de passe reste inchangé.",
      "",
      "À très vite,",
      "L'équipe Tourist Book",
    ],
  },
  en: {
    subject: "Reset your Tourist Book password",
    body: (link) => [
      "Hello,",
      "",
      "You asked to reset your Tourist Book password. Click this link to choose a new one:",
      "",
      link,
      "",
      "If you didn't ask for this, just ignore this email: your password stays unchanged.",
      "",
      "See you soon,",
      "The Tourist Book team",
    ],
  },
  es: {
    subject: "Restablece tu contraseña de Tourist Book",
    body: (link) => [
      "Hola,",
      "",
      "Has pedido restablecer tu contraseña de Tourist Book. Haz clic en este enlace para elegir una nueva:",
      "",
      link,
      "",
      "Si no lo has pedido tú, ignora este email: tu contraseña no cambia.",
      "",
      "Hasta pronto,",
      "El equipo de Tourist Book",
    ],
  },
};

// Lien de réinitialisation du mot de passe, envoyé depuis notre propre domaine
// (Resend) plutôt que par le modèle d'email de Supabase : le lien pointe vers
// tourist-book.com, et rien ne dépend d'un réglage fait à la main dans le
// dashboard Supabase.
export async function sendPasswordResetEmail({ to, link, locale = "fr" }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const copy = PASSWORD_RESET_COPY[locale] ?? PASSWORD_RESET_COPY.fr;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to,
    replyTo: CONTACT_NOTIFICATION_EMAIL,
    subject: copy.subject,
    text: copy.body(link).join("\n"),
  });

  if (error) {
    await logEmail({ recipient: to, subject: copy.subject, template: "password_reset", status: "failed", error: error.message });
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }

  await logEmail({ recipient: to, subject: copy.subject, template: "password_reset", status: "sent" });
  return { sent: true };
}

export async function sendProfilePhoneRequestEmail({ to, name }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const subject = "Ajoutez votre numéro de téléphone à votre compte Tourist Book";
  const hello = name && !name.includes("@") ? `Bonjour ${name},` : "Bonjour,";
  const text = [
    hello,
    "",
    "Votre compte Tourist Book est bien actif et votre adresse email est confirmée.",
    "",
    "Pour que nous puissions vous aider à créer votre premier livret d'accueil (ou vous joindre en cas de besoin), ajoutez votre numéro de téléphone dans votre profil, en 10 secondes :",
    "",
    "https://tourist-book.com/panel/perfil",
    "",
    "Si vous avez des questions, n'hésitez pas à nous écrire : répondez simplement à cet email.",
    "",
    "À très vite,",
    "Fernando — Tourist Book",
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Fernando de Tourist Book <notifications@tourist-book.com>",
    to,
    replyTo: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text,
  });
  if (error) {
    await logEmail({ recipient: to, subject, template: "profile_phone_request", status: "failed", error: error.message });
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }
  await logEmail({ recipient: to, subject, template: "profile_phone_request", status: "sent" });
  return { sent: true };
}

const SITE_URL = "https://tourist-book.com";
const DIGEST_KIND_LABELS = { info: "Info", tache: "Tâche", probleme: "Problème", plainte: "Plainte" };

// Relève du cahier de consignes (6h55, 14h55, 22h55) : les consignes encore
// ouvertes, prioritaires et reportées d'abord. À 6h55, le PDF de la veille
// est joint. Un email par destinataire, chacun journalisé.
export async function sendHotelDigestEmail({ to, hotelName, slotLabel, pending, pdf, cahierPath = "/hotel/cahier" }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const lines = [`Cahier de consignes — ${hotelName}`, `Relève de ${slotLabel}`, ""];
  if (pending.length === 0) {
    lines.push("Aucune consigne en attente.");
  } else {
    lines.push(`${pending.length} consigne${pending.length > 1 ? "s" : ""} en attente :`, "");
    for (const c of pending) {
      const flags = [
        c.priority || c.carried ? "PRIORITAIRE" : null,
        c.carried ? `ouverte depuis ${c.daysOpen} j` : null,
        DIGEST_KIND_LABELS[c.kind],
        c.placeName,
      ].filter(Boolean);
      lines.push(`• [${flags.join(" · ")}]`, `  ${c.body.replace(/\n+/g, " ")}`, "");
    }
  }
  lines.push(`Ouvrir le cahier : ${SITE_URL}${cahierPath}`);
  if (pdf) lines.push("", "Le PDF des consignes d'hier est joint à ce message.");

  const subject = `Cahier de consignes — ${hotelName} — relève de ${slotLabel} : ${pending.length} en attente`;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to,
    replyTo: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: lines.join("\n"),
    ...(pdf ? { attachments: [{ filename: pdf.filename, content: pdf.content }] } : {}),
  });
  if (error) {
    await logEmail({ recipient: to, subject, template: "hotel_digest", status: "failed", error: error.message });
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }
  await logEmail({ recipient: to, subject, template: "hotel_digest", status: "sent" });
  return { sent: true };
}

export async function sendHotelSignupNotification({ hotelName, name, email }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const subject = `Nouvel hôtel inscrit — ${hotelName}`;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: "Tourist Book <notifications@tourist-book.com>",
    to: CONTACT_NOTIFICATION_EMAIL,
    subject,
    text: ["Nouvel hôtel sur le cahier de consignes", "", `Hôtel : ${hotelName}`, `Manager : ${name || "-"}`, `Email : ${email}`].join("\n"),
  });
  if (error) {
    await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "hotel_signup_notification", status: "failed", error: error.message });
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }
  await logEmail({ recipient: CONTACT_NOTIFICATION_EMAIL, subject, template: "hotel_signup_notification", status: "sent" });
  return { sent: true };
}

const LOST_ITEM_COPY = {
  fr: { hi: "Bonjour,", body: (hotel) => `${hotel} a retrouvé un objet qui pourrait vous appartenir :`, cta: "Pour nous dire ce que vous souhaitez en faire (venir le récupérer, demander l'envoi ou le détruire), ouvrez ce lien :" },
  en: { hi: "Hello,", body: (hotel) => `${hotel} found an item that may belong to you:`, cta: "To tell us what you would like to do (collect it, have it shipped, or dispose of it), open this link:" },
  es: { hi: "Hola,", body: (hotel) => `${hotel} ha encontrado un objeto que podría ser suyo:`, cta: "Para indicarnos qué desea hacer (recogerlo, que se lo enviemos o destruirlo), abra este enlace:" },
};

// Email au client : trilingue (l'hôtel ne connaît pas toujours sa langue).
export async function sendLostItemGuestEmail({ to, hotelName, replyTo, description, photoUrl, link }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "not_configured" };

  const parts = Object.values(LOST_ITEM_COPY).map((c) =>
    [c.hi, "", c.body(hotelName), description ? `« ${description} »` : "", photoUrl ? `Photo : ${photoUrl}` : "", "", c.cta, link].filter((l) => l !== "").join("\n"),
  );
  const subject = `${hotelName} — objet trouvé / lost item / objeto encontrado`;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `${hotelName} <notifications@tourist-book.com>`,
    to,
    ...(replyTo ? { replyTo } : {}),
    subject,
    text: parts.join("\n\n———\n\n"),
  });
  if (error) {
    await logEmail({ recipient: to, subject, template: "lost_item_guest", status: "failed", error: error.message });
    throw new Error(`Resend API error: ${error.name} — ${error.message}`);
  }
  await logEmail({ recipient: to, subject, template: "lost_item_guest", status: "sent" });
  return { sent: true };
}

export async function sendLostItemChoiceNotification({ to, hotelName, number, description, choiceLabel, name, address, phone }) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = (to ?? []).filter(Boolean);
  if (!apiKey || recipients.length === 0) return { sent: false, reason: "not_configured" };

  const subject = `Objet trouvé n° ${number} — choix du client : ${choiceLabel}`;
  const lines = [`${hotelName} — objets trouvés`, "", `Objet n° ${number} : ${description || "(sans description)"}`, `Choix du client : ${choiceLabel}`];
  if (name) lines.push(`Nom : ${name}`);
  if (address) lines.push(`Adresse d'envoi : ${address}`);
  if (phone) lines.push(`Téléphone : ${phone}`);
  lines.push("", "https://tourist-book.com/hotel/objets-trouves");

  const resend = new Resend(apiKey);
  for (const recipient of recipients) {
    const { error } = await resend.emails.send({ from: "Tourist Book <notifications@tourist-book.com>", to: recipient, subject, text: lines.join("\n") });
    await logEmail({ recipient, subject, template: "lost_item_choice", status: error ? "failed" : "sent", ...(error ? { error: error.message } : {}) });
  }
  return { sent: true };
}
