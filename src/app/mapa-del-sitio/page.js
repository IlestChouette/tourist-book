import Link from "next/link";
import Hero from "@/components/Hero";
import { getLocale } from "@/lib/i18n/locale";

const content = {
  fr: {
    metaTitle: "Plan du site — Tourist Book",
    eyebrow: "Navigation",
    title: "Plan du site",
    note: "Les pages de chaque logement (livret d'accueil, check-in) et le panel de l'hôtelier sont des espaces privés ou propres à chaque propriété, et ne sont pas listés ici.",
    sections: [
      {
        title: "Produit",
        links: [
          { href: "/", label: "Accueil" },
          { href: "/#planes", label: "Offres et tarifs" },
          { href: "/#como-funciona", label: "Comment ça marche" },
        ],
      },
      {
        title: "Compte",
        links: [
          { href: "/panel/registro", label: "Créer un compte" },
          { href: "/panel/login", label: "Se connecter" },
        ],
      },
      {
        title: "Légal",
        links: [
          { href: "/terminos", label: "Conditions d'utilisation" },
          { href: "/privacidad", label: "Politique de confidentialité" },
          { href: "/privacidad#cookies", label: "Cookies" },
          { href: "/aviso-legal", label: "Mentions légales" },
        ],
      },
    ],
  },
  en: {
    metaTitle: "Sitemap — Tourist Book",
    eyebrow: "Navigation",
    title: "Sitemap",
    note: "Each property's pages (welcome book, check-in) and the host panel are private or property-specific areas, and are not listed here.",
    sections: [
      {
        title: "Product",
        links: [
          { href: "/", label: "Home" },
          { href: "/#planes", label: "Plans & pricing" },
          { href: "/#como-funciona", label: "How it works" },
        ],
      },
      {
        title: "Account",
        links: [
          { href: "/panel/registro", label: "Create an account" },
          { href: "/panel/login", label: "Log in" },
        ],
      },
      {
        title: "Legal",
        links: [
          { href: "/terminos", label: "Terms of use" },
          { href: "/privacidad", label: "Privacy policy" },
          { href: "/privacidad#cookies", label: "Cookies" },
          { href: "/aviso-legal", label: "Legal notice" },
        ],
      },
    ],
  },
  es: {
    metaTitle: "Mapa del sitio — Tourist Book",
    eyebrow: "Navegación",
    title: "Mapa del sitio",
    note: "Las páginas de cada alojamiento (livret de acogida, check-in) y el panel del hotelero son áreas privadas o específicas de cada propiedad, y no se listan aquí.",
    sections: [
      {
        title: "Producto",
        links: [
          { href: "/", label: "Inicio" },
          { href: "/#planes", label: "Planes y precios" },
          { href: "/#como-funciona", label: "Cómo funciona" },
        ],
      },
      {
        title: "Cuenta",
        links: [
          { href: "/panel/registro", label: "Crear cuenta" },
          { href: "/panel/login", label: "Iniciar sesión" },
        ],
      },
      {
        title: "Legal",
        links: [
          { href: "/terminos", label: "Términos de uso" },
          { href: "/privacidad", label: "Política de privacidad" },
          { href: "/privacidad#cookies", label: "Cookies" },
          { href: "/aviso-legal", label: "Aviso legal" },
        ],
      },
    ],
  },
};

export async function generateMetadata() {
  const locale = await getLocale();
  return { title: content[locale].metaTitle };
}

export default async function MapaDelSitioPage() {
  const locale = await getLocale();
  const t = content[locale];

  return (
    <main className="flex-1">
      <Hero eyebrow={t.eyebrow} title={t.title} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {t.sections.map((section) => (
            <div key={section.title}>
              <span className="text-xs font-bold uppercase tracking-widest text-ink/50">{section.title}</span>
              <ul className="mt-3 grid gap-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-ink/80 hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm text-ink/60">{t.note}</p>
      </section>
    </main>
  );
}
