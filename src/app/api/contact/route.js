import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendContactLeadNotification } from "@/lib/email";

export async function POST(request) {
  const { name, phone, email, propertiesCount } = await request.json();
  if (!name || !phone || !email) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("contact_leads").insert({
    name,
    phone,
    email,
    properties_count: propertiesCount ? Number(propertiesCount) : null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await sendContactLeadNotification({ name, phone, email, propertiesCount });
  } catch (err) {
    // Envoi email best-effort : le contact est déjà enregistré même si ça échoue.
    console.error("sendContactLeadNotification failed:", err);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
