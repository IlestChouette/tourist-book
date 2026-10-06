import { createAdminClient } from "@/lib/supabase/admin";
import { addDays, daysBetween, parisDate } from "@/lib/hotelTime";

export const KIND_LABELS = { info: "Info", tache: "Tâche", probleme: "Problème", plainte: "Plainte" };

export async function loadMeta(hotelId) {
  const admin = createAdminClient();
  const [{ data: tags }, { data: places }] = await Promise.all([
    admin.from("hotel_tags").select("id, name, kind").eq("hotel_id", hotelId).order("name"),
    admin.from("hotel_places").select("id, name, kind").eq("hotel_id", hotelId).order("name"),
  ]);
  const naturalSort = (a, b) => a.name.localeCompare(b.name, "fr", { numeric: true });
  // Équipes d'abord, dans l'ordre de la journée (matin, soir, nuit), puis les postes.
  const shiftOrder = ["matin", "soir", "nuit"];
  const rank = (t) => (t.kind === "shift" ? shiftOrder.indexOf(t.name) : t.kind === "role" ? 10 : 20);
  const tagSort = (a, b) => rank(a) - rank(b) || naturalSort(a, b);
  return { tags: (tags ?? []).sort(tagSort), places: (places ?? []).sort(naturalSort) };
}

// Reconstitue la page du cahier pour un jour donné :
//  - les consignes écrites ce jour-là ;
//  - celles des jours précédents qui n'étaient pas encore clôturées (elles
//    "passent au jour suivant" tant que personne ne les valide) ;
//  - les consignes épinglées encore valables ce jour-là.
// Les noms (qui a écrit / clôturé) ne sont donnés qu'au manager.
export async function loadDay(hotelId, day, showNames) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("consignes")
    .select("*")
    .eq("hotel_id", hotelId)
    .lte("day", day)
    .or(`closed_at.is.null,closed_at.gte.${addDays(day, -2)}T00:00:00Z`)
    .order("created_at", { ascending: true });

  const items = [];
  for (const c of data ?? []) {
    const closedDay = c.closed_at ? parisDate(new Date(c.closed_at)) : null;
    const done = closedDay !== null && closedDay <= day;
    const carried = c.day < day;
    if (carried && closedDay !== null && closedDay < day) continue;

    const pinnedToday = c.pinned && (!c.pinned_until || parisDate(new Date(c.pinned_until)) >= day);

    items.push({
      id: c.id,
      day: c.day,
      body: c.body,
      kind: c.kind,
      placeName: c.place_name,
      tagIds: c.tag_ids,
      priority: c.priority,
      createdAt: c.created_at,
      done,
      // Une consigne épinglée reste affichée par choix, ce n'est pas un retard.
      carried: carried && !done && !pinnedToday,
      daysOpen: carried && !done && !pinnedToday ? daysBetween(c.day, day) : 0,
      pinned: pinnedToday,
      pinnedUntil: c.pinned_until,
      closedAt: done ? c.closed_at : null,
      ...(showNames ? { createdByName: c.created_by_name, closedByName: done ? c.closed_by_name : null } : {}),
    });
  }
  return items;
}

// Consignes ouvertes à ce jour (pour les emails de relève) : prioritaires et
// reportées d'abord.
export async function loadPending(hotelId, today) {
  const items = await loadDay(hotelId, today, false);
  return items
    .filter((i) => !i.done)
    .sort((a, b) => Number(b.priority || b.carried) - Number(a.priority || a.carried) || a.createdAt.localeCompare(b.createdAt));
}
