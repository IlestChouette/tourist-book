import { NextResponse } from "next/server";
import { sendHostSignupNotification } from "@/lib/email";

export async function POST(request) {
  const { name, email, phone } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email manquant" }, { status: 400 });
  }

  try {
    await sendHostSignupNotification({ name, email, phone });
  } catch (err) {
    // Best-effort : le compte est déjà créé même si l'email échoue.
    console.error("sendHostSignupNotification failed:", err);
  }

  return NextResponse.json({ ok: true });
}
