import { createAdminClient } from "@/lib/supabase/admin";

// Lecture publique d'un logement par son slug, pour les pages du livret
// (Server Components). Utilise la clé service_role : ces pages sont déjà
// protégées par le code d'accès (proxy.js), pas besoin de session hôtelier.
export async function getPropertyBySlug(slug) {
  const admin = createAdminClient();
  const { data } = await admin.from("properties").select("*").eq("slug", slug).single();
  return data;
}
