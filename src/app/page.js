import Link from "next/link";
import Image from "next/image";
import PricingCards from "@/components/PricingCards";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function WifiIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M3 8.5a14 14 0 0 1 18 0" />
      <path d="M6.5 12a9 9 0 0 1 11 0" />
      <path d="M9.5 15.5a4.5 4.5 0 0 1 5 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 9l-2 6-6 2 2-6 6-2z" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 16V11l2-4h12l2 4v5" />
      <path d="M4 16h16" />
      <circle cx="7.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H10l-4.5 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M12 3.5l7 2.6v5.4c0 4.5-2.9 7.5-7 9-4.1-1.5-7-4.5-7-9V6.1l7-2.6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5v-13z" />
    </svg>
  );
}

const features = [
  { icon: <WifiIcon />, title: "Wifi y horarios al instante", desc: "Contraseña, llegada, salida y aparcamiento, indicaciones de cómo acceder a la propiedad — sin repetir el mismo mensaje a cada huésped." },
  { icon: <CompassIcon />, title: "Guía local con buscador", desc: "Tus recomendaciones de restaurantes, playas y museos, organizadas por categoría." },
  { icon: <CarIcon />, title: "Reserva de transfer", desc: "El huésped pide su traslado directamente desde el livret, sin llamadas con tarifas fijas." },
  { icon: <BookIcon />, title: "Carnet de visita", desc: "Un libro de recuerdos digital donde tus huéspedes dejan su mensaje." },
  { icon: <ChatIcon />, title: "Asistente virtual", desc: "Responde las preguntas frecuentes del huésped a cualquier hora." },
  { icon: <LogoIcon />, title: "Con tu propio logo", desc: "Tu marca en cada página que ve el huésped, desde el primer clic." },
];

const comparison = [
  { label: "Livret digital en FR / EN / ES", basico: true, premium: true },
  { label: "Wifi, horarios, aparcamiento, contacto", basico: true, premium: true },
  { label: "Guía local con buscador", basico: true, premium: true },
  { label: "Reserva de transfer y carnet de visita", basico: true, premium: true },
  { label: "Asistente virtual", basico: true, premium: true },
  { label: "Tu logo en cada página", basico: true, premium: true },
  { label: "Enlace único de check-in por reserva", basico: false, premium: true },
  { label: "Documento de identidad + selfie", basico: false, premium: true },
  { label: "Verificación manual desde tu panel", basico: false, premium: true },
  { label: "Usuario y contraseña automáticos para el huésped", basico: false, premium: true },
];

function Check({ on }) {
  if (!on) return <span className="text-ink/25">—</span>;
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" className="text-sage">
      <path
        d="M4 10.5l3.5 3.5L16 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const metadata = {
  title: "Tourist Book — Livret de acogida digital y check-in",
  description:
    "El livret de bienvenida y el check-in electrónico de tus huéspedes, por alojamiento, desde 7€/mes o 39,99€/año con 1 mes gratis.",
};

export default function Home() {
  return (
    <main className="flex-1">
      <header className="bg-[#2f7d76]">
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/tourist book long.png"
              alt="Tourist Book"
              width={278}
              height={106}
              className="h-20 w-auto drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] sm:h-24"
              priority
            />
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/panel/login" className="text-sm font-bold text-[#f7f1e4]/80 hover:text-[#f7f1e4]">
              Iniciar sesión
            </Link>
            <Link
              href="/panel/registro"
              className="rounded bg-terracotta px-4 py-2 text-sm font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              Crear cuenta →
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden bg-aqua-deep">
        <div className="mx-auto max-w-3xl px-6 pb-20 pt-6 text-center sm:pb-28 sm:pt-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#f7f1e4]/80">
            Para hoteleros y anfitriones de la Côte d&apos;Azur
          </span>
          <h1 className="mt-5 font-display italic text-4xl leading-tight text-[#f7f1e4] sm:text-5xl">
            El libro de bienvenida de tus huéspedes, sin imprimir una sola página
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[#f7f1e4]/90">
            Wifi, horarios, recomendaciones locales y check-in electrónico — todo en un enlace que
            envías antes de que lleguen. Desde Beausoleil hasta Niza.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/panel/registro"
              className="rounded bg-terracotta px-6 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
            >
              Crear mi cuenta gratis →
            </Link>
            <a
              href="#planes"
              className="rounded border border-[#f7f1e4]/40 px-6 py-3.5 font-bold text-[#f7f1e4] transition-colors hover:border-[#f7f1e4]"
            >
              Ver los planes
            </a>
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-widest text-[#f7f1e4]/70">
            Desde 7 €/mes sin permanencia · O anual desde 39,99 €/año con 1 mes gratis
          </p>
        </div>
        <div className="stripe-band" />
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-terracotta-deep">Antes</span>
            <p className="mt-3 font-display italic text-2xl text-ink">
              Un PDF perdido en el email, un grupo de WhatsApp que nadie relee, un formulario difícil
              de utilizar, y la misma pregunta del wifi a las 23h.
            </p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-aqua-deep">Con Tourist Book</span>
            <p className="mt-3 font-display italic text-2xl text-ink">
              Un único enlace, actualizado al instante, en tres idiomas, con tu logo — y el check-in
              hecho antes de que lleguen tus huéspedes.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-sand-card py-20">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center font-display italic text-3xl text-ink">Todo lo que necesita tu huésped</h2>
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-ink">
                  {f.icon}
                </span>
                <div>
                  <h3 className="font-bold text-ink">{f.title}</h3>
                  <p className="mt-1 text-sm text-ink/70">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-5xl px-6 py-20">
        <h2 className="text-center font-display italic text-3xl text-ink">Cómo funciona</h2>
        <div className="mt-12 grid gap-10 sm:grid-cols-3">
          {[
            { n: "1", t: "Crea tu cuenta y añade tu alojamiento", d: "Nombre, fotos, wifi, horarios — 5 minutos." },
            { n: "2", t: "Elige el plan de esa propiedad", d: "Básico o Premium, anual o por temporada, según cada alojamiento." },
            { n: "3", t: "Comparte el enlace con tus huéspedes", d: "Por WhatsApp, email o Airbnb — como prefieras." },
          ].map((s) => (
            <div key={s.n}>
              <span className="font-display italic text-3xl text-terracotta-deep">{s.n}</span>
              <h3 className="mt-2 font-bold text-ink">{s.t}</h3>
              <p className="mt-1 text-sm text-ink/70">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="planes" className="bg-sand-card py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <h2 className="font-display italic text-3xl text-ink">Un plan por cada alojamiento</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink/70">
              No por cuenta — si gestionas varias propiedades, cada una elige su plan. Sin registrarte
              puedes ver aquí mismo lo que incluye cada uno.
            </p>
          </div>

          <div className="mt-12">
            <PricingCards />
          </div>

          <div className="mt-10 overflow-x-auto rounded-xl border border-sand-dim">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-sand-dim bg-sand">
                  <th className="px-5 py-3 text-left font-bold text-ink/70">Incluye</th>
                  <th className="px-5 py-3 text-center font-bold text-aqua-deep">Básico</th>
                  <th className="px-5 py-3 text-center font-bold text-terracotta-deep">Premium</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-b border-sand-dim last:border-0">
                    <td className="px-5 py-3 text-ink/80">{row.label}</td>
                    <td className="px-5 py-3 text-center">
                      <Check on={row.basico} />
                    </td>
                    <td className="px-5 py-3 text-center">
                      <Check on={row.premium} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-center text-xs text-ink/50">
            Plan anual: 1 mes de prueba gratuita la primera vez que te suscribes (por cuenta, no por
            alojamiento); la suscripción se renueva cada año y solo puede cancelarse una vez
            transcurrido el año en curso. Plan por temporada: sin prueba gratuita, facturación
            mensual, cancela cuando quieras.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-aqua-deep text-[#f7f1e4]">
          <ShieldIcon />
        </span>
        <h2 className="mt-5 font-display italic text-2xl text-ink">
          Pensado para la Côte d&apos;Azur, no para una cadena hotelera
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-ink/70">
          Beausoleil, Roquebrune-Cap-Martin, Saint-Paul-de-Vence, Niza y otras ciudades de la Côte
          d&apos;Azur — Tourist Book está hecho para el anfitrión que gestiona uno o varios
          alojamientos él mismo, no para una gestora de cien propiedades.
        </p>
      </section>

      <section className="bg-aqua-deep py-16 text-center">
        <h2 className="font-display italic text-3xl text-[#f7f1e4]">
          ¿Listo para dejar de imprimir libros de bienvenida?
        </h2>
        <Link
          href="/panel/registro"
          className="mt-6 inline-block rounded bg-terracotta px-7 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
        >
          Crear mi cuenta gratis →
        </Link>
      </section>

      <footer className="border-t border-sand-dim">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-4">
            <div>
              <span className="font-display italic text-lg text-ink">Tourist Book</span>
              <p className="mt-2 text-sm text-ink/60">
                Livret de acogida digital y check-in electrónico para alojamientos de la Côte d&apos;Azur.
              </p>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-ink/50">Producto</span>
              <ul className="mt-3 grid gap-2 text-sm">
                <li><Link href="/#planes" className="text-ink/70 hover:text-ink">Planes y precios</Link></li>
                <li><a href="/#como-funciona" className="text-ink/70 hover:text-ink">Cómo funciona</a></li>
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
    </main>
  );
}
