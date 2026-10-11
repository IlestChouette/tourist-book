import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resolveActor } from "@/lib/hotelAuth";
import { getLostFoundContext } from "@/lib/lostFoundServer";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const fail = (error, status = 400) => NextResponse.json({ error }, { status });

// Création d'un objet trouvé. Deux entrées :
//  - le lien privé des femmes de chambre (champ "token") : sans PIN, mais il ne
//    permet que de créer un objet "à traiter" ;
//  - l'écran de la réception ou du manager (session / poste activé) : PIN
//    demandé sur un poste partagé.
export async function POST(request) {
  const form = await request.formData().catch(() => null);
  if (!form) return fail("Données invalides.");

  const token = String(form.get("token") ?? "");
  const admin = createAdminClient();
  let hotel;
  let createdVia;

  if (token) {
    const { data } = await admin.from("hotels").select("id, lost_found_enabled").eq("lost_found_token", token).maybeSingle();
    if (!data || data.lost_found_enabled !== true) return fail("Lien invalide.", 404);
    hotel = data;
    createdVia = "capture";

    // Garde-fou : un lien qui fuite ne doit pas pouvoir inonder le registre.
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { count } = await admin
      .from("lost_items")
      .select("id", { count: "exact", head: true })
      .eq("hotel_id", hotel.id)
      .eq("created_via", "capture")
      .gte("created_at", since);
    if ((count ?? 0) >= 40) return fail("Trop d'envois en peu de temps. Réessayez dans quelques minutes.", 429);
  } else {
    const ctx = await getLostFoundContext();
    if (!ctx) return fail("Non autorisé", 401);
    const actor = await resolveActor(ctx, String(form.get("pin") ?? ""));
    if (actor.error) return fail(actor.error, actor.status);
    hotel = ctx.hotel;
    createdVia = "staff";
  }

  const description = String(form.get("description") ?? "").trim().slice(0, 500);
  const roomRaw = String(form.get("room") ?? "").trim().slice(0, 30);
  const photo = form.get("photo");
  const hasPhoto = photo && typeof photo === "object" && photo.size > 0;
  if (!description && !hasPhoto) return fail("Ajoutez une photo ou une description.");

  let photoUrl = null;
  if (hasPhoto) {
    if (!String(photo.type).startsWith("image/")) return fail("Le fichier doit être une photo.");
    if (photo.size > MAX_PHOTO_BYTES) return fail("Photo trop lourde (8 Mo maximum).");
    const path = `lost-found/${hotel.id}/${crypto.randomUUID()}.jpg`;
    const { error } = await admin.storage.from("media").upload(path, await photo.arrayBuffer(), { contentType: photo.type });
    if (error) {
      console.error("lost-found photo upload failed:", error);
      return fail("Impossible d'enregistrer la photo.", 500);
    }
    photoUrl = admin.storage.from("media").getPublicUrl(path).data.publicUrl;
  }

  let roomConfirmed = false;
  if (roomRaw) {
    const { data: place } = await admin.from("hotel_places").select("id").eq("hotel_id", hotel.id).ilike("name", roomRaw).maybeSingle();
    roomConfirmed = Boolean(place);
  }

  const { error } = await admin.from("lost_items").insert({
    hotel_id: hotel.id,
    room_text: roomRaw || null,
    room_confirmed: roomConfirmed,
    description,
    photo_url: photoUrl,
    created_via: createdVia,
    status: createdVia === "capture" ? "a_traiter" : "garde",
  });
  if (error) {
    console.error("lost item insert failed:", error);
    return fail("Impossible d'enregistrer l'objet.", 500);
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
