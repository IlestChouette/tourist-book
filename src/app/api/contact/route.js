import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendContactLeadNotification } from "@/lib/email";
import { clientIp, limited } from "@/lib/rateLimit";

export async function POST(request) {
  if (limited(`contact:${clientIp(request)}`, 5, 10 * 60_000)) return NextResponse.json({ error: "Trop de demandes. Réessayez dans quelques minutes." }, { status: 429 });
  const b = await request.json().catch(() => ({}));
  const clean = (v, max) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
  const name = clean(b.name, 120), phone = clean(b.phone, 40), email = clean(b.email, 200);
  const { propertiesCount, message } = b;
  if (!name || !phone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }
  // Endpoint public sans authentification : on borne la taille du message.
  const cleanMessage = typeof message === "string" ? message.trim().slice(0, 2000) : "";

  const admin = createAdminClient();
  // Plafond global durable : au plus 30 messages / 10 min, tous visiteurs confondus.
  const { count } = await admin.from("contact_leads").select("id", { count: "exact", head: true }).gt("created_at", new Date(Date.now() - 10 * 60_000).toISOString());
  if ((count ?? 0) >= 30) return NextResponse.json({ error: "Trop de demandes. Réessayez dans quelques minutes." }, { status: 429 });
  const { error } = await admin.from("contact_leads").insert({
    name,
    phone,
    email,
    properties_count: propertiesCount ? Number(propertiesCount) : null,
    message: cleanMessage || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await sendContactLeadNotification({ name, phone, email, propertiesCount, message: cleanMessage });
  } catch (err) {
    // Envoi email best-effort : le contact est déjà enregistré même si ça échoue.
    console.error("sendContactLeadNotification failed:", err);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
