import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendPasswordResetEmail } from "@/lib/email";

// Base des liens envoyés par email : jamais dérivée de la requête (l'en-tête
// Host/Origin est contrôlable par un attaquant, qui pourrait faire envoyer à
// la victime un lien valide menant vers son propre site).
const SITE_URL = process.env.SITE_URL || "https://tourist-book.com";
const LOCALES = ["fr", "en", "es"];
const THROTTLE_MS = 60_000;

// Demande de réinitialisation de mot de passe. La réponse dit si un compte existe
// avec cet email, pour inviter à en créer un sinon (choix produit : cela révèle
// quels emails sont inscrits ; l'envoi reste limité à un email par minute).
export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const address = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!address || address.length > 254 || !address.includes("@")) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }
  const locale = LOCALES.includes(body.locale) ? body.locale : "fr";
  let found = false;

  try {
    const admin = createAdminClient();

    // Un seul email par minute et par adresse : sans ça, ce endpoint public
    // permettrait d'inonder la boîte d'un hôtelier (et de griller notre
    // réputation d'expéditeur).
    const since = new Date(Date.now() - THROTTLE_MS).toISOString();
    const { count } = await admin
      .from("email_log")
      .select("id", { count: "exact", head: true })
      .eq("recipient", address)
      .eq("template", "password_reset")
      .gt("created_at", since);

    // Un email envoyé dans la dernière minute prouve que le compte existe.
    if (count) found = true;
    if (!count) {
      const { data, error } = await admin.auth.admin.generateLink({ type: "recovery", email: address });
      const tokenHash = data?.properties?.hashed_token;
      if (!error && tokenHash) {
        found = true;
        const link = `${SITE_URL}/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}&type=recovery&next=/panel/restablecer-password`;
        await sendPasswordResetEmail({ to: address, link, locale });
      }
    }
  } catch (err) {
    console.error("forgot-password failed:", err);
  }

  return NextResponse.json({ ok: true, found });
}
