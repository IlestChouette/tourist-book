import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendHotelDigestEmail, sendHotelEndedWarning, sendHotelRetentionWarning } from "@/lib/email";
import { loadDay, loadMeta, loadPending, retentionInfo } from "@/lib/hotelData";
import { buildDayPdf } from "@/lib/hotelPdf";
import { addDays, addMonths, parisDate, parisMinutes } from "@/lib/hotelTime";
import { listHotelSlugs } from "@/lib/hotelSlug";
import { hotelHasAccess } from "@/lib/hotelBilling";

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
  // Test d'un seul hôtel (avec le secret) : ?hotel=<id>&slot=0655
  const sp = new URL(request.url).searchParams;
  const only = /^[0-9a-f-]{36}$/i.test(sp.get("hotel") ?? "") ? sp.get("hotel") : null;
  const slot = (only && SLOTS.find((s) => s.id === sp.get("slot"))) || SLOTS.filter((s) => minutes >= s.minutes && minutes < s.minutes + GRACE_MINUTES).at(-1);
  if (!slot) return NextResponse.json({ sent: 0, reason: "no slot due" });

  const today = parisDate(now);
  const yesterday = addDays(today, -1);
  const admin = createAdminClient();
  const { data: hotels } = await (only ? admin.from("hotels").select("*").eq("id", only) : admin.from("hotels").select("*"));

  const slugs = new Map((await listHotelSlugs(admin)).map((h) => [h.id, h.slug]));
  let sent = 0;
  const errors = [];
  for (const hotel of hotels ?? []) {
    // Rappel des consignes qui seront supprimées dans 3 mois : au plus un par mois et
    // par hôtel, même si l'abonnement n'est plus réglé (c'est une perte de données).
    if (slot.id === "0655") {
      // Abonnement terminé : prévenu à 2 mois, tout supprimé à 3 mois (voir endedHotel).
      if (await endedHotel(admin, hotel, today)) continue;
      await warnRetention(admin, hotel, today);
    }
    if (!hotelHasAccess(hotel)) {
      // Abonnement non réglé : pas de relève par email, mais la durée de conservation
      // s'applique quand même (une fois par jour, au créneau de 6h55).
      if (slot.id === "0655") {
        const { error: purgeClaim } = await admin.from("hotel_digest_log").insert({ hotel_id: hotel.id, day: today, slot: "purge" });
        if (!purgeClaim) {
          const cutoff = new Date(`${today}T12:00:00Z`);
          cutoff.setUTCMonth(cutoff.getUTCMonth() - (hotel.retention_months ?? 36));
          await admin.from("consignes").delete().eq("hotel_id", hotel.id).lt("day", cutoff.toISOString().slice(0, 10));
        }
      }
      continue;
    }
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
              types: hotel.consigne_types,
            }),
          };
        }
      }
      if (pending.length === 0 && !pdf) continue;

      for (const to of recipients) {
        await sendHotelDigestEmail({ to, hotelId: hotel.id, hotelName: hotel.name, slotLabel: slot.label, pending, pdf, replyTo: hotel.reply_to || undefined, types: hotel.consigne_types, cahierPath: slugs.has(hotel.id) ? `/hotel/${slugs.get(hotel.id)}/cahier` : "/hotel/cahier" });
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

async function warnRetention(admin, hotel, today) {
  const recipients = hotel.notification_emails ?? [];
  if (recipients.length === 0) return;
  try {
    const { data: recent } = await admin.from("hotel_digest_log").select("day").eq("hotel_id", hotel.id).eq("slot", "retention").gte("day", addDays(today, -30)).limit(1);
    if (recent?.length) return;
    const info = await retentionInfo(hotel.id, hotel.retention_months ?? 36);
    if (info.expiring === 0 || !info.deleteFrom) return;
    const { error: claimError } = await admin.from("hotel_digest_log").insert({ hotel_id: hotel.id, day: today, slot: "retention" });
    if (claimError) return;
    try {
      for (const to of recipients) {
        await sendHotelRetentionWarning({ to, hotelId: hotel.id, hotelName: hotel.name, count: info.expiring, deleteFrom: info.deleteFrom, months: info.months, replyTo: hotel.reply_to || undefined });
      }
    } catch (err) {
      await admin.from("hotel_digest_log").delete().eq("hotel_id", hotel.id).eq("day", today).eq("slot", "retention");
      throw err;
    }
  } catch (err) {
    console.error("hotel retention warning failed:", hotel.id, err);
  }
}

// Date de suppression annoncée : 3 mois après la fin, mais jamais moins de 28 jours après
// l'email d'avertissement.
const statedDate = (warnedOn, deleteOn) => (addDays(warnedOn, 28) > deleteOn ? addDays(warnedOn, 28) : deleteOn);

// Hôtel dont l'abonnement est terminé (résilié ou impayé jusqu'à l'annulation) : ses données
// sont conservées 3 mois après la fin, avec un email un mois avant la suppression. Rien
// n'est supprimé sans que l'email d'avertissement soit parti au moins 28 jours avant.
// Renvoie true si l'hôtel vient d'être supprimé.
async function endedHotel(admin, hotel, today) {
  if (hotel.billing_status !== "canceled" || hotel.billing_exempt || !hotel.current_period_end) return false;
  try {
    const endedOn = parisDate(new Date(hotel.current_period_end));
    const warnOn = addMonths(endedOn, 2);
    const deleteOn = addMonths(endedOn, 3);
    if (today < warnOn) return false;

    const { data: warned } = await admin.from("hotel_digest_log").select("day").eq("hotel_id", hotel.id).eq("slot", "ended-warning").order("day", { ascending: true }).limit(1);
    const warnedOn = warned?.[0]?.day ?? null;

    if (!warnedOn) {
      // Sans adresse de relève, on prévient le propriétaire du compte.
      let recipients = hotel.notification_emails ?? [];
      if (recipients.length === 0 && hotel.owner_id) {
        const { data: owner } = await admin.auth.admin.getUserById(hotel.owner_id);
        if (owner?.user?.email) recipients = [owner.user.email];
      }
      const { error: claimError } = await admin.from("hotel_digest_log").insert({ hotel_id: hotel.id, day: today, slot: "ended-warning" });
      if (claimError) return false;
      try {
        for (const to of recipients) await sendHotelEndedWarning({ to, hotelId: hotel.id, hotelName: hotel.name, endedOn, deleteOn: statedDate(today, deleteOn), replyTo: hotel.reply_to || undefined });
      } catch (err) {
        await admin.from("hotel_digest_log").delete().eq("hotel_id", hotel.id).eq("day", today).eq("slot", "ended-warning");
        throw err;
      }
      return false;
    }

    if (today >= statedDate(warnedOn, deleteOn)) {
      // Les accès de service sont des comptes à part : on les supprime avec l'hôtel.
      const { data: accounts } = await admin.from("hotel_services").select("account_user_id").eq("hotel_id", hotel.id).not("account_user_id", "is", null);
      for (const a of accounts ?? []) await admin.auth.admin.deleteUser(a.account_user_id).catch(() => {});
      const { error } = await admin.from("hotels").delete().eq("id", hotel.id);
      if (error) throw error;
      console.log("hotel data deleted after subscription end:", hotel.id);
      return true;
    }
  } catch (err) {
    console.error("ended hotel handling failed:", hotel.id, err);
  }
  return false;
}
