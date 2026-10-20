import { createAdminClient } from "@/lib/supabase/admin";
import { addDays, daysBetween, parisDate } from "@/lib/hotelTime";
import { normalize, searchTerms } from "@/lib/hotelSearch";
import { typeOf } from "@/lib/hotelTheme";

export const isUuid = (v) => typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

// Services actifs d'un hôtel (vide si la table n'existe pas encore).
export async function listServices(hotelId) {
  const { data } = await createAdminClient()
    .from("hotel_services")
    .select("id, key, name, color, position, active")
    .eq("hotel_id", hotelId)
    .eq("active", true)
    .order("position", { ascending: true });
  return data ?? [];
}

// Ce qu'un service a écrit pour d'autres services, avec l'état chez eux :
// encore ouvert ou fait. Ouvert d'abord, puis le fait récent (2 jours).
export async function loadSent(hotelId, fromServiceId, day) {
  if (!isUuid(fromServiceId)) return [];
  const admin = createAdminClient();
  const [{ data }, services] = await Promise.all([
    admin
      .from("consignes")
      .select("id, day, body, kind, type_id, place_name, service_id, created_at, closed_at, closed_by_name")
      .eq("hotel_id", hotelId)
      .eq("from_service_id", fromServiceId)
      .neq("service_id", fromServiceId)
      .not("service_id", "is", null)
      .lte("day", day)
      .or(`closed_at.is.null,closed_at.gte.${addDays(day, -2)}T00:00:00Z`)
      .order("created_at", { ascending: false })
      .limit(60),
    listServices(hotelId),
  ]);
  const name = Object.fromEntries(services.map((s) => [s.id, s.name]));
  return (data ?? []).map((c) => ({
    id: c.id,
    day: c.day,
    body: c.body,
    kind: c.kind,
    typeId: c.type_id ?? null,
    placeName: c.place_name,
    createdAt: c.created_at,
    toServiceId: c.service_id,
    toServiceName: name[c.service_id] ?? "Service",
    done: Boolean(c.closed_at),
    closedAt: c.closed_at,
    closedByName: c.closed_by_name ?? null,
  }));
}

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
export async function loadDay(hotelId, day, showNames, scope = {}) {
  const admin = createAdminClient();
  let query = admin
    .from("consignes")
    .select("*")
    .eq("hotel_id", hotelId)
    .lte("day", day)
    .or(`closed_at.is.null,closed_at.gte.${addDays(day, -2)}T00:00:00Z`);
  // Cahier d'un service : ses consignes, plus les anciennes consignes sans
  // service (visibles de tous les services jusqu'à leur clôture).
  if (isUuid(scope.serviceId)) query = query.or(`service_id.eq.${scope.serviceId},service_id.is.null`);
  const { data } = await query.order("created_at", { ascending: true });

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
      typeId: c.type_id ?? null,
      serviceId: c.service_id ?? null,
      fromServiceId: c.from_service_id ?? null,
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

// Recherche par mots-clés dans toutes les consignes conservées (les plus
// récentes d'abord) : « colis 405 » trouve ce qui parle de colis ET de la 405.
// Les noms (qui a écrit / clôturé) ne sont donnés qu'au manager.
const SEARCH_SCAN_LIMIT = 5000;
const SEARCH_RESULT_LIMIT = 40;

export async function searchConsignes(hotelId, query, { showNames, customTypes, serviceId }) {
  const terms = searchTerms(query);
  if (terms.length === 0) return { items: [], total: 0 };

  const admin = createAdminClient();
  let scan = admin.from("consignes").select("*").eq("hotel_id", hotelId);
  // Un service retrouve ce qui lui est adressé et ce qu'il a lui-même envoyé.
  if (isUuid(serviceId)) scan = scan.or(`service_id.eq.${serviceId},service_id.is.null,from_service_id.eq.${serviceId}`);
  const [{ data }, meta] = await Promise.all([
    scan.order("day", { ascending: false }).order("created_at", { ascending: false }).limit(SEARCH_SCAN_LIMIT),
    loadMeta(hotelId),
  ]);
  const tagName = Object.fromEntries(meta.tags.map((t) => [t.id, t.name]));

  const found = (data ?? []).filter((c) => {
    const haystack = normalize(
      [c.body, c.place_name, (c.tag_ids ?? []).map((id) => tagName[id]).join(" "), typeOf(customTypes, c.kind, c.type_id).short].join(" ")
    );
    return terms.every((t) => haystack.includes(t));
  });

  const items = found.slice(0, SEARCH_RESULT_LIMIT).map((c) => ({
    id: c.id,
    day: c.day,
    body: c.body,
    kind: c.kind,
    typeId: c.type_id ?? null,
    placeName: c.place_name,
    tagIds: c.tag_ids ?? [],
    createdAt: c.created_at,
    done: Boolean(c.closed_at),
    closedAt: c.closed_at,
    ...(showNames ? { createdByName: c.created_by_name, closedByName: c.closed_by_name } : {}),
  }));
  return { items, total: found.length };
}
