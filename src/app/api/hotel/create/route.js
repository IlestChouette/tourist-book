import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ensureHotel } from "@/lib/hotelCreate";

// Un compte déjà connecté (par exemple un hôtelier de livrets) crée aussi son
// espace hôtel, sans refaire d'inscription. Un seul hôtel par compte.
export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Connectez-vous d'abord." }, { status: 401 });

  const b = await request.json().catch(() => ({}));
  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ error: "Indiquez le nom de l'hôtel (2 à 120 caractères)." }, { status: 400 });
  }

  await ensureHotel(user, name);
  const { data: hotel } = await createAdminClient().from("hotels").select("id").eq("owner_id", user.id).maybeSingle();
  if (!hotel) return NextResponse.json({ error: "Impossible de créer l'espace hôtel. Réessayez." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
