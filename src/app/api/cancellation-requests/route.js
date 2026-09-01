import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const { propertyId, reason } = await request.json();
  if (!propertyId || !reason?.trim()) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { data: property } = await supabase
    .from("properties")
    .select("id, host_id")
    .eq("id", propertyId)
    .eq("host_id", user.id)
    .single();
  if (!property) {
    return NextResponse.json({ error: "Logement introuvable" }, { status: 404 });
  }

  const admin = createAdminClient();
  const { error } = await admin.from("cancellation_requests").insert({
    property_id: propertyId,
    host_id: user.id,
    reason: reason.trim(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
