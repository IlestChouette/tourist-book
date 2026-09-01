import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/Hero";
import { getLocale } from "@/lib/i18n/locale";

export const metadata = { robots: { index: false, follow: false } };

const content = {
  fr: {
    eyebrow: "Panel hôtelier",
    welcome: "Bienvenue",
    hello: (name) => `Bonjour, ${name}`,
    email: "Email :",
    properties: "Vos logements →",
    profile: "Profil et logo →",
  },
  en: {
    eyebrow: "Host panel",
    welcome: "Welcome",
    hello: (name) => `Hi, ${name}`,
    email: "Email:",
    properties: "Your properties →",
    profile: "Profile and logo →",
  },
  es: {
    eyebrow: "Panel hotelero",
    welcome: "Bienvenido",
    hello: (name) => `Hola, ${name}`,
    email: "Email:",
    properties: "Tus alojamientos →",
    profile: "Perfil y logo →",
  },
};

export default async function PanelPage() {
  const locale = await getLocale();
  const t = content[locale];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: host } = await supabase.from("hosts").select("*").eq("id", user.id).single();

  return (
    <main className="flex-1">
      <Hero eyebrow={t.eyebrow} title={host?.name ? t.hello(host.name) : t.welcome} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-sand-dim bg-sand-card p-5">
          <p className="text-ink">{t.email} {host?.email ?? user.email}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href="/panel/alojamientos"
            className="rounded border border-sand-dim bg-sand-card p-4 font-bold text-ink transition-colors hover:border-aqua-deep"
          >
            {t.properties}
          </Link>
          <Link
            href="/panel/perfil"
            className="rounded border border-sand-dim bg-sand-card p-4 font-bold text-ink transition-colors hover:border-aqua-deep"
          >
            {t.profile}
          </Link>
        </div>
      </section>
    </main>
  );
}
