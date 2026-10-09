import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTransferPricing } from "@/lib/transferPricing";
import { normalizeCity, ratesFromNet } from "@/lib/transferCityRates";

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
  if (!user) return NextResponse.json({ error: "Vous n'êtes pas connecté. Connectez-vous ou créez un compte pour continuer." }, { status: 401 });

  const admin = createAdminClient();
  const [{ data: property }, { data: me }] = await Promise.all([
    admin.from("properties").select("host_id").eq("id", propertyId).single(),
    admin.from("hosts").select("is_admin").eq("id", user.id).single(),
  ]);
  if (!property || (property.host_id !== user.id && !me?.is_admin)) {
    return NextResponse.json({ error: "Aucun compte ou logement trouvé. Créez un compte pour commencer." }, { status: 404 });
  }

  const { commissionPct, cities } = await getTransferPricing();
  const row = cities.find((c) => c.city === normalizeCity(city));
  const rates = row ? ratesFromNet(row, commissionPct) : null;
  if (!rates) return NextResponse.json({ applied: false });

  // Sans "force" (simple modification du logement), on ne touche pas des tarifs
  // que l'admin a pu personnaliser à la main pour ce logement précis. Mais si
  // les tarifs actuels sont ceux d'une ville standard (appliqués
  // automatiquement) et que la ville a changé (Nice → Cannes), ils doivent
  // suivre la nouvelle ville. "force" (création, duplication) part toujours
  // d'une fiche neuve : rien à préserver.
  if (!force) {
    const { data: existing } = await admin
      .from("transfer_rates")
      .select("passengers, luggage, price")
      .eq("property_id", propertyId)
      .eq("pickup_location", "airport");
    if ((existing ?? []).length > 0) {
      const signature = (list) =>
        [...list].sort((a, b) => a.passengers - b.passengers).map((r) => `${r.passengers}:${r.luggage}:${Number(r.price)}`).join("|");
      const current = signature(existing);
      if (current === signature(rates)) return NextResponse.json({ applied: false, reason: "already_set" });
      const isStandard = cities.some((c) => signature(ratesFromNet(c, commissionPct)) === current);
      if (!isStandard) return NextResponse.json({ applied: false, reason: "custom_rates" });
    }
  }
  await admin.from("transfer_rates").delete().eq("property_id", propertyId).eq("pickup_location", "airport");

  const { error } = await admin
    .from("transfer_rates")
    .insert(rates.map((r) => ({ property_id: propertyId, ...r })));

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ applied: true });
}
