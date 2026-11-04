// Limite de débit en mémoire, par clé (IP, IP + logement…).
// ponytail: propre à chaque instance serverless — freine fortement un balayage depuis une même IP mais
// ne le bloque pas à 100 % ; si cela devient un sujet, passer à une table partagée.
const buckets = new Map();

export function clientIp(request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

function entry(key, windowMs) {
  const now = Date.now();
  let e = buckets.get(key);
  if (!e || e.reset < now) {
    e = { count: 0, reset: now + windowMs };
    buckets.set(key, e);
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  }
  return e;
}

// Compte cet appel et dit si la limite est dépassée.
export function limited(key, limit, windowMs) {
  const e = entry(key, windowMs);
  e.count += 1;
  return e.count > limit;
}

// Pour les codes : on ne compte que les échecs (blocked avant de tester, fail après un échec, clear après un succès).
export const blocked = (key, limit, windowMs) => entry(key, windowMs).count >= limit;
export const fail = (key, windowMs) => { entry(key, windowMs).count += 1; };
export const clear = (key) => { buckets.delete(key); };
