import Hero from "@/components/Hero";

export const metadata = { title: "Política de privacidad — Tourist Book" };

export default function PrivacidadPage() {
  return (
    <main className="flex-1">
      <Hero eyebrow="Legal" title="Política de privacidad" />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-terracotta bg-sand-card p-4 text-sm text-ink/80">
          <strong>Aviso:</strong> plantilla de partida conforme a los principios del RGPD, no asesoría
          legal. Revísala con un especialista antes de operar con clientes reales — en particular la
          gestión de documentos de identidad (plan Premium).
        </div>

        <div className="mt-8 grid gap-6 text-ink/80">
          <div>
            <h2 className="font-display italic text-2xl text-ink">Responsable del tratamiento</h2>
            <p className="mt-2">Tourist Book — [razón social y dirección a completar].</p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">Qué datos recogemos</h2>
            <ul className="mt-2 grid gap-1">
              <li>• Del hotelero: nombre, email, datos de facturación (gestionados por Stripe).</li>
              <li>
                • Del huésped (plan Premium, check-in electrónico): nombre, teléfono, email, hora de
                llegada, y una foto de su documento de identidad.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">Para qué los usamos</h2>
            <p className="mt-2">
              Exclusivamente para prestar el servicio: generar el livret de acogida, gestionar el
              check-in y crear el acceso del huésped a la información de su alojamiento. No vendemos
              datos a terceros.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">Documentos de identidad</h2>
            <p className="mt-2">
              Se almacenan cifrados, en un espacio privado no accesible públicamente, y solo el hotelero
              correspondiente puede consultarlos. Se conservan durante el tiempo necesario para la
              estancia y las obligaciones legales aplicables, y después se eliminan.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">Tus derechos (RGPD)</h2>
            <p className="mt-2">
              Puedes solicitar el acceso, rectificación, supresión, portabilidad u oposición al
              tratamiento de tus datos escribiendo a [email de contacto a completar].
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">Subencargados</h2>
            <ul className="mt-2 grid gap-1">
              <li>• Supabase (base de datos y almacenamiento)</li>
              <li>• Stripe (pagos y facturación)</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
