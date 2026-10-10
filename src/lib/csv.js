import { NextResponse } from "next/server";

// Les exports s'ouvrent dans Excel : en France (et en Espagne, Allemagne…)
// Excel attend des points-virgules, sinon tout tombe dans une seule colonne.
// Le BOM garde les accents lisibles.
const DELIM = ";";

export function csvCell(value) {
  let s = String(value ?? "");
  // Un champ qui commence par = + - @ serait interprété comme une formule.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function csvResponse(head, rows, filename) {
  const lines = [head, ...rows].map((r) => r.map(csvCell).join(DELIM));
  return new NextResponse(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
