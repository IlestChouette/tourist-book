import { NextResponse } from "next/server";
import { csvResponse } from "@/lib/csv";
import { getHotelContext } from "@/lib/hotelAuth";
import { KIND_LABELS, loadMeta } from "@/lib/hotelData";
import { filterRows, parseStatsParams, selectDetail } from "@/lib/hotelStats";
import { parisDate } from "@/lib/hotelTime";

const dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" });
const timeFmt = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

// Export (Excel) des consignes de la période et des filtres choisis, comme la
// page Statistiques. Avec `detail`, seulement la sélection ouverte à l'écran
// (une chambre, un service…). Réservé au manager.
export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const f = parseStatsParams({ ...sp, compare: "0" }, parisDate());
  const [{ data }, meta] = await Promise.all([
    ctx.admin
      .from("consignes")
      .select("id, day, kind, body, place_name, tag_ids, priority, created_by_name, created_at, closed_at, closed_by_name")
      .eq("hotel_id", ctx.hotel.id)
      .gte("day", f.from)
      .lte("day", f.to)
      .order("created_at", { ascending: true })
      .limit(20000),
    loadMeta(ctx.hotel.id),
  ]);
  const tagName = Object.fromEntries(meta.tags.map((t) => [t.id, t.name]));
  const picked = selectDetail(data ?? [], f, meta.tags);
  const rows = picked ? picked.list : filterRows(data ?? [], f, meta.tags);

  const head = ["Date", "Heure", "Type", "Chambre ou lieu", "Consigne", "Équipes / postes", "Urgente", "Statut", "Écrite par", "Clôturée le", "Clôturée à", "Clôturée par"];
  const lines = rows.map((c) => [
    c.day,
    timeFmt.format(new Date(c.created_at)),
    KIND_LABELS[c.kind],
    c.place_name,
    c.body,
    c.tag_ids.map((id) => tagName[id]).filter(Boolean).join(" / "),
    c.priority ? "Oui" : "Non",
    c.closed_at ? "Faite" : "À faire",
    c.created_by_name,
    c.closed_at ? dateFmt.format(new Date(c.closed_at)) : "",
    c.closed_at ? timeFmt.format(new Date(c.closed_at)) : "",
    c.closed_by_name ?? "",
  ]);
  return csvResponse(head, lines, `consignes-${f.from}_${f.to}.csv`);
}
