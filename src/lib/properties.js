import { createAdminClient } from "@/lib/supabase/admin";

// Lecture publique d'un logement par son slug, pour les pages du livret
// (Server Components). Utilise la clé service_role : ces pages sont déjà
// protégées par le code d'accès (proxy.js), pas besoin de session hôtelier.
export async function getPropertyBySlug(slug) {
  const admin = createAdminClient();
  const { data } = await admin.from("properties").select("*, hosts(logo_url)").eq("slug", slug).single();
  if (!data) return data;

  const { data: rates } = await admin
    .from("transfer_rates")
    .select("pickup_location, passengers, price")
    .eq("property_id", data.id)
    .order("passengers", { ascending: true });

  return { ...data, transfer_rates: rates ?? [] };
}

// Un logement créé mais jamais souscrit (subscription_status: null) ou dont
// l'abonnement a expiré/été annulé ne doit pas avoir de livret fonctionnel —
// sans ça, un hôte pourrait créer un logement, ne jamais payer, et partager
// quand même le lien à ses voyageurs indéfiniment.
export function hasActiveSubscription(property) {
  return ["trialing", "active"].includes(property?.subscription_status);
}
