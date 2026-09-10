import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import TarifasClient from "./TarifasClient";

export const metadata = { robots: { index: false, follow: false } };

export default async function TarifasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) notFound();

  const admin = createAdminClient();
  const { data: properties } = await admin
    .from("properties")
    .select("id, name, city")
    .order("name", { ascending: true });

  return <TarifasClient properties={properties ?? []} />;
}
