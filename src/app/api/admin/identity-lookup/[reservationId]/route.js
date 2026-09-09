import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Génère les liens signés (120s, comme pour l'hôtelier) pour UNE réservation
// précise, seulement quand l'admin clique explicitement dessus — jamais en
// listant les résultats de recherche. Chaque génération est tracée.
export async function GET(request, { params }) {
  const { reservationId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: me } = await supabase.from("hosts").select("is_admin, email").eq("id", user.id).single();
  if (!me?.is_admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const admin = createAdminClient();
  const { data: reservation } = await admin
    .from("reservations")
    .select("id, guest_name, guest_accounts(id_document_url, selfie_url)")
    .eq("id", reservationId)
    .single();

  const ga = reservation?.guest_accounts;
  if (!reservation || !ga) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const [idSigned, selfieSigned] = await Promise.all([
    admin.storage.from("identity").createSignedUrl(ga.id_document_url, 120),
    admin.storage.from("identity").createSignedUrl(ga.selfie_url, 120),
  ]);

  await admin.from("identity_access_log").insert({
    admin_email: me.email,
    reservation_id: reservation.id,
    guest_name: reservation.guest_name,
  });

  return NextResponse.json({
    idDocumentUrl: idSigned.data?.signedUrl ?? null,
    selfieUrl: selfieSigned.data?.signedUrl ?? null,
  });
}
