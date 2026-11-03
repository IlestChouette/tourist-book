import { NextResponse } from "next/server";
import { sendHostSignupNotification } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, limited } from "@/lib/rateLimit";

export async function POST(request) {
  // Endpoint public qui écrit à l'administrateur : limité par IP et par plafond global (anti-spam de la boîte).
  if (limited(`signup-notify:${clientIp(request)}`, 5, 10 * 60_000)) return NextResponse.json({ ok: true });
  const b = await request.json().catch(() => ({}));
  const clean = (v, max) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
  const name = clean(b.name, 120), email = clean(b.email, 200), phone = clean(b.phone, 40);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }
  const since = new Date(Date.now() - 10 * 60_000).toISOString();
  const { count } = await createAdminClient().from("email_log").select("id", { count: "exact", head: true }).eq("template", "host_signup_notification").gt("created_at", since);
  if ((count ?? 0) >= 20) return NextResponse.json({ ok: true });

  try {
    await sendHostSignupNotification({ name, email, phone });
  } catch (err) {
    // Best-effort : le compte est déjà créé même si l'email échoue.
    console.error("sendHostSignupNotification failed:", err);
  }

  return NextResponse.json({ ok: true });
}
