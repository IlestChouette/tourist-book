import Hero from "@/components/Hero";

export const metadata = { title: "Términos de uso y suscripción — Tourist Book" };

export default function TerminosPage() {
  return (
    <main className="flex-1">
      <Hero eyebrow="Legal" title="Términos de uso y suscripción" />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-terracotta bg-sand-card p-4 text-sm text-ink/80">
          <strong>Aviso:</strong> este texto es una plantilla de partida, no asesoría legal. Antes de
          operar con clientes reales, hazlo revisar por un abogado especializado en protección de datos
          y derecho del consumo (UE).
        </div>

        <div className="mt-8 grid gap-6 text-ink/80">
          <div>
            <h2 className="font-display italic text-2xl text-ink">1. El servicio</h2>
            <p className="mt-2">
              Tourist Book es una plataforma que permite a hoteleros y anfitriones crear un livret de
              acogida digital para sus huéspedes, y opcionalmente gestionar el check-in electrónico
              previo a la llegada.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">2. Planes y precios</h2>
            <p className="mt-2">
              Cada alojamiento se suscribe a un plan de contenido (Básico o Premium) y a un ciclo de
              facturación (Anual o Por temporada), de forma independiente del resto de tus
              alojamientos.
            </p>
            <ul className="mt-2 grid gap-1">
              <li>• Plan Básico: livret digital (wifi, información práctica, carnet de visita, carta
                local, asistente).</li>
              <li>• Plan Premium: todo lo anterior + check-in electrónico por reserva.</li>
            </ul>
            <p className="mt-3 font-bold text-ink">Ciclo Anual</p>
            <p className="mt-1">
              39,99 €/año (Básico) o 59,99 €/año (Premium). Incluye 30 días de prueba gratuita{" "}
              <strong>una única vez por cuenta</strong>, con independencia del número de alojamientos
              que gestiones o de si te vuelves a suscribir tras una cancelación. La suscripción se
              renueva automáticamente cada año; la cancelación solo puede solicitarse una vez
              transcurrido el año en curso, y surte efecto al final de ese año (no se realizan
              reembolsos parciales).
            </p>
            <p className="mt-3 font-bold text-ink">Ciclo Por temporada</p>
            <p className="mt-1">
              7 €/mes (Básico) o 10 €/mes (Premium). Sin periodo de prueba. Facturación mensual
              recurrente; puedes cancelar en cualquier momento, y la cancelación surte efecto al final
              del mes ya facturado.
            </p>
            <p className="mt-3">Facturación gestionada por Stripe en todos los casos.</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">3. Responsabilidad sobre los datos de los huéspedes</h2>
            <p className="mt-2">
              El hotelero es responsable de la exactitud de la información que publica en su livret y de
              obtener el consentimiento de sus huéspedes para el tratamiento de sus datos durante el
              check-in electrónico (plan Premium). Tourist Book actúa como encargado del tratamiento
              respecto a esos datos, conforme al RGPD.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">4. Cuenta y uso aceptable</h2>
            <p className="mt-2">
              Eres responsable de la confidencialidad de tu contraseña y de la veracidad de la
              información de tu cuenta. No está permitido usar la plataforma para fines ilícitos ni
              para publicar contenido que infrinja derechos de terceros.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">5. Protección de datos</h2>
            <p className="mt-2">
              Consulta el detalle en nuestra{" "}
              <a href="/privacidad" className="font-bold text-aqua-deep">
                Política de Privacidad
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">6. Contacto</h2>
            <p className="mt-2">Para cualquier duda sobre estas condiciones: [email de contacto a completar].</p>
          </div>
        </div>
      </section>
    </main>
  );
}
