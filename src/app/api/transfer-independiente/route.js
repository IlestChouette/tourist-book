import { NextResponse } from "next/server";
import { sendIndependentTransferRequest } from "@/lib/email";

// Formulaire public, sans logement associé (partagé directement par lien à
// des voyageurs indépendants) — pas d'authentification, comme /api/requests.
export async function POST(request) {
  const body = await request.json();
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

  return NextResponse.json({ ok: true });
}
