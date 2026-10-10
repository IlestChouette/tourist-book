import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Dit si un email a un compte, pour que les écrans de connexion puissent
// répondre « aucun compte avec cet email, créez-en un » au lieu d'un message
// vague. Choix produit assumé : cela révèle quels emails sont inscrits, d'où la
// limite de débit ci-dessous (par adresse IP).
// ponytail: limite en mémoire, propre à chaque instance serverless — freine un
// balayage simple mais ne l'empêche pas ; passer à une table si ça devient un sujet.
const hits = new Map();
const LIMIT = 20;
const WINDOW_MS = 60_000;

function tooMany(ip) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

async function emailExists(admin, email) {
  for (let page = 1; page <= 20; page++) {
    const { data } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    const users = data?.users ?? [];
    if (users.some((u) => u.email?.toLowerCase() === email)) return true;
    if (users.length < 1000) return false;
  }
  return false;
}

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (tooMany(ip)) return NextResponse.json({ error: "Trop de tentatives. Réessayez dans une minute." }, { status: 429 });

  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email || email.length > 254 || !email.includes("@")) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }
  try {
    return NextResponse.json({ exists: await emailExists(createAdminClient(), email) });
  } catch (err) {
    console.error("account-exists failed:", err);
    return NextResponse.json({ error: "Vérification impossible." }, { status: 500 });
  }
}
