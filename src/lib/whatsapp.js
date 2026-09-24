const GRAPH_API_VERSION = "v21.0";

// Envoie automatiquement chaque demande de transfert par WhatsApp aux
// partenaires transport, via l'API WhatsApp Business (Meta Cloud API), depuis
// le numéro Il est chouette en mode "coexistence" (le même numéro reste
// utilisable dans l'app WhatsApp Business). Un message initié par
// l'entreprise doit passer par un modèle ("template") approuvé par Meta.
// Modèle à soumettre (catégorie Utilité, langue fr, nom
// "nouvelle_demande_transfert") — l'ordre des {{n}} doit rester celui de
// `params` plus bas :
//
//   Nouvelle demande de transfert
//   Logement : {{1}}
//   Date : {{2}} à {{3}}
//   Prise en charge : {{4}}
//   Passagers : {{5}}
//   Bagages : {{6}}
//   N° de vol : {{7}}
//   Voyageur : {{8}} — {{9}}
//   Tarif : {{10}}
//   Remarques : {{11}}
//
// WHATSAPP_TRANSPORT_NUMBERS : numéros destinataires au format international
// sans "+", séparés par des virgules (ex. "33612345678,33698765432").
// Tant que les variables ne sont pas configurées, la fonction ne fait rien :
// la demande reste enregistrée et l'email part normalement.

// Meta refuse les paramètres vides, avec retours à la ligne, tabulations ou
// plus de 4 espaces consécutifs.
function param(value) {
  const text = String(value ?? "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/ {2,}/g, " ")
    .trim();
  return text || "-";
}

export async function sendTransferWhatsApp({ propertyLabel, nom, telephone, details }) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipients = (process.env.WHATSAPP_TRANSPORT_NUMBERS || "")
    .split(",")
    .map((n) => n.replace(/[^\d]/g, ""))
    .filter(Boolean);
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "nouvelle_demande_transfert";

  if (!token || !phoneNumberId || recipients.length === 0) {
    return { sent: false, reason: "not_configured" };
  }

  const d = details || {};
  const bagages =
    d.bagagesGrands || d.bagagesPetits ? `${d.bagagesGrands ?? 0} grand(s), ${d.bagagesPetits ?? 0} petit(s)` : "-";
  const prix = Number.isFinite(Number(d.prixEstime)) && d.prixEstime != null
    ? `${Number(d.prixEstime).toFixed(2)} €`
    : "Sur demande";

  // L'ordre doit correspondre exactement aux {{1}}…{{11}} du modèle Meta.
  const params = [
    propertyLabel,
    d.date,
    d.heure,
    d.lieu,
    d.passagers,
    bagages,
    d.vol,
    nom,
    telephone,
    prix,
    d.remarques,
  ].map(param);

  const results = await Promise.allSettled(
    recipients.map(async (to) => {
      const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName,
            language: { code: "fr" },
            components: [{ type: "body", parameters: params.map((text) => ({ type: "text", text })) }],
          },
        }),
      });
      if (!res.ok) throw new Error(`WhatsApp API error ${res.status} (${to}): ${await res.text()}`);
    })
  );

  const failures = results.filter((r) => r.status === "rejected").map((r) => r.reason.message);
  if (failures.length > 0) console.error("sendTransferWhatsApp partial failure:", failures);

  return { sent: failures.length < recipients.length, failures };
}
