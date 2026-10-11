// Les consignes suivent le jour civil de Paris, pas celui du serveur (UTC) :
// à 0h30 à Nice, il est encore "hier" en UTC.
const dayFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Paris",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// "2026-10-06" (heure de Paris)
export function parisDate(date = new Date()) {
  return dayFmt.format(date);
}

// Minutes écoulées depuis minuit, heure de Paris.
export function parisMinutes(date = new Date()) {
  const [h, m] = timeFmt.format(date).split(":").map(Number);
  return (h % 24) * 60 + m;
}

export function isDay(value) {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export function addDays(day, n) {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(from, to) {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86400000);
}

export function formatDayLong(day) {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
