import { NextResponse } from "next/server";
import { CHOICE_LABELS, ITEM_COLUMNS, STATUSES } from "@/lib/lostFound";
import { getLostFoundContext } from "@/lib/lostFoundServer";

const cell = (v) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // pas de formule dans Excel
  return `"${s.replace(/"/g, '""')}"`;
};

// Export du registre en CSV (ouvre dans Excel) : la même chose que leur
// ancien fichier, mais généré à la demande, toujours à jour.
export async function GET() {
  const ctx = await getLostFoundContext();
  if (!ctx) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { data } = await ctx.admin.from("lost_items").select(ITEM_COLUMNS).eq("hotel_id", ctx.hotel.id).order("found_at", { ascending: false }).limit(20000);
  const head = ["N°", "Date", "Chambre", "Objet", "Catégorie", "Rangé à", "Statut", "Client", "Email client", "Choix du client", "Notes", "Clôturé le"];
  const lines = (data ?? []).map((i) =>
    [i.number, i.found_at, i.room_text, i.description, i.category, i.storage_location, STATUSES[i.status], i.guest_name, i.guest_email, CHOICE_LABELS[i.guest_choice] ?? "", i.notes, i.closed_at ?? ""].map(cell).join(","),
  );
  return new NextResponse(`﻿${[head.map(cell).join(","), ...lines].join("\r\n")}\r\n`, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="objets-trouves.csv"', "Cache-Control": "private, no-store" },
  });
}
