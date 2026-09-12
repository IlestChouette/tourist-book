import { NextResponse } from "next/server";
import { sendPropertyCreatedNotification } from "@/lib/email";

export async function POST(request) {
  const { hostName, hostEmail, propertyName, city } = await request.json();
  if (!propertyName) {
    return NextResponse.json({ error: "Nom du logement manquant" }, { status: 400 });
  }

  try {
    await sendPropertyCreatedNotification({ hostName, hostEmail, propertyName, city });
  } catch (err) {
    // Best-effort : le logement est déjà créé même si l'email échoue.
    console.error("sendPropertyCreatedNotification failed:", err);
  }

  return NextResponse.json({ ok: true });
}
