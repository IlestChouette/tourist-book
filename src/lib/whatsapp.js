const GRAPH_API_VERSION = "v21.0";

// Envoie une notification WhatsApp automatique à l'entreprise de transport
// partenaire dès qu'un voyageur demande un transfert, via l'API WhatsApp
// Business Platform (Meta Cloud API). Nécessite un compte Meta Business
// vérifié, un numéro WhatsApp Business dédié et un modèle de message
// ("message template") approuvé par Meta — voir la documentation du projet.
// Tant que les variables d'environnement ne sont pas configurées, cette
// fonction ne fait rien : la demande reste enregistrée normalement, seul
// l'envoi automatique est désactivé.
export async function sendTransferRequestWhatsApp(req) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const transportNumber = process.env.WHATSAPP_TRANSPORT_NUMBER;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "nouvelle_demande_transfert";

  if (!token || !phoneNumberId || !transportNumber) {
    return { sent: false, reason: "not_configured" };
  }

  const d = req.details || {};
  const params = [
    req.propertyName || "-",
    d.date || "-",
    d.heure || "-",
    d.lieu || "-",
    String(d.passagers ?? "-"),
    req.nom || "-",
    req.telephone || "-",
  ];

  const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: transportNumber,
      type: "template",
      template: {
        name: templateName,
        language: { code: "fr" },
        components: [
          {
            type: "body",
            parameters: params.map((text) => ({ type: "text", text })),
          },
        ],
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`WhatsApp API error ${res.status}: ${errText}`);
  }

  return { sent: true };
}
