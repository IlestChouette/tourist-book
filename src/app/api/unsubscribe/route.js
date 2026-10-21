import { createAdminClient } from "@/lib/supabase/admin";
import { verifyUnsubscribe } from "@/lib/unsubscribe";

const isUuid = (v) => typeof v === "string" && /^[0-9a-f-]{36}$/i.test(v);
const page = (title, text, status = 200) =>
  new Response(
    `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head><body style="font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1.5rem;color:#222"><h1 style="font-size:1.5rem">${title}</h1><p>${text}</p></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } },
  );

// Désabonnement par lien signé. GET : depuis le lien de l'email (page de confirmation).
// POST : désabonnement en un clic des clients mail (List-Unsubscribe-Post).
async function handle(request) {
  const sp = new URL(request.url).searchParams;
  const kind = sp.get("k");
  const id = sp.get("i");
  const email = (sp.get("e") ?? "").trim().toLowerCase();
  if (!["host", "digest"].includes(kind) || !isUuid(id) || !verifyUnsubscribe(kind, id, kind === "digest" ? email : "", sp.get("t"))) {
    return page("Lien invalide", "Ce lien de désabonnement n'est pas valide ou a été modifié. Écrivez-nous à allo@ilestchouette.fr et nous le ferons pour vous.", 400);
  }
  const admin = createAdminClient();

  if (kind === "host") {
    const { error } = await admin.from("hosts").update({ email_optout: true }).eq("id", id);
    if (error) return page("Une erreur est survenue", "Réessayez dans un instant ou écrivez-nous à allo@ilestchouette.fr.", 500);
    return page("Vous êtes désabonné", "Vous ne recevrez plus nos emails de rappel et de conseils. Les emails liés à votre compte et à votre abonnement continueront d'arriver.");
  }

  const { data: hotel } = await admin.from("hotels").select("notification_emails").eq("id", id).maybeSingle();
  if (!hotel) return page("Lien invalide", "Cet hôtel n'existe plus.", 404);
  const next = (hotel.notification_emails ?? []).filter((e) => e.toLowerCase() !== email);
  const { error } = await admin.from("hotels").update({ notification_emails: next }).eq("id", id);
  if (error) return page("Une erreur est survenue", "Réessayez dans un instant ou écrivez-nous à allo@ilestchouette.fr.", 500);
  return page("Adresse retirée", `${email.replace(/[<>&"]/g, "")} ne recevra plus les relèves du cahier de consignes. Le manager de l'hôtel peut la remettre à tout moment depuis Gestion.`);
}

export const GET = handle;
export const POST = handle;
