import { NextResponse } from "next/server";
import { csvResponse } from "@/lib/csv";
import { getHotelContext } from "@/lib/hotelAuth";
import { KIND_LABELS, loadMeta } from "@/lib/hotelData";
import { computeStats, parseStatsParams } from "@/lib/hotelStats";
import { parisDate } from "@/lib/hotelTime";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const hours = (h) => (h === null || h === undefined ? "" : Math.round(h * 10) / 10);
const rounded = (v) => (v === null || v === undefined ? "" : Math.round(v * 10) / 10);

// Le résumé de la page Statistiques en tableau : une ligne par chiffre, avec la
// période précédente si la comparaison est active. Même calcul que l'écran.
export async function GET(request) {
  const ctx = await getHotelContext();
  if (!ctx || ctx.mode !== "manager") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const sp = Object.fromEntries(new URL(request.url).searchParams);
  const f = parseStatsParams(sp, parisDate());
  const [{ data }, meta] = await Promise.all([
    ctx.admin
      .from("consignes")
      .select("id, day, kind, body, place_name, tag_ids, priority, created_at, closed_at")
      .eq("hotel_id", ctx.hotel.id)
      .gte("day", f.compare ? f.prevFrom : f.from)
      .lte("day", f.to)
      .limit(20000),
    loadMeta(ctx.hotel.id),
  ]);
  const s = computeStats(data ?? [], f, meta.tags);
  const cur = s.current;
  const prev = s.previous;

  const head = ["Rubrique", "Élément", "Valeur", ...(f.compare ? ["Période précédente"] : [])];
  const rows = [];
  const add = (section, label, value, before) => rows.push([section, label, value, ...(f.compare ? [before ?? ""] : [])]);

  add("Période", "Du", f.from);
  add("Période", "Au", f.to);
  add("Chiffres clés", "Consignes écrites", cur.written, prev?.written);
  add("Chiffres clés", "Taux de clôture (%)", rounded(cur.closeRate), rounded(prev?.closeRate));
  add("Chiffres clés", "Délai moyen de clôture (heures)", hours(cur.avgHours), hours(prev?.avgHours));
  add("Chiffres clés", "Pas encore clôturées", cur.open, prev?.open);
  add("Chiffres clés", "Problèmes et plaintes", cur.issues, prev?.issues);
  add("Chiffres clés", "Urgentes", cur.priority, prev?.priority);
  add("Chiffres clés", "Chambres ou lieux concernés", s.placesCount);
  for (const r of s.byKind) add("Par type", KIND_LABELS[r.label] ?? r.label, r.value);
  for (const r of s.topPlaces) add("Chambres et lieux les plus touchés", r.label, r.value);
  for (const r of s.byService) add("Par service", r.label, r.value);
  for (const r of s.shiftLeft) add("Laissées en suspens, par équipe", r.label, r.value);
  for (const r of s.closeDist) add("Délai de clôture (nombre de consignes)", r.label, r.value);
  for (const r of s.closeByService) add("Délai moyen par service (heures)", r.label, hours(r.hours));
  DAYS.forEach((d, i) => add("Par jour de la semaine", d, s.weekday[i]));
  s.byHour.forEach((v, h) => add("Par heure d'écriture", `${h} h`, v));
  for (const r of s.recurring) add("Problèmes récurrents (nombre de problèmes et plaintes)", r.place, r.count);
  for (const b of s.buckets) add("Évolution : écrites", b.key, b.written, b.prev);
  for (const b of s.buckets) add("Évolution : clôturées", b.key, b.closed);

  return csvResponse(head, rows, `resume-statistiques-${f.from}_${f.to}.csv`);
}
