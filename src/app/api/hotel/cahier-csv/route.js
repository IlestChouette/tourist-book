import { NextResponse } from "next/server";
import { csvResponse } from "@/lib/csv";
import { getHotelContext } from "@/lib/hotelAuth";
import { KIND_LABELS, loadDay, loadMeta } from "@/lib/hotelData";
import { isDay, parisDate } from "@/lib/hotelTime";

const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

// La journée du cahier en tableau (Excel) : les mêmes consignes que l'écran.
// Les noms n'y figurent que pour le manager, comme dans le PDF.
export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const day = new URL(request.url).searchParams.get("day") || parisDate();
  if (!isDay(day)) return NextResponse.json({ error: "Date invalide" }, { status: 400 });

  const withNames = ctx.mode === "manager";
  const [items, meta] = await Promise.all([loadDay(ctx.hotel.id, day, withNames), loadMeta(ctx.hotel.id)]);
  const tagName = Object.fromEntries(meta.tags.map((t) => [t.id, t.name]));

  const head = ["Date de la consigne", "Heure", "Type", "Chambre ou lieu", "Consigne", "Équipes / postes", "Urgente", "Statut", "Ouverte depuis (jours)", "Épinglée", "Clôturée à"];
  if (withNames) head.push("Écrite par", "Clôturée par");
  const rows = items.map((c) => {
    const row = [
      c.day,
      timeFmt.format(new Date(c.createdAt)),
      KIND_LABELS[c.kind],
      c.placeName,
      c.body,
      c.tagIds.map((id) => tagName[id]).filter(Boolean).join(" / "),
      c.priority || c.carried ? "Oui" : "Non",
      c.done ? "Faite" : "À faire",
      c.carried ? c.daysOpen : "",
      c.pinned ? "Oui" : "Non",
      c.closedAt ? timeFmt.format(new Date(c.closedAt)) : "",
    ];
    if (withNames) row.push(c.createdByName ?? "", c.closedByName ?? "");
    return row;
  });
  return csvResponse(head, rows, `cahier-${day}.csv`);
}
