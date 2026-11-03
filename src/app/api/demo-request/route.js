import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDemoRequestNotification } from "@/lib/email";

// Les trois questions du parcours /demo-livret : on n'accepte que ces réponses.
const QUESTIONS = [
  { q: "Logements gérés :", options: ["1", "2 à 5", "6 à 20", "Plus de 20"] },
  { q: "Accueil des voyageurs aujourd'hui :", options: ["Un PDF ou des emails", "WhatsApp ou messages", "Un livret papier", "Rien de formel"] },
  { q: "Ce qui ferait gagner le plus de temps :", options: ["Les questions répétitives (wifi, horaires)", "Le check-in et les pièces d'identité", "La traduction pour les voyageurs étrangers", "Les transferts"] },
];
const clean = (v, max) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

// Demande de démonstration gratuite : endpoint public, donc entrées bornées. Enregistre dans
// contact_leads (déjà lu par l'admin) et prévient par email.
export async function POST(request) {
  const b = await request.json().catch(() => ({}));
  if (b.website) return NextResponse.json({ ok: true }, { status: 201 }); // champ-piège : un robot le remplit

  const name = clean(b.name, 120), phone = clean(b.phone, 40), email = clean(b.email, 200);
  if (!name || phone.length < 6 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Vérifiez votre nom, votre téléphone et votre email." }, { status: 400 });
  }
  const picks = Array.isArray(b.answers) ? b.answers : [];
  const answers = QUESTIONS.map((Q, i) => ({ q: Q.q, a: Q.options.includes(picks[i]) ? picks[i] : "-" }));
  const source = clean(b.source, 300);

  const message = ["Démo gratuite demandée (/demo-livret)", ...answers.map((a) => `${a.q} ${a.a}`), ...(source ? [`Source : ${source}`] : [])].join("\n");
  const { error } = await createAdminClient().from("contact_leads").insert({
    name,
    phone,
    email,
    properties_count: null,
    message,
  });
  if (error) {
    console.error("demo request insert failed:", error);
    return NextResponse.json({ error: "Impossible d'enregistrer la demande. Réessayez." }, { status: 500 });
  }

  try {
    await sendDemoRequestNotification({ name, phone, email, answers, source });
  } catch (err) {
    console.error("sendDemoRequestNotification failed:", err);
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
