import { typeOf } from "@/lib/hotelTheme";

const dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" });
const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

export const OVERVIEW_CSV_HEAD = ["Date", "Heure", "Type", "Chambre ou lieu", "De (service)", "Vers (service)", "Consigne", "Statut", "Écrite par", "Terminée le", "Terminée par", "Ont validé", "Manquent"];

// Lignes de l'export Excel du suivi (utilisées par l'export du manager et par le lien
// de téléchargement des consignes bientôt supprimées).
export function overviewCsvRows(all, customTypes) {
  return all.map((c) => [
    c.day,
    timeFmt.format(new Date(c.createdAt)),
    typeOf(customTypes, c.kind, c.typeId).short,
    c.placeName,
    c.fromServiceName ?? "",
    c.toServiceName ?? "",
    c.body,
    c.done ? "Faite" : "À faire",
    c.createdByName ?? "",
    c.closedAt ? `${dateFmt.format(new Date(c.closedAt))} ${timeFmt.format(new Date(c.closedAt))}` : "",
    c.closedByName ?? "",
    (c.ack?.ackNames ?? []).join(" / "),
    (c.ack?.missingNames ?? []).join(" / "),
  ]);
}
