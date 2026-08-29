import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { randomToken } from "@/lib/password";

export async function POST(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { propertyId, guestName, arrivalDate, departureDate } = await request.json();
  if (!propertyId || !guestName || !arrivalDate || !departureDate) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: property } = await admin
    .from("properties")
    .select("id, host_id, plan")
    .eq("id", propertyId)
    .single();

  if (!property || property.host_id !== user.id) {
    return NextResponse.json({ error: "Alojamiento no encontrado" }, { status: 404 });
  }
  if (property.plan !== "premium") {
    return NextResponse.json(
      { error: "El check-in solo está disponible en el plan Premium." },
      { status: 403 }
    );
  }

  const token = randomToken();
  const { data: reservation, error } = await admin
    .from("reservations")
    .insert({
      property_id: propertyId,
      guest_name: guestName,
      arrival_date: arrivalDate,
      departure_date: departureDate,
      token,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(reservation, { status: 201 });
}

export async function GET(request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("propertyId");

  const admin = createAdminClient();
  const { data: property } = await admin
    .from("properties")
    .select("id, host_id")
    .eq("id", propertyId)
    .single();
  if (!property || property.host_id !== user.id) {
    return NextResponse.json({ error: "Alojamiento no encontrado" }, { status: 404 });
  }

  const { data } = await admin
    .from("reservations")
    .select("*, guest_accounts(verification_status)")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  return NextResponse.json(data ?? []);
}
