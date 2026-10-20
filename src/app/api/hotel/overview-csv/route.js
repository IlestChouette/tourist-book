import { NextResponse } from "next/server";
import { csvResponse } from "@/lib/csv";
import { getHotelContext } from "@/lib/hotelAuth";
import { overviewConsignes } from "@/lib/hotelData";
import { cleanCustomTypes, typeOf } from "@/lib/hotelTheme";

const dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" });
const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

// Export (Excel) du suivi, avec les mêmes filtres que l'écran.
export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const sp = new URL(request.url).searchParams;
  const customTypes = cleanCustomTypes(ctx.hotel.consigne_types);
  const { all } = await overviewConsignes(ctx.hotel.id, {
    q: (sp.get("q") ?? "").slice(0, 100),
    serviceId: sp.get("service") ?? undefined,
    status: ["open", "done"].includes(sp.get("status")) ? sp.get("status") : "all",
    from: sp.get("from") ?? undefined,
    to: sp.get("to") ?? undefined,
    customTypes,
  });

  const head = ["Date", "Heure", "Type", "Chambre ou lieu", "De (service)", "Vers (service)", "Consigne", "Statut", "Écrite par", "Terminée le", "Terminée par", "Ont validé", "Manquent"];
  const rows = all.map((c) => [
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
  return csvResponse(head, rows, "suivi-consignes.csv");
}
