import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendLostItemChoiceNotification } from "@/lib/email";
import { CHOICE_LABELS, CLOSED_STATUSES } from "@/lib/lostFound";

const fail = (error, status = 400) => NextResponse.json({ error }, { status });

// Choix du client depuis sa page privée. Le jeton (dans l'email) est le seul
// laissez-passer : il ne donne accès qu'à cet objet.
export async function POST(request) {
  const b = await request.json().catch(() => ({}));
  if (typeof b.token !== "string" || !["pickup", "ship", "discard"].includes(b.choice)) return fail("Demande invalide.");

  const admin = createAdminClient();
  const { data: item } = await admin
    .from("lost_items")
    .select("id, number, description, status, hotels(name, notification_emails, lost_found_enabled)")
    .eq("guest_token", b.token)
    .maybeSingle();
  if (!item || item.hotels?.lost_found_enabled !== true) return fail("Lien invalide.", 404);
  if (CLOSED_STATUSES.includes(item.status)) return fail("Objet déjà traité.", 409);

  const name = typeof b.name === "string" ? b.name.trim().slice(0, 120) : "";
  const address = typeof b.address === "string" ? b.address.trim().slice(0, 500) : "";
  const phone = typeof b.phone === "string" ? b.phone.trim().slice(0, 40) : "";
  if (b.choice === "ship" && (!name || address.length < 8)) return fail("Indiquez votre nom et votre adresse complète.");

  const { error } = await admin
    .from("lost_items")
    .update({
      guest_choice: b.choice,
      guest_choice_at: new Date().toISOString(),
      guest_address: b.choice === "ship" ? address : null,
      guest_phone: b.choice === "ship" ? phone || null : null,
      ...(b.choice === "ship" && name ? { guest_name: name } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", item.id);
  if (error) return fail("Impossible d'enregistrer.", 500);

  try {
    await sendLostItemChoiceNotification({
      to: item.hotels.notification_emails ?? [],
      hotelName: item.hotels.name,
      number: item.number,
      description: item.description,
      choiceLabel: CHOICE_LABELS[b.choice],
      name,
      address,
      phone,
    });
  } catch (err) {
    // Le choix est enregistré et visible dans le registre même si l'alerte échoue.
    console.error("lost item choice notification failed:", err);
  }
  return NextResponse.json({ ok: true });
}
