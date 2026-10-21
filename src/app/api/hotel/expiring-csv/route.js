import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { csvResponse } from "@/lib/csv";
import { overviewConsignes } from "@/lib/hotelData";
import { addDays, addMonths, parisDate } from "@/lib/hotelTime";
import { cleanCustomTypes } from "@/lib/hotelTheme";
import { OVERVIEW_CSV_HEAD, overviewCsvRows } from "@/lib/overviewCsv";
import { verifyExpiringExport } from "@/lib/unsubscribe";

// Les consignes qui seront supprimées (dans les 3 mois ; toutes si l'abonnement est terminé), pour Excel. On y arrive par le
// lien signé de l'email de rappel (valable 30 jours), sans connexion.
export async function GET(request) {
  const sp = new URL(request.url).searchParams;
  const hotelId = sp.get("h") ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(hotelId) || !verifyExpiringExport(hotelId, sp.get("x"), sp.get("t"), sp.get("a") === "1")) {
    return NextResponse.json({ error: "Lien invalide ou expiré. Téléchargez l'export depuis Suivi, dans votre espace." }, { status: 403 });
  }
  const { data: hotel } = await createAdminClient().from("hotels").select("consigne_types, retention_months").eq("id", hotelId).maybeSingle();
  if (!hotel) return NextResponse.json({ error: "Hôtel introuvable." }, { status: 404 });

  const warnBefore = addMonths(parisDate(), -((hotel.retention_months ?? 36) - 3));
  const customTypes = cleanCustomTypes(hotel.consigne_types);
  const everything = sp.get("a") === "1";
  const { all } = await overviewConsignes(hotelId, { ...(everything ? {} : { to: addDays(warnBefore, -1) }), customTypes });
  return csvResponse(OVERVIEW_CSV_HEAD, overviewCsvRows(all, customTypes), everything ? "consignes-cahier.csv" : "consignes-bientot-supprimees.csv");
}
