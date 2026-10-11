import { createAdminClient } from "@/lib/supabase/admin";

// Adresse propre à chaque hôtel : /hotel/<nom-de-l-hotel>/cahier. Le nom de
// l'hôtel en fait l'identifiant, avec un numéro en cas de doublon, sans
// colonne en plus dans la base.
// ponytail: lit tous les hôtels à chaque appel — suffisant pour quelques
// centaines ; ajouter une colonne `slug` indexée au-delà.

// Mots qui correspondent déjà à une page de /hotel : ils ne peuvent pas servir de nom.
const RESERVED = ["cahier", "gestion", "statistiques", "connexion", "inscription", "objets-trouves", "activer", "api"];

export function slugify(name) {
  const s = String(name ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60)
    .replace(/-$/, "");
  return s || "hotel";
}

export async function listHotelSlugs(admin = createAdminClient()) {
  const { data } = await admin.from("hotels").select("id, name, created_at").order("created_at", { ascending: true }).limit(5000);
  const used = new Set();
  return (data ?? []).map((h) => {
    let base = slugify(h.name);
    if (RESERVED.includes(base)) base = `${base}-hotel`;
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    return { id: h.id, name: h.name, slug };
  });
}

export async function slugForHotel(hotelId, admin) {
  return (await listHotelSlugs(admin)).find((h) => h.id === hotelId)?.slug ?? null;
}
