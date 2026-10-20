import { createAdminClient } from "@/lib/supabase/admin";
import { addDays, daysBetween, isDay, parisDate } from "@/lib/hotelTime";
import { normalize, searchTerms } from "@/lib/hotelSearch";
import { typeOf } from "@/lib/hotelTheme";

export const isUuid = (v) => typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

// Validation par tous : pour les consignes « à valider par chaque personne »,
// qui doit valider (personnes actives rattachées au service, hors manager) et
// qui l'a fait. Renvoie une Map id → { expected, acked, ackNames, missingNames, complete, lastAt }.
export async function ackProgress(admin, hotelId, rows) {
  const wanted = (rows ?? []).filter((r) => r.require_all);
  if (wanted.length === 0) return new Map();
  const [{ data: acks }, { data: staff }] = await Promise.all([
    admin.from("consigne_acks").select("consigne_id, staff_id, created_at").in("consigne_id", wanted.map((r) => r.id)),
    admin.from("hotel_staff").select("id, name, service_ids").eq("hotel_id", hotelId).eq("active", true).eq("is_manager", false),
  ]);
  const out = new Map();
  for (const r of wanted) {
    const expected = (staff ?? []).filter((s) => (s.service_ids ?? []).includes(r.service_id));
    const done = new Map((acks ?? []).filter((a) => a.consigne_id === r.id).map((a) => [a.staff_id, a.created_at]));
    const acked = expected.filter((s) => done.has(s.id));
    const missing = expected.filter((s) => !done.has(s.id));
    out.set(r.id, {
      expected: expected.length,
      acked: acked.length,
      ackNames: acked.map((s) => s.name),
      missingNames: missing.map((s) => s.name),
      complete: expected.length > 0 && missing.length === 0,
      lastAt: acked.map((s) => done.get(s.id)).sort().pop() ?? null,
    });
  }
  return out;
}

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
      .select("id, day, body, kind, type_id, place_name, service_id, created_at, closed_at, closed_by_name, require_all")
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
  const progress = await ackProgress(admin, hotelId, data ?? []);
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
    done: Boolean(c.closed_at) || Boolean(c.require_all && progress.get(c.id)?.complete),
    closedAt: c.closed_at ?? progress.get(c.id)?.lastAt ?? null,
    closedByName: c.closed_by_name ?? null,
    requireAll: Boolean(c.require_all),
    ack: progress.get(c.id) ? { expected: progress.get(c.id).expected, acked: progress.get(c.id).acked, missingNames: progress.get(c.id).missingNames } : null,
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
  const progress = await ackProgress(admin, hotelId, data ?? []);

  const items = [];
  for (const c of data ?? []) {
    const closedDay = c.closed_at ? parisDate(new Date(c.closed_at)) : null;
    const pr = progress.get(c.id);
    // « À valider par tous » : terminée dès que la dernière personne a validé.
    const done = (closedDay !== null && closedDay <= day) || Boolean(c.require_all && !c.closed_at && pr?.complete);
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
      closedAt: done ? c.closed_at ?? pr?.lastAt ?? null : null,
      requireAll: Boolean(c.require_all),
      ack: pr ? { expected: pr.expected, acked: pr.acked, ...(showNames ? { ackNames: pr.ackNames, missingNames: pr.missingNames } : {}) } : null,
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

// Suivi du manager : toutes les consignes de tous les services, avec qui les a
// écrites, pour qui, si elles sont faites et par qui (ou, pour une consigne à
// valider par tous, qui a validé et qui manque). Filtres : mots-clés (sans
// accents, tous les mots), service (écrit ou reçu par), état, période.
const OVERVIEW_SCAN_LIMIT = 5000;

export async function overviewConsignes(hotelId, { q = "", serviceId, status = "all", from, to, limit = 40, offset = 0, customTypes } = {}) {
  const terms = searchTerms(q);
  const admin = createAdminClient();
  let query = admin.from("consignes").select("*").eq("hotel_id", hotelId);
  if (isDay(from)) query = query.gte("day", from);
  if (isDay(to)) query = query.lte("day", to);
  if (isUuid(serviceId)) query = query.or(`service_id.eq.${serviceId},from_service_id.eq.${serviceId}`);
  if (status === "open") query = query.is("closed_at", null);
  if (status === "done") query = query.not("closed_at", "is", null);
  const [{ data }, services] = await Promise.all([
    query.order("day", { ascending: false }).order("created_at", { ascending: false }).limit(OVERVIEW_SCAN_LIMIT),
    listServices(hotelId),
  ]);
  const name = Object.fromEntries(services.map((s) => [s.id, s.name]));
  const progress = await ackProgress(admin, hotelId, data ?? []);

  let items = (data ?? []).map((c) => {
    const pr = progress.get(c.id);
    const done = Boolean(c.closed_at) || Boolean(c.require_all && pr?.complete);
    return {
      id: c.id,
      day: c.day,
      body: c.body,
      kind: c.kind,
      typeId: c.type_id ?? null,
      placeName: c.place_name,
      priority: Boolean(c.priority),
      createdAt: c.created_at,
      createdByName: c.created_by_name,
      fromServiceName: c.from_service_id ? name[c.from_service_id] ?? null : null,
      toServiceName: c.service_id ? name[c.service_id] ?? null : null,
      done,
      closedAt: c.closed_at ?? pr?.lastAt ?? null,
      closedByName: c.closed_by_name ?? null,
      requireAll: Boolean(c.require_all),
      ack: pr ? { expected: pr.expected, acked: pr.acked, ackNames: pr.ackNames, missingNames: pr.missingNames } : null,
    };
  });
  if (status === "open") items = items.filter((i) => !i.done);
  if (terms.length > 0) {
    items = items.filter((i) => {
      const haystack = normalize(
        [i.body, i.placeName, i.fromServiceName, i.toServiceName, i.createdByName, i.closedByName, (i.ack?.ackNames ?? []).join(" "), (i.ack?.missingNames ?? []).join(" "), typeOf(customTypes, i.kind, i.typeId).short].join(" ")
      );
      return terms.every((t) => haystack.includes(t));
    });
  }
  return {
    total: items.length,
    open: items.filter((i) => !i.done).length,
    done: items.filter((i) => i.done).length,
    items: items.slice(offset, offset + limit),
    all: items,
  };
}
