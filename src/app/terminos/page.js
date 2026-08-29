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
            <ul className="mt-2 grid gap-1">
              <li>• Plan Básico — 29,99 €/mes: livret digital (wifi, información práctica, carnet de
                visita, carta local, asistente).</li>
              <li>• Plan Premium — 49,99 €/mes: todo lo anterior + check-in electrónico por reserva.</li>
            </ul>
            <p className="mt-2">
              Ambos planes incluyen 30 días de prueba gratuita. Facturación mensual recurrente gestionada
              por Stripe. Puedes cancelar en cualquier momento desde tu panel; la cancelación surte
              efecto al final del periodo ya facturado.
            </p>
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
