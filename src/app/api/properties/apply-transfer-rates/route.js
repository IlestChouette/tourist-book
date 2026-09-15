import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { transferRatesForCity } from "@/lib/transferCityRates";

// Les tarifs de transfert sont admin-only en écriture (RLS) — un hôtelier ne
// peut pas les insérer lui-même. Cette route applique le tarif standard de
// la ville du logement (s'il y en a un) avec la clé service_role, appelée
// juste après la création ou la duplication d'un logement.
export async function POST(request) {
  const { propertyId, city, force } = await request.json();
  if (!propertyId) {
    return NextResponse.json({ error: "propertyId manquant" }, { status: 400 });
  }

  const rates = transferRatesForCity(city);
  if (!rates) return NextResponse.json({ applied: false });

  const admin = createAdminClient();

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
