import { createAdminClient } from "@/lib/supabase/admin";

// Historique : passait par un fichier JSON local partagé entre tous les
// hôtes (src/lib/store.js), jamais migré vers Supabase lors du passage au
// multi-hôtes — chaque logement voyait donc le même livre d'or, et rien ne
// persistait de façon fiable sur l'hébergement serverless. Passe maintenant
// par la table guestbook_entries, scopée par propriété comme le reste.

function toClientShape(row) {
  return { id: row.id, createdAt: row.created_at, hidden: row.hidden, nom: row.nom, message: row.message };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const all = searchParams.get("all");
  if (!slug) return Response.json([]);

  const admin = createAdminClient();
  const { data: property } = await admin.from("properties").select("id").eq("slug", slug).maybeSingle();
  if (!property) return Response.json([]);

  let query = admin
    .from("guestbook_entries")
    .select("*")
    .eq("property_id", property.id)
    .order("created_at", { ascending: false });
  if (!all) query = query.eq("hidden", false);

  const { data, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json((data ?? []).map(toClientShape));
}

export async function POST(request) {
  const { slug, nom, message } = await request.json();
  if (!slug || !nom || !message) {
    return Response.json({ error: "Données manquantes" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: property } = await admin.from("properties").select("id").eq("slug", slug).maybeSingle();
  if (!property) return Response.json({ error: "Logement introuvable" }, { status: 404 });

  const { data, error } = await admin
    .from("guestbook_entries")
    .insert({ property_id: property.id, nom, message })
    .select()
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(toClientShape(data), { status: 201 });
}

export async function PATCH(request) {
  const { id, hidden } = await request.json();
  if (!id) return Response.json({ error: "Données manquantes" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("guestbook_entries").update({ hidden }).eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
