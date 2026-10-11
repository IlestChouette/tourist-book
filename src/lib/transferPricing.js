import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeCity, ratesFromNet } from "@/lib/transferCityRates";

// Tarifs par ville et commission, fixés par l'admin (/admin/tarifas) —
// serveur uniquement (clé service_role). Les villes absentes restent "sur
// demande" : aucun tarif appliqué.
export async function getTransferPricing() {
  const admin = createAdminClient();
  const [{ data: cities, error }, { data: setting }] = await Promise.all([
    admin.from("transfer_city_rates").select("city, label, net_small, net_large").order("label"),
    admin.from("app_settings").select("value").eq("key", "transfer_commission_pct").maybeSingle(),
  ]);
  if (error) throw new Error(`transfer_city_rates: ${error.message}`);
  return { commissionPct: Number(setting?.value ?? 20), cities: cities ?? [] };
}

// Commission configurée (20 % tant que l'admin n'a rien changé).
export async function getTransferCommissionPct() {
  const { data: setting } = await createAdminClient()
    .from("app_settings")
    .select("value")
    .eq("key", "transfer_commission_pct")
    .maybeSingle();
  const pct = Number(setting?.value ?? 20);
  return Number.isFinite(pct) && pct >= 0 ? pct : 20;
}

export async function transferRatesForCity(city) {
  const { commissionPct, cities } = await getTransferPricing();
  const row = cities.find((c) => c.city === normalizeCity(city));
  return row ? ratesFromNet(row, commissionPct) : null;
}

// Remplace les tarifs aéroport de chaque logement dont la ville a un tarif
// standard. Renvoie le nombre de logements mis à jour.
// ponytail: une requête par logement, suffisant tant qu'il y en a quelques centaines.
export async function applyPricingToAllProperties({ commissionPct, cities }) {
  const admin = createAdminClient();
  const { data: properties } = await admin.from("properties").select("id, city");
  let updated = 0;
  for (const p of properties ?? []) {
    const row = cities.find((c) => c.city === normalizeCity(p.city));
    if (!row) continue;
    await admin.from("transfer_rates").delete().eq("property_id", p.id).eq("pickup_location", "airport");
    const { error } = await admin
      .from("transfer_rates")
      .insert(ratesFromNet(row, commissionPct).map((r) => ({ property_id: p.id, ...r })));
    if (error) throw new Error(`transfer_rates (${p.id}): ${error.message}`);
    updated += 1;
  }
  return updated;
}
