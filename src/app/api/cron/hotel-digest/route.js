import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendHotelDigestEmail } from "@/lib/email";
import { loadDay, loadMeta, loadPending } from "@/lib/hotelData";
import { buildDayPdf } from "@/lib/hotelPdf";
import { addDays, parisDate, parisMinutes } from "@/lib/hotelTime";
import { listHotelSlugs } from "@/lib/hotelSlug";

// Appelé toutes les 5 minutes par Supabase (voir supabase/hotel_digest_cron.sql) :
// l'offre Vercel gratuite n'autorise qu'une tâche planifiée par jour. C'est ici
// qu'on décide, en heure de Paris (changement d'heure compris), s'il faut
// envoyer. Une relève part dès que son heure est passée (jusqu'à 2 h de
// retard si un appel a été manqué) et une seule fois par hôtel (hotel_digest_log).
const SLOTS = [
  { id: "0655", minutes: 6 * 60 + 55, label: "6h55" },
  { id: "1455", minutes: 14 * 60 + 55, label: "14h55" },
  { id: "2255", minutes: 22 * 60 + 55, label: "22h55" },
];
const GRACE_MINUTES = 120;

export async function GET(request) {
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const now = new Date();
  const minutes = parisMinutes(now);
  const slot = SLOTS.filter((s) => minutes >= s.minutes && minutes < s.minutes + GRACE_MINUTES).at(-1);
  if (!slot) return NextResponse.json({ sent: 0, reason: "no slot due" });

  const today = parisDate(now);
  const yesterday = addDays(today, -1);
  const admin = createAdminClient();
  const { data: hotels } = await admin.from("hotels").select("id, name, notification_emails, retention_months");

  const slugs = new Map((await listHotelSlugs(admin)).map((h) => [h.id, h.slug]));
  let sent = 0;
  const errors = [];
  for (const hotel of hotels ?? []) {
    // On "réserve" le créneau avant d'envoyer : si deux appels arrivent en
    // même temps, un seul passe (clé primaire hotel/jour/créneau).
    const { error: claimError } = await admin
      .from("hotel_digest_log")
      .insert({ hotel_id: hotel.id, day: today, slot: slot.id });
    if (claimError) continue;

    try {
      if (slot.id === "0655") {
        const cutoff = new Date(`${today}T12:00:00Z`);
        cutoff.setUTCMonth(cutoff.getUTCMonth() - (hotel.retention_months ?? 36));
        await admin.from("consignes").delete().eq("hotel_id", hotel.id).lt("day", cutoff.toISOString().slice(0, 10));
      }

      const recipients = hotel.notification_emails ?? [];
      if (recipients.length === 0) continue;

      const pending = await loadPending(hotel.id, today);
      let pdf = null;
      if (slot.id === "0655") {
        const items = await loadDay(hotel.id, yesterday, true);
        if (items.length > 0) {
          const meta = await loadMeta(hotel.id);
          pdf = {
            filename: `consignes-${yesterday}.pdf`,
            content: await buildDayPdf({
              hotelName: hotel.name,
              day: yesterday,
              items,
              tagNames: Object.fromEntries(meta.tags.map((t) => [t.id, t.name])),
              withNames: true,
            }),
          };
        }
      }
      if (pending.length === 0 && !pdf) continue;

      for (const to of recipients) {
        await sendHotelDigestEmail({ to, hotelName: hotel.name, slotLabel: slot.label, pending, pdf, cahierPath: slugs.has(hotel.id) ? `/hotel/${slugs.get(hotel.id)}/cahier` : "/hotel/cahier" });
        sent += 1;
      }
    } catch (err) {
      console.error("hotel digest failed:", hotel.id, err);
      errors.push(hotel.id);
      // Libère le créneau pour qu'un prochain appel (dans la fenêtre) réessaie.
      await admin.from("hotel_digest_log").delete().eq("hotel_id", hotel.id).eq("day", today).eq("slot", slot.id);
    }
  }
  return NextResponse.json({ slot: slot.id, sent, errors });
}
