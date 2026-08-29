import { notFound } from "next/navigation";
import Image from "next/image";
import { getPropertyBySlug } from "@/lib/properties";
import Hero from "@/components/Hero";
import LivretMenu from "@/components/LivretMenu";

export default async function LivretPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const photos = property.photos ?? [];

  return (
    <main className="flex-1">
      <Hero
        eyebrow="Livret d'accueil"
        title={property.name}
        subtitle={property.address}
        stamps={["FR", "EN", "ES"]}
        photo={photos[0] ?? null}
      />

      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-6 py-4">
          {photos.slice(1).map((url) => (
            <div key={url} className="relative h-20 w-28 shrink-0 overflow-hidden rounded border border-sand-dim">
              <Image src={url} alt="" fill sizes="112px" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <section className="mx-auto max-w-2xl px-6 py-10">
        {property.description ? (
          <p className="whitespace-pre-line text-ink/80">{property.description}</p>
        ) : (
          <p className="text-ink/80">
            Ce livret numérique réunit tout ce qu&apos;il faut pour ton séjour : le wifi, les horaires
            d&apos;arrivée et de départ, les recommandations de l&apos;hôte, et la réservation de ton
            transfert — directement depuis ton téléphone, sans rien installer.
          </p>
        )}

        <div className="mt-8">
          <LivretMenu property={property} slug={slug} />
        </div>
      </section>
    </main>
  );
}
