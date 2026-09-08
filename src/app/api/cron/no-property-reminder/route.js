import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNoPropertyReminder } from "@/lib/email";

// Déclenché une fois par jour par Vercel Cron (voir vercel.json). Protégé
// par CRON_SECRET pour qu'on ne puisse pas le déclencher depuis l'extérieur
// et spammer les hôteliers.
export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: hosts, error } = await admin
    .from("hosts")
    .select("id, name, email")
    .eq("is_admin", false)
    .is("no_property_reminder_sent_at", null)
    .lt("created_at", cutoff);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: properties } = await admin.from("properties").select("host_id");
  const hostsWithProperty = new Set((properties ?? []).map((p) => p.host_id));
  const targets = (hosts ?? []).filter((h) => !hostsWithProperty.has(h.id));

  const results = [];
  for (const host of targets) {
    try {
      await sendNoPropertyReminder({ name: host.name, email: host.email });
      await admin.from("hosts").update({ no_property_reminder_sent_at: new Date().toISOString() }).eq("id", host.id);
      results.push({ email: host.email, sent: true });
    } catch (err) {
      console.error(`sendNoPropertyReminder failed for ${host.email}:`, err);
      results.push({ email: host.email, sent: false, error: err.message });
    }
  }

  return NextResponse.json({ checked: targets.length, results });
}
