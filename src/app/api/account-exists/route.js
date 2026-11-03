import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, limited } from "@/lib/rateLimit";

// Dit si un email a un compte, pour que les écrans de connexion puissent
// répondre « aucun compte avec cet email, créez-en un » au lieu d'un message
// vague. Choix produit assumé : cela révèle quels emails sont inscrits, d'où la
// limite de débit ci-dessous (par adresse IP).
// Limite : 10 demandes / 10 min par IP (voir lib/rateLimit.js pour son plafond).

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
  if (limited(`exists:${clientIp(request)}`, 10, 10 * 60_000)) return NextResponse.json({ error: "Trop de tentatives. Réessayez dans une minute." }, { status: 429 });

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
