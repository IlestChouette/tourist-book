import { addDays, daysBetween, parisDate, parisMinutes } from "@/lib/hotelTime";

export const RANGES = {
  today: { label: "Aujourd'hui", days: 1 },
  "7": { label: "7 derniers jours", days: 7 },
  "30": { label: "30 derniers jours", days: 30 },
  "90": { label: "90 derniers jours", days: 90 },
  "365": { label: "12 derniers mois", days: 365 },
};
export const KIND_OPTIONS = [
  { id: "info", label: "Info" },
  { id: "tache", label: "Tâche" },
  { id: "probleme", label: "Problème" },
  { id: "plainte", label: "Plainte" },
];
const isDay = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

// Lit les paramètres d'URL (période, comparaison, filtres) et en déduit la
// période affichée et la période précédente de même durée.
export function parseStatsParams(sp, today) {
  let range = RANGES[sp.range] ? sp.range : sp.range === "custom" ? "custom" : "30";
  let from;
  let to = today;
  if (range === "custom" && isDay(sp.from) && isDay(sp.to) && sp.from <= sp.to) {
    from = sp.from;
    to = sp.to > today ? today : sp.to;
    if (from > to) from = to;
  } else {
    range = RANGES[range] ? range : "30";
    from = addDays(today, -(RANGES[range].days - 1));
  }
  if (daysBetween(from, to) > 730) from = addDays(to, -730);
  const length = daysBetween(from, to) + 1;
  const compare = sp.compare === "1";
  return {
    range,
    from,
    to,
    length,
    compare,
    prevFrom: addDays(from, -length),
    prevTo: addDays(from, -1),
    kinds: String(sp.kind ?? "").split(",").filter((k) => KIND_OPTIONS.some((o) => o.id === k)),
    service: sp.service || "",
    shift: sp.shift || "",
    place: (sp.place || "").slice(0, 60),
    detail: /^(place|service|kind|shift|issues|open):/.test(sp.detail || "") || sp.detail === "issues" || sp.detail === "open" ? String(sp.detail).slice(0, 80) : "",
  };
}

// Adresse de la page Statistiques avec les filtres actuels, modifiés par `patch`.
export function statsHref(f, patch = {}) {
  const n = { ...f, ...patch };
  const qs = new URLSearchParams();
  qs.set("range", n.range);
  if (n.range === "custom") {
    qs.set("from", n.from);
    qs.set("to", n.to);
  }
  if (n.compare) qs.set("compare", "1");
  if (n.kinds.length) qs.set("kind", n.kinds.join(","));
  if (n.service) qs.set("service", n.service);
  if (n.shift) qs.set("shift", n.shift);
  if (n.place) qs.set("place", n.place);
  if (n.detail) qs.set("detail", n.detail);
  return `/hotel/statistiques?${qs.toString()}`;
}

export const RECURRENCE_DAYS = 90;
const ISSUE_KINDS = ["probleme", "plainte"];

// Sélection des consignes derrière un chiffre cliqué (une chambre, un service,
// un type…), dans la période et avec les filtres actifs.
export function selectDetail(rows, f, tags) {
  if (!f.detail) return null;
  const tagById = Object.fromEntries(tags.map((t) => [t.id, t]));
  const [type, ...rest] = f.detail.split(":");
  const value = rest.join(":");
  const cur = rows.filter((c) => c.day >= f.from && c.day <= f.to && matches(c, f, tagById));
  const names = (c) => c.tag_ids.map((id) => tagById[id]).filter(Boolean);
  let list;
  let title;
  switch (type) {
    case "place":
      list = cur.filter((c) => c.place_name === value);
      title = /^\d+$/.test(value) ? `Chambre ${value}` : value;
      break;
    case "service":
      list = cur.filter((c) => names(c).some((t) => t.kind !== "shift" && t.name === value));
      title = `Service : ${value}`;
      break;
    case "kind":
      list = cur.filter((c) => c.kind === value);
      title = `Type : ${KIND_OPTIONS.find((k) => k.id === value)?.label ?? value}`;
      break;
    case "shift":
      list = cur.filter((c) => names(c).some((t) => t.kind === "shift" && t.name === value) && (!c.closed_at || parisDate(new Date(c.closed_at)) > c.day));
      title = `Laissées en suspens — équipe ${value}`;
      break;
    case "issues":
      list = cur.filter((c) => ISSUE_KINDS.includes(c.kind));
      title = "Problèmes et plaintes";
      break;
    case "open":
      list = cur.filter((c) => !c.closed_at);
      title = "Pas encore clôturées";
      break;
    default:
      return null;
  }
  list = list.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return { type, value, title, list, tagById };
}

// Récurrence : un problème ou une plainte est « récurrent » si la même chambre
// (ou le même lieu) a déjà eu un problème ou une plainte du même service dans
// les 90 jours qui précèdent. `history` : problèmes et plaintes de ces lieux
// sur une période plus longue, sans les filtres de la page.
export function withRecurrence(detail, history) {
  const { tagById } = detail;
  const service = (c) => c.tag_ids.map((id) => tagById[id]).filter((t) => t && t.kind !== "shift").map((t) => t.id);
  const items = detail.list.map((c) => {
    const issue = ISSUE_KINDS.includes(c.kind);
    let prior = [];
    if (issue) {
      const mine = service(c);
      const start = Date.parse(c.created_at) - RECURRENCE_DAYS * 86400000;
      prior = history.filter((h) => {
        if (h.id === c.id || h.place_name !== c.place_name) return false;
        const t = Date.parse(h.created_at);
        if (t >= Date.parse(c.created_at) || t < start) return false;
        // même service si la consigne en a un, sinon n'importe quel problème du lieu
        return mine.length === 0 || service(h).some((id) => mine.includes(id));
      });
    }
    return {
      id: c.id,
      day: c.day,
      kind: c.kind,
      body: c.body,
      place: c.place_name,
      priority: c.priority,
      createdAt: c.created_at,
      closedAt: c.closed_at,
      tags: c.tag_ids.map((id) => tagById[id]?.name).filter(Boolean),
      issue,
      priorCount: prior.length,
      lastPrior: prior.reduce((m, h) => (h.day > m ? h.day : m), ""),
    };
  });
  const issues = items.filter((i) => i.issue);
  return {
    items,
    issuesCount: issues.length,
    recurrentCount: issues.filter((i) => i.priorCount > 0).length,
    firstTimeCount: issues.filter((i) => i.priorCount === 0).length,
  };
}

function bucketOf(day, mode) {
  if (mode === "day") return day;
  if (mode === "month") return day.slice(0, 7);
  const dow = (new Date(`${day}T12:00:00Z`).getUTCDay() + 6) % 7; // lundi = 0
  return addDays(day, -dow);
}

function bucketList(from, to, mode) {
  const keys = [];
  for (let d = from; d <= to; d = addDays(d, 1)) {
    const k = bucketOf(d, mode);
    if (keys[keys.length - 1] !== k) keys.push(k);
  }
  return keys;
}

const monthShort = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit", timeZone: "UTC" });
const dayShort = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
const dayLong = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "long", timeZone: "UTC" });

export function bucketLabel(key, mode, long = false) {
  if (mode === "month") return monthShort.format(new Date(`${key}-15T12:00:00Z`));
  const d = new Date(`${key}T12:00:00Z`);
  if (mode === "week") return `Sem. du ${dayShort.format(d)}`;
  return (long ? dayLong : dayShort).format(d);
}

function matches(c, f, tagById) {
  if (f.kinds.length && !f.kinds.includes(c.kind)) return false;
  if (f.service && !c.tag_ids.includes(f.service)) return false;
  if (f.shift && !c.tag_ids.includes(f.shift)) return false;
  if (f.place && c.place_name.toLowerCase() !== f.place.toLowerCase()) return false;
  return true;
}

function summary(rows) {
  const closed = rows.filter((c) => c.closed_at);
  const hours = closed.map((c) => (Date.parse(c.closed_at) - Date.parse(c.created_at)) / 3600000);
  return {
    written: rows.length,
    open: rows.length - closed.length,
    closedCount: closed.length,
    closeRate: rows.length ? (closed.length / rows.length) * 100 : null,
    avgHours: hours.length ? hours.reduce((a, b) => a + b, 0) / hours.length : null,
    priority: rows.filter((c) => c.priority).length,
    issues: rows.filter((c) => c.kind === "probleme" || c.kind === "plainte").length,
  };
}

const countBy = (list, keyFn) => {
  const map = new Map();
  for (const item of list) for (const key of [].concat(keyFn(item))) map.set(key, (map.get(key) ?? 0) + 1);
  return [...map].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
};

// `rows` : consignes dont le jour est dans [prevFrom (si comparaison) ; to].
export function filterRows(rows, f, tags) {
  const tagById = Object.fromEntries(tags.map((t) => [t.id, t]));
  return rows.filter((c) => matches(c, f, tagById));
}

export function computeStats(rows, f, tags) {
  const tagById = Object.fromEntries(tags.map((t) => [t.id, t]));
  const filtered = rows.filter((c) => matches(c, f, tagById));
  const cur = filtered.filter((c) => c.day >= f.from && c.day <= f.to);
  const prev = f.compare ? filtered.filter((c) => c.day >= f.prevFrom && c.day <= f.prevTo) : [];

  const mode = f.length <= 45 ? "day" : f.length <= 200 ? "week" : "month";
  const keys = bucketList(f.from, f.to, mode);
  const idx = new Map(keys.map((k, i) => [k, i]));
  const buckets = keys.map((key) => ({
    key,
    label: bucketLabel(key, mode, true),
    short: mode === "week" ? dayShort.format(new Date(`${key}T12:00:00Z`)) : bucketLabel(key, mode),
    written: 0,
    closed: 0,
    prev: null,
    kinds: { info: 0, tache: 0, probleme: 0, plainte: 0 },
  }));
  for (const c of cur) {
    const b = buckets[idx.get(bucketOf(c.day, mode))];
    b.written += 1;
    b.kinds[c.kind] += 1;
  }
  for (const c of cur) {
    if (!c.closed_at) continue;
    const closedDay = parisDate(new Date(c.closed_at));
    const i = idx.get(bucketOf(closedDay < f.from ? f.from : closedDay > f.to ? f.to : closedDay, mode));
    if (i !== undefined) buckets[i].closed += 1;
  }
  if (f.compare) {
    // période précédente alignée sur la même position (jour 1 ↔ jour 1)
    const prevKeys = bucketList(f.prevFrom, f.prevTo, mode);
    const prevIdx = new Map(prevKeys.map((k, i) => [k, i]));
    const counts = prevKeys.map(() => 0);
    for (const c of prev) counts[prevIdx.get(bucketOf(c.day, mode))] += 1;
    buckets.forEach((b, i) => {
      b.prev = counts[i] ?? 0;
      b.prevLabel = prevKeys[i] ? bucketLabel(prevKeys[i], mode, true) : null;
    });
  }

  // chaleur : jour de la semaine × heure d'écriture (heure de Paris)
  const heat = Array.from({ length: 7 }, () => Array(24).fill(0));
  for (const c of cur) {
    const created = new Date(c.created_at);
    const dow = (new Date(`${parisDate(created)}T12:00:00Z`).getUTCDay() + 6) % 7;
    heat[dow][Math.floor(parisMinutes(created) / 60)] += 1;
  }

  const serviceRows = countBy(cur, (c) =>
    c.tag_ids.map((id) => tagById[id]).filter((t) => t && t.kind !== "shift").map((t) => t.name),
  );
  const shiftLeft = countBy(
    cur.filter((c) => !c.closed_at || parisDate(new Date(c.closed_at)) > c.day),
    (c) => c.tag_ids.map((id) => tagById[id]).filter((t) => t?.kind === "shift").map((t) => t.name),
  );
  const now = Date.now();
  const oldestOpen = cur
    .filter((c) => !c.closed_at)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .slice(0, 5)
    .map((c) => ({ id: c.id, place: c.place_name, kind: c.kind, body: c.body, days: Math.floor((now - Date.parse(c.created_at)) / 86400000), priority: c.priority }));

  // Délai de clôture : répartition en tranches et moyenne par service.
  const BINS = [
    ["Moins d'1 h", 1],
    ["1 à 4 h", 4],
    ["4 à 24 h", 24],
    ["1 à 3 jours", 72],
    ["Plus de 3 jours", Infinity],
  ];
  const closeDist = BINS.map(([label]) => ({ label, value: 0 }));
  const svc = new Map();
  for (const c of cur) {
    if (!c.closed_at) continue;
    const h = (Date.parse(c.closed_at) - Date.parse(c.created_at)) / 3600000;
    closeDist[BINS.findIndex(([, max]) => h < max)].value += 1;
    for (const id of c.tag_ids) {
      const t = tagById[id];
      if (!t || t.kind === "shift") continue;
      const e = svc.get(t.name) ?? { sum: 0, n: 0 };
      e.sum += h;
      e.n += 1;
      svc.set(t.name, e);
    }
  }
  const closeByService = [...svc].map(([label, e]) => ({ label, hours: e.sum / e.n, n: e.n })).sort((a, b) => b.hours - a.hours);

  const weekday = Array(7).fill(0);
  const byHour = Array(24).fill(0);
  heat.forEach((row, d) => row.forEach((v, h) => { weekday[d] += v; byHour[h] += v; }));

  // Chambres récurrentes : au moins 2 problèmes ou plaintes sur la période.
  const issues = new Map();
  for (const c of cur) {
    if (c.kind !== "probleme" && c.kind !== "plainte") continue;
    const e = issues.get(c.place_name) ?? { place: c.place_name, count: 0, last: c.day, probleme: 0, plainte: 0 };
    e.count += 1;
    e[c.kind] += 1;
    if (c.day > e.last) e.last = c.day;
    issues.set(c.place_name, e);
  }
  const recurring = [...issues.values()].filter((e) => e.count >= 2).sort((a, b) => b.count - a.count || b.last.localeCompare(a.last)).slice(0, 8);

  return {
    mode,
    buckets,
    closeDist,
    closeByService,
    weekday,
    byHour,
    recurring,
    current: summary(cur),
    previous: f.compare ? summary(prev) : null,
    byKind: countBy(cur, (c) => c.kind),
    topPlaces: countBy(cur, (c) => c.place_name).slice(0, 10),
    placesCount: new Set(cur.map((c) => c.place_name)).size,
    byService: serviceRows,
    shiftLeft,
    heat,
    oldestOpen,
    total: cur.length,
  };
}
