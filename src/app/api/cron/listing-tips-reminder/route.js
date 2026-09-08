import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendListingTipsEmail, sendListingTipsBatchNotification } from "@/lib/email";

// Comptes de test/personnels de Fernando — jamais de vrais clients, on ne
// veut pas leur envoyer ce message de remerciement.
const EXCLUDED_EMAILS = ["ffonsecap@icloud.com", "fernando.test.tb@gmail.com", "allo@ilestchouette.fr"];

// Déclenché une fois par jour par Vercel Cron (voir vercel.json). Protégé
// par CRON_SECRET, comme /api/cron/no-property-reminder.
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
    .is("listing_tips_sent_at", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: properties } = await admin.from("properties").select("host_id, created_at");
  const earliestPropertyByHost = new Map();
  for (const p of properties ?? []) {
    const current = earliestPropertyByHost.get(p.host_id);
    if (!current || p.created_at < current) earliestPropertyByHost.set(p.host_id, p.created_at);
  }

  const targets = (hosts ?? []).filter((h) => {
    if (EXCLUDED_EMAILS.includes(h.email)) return false;
    const earliest = earliestPropertyByHost.get(h.id);
    return earliest && earliest < cutoff;
  });

  const results = [];
  const sentTo = [];
  for (const host of targets) {
    try {
      await sendListingTipsEmail({ name: host.name, email: host.email });
      await admin.from("hosts").update({ listing_tips_sent_at: new Date().toISOString() }).eq("id", host.id);
      results.push({ email: host.email, sent: true });
      sentTo.push({ name: host.name, email: host.email });
    } catch (err) {
      console.error(`sendListingTipsEmail failed for ${host.email}:`, err);
      results.push({ email: host.email, sent: false, error: err.message });
    }
  }

  try {
    await sendListingTipsBatchNotification({ sentTo });
  } catch (err) {
    console.error("sendListingTipsBatchNotification failed:", err);
  }

  return NextResponse.json({ checked: targets.length, results });
}
