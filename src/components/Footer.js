import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-sand-dim bg-sand">
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display italic text-lg text-ink">Tourist Book</span>
            <p className="mt-2 text-sm text-ink/60">
              Livret de acogida digital y check-in electrónico para alojamientos de la Côte d&apos;Azur.
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-ink/50">Producto</span>
            <ul className="mt-3 grid gap-2 text-sm">
              <li><Link href="/#planes" className="text-ink/70 hover:text-ink">Planes y precios</Link></li>
              <li><Link href="/#como-funciona" className="text-ink/70 hover:text-ink">Cómo funciona</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-ink/50">Cuenta</span>
            <ul className="mt-3 grid gap-2 text-sm">
              <li><Link href="/panel/registro" className="text-ink/70 hover:text-ink">Crear cuenta</Link></li>
              <li><Link href="/panel/login" className="text-ink/70 hover:text-ink">Iniciar sesión</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-ink/50">Legal</span>
            <ul className="mt-3 grid gap-2 text-sm">
              <li><Link href="/terminos" className="text-ink/70 hover:text-ink">Términos de uso</Link></li>
              <li><Link href="/privacidad" className="text-ink/70 hover:text-ink">Política de privacidad</Link></li>
              <li><Link href="/privacidad#cookies" className="text-ink/70 hover:text-ink">Cookies</Link></li>
              <li><Link href="/aviso-legal" className="text-ink/70 hover:text-ink">Aviso legal</Link></li>
              <li><Link href="/mapa-del-sitio" className="text-ink/70 hover:text-ink">Mapa del sitio</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-sand-dim pt-6 text-xs text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Tourist Book</span>
          <span>
            Creado por{" "}
            <Link href="/aviso-legal" className="font-bold text-ink/70 hover:text-ink">
              Il est chouette
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
