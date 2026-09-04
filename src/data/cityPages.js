// Pages locales SEO — français uniquement, même raison que blogPosts.js :
// sans hreflang, seule cette version a une vraie chance d'être indexée.
export const cityPages = [
  {
    slug: "nice",
    city: "Nice",
    metaTitle: "Livret d'accueil numérique pour votre location à Nice — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre logement à Nice : wifi, horaires, recommandations du Vieux Nice à la Promenade des Anglais, en un lien.",
    intro:
      "Nice concentre une grande partie de la location courte durée de la Côte d'Azur, du Vieux Nice à la Promenade des Anglais en passant par Cimiez. Beaucoup de voyageurs arrivent par l'aéroport, souvent en horaires décalés, et posent les mêmes questions : où se garer, comment entrer dans l'immeuble, quel bus prendre pour la Promenade.",
      body: [
        "Un livret d'accueil numérique répond à tout ça avant même que la question soit posée. Le lien s'envoie avant l'arrivée, avec le wifi, les horaires, et vos recommandations réelles — un restaurant du Cours Saleya, une plage plutôt qu'une autre, la meilleure façon de rejoindre le Vieux Nice à pied.",
        "Pour les logements loués sur de courtes périodes, la carte intégrée du livret cherche automatiquement les restaurants, plages ou commerces à proximité immédiate de votre adresse exacte — utile dans une ville où \"centre-ville\" peut vouloir dire dix minutes de marche de différence selon le quartier.",
      ],
    neighborhoods: ["Vieux Nice", "Promenade des Anglais", "Cimiez", "Le Port", "Libération"],
  },
  {
    slug: "cannes",
    city: "Cannes",
    metaTitle: "Livret d'accueil numérique pour votre location à Cannes — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre logement à Cannes : wifi, horaires, recommandations de la Croisette au Suquet, en un lien.",
    intro:
      "Entre la Croisette, le Suquet et Palm Beach, les locations à Cannes accueillent un mélange de voyageurs d'affaires pendant les événements et de vacanciers le reste de l'année — deux publics qui n'ont pas les mêmes questions ni le même rythme d'arrivée.",
    body: [
      "Un livret d'accueil numérique s'adapte aux deux : les horaires et le wifi sont là pour l'arrivée rapide d'un séjour professionnel, les recommandations locales prennent le relais pour un séjour plus tranquille. Le tout dans un seul lien, disponible en français, anglais et espagnol.",
      "Pendant les périodes de forte affluence (festivals, salons), répéter les mêmes informations à chaque nouveau voyageur devient vite ingérable par message. Le livret reste à jour en continu, sans repartir de zéro à chaque réservation.",
    ],
    neighborhoods: ["La Croisette", "Le Suquet", "Palm Beach", "La Bocca", "Le Cannet"],
  },
  {
    slug: "antibes",
    city: "Antibes",
    metaTitle: "Livret d'accueil numérique pour votre location à Antibes — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre logement à Antibes : wifi, horaires, recommandations du Vieil Antibes à Juan-les-Pins, en un lien.",
    intro:
      "Du Vieil Antibes à Juan-les-Pins et au Cap d'Antibes, les logements de la commune couvrent des ambiances très différentes — un studio dans les remparts n'a pas les mêmes contraintes d'accès qu'une villa du Cap. Un livret d'accueil numérique s'adapte à chaque logement individuellement, pas à un modèle générique.",
    body: [
      "Wifi, horaires, stationnement (souvent le point le plus délicat dans le Vieil Antibes) et vos recommandations réelles — un marché provençal, une crique moins connue, un restaurant à Juan-les-Pins — tout tient dans un lien envoyé avant l'arrivée.",
      "Pour les logements avec accès autonome (boîte à clés, digicode), le livret peut aussi inclure une photo ou une courte vidéo montrant exactement où et comment récupérer les clés — utile quand l'entrée d'un immeuble ancien n'est pas évidente à décrire par écrit.",
    ],
    neighborhoods: ["Vieil Antibes", "Juan-les-Pins", "Cap d'Antibes", "Fontonne", "La Fontonne"],
  },
];

export function getCityPage(slug) {
  return cityPages.find((c) => c.slug === slug) ?? null;
}
