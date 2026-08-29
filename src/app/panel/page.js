import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/Hero";

export default async function PanelPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: host } = await supabase.from("hosts").select("*").eq("id", user.id).single();

  return (
    <main className="flex-1">
      <Hero eyebrow="Panel hotelero" title={host?.name ? `Hola, ${host.name}` : "Bienvenido"} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-sand-dim bg-sand-card p-5">
          <p className="text-ink">Email: {host?.email ?? user.email}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/panel/alojamientos"
            className="rounded border border-sand-dim bg-sand-card p-4 font-bold text-ink transition-colors hover:border-aqua-deep"
          >
            Tus alojamientos →
          </Link>
          <Link
            href="/panel/perfil"
            className="rounded border border-sand-dim bg-sand-card p-4 font-bold text-ink transition-colors hover:border-aqua-deep"
          >
            Perfil y logo →
          </Link>
        </div>
      </section>
    </main>
  );
}
