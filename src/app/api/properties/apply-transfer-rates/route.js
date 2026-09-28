import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { transferRatesForCity } from "@/lib/transferPricing";

// Les tarifs de transfert sont admin-only en écriture (RLS) — un hôtelier ne
// peut pas les insérer lui-même. Cette route applique le tarif standard de
// la ville du logement (s'il y en a un) avec la clé service_role, appelée
// juste après la création, la duplication ou la modification d'un logement.
export async function POST(request) {
  const { propertyId, city, force } = await request.json();
  if (!propertyId) {
    return NextResponse.json({ error: "propertyId manquant" }, { status: 400 });
  }

  // Seul le propriétaire du logement (ou l'admin) peut déclencher la mise à
  // jour : la route écrit avec la clé service_role, qui ignore la RLS.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = createAdminClient();
  const [{ data: property }, { data: me }] = await Promise.all([
    admin.from("properties").select("host_id").eq("id", propertyId).single(),
    admin.from("hosts").select("is_admin").eq("id", user.id).single(),
  ]);
  if (!property || (property.host_id !== user.id && !me?.is_admin)) {
    return NextResponse.json({ error: "Logement introuvable" }, { status: 404 });
  }

  const rates = await transferRatesForCity(city);
  if (!rates) return NextResponse.json({ applied: false });

  // Sans "force" (cas d'une simple modification du logement), on ne touche
  // pas des tarifs déjà présents — l'admin a pu les personnaliser à la main
  // pour ce logement précis. "force" (création, duplication) part toujours
  // d'une fiche neuve : rien à préserver.
  if (!force) {
    const { count } = await admin
      .from("transfer_rates")
      .select("id", { count: "exact", head: true })
      .eq("property_id", propertyId)
      .eq("pickup_location", "airport");
    if (count > 0) return NextResponse.json({ applied: false, reason: "already_set" });
  } else {
    await admin.from("transfer_rates").delete().eq("property_id", propertyId).eq("pickup_location", "airport");
  }

  const { error } = await admin
    .from("transfer_rates")
    .insert(rates.map((r) => ({ property_id: propertyId, ...r })));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applied: true });
}
