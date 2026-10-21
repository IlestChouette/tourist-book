import crypto from "crypto";

const SITE_URL = "https://tourist-book.com";

// Lien de désabonnement signé : il ne peut être fabriqué que par le serveur, donc
// personne ne peut retirer l'adresse d'un autre. kind = "host" (rappels aux hôtes)
// ou "digest" (relève du cahier : retire l'adresse de la liste de l'hôtel).
const sign = (kind, id, email) =>
  crypto.createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY).update(`unsub:${kind}:${id}:${email ?? ""}`).digest("hex");

export function unsubscribeUrl(kind, id, email) {
  const q = new URLSearchParams({ k: kind, i: id, t: sign(kind, id, email) });
  if (email) q.set("e", email);
  return `${SITE_URL}/api/unsubscribe?${q}`;
}

export function verifyUnsubscribe(kind, id, email, token) {
  if (!/^[0-9a-f]{64}$/.test(token ?? "")) return false;
  const good = Buffer.from(sign(kind, id, email), "hex");
  const given = Buffer.from(token, "hex");
  return good.length === given.length && crypto.timingSafeEqual(good, given);
}

// En-têtes de désabonnement en un clic (RFC 8058) pour Gmail, Apple Mail, etc.
export const unsubscribeHeaders = (url) => ({ "List-Unsubscribe": `<${url}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" });

// Lien de téléchargement (30 jours) des consignes bientôt supprimées : signé, lié à
// l'hôtel et à une date limite. Le fichier est calculé au moment du clic.
const EXPORT_DAYS = 30;
// all = toutes les consignes (hôtel dont l'abonnement est terminé), sinon seulement
// celles qui seront supprimées dans les 3 mois.
const exportSig = (hotelId, exp, all) => crypto.createHmac("sha256", process.env.SUPABASE_SERVICE_ROLE_KEY).update(`export:${hotelId}:${exp}:${all ? "all" : "soon"}`).digest("hex");

export function expiringExportUrl(hotelId, { all = false } = {}) {
  const exp = Date.now() + EXPORT_DAYS * 86400000;
  const q = new URLSearchParams({ h: hotelId, x: String(exp), t: exportSig(hotelId, exp, all) });
  if (all) q.set("a", "1");
  return `${SITE_URL}/api/hotel/expiring-csv?${q}`;
}

export function verifyExpiringExport(hotelId, exp, token, all = false) {
  if (!/^\d+$/.test(exp ?? "") || Number(exp) < Date.now() || !/^[0-9a-f]{64}$/.test(token ?? "")) return false;
  const good = Buffer.from(exportSig(hotelId, exp, all), "hex");
  const given = Buffer.from(token, "hex");
  return good.length === given.length && crypto.timingSafeEqual(good, given);
}
