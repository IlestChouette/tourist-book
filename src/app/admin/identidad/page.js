import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import IdentidadLookupClient from "./IdentidadLookupClient";

export const metadata = { robots: { index: false, follow: false } };

export default async function IdentidadLookupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) notFound();

  return <IdentidadLookupClient />;
}
