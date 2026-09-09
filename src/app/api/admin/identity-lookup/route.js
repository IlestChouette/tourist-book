import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Recherche de réservations pour retrouver un check-in précis (nom du
// voyageur + dates) sans exposer les documents eux-mêmes ici — les liens
// signés ne sont générés qu'à la demande, réservation par réservation, via
// /api/admin/identity-lookup/[reservationId].
export async function GET(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: me } = await supabase.from("hosts").select("is_admin, email").eq("id", user.id).single();
  if (!me?.is_admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const from = searchParams.get("from") || null;
  const to = searchParams.get("to") || null;

  if (!q && !from && !to) {
    return NextResponse.json({ results: [] });
  }

  const admin = createAdminClient();
  let query = admin
    .from("reservations")
    .select("id, guest_name, arrival_date, departure_date, properties(name), guest_accounts(verification_status)")
    .order("arrival_date", { ascending: false })
    .limit(50);

  if (q) query = query.ilike("guest_name", `%${q}%`);
  if (from) query = query.gte("arrival_date", from);
  if (to) query = query.lte("departure_date", to);

  const { data: reservations, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from("identity_access_log").insert({ admin_email: me.email, search_query: q || `${from ?? ""}..${to ?? ""}` });

  return NextResponse.json({
    results: (reservations ?? [])
      .filter((r) => r.guest_accounts)
      .map((r) => ({
        id: r.id,
        guestName: r.guest_name,
        arrivalDate: r.arrival_date,
        departureDate: r.departure_date,
        propertyName: r.properties?.name,
        verificationStatus: r.guest_accounts?.verification_status,
      })),
  });
}
