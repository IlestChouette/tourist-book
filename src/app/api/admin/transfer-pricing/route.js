import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { applyPricingToAllProperties } from "@/lib/transferPricing";

// Enregistre les prix nets par ville et la commission, puis les applique
// immédiatement aux tarifs aéroport de tous les logements concernés.
export async function PUT(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const { commissionPct, cities } = await request.json();
  const pct = Number(commissionPct);
  const valid =
    Number.isFinite(pct) &&
    pct >= 0 &&
    pct <= 100 &&
    Array.isArray(cities) &&
    cities.every((c) => c.city && Number(c.net_small) > 0 && Number(c.net_large) > 0);
  if (!valid) return NextResponse.json({ error: "Valeurs invalides" }, { status: 400 });

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { error: settingError } = await admin
    .from("app_settings")
    .upsert({ key: "transfer_commission_pct", value: pct, updated_at: now });
  if (settingError) return NextResponse.json({ error: settingError.message }, { status: 500 });

  for (const c of cities) {
    const { error } = await admin
      .from("transfer_city_rates")
      .update({ net_small: Number(c.net_small), net_large: Number(c.net_large), updated_at: now })
      .eq("city", c.city);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: saved } = await admin.from("transfer_city_rates").select("city, label, net_small, net_large");
  try {
    const updatedProperties = await applyPricingToAllProperties({ commissionPct: pct, cities: saved ?? [] });
    return NextResponse.json({ ok: true, updatedProperties });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
