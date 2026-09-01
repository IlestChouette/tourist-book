import Link from "next/link";
import Hero from "@/components/Hero";

export const metadata = { title: "Mapa del sitio — Tourist Book" };

const sections = [
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
];

export default function MapaDelSitioPage() {
  return (
    <main className="flex-1">
      <Hero eyebrow="Navegación" title="Mapa del sitio" />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          {sections.map((section) => (
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
        <p className="mt-10 text-sm text-ink/60">
          Las páginas de cada alojamiento (livret de acogida, check-in) y el panel del hotelero son áreas
          privadas o específicas de cada propiedad, y no se listan aquí.
        </p>
      </section>
    </main>
  );
}
