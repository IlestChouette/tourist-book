import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TRACKED_EVENTS } from "@/lib/livretStats";

// Statistiques du livret, appelé par LivretMenu (navigator.sendBeacon).
// Public par nature (le voyageur n'a pas de compte) : on n'accepte que les
// événements connus et un slug existant, et on répond toujours 204 pour ne
// rien révéler.
// ponytail: pas de limite de débit — quelqu'un pourrait gonfler les compteurs
// à la main ; ajouter un throttle par IP si ça arrive.
export async function POST(request) {
  try {
    const { slug, event } = await request.json();
    if (typeof slug === "string" && TRACKED_EVENTS.includes(event)) {
      const admin = createAdminClient();
      const { data: property } = await admin.from("properties").select("id").eq("slug", slug).maybeSingle();
      if (property) await admin.from("livret_events").insert({ property_id: property.id, event });
    }
  } catch (err) {
    console.error("track failed:", err);
  }
  return new NextResponse(null, { status: 204 });
}
