import { notFound } from "next/navigation";
import Image from "next/image";
import { getPropertyBySlug } from "@/lib/properties";
import LivretHero from "@/components/LivretHero";
import LivretMenu from "@/components/LivretMenu";

export default async function LivretPage({ params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const photos = property.photos ?? [];

  return (
    <main className="flex-1">
      <LivretHero title={property.name} subtitle={property.address} photo={photos[0] ?? null} />

      <section id="menu" className="mx-auto max-w-2xl px-6 py-8 md:max-w-5xl md:py-10">
        <LivretMenu property={property} slug={slug} />
      </section>

      <section className="mx-auto max-w-2xl px-6 pb-10 md:max-w-5xl">
        {property.description ? (
          <p className="whitespace-pre-line text-ink/80">{property.description}</p>
        ) : (
          <p className="text-ink/80">
            Ce livret numérique réunit tout ce qu&apos;il faut pour ton séjour : le wifi, les horaires
            d&apos;arrivée et de départ, les recommandations de l&apos;hôte, et la réservation de ton
            transfert — directement depuis ton téléphone, sans rien installer.
          </p>
        )}
      </section>

      {photos.length > 1 && (
        <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-6 pb-10 md:max-w-5xl">
          {photos.slice(1).map((url) => (
            <div key={url} className="relative h-20 w-28 shrink-0 overflow-hidden rounded border border-sand-dim">
              <Image src={url} alt="" fill sizes="112px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
