import Hero from "@/components/Hero";

export const metadata = { title: "Política de privacidad — Tourist Book" };

export default function PrivacidadPage() {
  return (
    <main className="flex-1">
      <Hero eyebrow="Legal" title="Política de privacidad" />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-terracotta bg-sand-card p-4 text-sm text-ink/80">
          <strong>Aviso:</strong> plantilla de partida redactada conforme a los principios del Reglamento
          (UE) 2016/679 (RGPD), no asesoría legal. Complétala con los datos exactos de tu empresa y hazla
          revisar por un especialista antes de operar con clientes reales — en particular por el
          tratamiento de documentos de identidad (plan Premium).
        </div>

        <div className="mt-8 grid gap-6 text-ink/80">
          <div>
            <h2 className="font-display italic text-2xl text-ink">1. Responsable del tratamiento</h2>
            <p className="mt-2">
              Tourist Book es un servicio operado por <span className="font-bold">Il est chouette</span>,
              SAS unipersonal con domicilio en 143 Promenade des Anglais, 06200 Niza, Francia (SIREN 942 069
              949, RCS Nice). Para cualquier cuestión relativa a tus datos personales puedes escribir a{" "}
              <span className="font-bold">allo@ilestchouette.fr</span>.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">2. Qué datos recogemos y de quién</h2>
            <ul className="mt-2 grid gap-1">
              <li>
                • <span className="font-bold">Del hotelero</span> (cuenta del panel): nombre, email,
                contraseña (almacenada cifrada), logotipo, datos de las propiedades gestionadas, y datos de
                facturación gestionados directamente por Stripe (no almacenamos números de tarjeta).
              </li>
              <li>
                • <span className="font-bold">Del huésped, plan Básico</span> (acceso por código): ningún
                dato personal — el acceso se hace con un código numérico compartido por el hotelero, sin
                registro.
              </li>
              <li>
                • <span className="font-bold">Del huésped, plan Premium</span> (check-in electrónico):
                nombre (indicado por el hotelero al crear la reserva), teléfono, email, nacionalidad,
                número de documento de identidad o pasaporte, una fotografía de dicho documento y una
                fotografía tipo selfie para verificación, y las fechas de estancia.
              </li>
              <li>
                • <span className="font-bold">Datos técnicos</span>: cookies estrictamente necesarias para
                mantener la sesión iniciada y el acceso al livret (ver sección 8).
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">3. Finalidad y base jurídica</h2>
            <ul className="mt-2 grid gap-1">
              <li>
                • <span className="font-bold">Ejecución del contrato</span> (art. 6.1.b RGPD): crear y
                gestionar la cuenta del hotelero, generar el livret de acogida, procesar el check-in
                electrónico y dar acceso al huésped a la información de su alojamiento durante su estancia.
              </li>
              <li>
                • <span className="font-bold">Cumplimiento de una obligación legal</span> (art. 6.1.c
                RGPD): cuando la normativa local de registro de viajeros aplicable al alojamiento lo exija,
                el hotelero puede necesitar conservar o comunicar los datos de identidad del huésped a las
                autoridades competentes.
              </li>
              <li>
                • <span className="font-bold">Interés legítimo</span> (art. 6.1.f RGPD): seguridad del
                servicio, prevención de fraude y mejora de la plataforma.
              </li>
            </ul>
            <p className="mt-2">
              No utilizamos los datos de los huéspedes con fines de marketing ni los vendemos ni cedemos a
              terceros distintos de los indicados en la sección 4.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">4. Destinatarios y encargados del tratamiento</h2>
            <p className="mt-2">
              Los datos de identidad de un huésped solo son accesibles por el hotelero de la propiedad
              correspondiente, para verificar manualmente el check-in. Tourist Book no los revisa ni
              accede a ellos salvo requerimiento técnico puntual (por ejemplo, soporte ante un incidente) o
              obligación legal. Utilizamos los siguientes encargados del tratamiento, sujetos a acuerdo de
              tratamiento de datos:
            </p>
            <ul className="mt-2 grid gap-1">
              <li>• Supabase (base de datos, autenticación y almacenamiento de documentos)</li>
              <li>• Stripe (procesamiento de pagos y facturación de la suscripción)</li>
            </ul>
            <p className="mt-2">
              Estos proveedores pueden alojar datos fuera del Espacio Económico Europeo; en ese caso, la
              transferencia se realiza sobre la base de las Cláusulas Contractuales Tipo de la Comisión
              Europea u otro mecanismo de transferencia reconocido por el RGPD.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">5. Plazo de conservación</h2>
            <ul className="mt-2 grid gap-1">
              <li>
                • <span className="font-bold">Documento de identidad y selfie del huésped</span>: se
                almacenan en un espacio privado no accesible públicamente y se conservan únicamente durante
                la estancia y el plazo que exija la normativa local de registro de viajeros aplicable al
                alojamiento; transcurrido ese plazo se eliminan de forma definitiva.
              </li>
              <li>
                • <span className="font-bold">Resto de datos del huésped</span> (nombre, contacto, fechas):
                se conservan mientras la cuenta ligada a la reserva permanezca activa, y se eliminan poco
                después de la fecha de salida salvo obligación legal de conservarlos más tiempo.
              </li>
              <li>
                • <span className="font-bold">Datos del hotelero</span>: se conservan mientras la cuenta
                esté activa, y hasta 5 años tras su cierre para cumplir obligaciones contables y fiscales.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">6. Seguridad</h2>
            <p className="mt-2">
              Las contraseñas se almacenan cifradas (nunca en texto plano). Los documentos de identidad se
              guardan en un almacenamiento privado, aislado por hotelero, con acceso restringido mediante
              enlaces temporales de un solo uso. Las comunicaciones con la plataforma viajan cifradas
              (HTTPS).
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">7. Tus derechos</h2>
            <p className="mt-2">
              Puedes solicitar en cualquier momento el acceso, la rectificación, la supresión, la
              limitación del tratamiento, la portabilidad de tus datos, o oponerte a su tratamiento,
              escribiendo a <span className="font-bold">allo@ilestchouette.fr</span>. Responderemos
              en el plazo de un mes desde la solicitud. Si consideras que el tratamiento de tus datos no se
              ajusta a la normativa, tienes derecho a presentar una reclamación ante la autoridad de control
              competente (por ejemplo, la CNIL en Francia — www.cnil.fr — o la autoridad de protección de
              datos de tu país de residencia).
            </p>
            <p className="mt-2">
              Si eres huésped y quieres ejercer estos derechos sobre tus datos de check-in, puedes dirigirte
              directamente al hotelero de la propiedad (responsable de tu reserva) o a nosotros, y
              trasladaremos la solicitud.
            </p>
          </div>

          <div id="cookies">
            <h2 className="font-display italic text-2xl text-ink">8. Cookies</h2>
            <p className="mt-2">
              Usamos únicamente cookies técnicas, estrictamente necesarias para el funcionamiento del
              servicio: mantener la sesión del hotelero iniciada, y recordar el acceso de un huésped a su
              livret durante la estancia. No usamos cookies de publicidad ni de seguimiento de terceros, por
              lo que no requieren tu consentimiento previo conforme a la normativa de cookies (ePrivacy).
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">9. Menores de edad</h2>
            <p className="mt-2">
              La plataforma no está dirigida a menores de edad. La creación de una cuenta de hotelero
              requiere ser mayor de edad y tener capacidad legal para contratar.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">10. Modificaciones</h2>
            <p className="mt-2">
              Podemos actualizar esta política para reflejar cambios legales o del servicio. La fecha de la
              última actualización se indica al pie de esta página; te recomendamos consultarla
              periódicamente.
            </p>
            <p className="mt-4 text-sm text-ink/60">Última actualización: 1 de septiembre de 2026.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
