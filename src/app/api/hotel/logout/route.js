import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Déconnexion du manager, côté serveur : efface la session Supabase même si
// l'appel réseau du navigateur échoue ou si les cookies ne se laissent pas
// effacer depuis le JavaScript. Le poste de réception activé (cookie propre
// au poste) n'est pas touché : l'équipe garde son accès par PIN.
export async function POST(request) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "local" });
  } catch (err) {
    console.error("hotel logout signOut failed:", err);
  }
  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  // Ceinture et bretelles : on expire explicitement tous les cookies de session.
  for (const c of request.cookies.getAll()) {
    if (c.name.startsWith("sb-")) res.cookies.set(c.name, "", { path: "/", maxAge: 0 });
  }
  return res;
}
