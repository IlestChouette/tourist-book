import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword, randomPassword } from "@/lib/password";

export async function GET(request, { params }) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: reservation } = await admin
    .from("reservations")
    .select(
      "id, guest_name, arrival_date, departure_date, status, property_id, properties(name, slug, host_id, hosts(logo_url))"
    )
    .eq("token", token)
    .single();

  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    guestName: reservation.guest_name,
    arrivalDate: reservation.arrival_date,
    departureDate: reservation.departure_date,
    hostLogoUrl: reservation.properties?.hosts?.logo_url ?? null,
    status: reservation.status,
    propertyName: reservation.properties?.name,
    propertySlug: reservation.properties?.slug,
  });
}

export async function POST(request, { params }) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: reservation } = await admin
    .from("reservations")
    .select("id, property_id, guest_name, properties(slug)")
    .eq("token", token)
    .single();

  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
  }

  const formData = await request.formData();
  const phone = formData.get("phone");
  const email = formData.get("email");
  const documentNumber = formData.get("documentNumber");
  const nationality = formData.get("nationality");
  const idDocument = formData.get("idDocument");
  const selfie = formData.get("selfie");

  if (!phone || !email || !documentNumber || !nationality || !idDocument || !selfie) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  const idExt = idDocument.name.split(".").pop();
  const selfieExt = selfie.name.split(".").pop();
  const idPath = `${reservation.id}/documento.${idExt}`;
  const selfiePath = `${reservation.id}/selfie.${selfieExt}`;

  const [idUpload, selfieUpload] = await Promise.all([
    admin.storage.from("identity").upload(idPath, await idDocument.arrayBuffer(), {
      upsert: true,
      contentType: idDocument.type,
    }),
    admin.storage.from("identity").upload(selfiePath, await selfie.arrayBuffer(), {
      upsert: true,
      contentType: selfie.type,
    }),
  ]);

  if (idUpload.error || selfieUpload.error) {
    return NextResponse.json(
      { error: idUpload.error?.message || selfieUpload.error?.message },
      { status: 500 }
    );
  }

  const username = `${reservation.guest_name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]+/g, "")}${Math.floor(100 + Math.random() * 900)}`;
  const password = randomPassword();

  const { error: upsertError } = await admin.from("guest_accounts").upsert(
    {
      reservation_id: reservation.id,
      username,
      password_hash: hashPassword(password),
      phone,
      email,
      document_number: documentNumber,
      nationality,
      id_document_url: idPath,
      selfie_url: selfiePath,
      verification_status: "pendiente",
    },
    { onConflict: "reservation_id" }
  );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  await admin.from("reservations").update({ status: "check-in hecho" }).eq("id", reservation.id);

  const response = NextResponse.json({ username, password, slug: reservation.properties?.slug });
  // Donne un accès immédiat au livret pendant que l'hôte vérifie les documents.
  response.cookies.set(`access_${reservation.properties?.slug}`, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
