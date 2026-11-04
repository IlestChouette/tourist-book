import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

const LIVE = ["active", "trialing", "past_due", "unpaid"];
const BAN = "876000h"; // ~100 ans : « pour toujours » tant qu'on ne débloque pas

// Une souscription Stripe encore vivante : on ne supprime pas un client qui paie encore.
async function liveSubscription(id) {
  if (!id) return false;
  try {
    const s = await stripe.subscriptions.retrieve(id);
    return LIVE.includes(s.status);
  } catch {
    return false;
  }
}

// Bloquer / débloquer / supprimer un client (livret = « host », cahier = « hotel »). Réservé à l'administrateur.
export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const b = await request.json().catch(() => ({}));
  const { action, kind, id } = b;
  if (!["block", "unblock", "delete"].includes(action) || !["host", "hotel"].includes(kind) || typeof id !== "string") {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  const admin = createAdminClient();

  if (kind === "host") {
    const { data: host } = await admin.from("hosts").select("id, name, is_admin").eq("id", id).maybeSingle();
    if (!host) return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    if (host.is_admin || host.id === user.id) return NextResponse.json({ error: "Un compte administrateur ne peut pas être modifié ici." }, { status: 403 });

    if (action === "delete") {
      const { data: props } = await admin.from("properties").select("stripe_subscription_id").eq("host_id", id);
      for (const p of props ?? []) {
        if (await liveSubscription(p.stripe_subscription_id)) return NextResponse.json({ error: "Cet hôte a encore un abonnement actif. Résiliez-le dans Stripe avant de supprimer le compte." }, { status: 409 });
      }
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return NextResponse.json({ error: `Suppression impossible : ${error.message}` }, { status: 500 });
      return NextResponse.json({ ok: true });
    }
    const blocking = action === "block";
    const { error } = await admin.from("hosts").update({ blocked_at: blocking ? new Date().toISOString() : null }).eq("id", id);
    if (error) return NextResponse.json({ error: "Colonne absente : exécutez d'abord supabase/admin_block_users.sql dans Supabase." }, { status: 500 });
    // Un hôte bloqué ne peut plus se connecter à son espace.
    await admin.auth.admin.updateUserById(id, { ban_duration: blocking ? BAN : "none" });
    return NextResponse.json({ ok: true });
  }

  const { data: hotel } = await admin.from("hotels").select("id, owner_id, billing_status, billing_exempt, stripe_subscription_id").eq("id", id).maybeSingle();
  if (!hotel) return NextResponse.json({ error: "Hôtel introuvable" }, { status: 404 });
  if (hotel.owner_id === user.id) return NextResponse.json({ error: "Votre propre hôtel ne peut pas être modifié ici." }, { status: 403 });

  if (action === "delete") {
    if (await liveSubscription(hotel.stripe_subscription_id)) return NextResponse.json({ error: "Cet hôtel a encore un abonnement actif. Résiliez-le dans Stripe avant de le supprimer." }, { status: 409 });
    // Les accès de service sont des comptes à part : on les supprime avec l'hôtel.
    const { data: accounts } = await admin.from("hotel_services").select("account_user_id").eq("hotel_id", id).not("account_user_id", "is", null);
    for (const a of accounts ?? []) await admin.auth.admin.deleteUser(a.account_user_id).catch(() => {});
    const { error } = await admin.from("hotels").delete().eq("id", id);
    if (error) return NextResponse.json({ error: `Suppression impossible : ${error.message}` }, { status: 500 });
    // Le compte du responsable disparaît aussi s'il ne sert plus à rien (ni autre hôtel, ni livrets, ni administrateur).
    const [{ count: other }, { data: asHost }] = await Promise.all([
      admin.from("hotels").select("id", { count: "exact", head: true }).eq("owner_id", hotel.owner_id),
      admin.from("hosts").select("id, is_admin").eq("id", hotel.owner_id).maybeSingle(),
    ]);
    if (!other && !asHost) await admin.auth.admin.deleteUser(hotel.owner_id).catch(() => {});
    return NextResponse.json({ ok: true });
  }
  const { error } = await admin.from("hotels").update({ blocked_at: action === "block" ? new Date().toISOString() : null }).eq("id", id);
  if (error) return NextResponse.json({ error: "Colonne absente : exécutez d'abord supabase/admin_block_users.sql dans Supabase." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
