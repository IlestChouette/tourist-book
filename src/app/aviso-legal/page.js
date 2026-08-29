import Hero from "@/components/Hero";

export const metadata = { title: "Aviso legal — Tourist Book" };

export default function AvisoLegalPage() {
  return (
    <main className="flex-1">
      <Hero eyebrow="Legal" title="Aviso legal" />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-6 text-ink/80">
          <div>
            <h2 className="font-display italic text-2xl text-ink">Editor del sitio</h2>
            <div className="mt-3 rounded border border-sand-dim bg-sand-card p-5">
              <p className="text-ink">
                <span className="font-bold">Il est chouette</span> — Société par actions simplifiée
                (société à associé unique), capital social de 5.000 €.
              </p>
              <p className="mt-2">SIREN 942 069 949 · RCS Nice</p>
              <p className="mt-1">Domicilio social: 143 Promenade des Anglais, 06200 Niza, Francia</p>
              <p className="mt-1">Presidente: Fernando Francisco Fonseca Pinzon</p>
              <p className="mt-3">
                Contacto: <a href="mailto:allo@ilestchouette.fr" className="font-bold text-aqua-deep">allo@ilestchouette.fr</a>
                {" "}· 06 95 42 73 12
              </p>
              <p className="mt-1">
                Sitio de la empresa:{" "}
                <a
                  href="https://ilestchouette.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-aqua-deep"
                >
                  ilestchouette.fr
                </a>
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">Alojamiento (hébergement)</h2>
            <p className="mt-2">
              Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, Estados Unidos.
            </p>
            <p className="mt-2">
              Base de datos, autenticación y almacenamiento de documentos: Supabase. Procesamiento de
              pagos: Stripe. Más detalle sobre estos encargados del tratamiento en la{" "}
              <a href="/privacidad" className="font-bold text-aqua-deep">Política de privacidad</a>.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">Propiedad intelectual</h2>
            <p className="mt-2">
              El nombre, el diseño y el contenido de Tourist Book pertenecen a Il est chouette, salvo
              el contenido propio de cada hotelero (fotos, textos y recomendaciones de su alojamiento).
              Su reproducción sin autorización está prohibida.
            </p>
          </div>

          <div>
            <h2 className="font-display italic text-2xl text-ink">Más información</h2>
            <p className="mt-2">
              Consulta también los{" "}
              <a href="/terminos" className="font-bold text-aqua-deep">Términos de uso y suscripción</a>{" "}
              y la{" "}
              <a href="/privacidad" className="font-bold text-aqua-deep">Política de privacidad</a>.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
