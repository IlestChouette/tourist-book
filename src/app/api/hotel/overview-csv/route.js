import { NextResponse } from "next/server";
import { csvResponse } from "@/lib/csv";
import { getHotelContext } from "@/lib/hotelAuth";
import { overviewConsignes } from "@/lib/hotelData";
import { cleanCustomTypes } from "@/lib/hotelTheme";
import { OVERVIEW_CSV_HEAD, overviewCsvRows } from "@/lib/overviewCsv";

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

  return csvResponse(OVERVIEW_CSV_HEAD, overviewCsvRows(all, customTypes), "suivi-consignes.csv");
}
