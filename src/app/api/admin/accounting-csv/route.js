import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { csvResponse } from "@/lib/csv";
import { loadDashboard, monthOf } from "@/lib/adminDashboard";

const eur = (n) => Number(n).toFixed(2).replace(".", ",");

// Exports pour la comptabilité (Excel) : factures encaissées, ou résumé mensuel. Réservé à l'administrateur.
export async function GET(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

  const type = new URL(request.url).searchParams.get("type");
  const d = await loadDashboard();
  if (type === "months") {
    const head = ["Mois", "Livrets facturés (€)", "Cahier facturé (€)", "Total facturé (€)", "Encaissé brut (€)", "Remboursé (€)", "Frais Stripe (€)", "Net encaissé (€)", "Commission transferts estimée (€)"];
    const rows = d.revenue.map((r, i) => [r.month, eur(r.livret), eur(r.cahier), eur(r.livret + r.cahier), eur(r.gross), eur(r.refunded), eur(r.fees), eur(r.gross - r.refunded - r.fees), eur(d.transfers[i]?.commission ?? 0)]);
    return csvResponse(head, rows, "tourist-book-resume-mensuel.csv");
  }
  const head = ["N° facture", "Date", "Mois", "Client", "Email", "Produit", "Montant payé (€)", "TVA (€)", "Lien facture"];
  const rows = d.bills.map((b) => [b.number ?? "", new Date(b.date * 1000).toISOString().slice(0, 10), monthOf(b.date), b.customer ?? "", b.email, b.product === "cahier" ? "Cahier de consignes" : "Livret d'accueil", eur(b.amount), "0,00", b.url]);
  return csvResponse(head, rows, "tourist-book-factures.csv");
}
