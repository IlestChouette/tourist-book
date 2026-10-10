import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPropertyCreatedNotification } from "@/lib/email";

// Appelé par le panel juste après la création ou la duplication d'un logement.
// Exige une session et un logement qui existe vraiment chez cet hôtelier :
// sans ça, n'importe qui pourrait inonder la boîte de notification et
// consommer le quota d'emails.
export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Vous n'êtes pas connecté. Connectez-vous ou créez un compte pour continuer." }, { status: 401 });

  const { propertyName } = await request.json().catch(() => ({}));
  if (!propertyName || typeof propertyName !== "string") {
    return NextResponse.json({ error: "Nom du logement manquant" }, { status: 400 });
  }

  const admin = createAdminClient();
  const [{ data: property }, { data: host }] = await Promise.all([
    admin
      .from("properties")
      .select("name, city")
      .eq("host_id", user.id)
      .eq("name", propertyName)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    admin.from("hosts").select("name, email").eq("id", user.id).maybeSingle(),
  ]);
  if (!property) return NextResponse.json({ error: "Aucun compte ou logement trouvé. Créez un compte pour commencer." }, { status: 404 });

  try {
    await sendPropertyCreatedNotification({
      hostName: host?.name,
      hostEmail: host?.email ?? user.email,
      propertyName: property.name,
      city: property.city,
    });
  } catch (err) {
    // Best-effort : le logement est déjà créé même si l'email échoue.
    console.error("sendPropertyCreatedNotification failed:", err);
  }

  return NextResponse.json({ ok: true });
}
