import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPassword } from "@/lib/password";

export async function POST(request) {
  const { slug, username, password } = await request.json();
  if (!slug || !username || !password) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: property } = await admin.from("properties").select("id").eq("slug", slug).single();
  if (!property) {
    return NextResponse.json({ error: "Logement introuvable" }, { status: 404 });
  }

  const { data: account } = await admin
    .from("guest_accounts")
    .select("password_hash, reservations!inner(property_id)")
    .eq("username", username)
    .eq("reservations.property_id", property.id)
    .single();

  if (!account || !verifyPassword(password, account.password_hash)) {
    return NextResponse.json({ error: "Identifiant ou mot de passe incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(`access_${slug}`, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
