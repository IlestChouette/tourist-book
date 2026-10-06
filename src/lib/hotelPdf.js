import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { KIND_LABELS } from "@/lib/hotelData";
import { formatDayLong } from "@/lib/hotelTime";

// Les polices PDF standard ne couvrent que le latin de base : tout autre
// caractère (emoji, flèches…) devient "?" plutôt que de faire échouer le PDF.
const EXTRA = "’‘“”–—€…•";
const safe = (text) => [...String(text)].map((ch) => (ch.charCodeAt(0) <= 255 || EXTRA.includes(ch) ? ch : "?")).join("");

const PAGE = { w: 595, h: 842, margin: 44 };

function wrap(font, text, size, maxWidth) {
  const lines = [];
  for (const paragraph of safe(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

// PDF d'une journée du cahier : mêmes consignes que l'écran, prêtes à
// imprimer ou à archiver (consignes-AAAA-MM-JJ.pdf).
export async function buildDayPdf({ hotelName, day, items, tagNames, withNames }) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const width = PAGE.w - PAGE.margin * 2;
  let page = pdf.addPage([PAGE.w, PAGE.h]);
  let y = PAGE.h - PAGE.margin;

  const ensure = (needed) => {
    if (y - needed < PAGE.margin) {
      page = pdf.addPage([PAGE.w, PAGE.h]);
      y = PAGE.h - PAGE.margin;
    }
  };
  const write = (text, { size = 10, f = font, color = rgb(0.13, 0.2, 0.22), indent = 0, gap = 3 } = {}) => {
    for (const line of wrap(f, text, size, width - indent)) {
      ensure(size + gap);
      page.drawText(line, { x: PAGE.margin + indent, y: y - size, size, font: f, color });
      y -= size + gap;
    }
  };

  write(`${hotelName} — Cahier de consignes`, { size: 16, f: bold });
  write(formatDayLong(day), { size: 11 });
  y -= 10;

  const sections = [
    ["Épinglées", items.filter((i) => i.pinned)],
    ["À faire", items.filter((i) => !i.pinned && !i.done)],
    ["Faites", items.filter((i) => !i.pinned && i.done)],
  ];
  for (const [title, list] of sections) {
    if (list.length === 0) continue;
    ensure(40);
    write(`${title} (${list.length})`, { size: 12, f: bold });
    y -= 2;
    for (const c of list) {
      const flags = [
        c.done ? "[x]" : "[ ]",
        c.priority || c.carried ? "PRIORITAIRE" : null,
        c.carried ? `reportée depuis ${c.daysOpen} j` : null,
        KIND_LABELS[c.kind],
        c.placeName,
      ].filter(Boolean);
      write(flags.join("  ·  "), { size: 9, f: bold });
      write(c.body, { size: 10, indent: 14 });
      const tags = (c.tagIds ?? []).map((id) => tagNames[id]).filter(Boolean);
      const meta = [
        tags.length ? `Étiquettes : ${tags.join(", ")}` : null,
        withNames && c.createdByName ? `Écrite par ${c.createdByName}` : null,
        withNames && c.closedByName ? `Clôturée par ${c.closedByName}` : null,
      ].filter(Boolean);
      if (meta.length) write(meta.join("  ·  "), { size: 8, indent: 14, color: rgb(0.4, 0.45, 0.47) });
      y -= 6;
    }
    y -= 6;
  }
  if (items.length === 0) write("Aucune consigne ce jour-là.");

  return Buffer.from(await pdf.save());
}
