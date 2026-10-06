import { NextResponse } from "next/server";
import { getHotelContext } from "@/lib/hotelAuth";
import { loadMeta } from "@/lib/hotelData";
import { filterRows, parseStatsParams } from "@/lib/hotelStats";
import { parisDate } from "@/lib/hotelTime";

// Export CSV des consignes de la période et des filtres choisis (même lecture
// que la page Statistiques). Réservé au manager.
const cell = (v) => {
  let s = String(v ?? "");
  // Un champ qui commence par = + - @ serait interprété comme formule par Excel.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const f = parseStatsParams({ ...sp, compare: "0" }, parisDate());
  const [{ data }, meta] = await Promise.all([
    ctx.admin
      .from("consignes")
      .select("day, kind, body, place_name, tag_ids, priority, created_by_name, created_at, closed_at, closed_by_name")
      .eq("hotel_id", ctx.hotel.id)
      .gte("day", f.from)
      .lte("day", f.to)
      .order("created_at", { ascending: true })
      .limit(20000),
    loadMeta(ctx.hotel.id),
  ]);
  const tagName = Object.fromEntries(meta.tags.map((t) => [t.id, t.name]));
  const rows = filterRows(data ?? [], f, meta.tags);
  const head = ["Jour", "Type", "Chambre / lieu", "Consigne", "Étiquettes", "Prioritaire", "Écrite par", "Écrite le", "Clôturée le", "Clôturée par"];
  const lines = rows.map((c) =>
    [c.day, c.kind, c.place_name, c.body, c.tag_ids.map((id) => tagName[id]).filter(Boolean).join(" / "), c.priority ? "oui" : "non", c.created_by_name, c.created_at, c.closed_at ?? "", c.closed_by_name ?? ""].map(cell).join(","),
  );
  const csv = `﻿${[head.map(cell).join(","), ...lines].join("\r\n")}\r\n`;
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="consignes-${f.from}_${f.to}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
