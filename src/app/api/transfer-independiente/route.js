import { NextResponse } from "next/server";
import { sendIndependentTransferRequest } from "@/lib/email";
import { sendTransferWhatsApp } from "@/lib/whatsapp";

// Formulaire public, sans logement associé (partagé directement par lien à
// des voyageurs indépendants) — pas d'authentification, comme /api/requests.
export async function POST(request) {
  // Aucun tarif vérifiable pour un transfert sans logement : on ignore tout
  // prix envoyé par le navigateur (il serait transmis tel quel au transporteur).
  const { prixEstime: _ignored, ...body } = await request.json();
  const { nom, telephone } = body;
  if (!nom || !telephone) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  try {
    await sendIndependentTransferRequest(body);
  } catch (err) {
    console.error("sendIndependentTransferRequest failed:", err);
    return NextResponse.json({ error: "Impossible d'envoyer la demande." }, { status: 500 });
  }

  try {
    await sendTransferWhatsApp({
      propertyLabel: "Transfert indépendant (sans logement)",
      nom,
      telephone,
      details: body,
    });
  } catch (err) {
    // Best-effort : l'email est déjà parti, la demande n'est pas perdue.
    console.error("sendTransferWhatsApp failed:", err);
  }

  return NextResponse.json({ ok: true });
}
