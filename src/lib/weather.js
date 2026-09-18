import { normalizeCity } from "./transferCityRates";

// Coordonnées des villes déjà connues du produit (mêmes villes que les
// tarifs de transfert) — les autres logements retombent sur Nice, centre
// géographique de la zone couverte.
const CITY_COORDS = {
  nice: { lat: 43.7102, lon: 7.262 },
  cannes: { lat: 43.5528, lon: 7.0174 },
  antibes: { lat: 43.5808, lon: 7.1251 },
  monaco: { lat: 43.7384, lon: 7.4246 },
  beausoleil: { lat: 43.744, lon: 7.4227 },
  "roquebrune-cap-martin": { lat: 43.7657, lon: 7.4649 },
  "saint-paul-de-vence": { lat: 43.6976, lon: 7.1216 },
};
const DEFAULT_COORDS = CITY_COORDS.nice;

// Codes météo WMO (renvoyés par Open-Meteo) regroupés en quelques familles
// d'icônes — inutile de distinguer chaque variante de pluie ou de neige.
const CONDITIONS = {
  0: "clear",
  1: "clear",
  2: "cloudy-sun",
  3: "cloudy",
  45: "fog",
  48: "fog",
  51: "rain",
  53: "rain",
  55: "rain",
  56: "rain",
  57: "rain",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "rain",
  81: "rain",
  82: "rain",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
};

// Prévisions du jour et du lendemain pour la ville d'un logement — API
// Open-Meteo, gratuite et sans clé. Best-effort : renvoie null si l'appel
// échoue, pour ne jamais bloquer l'affichage du livret.
export async function getWeatherForCity(city) {
  const coords = CITY_COORDS[normalizeCity(city)] || DEFAULT_COORDS;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FParis&forecast_days=2`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    const data = await res.json();
    const days = data.daily;
    if (!days?.time?.length) return null;
    return days.time.slice(0, 2).map((date, i) => ({
      date,
      condition: CONDITIONS[days.weathercode[i]] || "cloudy",
      max: Math.round(days.temperature_2m_max[i]),
      min: Math.round(days.temperature_2m_min[i]),
    }));
  } catch {
    return null;
  }
}
