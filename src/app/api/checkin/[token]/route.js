import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword, randomPassword } from "@/lib/password";
import { sendGuestCheckinCredentials } from "@/lib/email";

export async function GET(request, { params }) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: reservation } = await admin
    .from("reservations")
    .select(
      "id, guest_name, arrival_date, departure_date, status, property_id, properties(name, slug, host_id, house_rules, hosts(logo_url))"
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
    houseRules: reservation.properties?.house_rules || null,
  });
}

export async function POST(request, { params }) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: reservation } = await admin
    .from("reservations")
    .select("id, property_id, guest_name, properties(slug, name, house_rules)")
    .eq("token", token)
    .single();

  if (!reservation) {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
  }

  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const documentNumber = formData.get("documentNumber");
  const nationality = formData.get("nationality");
  const idDocument = formData.get("idDocument");
  const selfie = formData.get("selfie");
  const signature = formData.get("signature");
  const houseRulesAcceptedRaw = formData.get("houseRulesAccepted");

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !email ||
    !documentNumber ||
    !nationality ||
    !idDocument ||
    !selfie ||
    !signature
  ) {
    return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
  }

  // Si le logement a des règles, le voyageur doit avoir choisi accepter/refuser
  // explicitement — sinon (pas de règles définies) rien à accepter.
  const hasHouseRules = Boolean(reservation.properties?.house_rules?.trim());
  if (hasHouseRules && houseRulesAcceptedRaw !== "true" && houseRulesAcceptedRaw !== "false") {
    return NextResponse.json({ error: "Merci d'indiquer si vous acceptez le règlement intérieur." }, { status: 400 });
  }
  const houseRulesAccepted = hasHouseRules ? houseRulesAcceptedRaw === "true" : null;

  const idExt = idDocument.name.split(".").pop();
  const selfieExt = selfie.name.split(".").pop();
  const idPath = `${reservation.id}/documento.${idExt}`;
  const selfiePath = `${reservation.id}/selfie.${selfieExt}`;
  const signaturePath = `${reservation.id}/firma.png`;

  const [idUpload, selfieUpload, signatureUpload] = await Promise.all([
    admin.storage.from("identity").upload(idPath, await idDocument.arrayBuffer(), {
      upsert: true,
      contentType: idDocument.type,
    }),
    admin.storage.from("identity").upload(selfiePath, await selfie.arrayBuffer(), {
      upsert: true,
      contentType: selfie.type,
    }),
    admin.storage.from("identity").upload(signaturePath, await signature.arrayBuffer(), {
      upsert: true,
      contentType: "image/png",
    }),
  ]);

  if (idUpload.error || selfieUpload.error || signatureUpload.error) {
    return NextResponse.json(
      { error: idUpload.error?.message || selfieUpload.error?.message || signatureUpload.error?.message },
      { status: 500 }
    );
  }

  const username = `${`${firstName} ${lastName}`
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
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      document_number: documentNumber,
      nationality,
      id_document_url: idPath,
      selfie_url: selfiePath,
      signature_url: signaturePath,
      house_rules_accepted: houseRulesAccepted,
      verification_status: "pendiente",
    },
    { onConflict: "reservation_id" }
  );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  await admin.from("reservations").update({ status: "check-in hecho" }).eq("id", reservation.id);

  try {
    await sendGuestCheckinCredentials({
      email,
      firstName,
      propertyName: reservation.properties?.name,
      propertySlug: reservation.properties?.slug,
      username,
      password,
    });
  } catch (err) {
    // Le check-in reste valide même si l'email échoue — les identifiants
    // restent affichés à l'écran juste après.
    console.error("sendGuestCheckinCredentials failed:", err);
  }

  const response = NextResponse.json({ username, password, slug: reservation.properties?.slug });
  // Donne un accès immédiat au livret pendant que l'hôte vérifie les documents.
  response.cookies.set(`access_${reservation.properties?.slug}`, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  // Identifie ce voyageur pour lui afficher l'état de son check-in sur le livret.
  response.cookies.set(`guest_${reservation.properties?.slug}`, reservation.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
