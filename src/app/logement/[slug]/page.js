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

  const description =
    property.description ||
    "Ce livret numérique réunit tout ce qu'il faut pour ton séjour : le wifi, les horaires d'arrivée et de départ, les recommandations de l'hôte, et la réservation de ton transfert — directement depuis ton téléphone, sans rien installer.";

  return (
    <main className="flex-1">
      <LivretHero
        title={property.name}
        subtitle={property.address}
        description={description}
        photo={photos[0] ?? null}
      />

      <section id="menu" className="mx-auto max-w-2xl px-6 py-8 md:max-w-5xl md:py-10">
        <LivretMenu property={property} slug={slug} />
      </section>

      {photos.length > 1 && (
        <div className="relative bg-sand pt-2">
          <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto px-6 pb-10 md:max-w-5xl">
            {photos.slice(1).map((url) => (
              <div key={url} className="relative h-20 w-28 shrink-0 overflow-hidden rounded border border-sand-dim">
                <Image src={url} alt="" fill sizes="112px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
