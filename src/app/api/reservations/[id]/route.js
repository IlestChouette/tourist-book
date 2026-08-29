import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function loadOwned(id, userId) {
  const admin = createAdminClient();
  const { data: reservation } = await admin
    .from("reservations")
    .select("*, properties(id, name, host_id), guest_accounts(*)")
    .eq("id", id)
    .single();

  if (!reservation || reservation.properties?.host_id !== userId) {
    return null;
  }
  return { reservation, admin };
}

export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const loaded = await loadOwned(id, user.id);
  if (!loaded) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const { reservation, admin } = loaded;
  const guestAccount = reservation.guest_accounts;

  let idDocumentUrl = null;
  let selfieUrl = null;
  if (guestAccount) {
    const [idSigned, selfieSigned] = await Promise.all([
      admin.storage.from("identity").createSignedUrl(guestAccount.id_document_url, 120),
      admin.storage.from("identity").createSignedUrl(guestAccount.selfie_url, 120),
    ]);
    idDocumentUrl = idSigned.data?.signedUrl ?? null;
    selfieUrl = selfieSigned.data?.signedUrl ?? null;
  }

  return NextResponse.json({
    id: reservation.id,
    guestName: reservation.guest_name,
    arrivalDate: reservation.arrival_date,
    departureDate: reservation.departure_date,
    status: reservation.status,
    propertyName: reservation.properties?.name,
    guestAccount: guestAccount
      ? {
          username: guestAccount.username,
          phone: guestAccount.phone,
          email: guestAccount.email,
          documentNumber: guestAccount.document_number,
          nationality: guestAccount.nationality,
          verificationStatus: guestAccount.verification_status,
          idDocumentUrl,
          selfieUrl,
        }
      : null,
  });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const loaded = await loadOwned(id, user.id);
  if (!loaded) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const { verificationStatus } = await request.json();
  if (!["aprobado", "rechazado", "pendiente"].includes(verificationStatus)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const { admin, reservation } = loaded;
  const guestAccount = reservation.guest_accounts;
  if (!guestAccount) return NextResponse.json({ error: "Sin check-in todavía" }, { status: 400 });

  await admin
    .from("guest_accounts")
    .update({ verification_status: verificationStatus })
    .eq("reservation_id", id);

  return NextResponse.json({ ok: true });
}
