import crypto from "crypto";
import { NextResponse } from "next/server";
import { resolveActor } from "@/lib/hotelAuth";
import { sendLostItemGuestEmail } from "@/lib/email";
import { isEmail } from "@/lib/lostFound";
import { getLostFoundContext } from "@/lib/lostFoundServer";

const fail = (error, status = 400) => NextResponse.json({ error }, { status });

// "Avertir le client" : envoie l'email (trilingue) avec la photo et le lien où
// le client choisit : venir le récupérer, demander l'envoi, ou le détruire.
export async function POST(request) {
  const ctx = await getLostFoundContext();
  if (!ctx) return fail("Non autorisé", 401);
  const b = await request.json().catch(() => ({}));

  const { data: item } = await ctx.admin
    .from("lost_items")
    .select("id, description, photo_url, guest_email, guest_token, status")
    .eq("id", b.id ?? "")
    .eq("hotel_id", ctx.hotel.id)
    .maybeSingle();
  if (!item) return fail("Objet introuvable.", 404);
  if (!isEmail(item.guest_email)) return fail("Ajoutez d'abord l'adresse email du client.");

  const actor = await resolveActor(ctx, b.pin);
  if (actor.error) return fail(actor.error, actor.status);

  const token = item.guest_token ?? crypto.randomBytes(16).toString("hex");
  try {
    await sendLostItemGuestEmail({
      to: item.guest_email,
      hotelName: ctx.hotel.name,
      replyTo: ctx.hotel.notification_emails?.[0],
      description: item.description,
      photoUrl: item.photo_url,
      link: `https://tourist-book.com/objet/${token}`,
    });
  } catch (err) {
    console.error("lost item guest email failed:", err);
    return fail("L'email n'a pas pu être envoyé.", 502);
  }

  await ctx.admin
    .from("lost_items")
    .update({
      guest_token: token,
      notified_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: ["a_traiter", "garde"].includes(item.status) ? "client_averti" : item.status,
    })
    .eq("id", item.id);
  return NextResponse.json({ ok: true });
}
