// Pages locales SEO — français uniquement : sans hreflang, seule cette
// version a une vraie chance d'être indexée par Google.
export const cityPages = [
  {
    slug: "nice",
    city: "Nice",
    metaTitle: "Livret d'accueil numérique à Nice — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre logement à Nice : wifi, horaires, recommandations du Vieux Nice à la Promenade des Anglais, en un lien.",
    intro:
      "Nice concentre une grande partie de la location courte durée de la Côte d'Azur, du Vieux Nice à la Promenade des Anglais en passant par Cimiez. Beaucoup de voyageurs arrivent par l'aéroport, souvent en horaires décalés, et posent les mêmes questions : où se garer, comment entrer dans l'immeuble, quel bus prendre pour la Promenade.",
      body: [
        "Un livret d'accueil numérique répond à tout ça avant même que la question soit posée. Le lien s'envoie avant l'arrivée, avec le wifi, les horaires, et vos recommandations réelles — un restaurant du Cours Saleya, une plage plutôt qu'une autre, la meilleure façon de rejoindre le Vieux Nice à pied.",
        "Pour les logements loués sur de courtes périodes, la carte intégrée du livret cherche automatiquement les restaurants, plages ou commerces à proximité immédiate de votre adresse exacte — utile dans une ville où \"centre-ville\" peut vouloir dire dix minutes de marche de différence selon le quartier.",
      ],
    neighborhoods: ["Vieux Nice", "Promenade des Anglais", "Cimiez", "Le Port", "Libération"],
    faqLocal: [
    { q: "Quelles informations mettre dans le livret d'un logement à Nice ?", a: "Le wifi, les horaires d'arrivée et de départ, l'itinéraire depuis l'aéroport ou la gare, le stationnement et vos adresses préférées autour du Vieux Nice, de la Promenade des Anglais ou de Cimiez. Tout se modifie en ligne, sans rien imprimer." },
    { q: "Mes voyageurs arrivent par l'aéroport de Nice : comment les guider ?", a: "Ajoutez dans le livret votre itinéraire détaillé (tram, bus ou taxi) et, si vous le souhaitez, une réservation de transfert directement depuis le livret, avec le tarif affiché." },
    ],
  },
  {
    slug: "cannes",
    city: "Cannes",
    metaTitle: "Livret d'accueil numérique à Cannes — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre logement à Cannes : wifi, horaires, recommandations de la Croisette au Suquet, en un lien.",
    intro:
      "Entre la Croisette, le Suquet et Palm Beach, les locations à Cannes accueillent un mélange de voyageurs d'affaires pendant les événements et de vacanciers le reste de l'année — deux publics qui n'ont pas les mêmes questions ni le même rythme d'arrivée.",
    body: [
      "Un livret d'accueil numérique s'adapte aux deux : les horaires et le wifi sont là pour l'arrivée rapide d'un séjour professionnel, les recommandations locales prennent le relais pour un séjour plus tranquille. Le tout dans un seul lien, disponible en français, anglais et espagnol.",
      "Pendant les périodes de forte affluence (festivals, salons), répéter les mêmes informations à chaque nouveau voyageur devient vite ingérable par message. Le livret reste à jour en continu, sans repartir de zéro à chaque réservation.",
    ],
    neighborhoods: ["La Croisette", "Le Suquet", "Palm Beach", "La Bocca", "Le Cannet"],
    faqLocal: [
    { q: "Comment gérer les pics d'affluence à Cannes avec un livret numérique ?", a: "Le livret reste à jour en continu : vous changez une information une fois et tous vos voyageurs la voient tout de suite, sans renvoyer de message à chaque réservation." },
    { q: "Que mettre dans le livret pour un séjour d'affaires ou un séjour de vacances ?", a: "Les horaires et le wifi pour l'arrivée rapide, puis vos recommandations locales (restaurants, plages, commerces) pour les séjours plus longs, dans un seul lien." },
    ],
  },
  {
    slug: "antibes",
    city: "Antibes",
    metaTitle: "Livret d'accueil numérique à Antibes — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre logement à Antibes : wifi, horaires, recommandations du Vieil Antibes à Juan-les-Pins, en un lien.",
    intro:
      "Du Vieil Antibes à Juan-les-Pins et au Cap d'Antibes, les logements de la commune couvrent des ambiances très différentes — un studio dans les remparts n'a pas les mêmes contraintes d'accès qu'une villa du Cap. Un livret d'accueil numérique s'adapte à chaque logement individuellement, pas à un modèle générique.",
    body: [
      "Wifi, horaires, stationnement (souvent le point le plus délicat dans le Vieil Antibes) et vos recommandations réelles — un marché provençal, une crique moins connue, un restaurant à Juan-les-Pins — tout tient dans un lien envoyé avant l'arrivée.",
      "Pour les logements avec accès autonome (boîte à clés, digicode), le livret peut aussi inclure une photo ou une courte vidéo montrant exactement où et comment récupérer les clés — utile quand l'entrée d'un immeuble ancien n'est pas évidente à décrire par écrit.",
    ],
    neighborhoods: ["Vieil Antibes", "Juan-les-Pins", "Cap d'Antibes", "Fontonne", "La Fontonne"],
    faqLocal: [
    { q: "Comment aider mes voyageurs à trouver leur logement dans le Vieil Antibes ?", a: "Ajoutez une photo ou une courte vidéo de l'entrée, de la boîte à clés ou du digicode, et précisez le stationnement le plus proche. Le livret garde tout au même endroit." },
    { q: "Le livret est-il utile pour une villa au Cap d'Antibes ?", a: "Oui : accès, parking, wifi, règles de la maison et recommandations locales se retrouvent dans un lien que le voyageur ouvre sur son téléphone, sans application." },
    ],
  },

  {
    slug: "menton",
    city: "Menton",
    metaTitle: "Livret d'accueil numérique à Menton — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre location à Menton : wifi, horaires, adresses de la vieille ville à Garavan, traduction automatique, en un lien.",
    intro:
      "À Menton, entre la vieille ville, le port, Garavan et la frontière italienne toute proche, les voyageurs arrivent en train ou en voiture avec des questions très concrètes : où se garer, comment rejoindre le centre à pied, où manger près de la plage. Un livret d'accueil numérique y répond avant même qu'ils ne les posent.",
    body: [
      "Le lien s'envoie avant l'arrivée avec le wifi, les horaires, l'itinéraire et vos recommandations réelles — un restaurant de la vieille ville, une plage plutôt qu'une autre. Vos voyageurs, souvent étrangers, le lisent dans leur langue grâce à la traduction automatique.",
      "Pendant les périodes de forte fréquentation, comme la Fête du Citron, le livret évite de répéter les mêmes informations à chaque réservation : vous mettez à jour une fois, tout le monde voit la dernière version.",
    ],
    neighborhoods: ["Vieille ville", "Garavan", "Les Sablettes", "Le Port", "Centre-ville"],
    faqLocal: [
      { q: "Mes voyageurs viennent souvent d'Italie ou de l'étranger : le livret est-il traduit ?", a: "Oui. Le livret existe en français, en anglais et en espagnol, traduit automatiquement, et le voyageur choisit sa langue en un clic." },
      { q: "Comment expliquer le stationnement à Menton ?", a: "Indiquez dans le livret où se garer, avec une photo ou un plan, et précisez l'accès à pied jusqu'au logement. Vous pouvez le modifier à tout moment." },
    ],
  },
  {
    slug: "beausoleil",
    city: "Beausoleil",
    metaTitle: "Livret d'accueil numérique à Beausoleil — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre location à Beausoleil, aux portes de Monaco : wifi, horaires, accès, recommandations, en un lien.",
    intro:
      "Beausoleil est collée à Monaco : les voyageurs y séjournent pour la principauté tout en cherchant un logement plus accessible, souvent avec des rues en pente et des immeubles où l'entrée n'est pas évidente. Un livret d'accueil numérique leur donne dès l'arrivée les bonnes indications.",
    body: [
      "Accès au logement, boîte à clés ou digicode, stationnement, wifi, horaires : tout est réuni dans un lien envoyé avant l'arrivée. Vous y ajoutez vos adresses préférées à Beausoleil et à Monaco, et l'itinéraire pour rejoindre la principauté à pied ou en transport.",
      "Comme le livret se modifie en ligne, vous corrigez une information une fois et tous vos voyageurs voient la dernière version, sans imprimer ni renvoyer de message.",
    ],
    neighborhoods: ["Centre de Beausoleil", "Limite de Monaco", "Hauteurs de Beausoleil"],
    faqLocal: [
      { q: "Comment guider mes voyageurs entre Beausoleil et Monaco ?", a: "Ajoutez dans le livret l'itinéraire à pied ou en transport vers Monaco, avec vos recommandations. Le voyageur l'ouvre sur son téléphone, sans application." },
      { q: "L'entrée de mon immeuble n'est pas évidente : que faire ?", a: "Ajoutez des photos ou une courte vidéo de l'entrée, de la boîte à clés ou du digicode. Elles s'affichent dans le livret au moment où le voyageur en a besoin." },
    ],
  },
  {
    slug: "villefranche-sur-mer",
    city: "Villefranche-sur-Mer",
    metaTitle: "Livret d'accueil numérique à Villefranche — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre location à Villefranche-sur-Mer : wifi, horaires, adresses de la vieille ville au port, en un lien.",
    intro:
      "Villefranche-sur-Mer s'étend autour de sa rade, de la vieille ville au port de la Darse et aux plages. Entre ruelles, escaliers et voyageurs de passage venus par la mer ou par Nice, un livret d'accueil numérique aide chacun à trouver son logement et les bonnes adresses.",
    body: [
      "Dans le livret : le wifi, les horaires, l'accès au logement (souvent par des ruelles ou des escaliers) et vos recommandations — un restaurant sur le port, une plage plus calme. Une photo de l'entrée évite bien des appels le jour de l'arrivée.",
      "Traduit automatiquement en français, anglais et espagnol, le livret accompagne les voyageurs étrangers qui séjournent à Villefranche comme base pour visiter la Côte d'Azur.",
    ],
    neighborhoods: ["Vieille ville", "Rue Obscure", "Port de la Darse", "Plage des Marinières", "La rade"],
    faqLocal: [
      { q: "Mon logement est dans la vieille ville : comment expliquer l'accès ?", a: "Ajoutez un itinéraire pas à pas avec photos depuis le point de dépose ou de stationnement le plus proche. Le voyageur le suit sur son téléphone." },
      { q: "Mes voyageurs ne parlent pas français : quelle solution ?", a: "Le livret est disponible en français, en anglais et en espagnol, traduit automatiquement, même pour le texte que vous écrivez vous-même." },
    ],
  },
  {
    slug: "cagnes-sur-mer",
    city: "Cagnes-sur-Mer",
    metaTitle: "Livret d'accueil numérique à Cagnes-sur-Mer — Tourist Book",
    metaDescription:
      "Créez le livret d'accueil numérique de votre location à Cagnes-sur-Mer : wifi, horaires, accès depuis l'aéroport de Nice, recommandations, en un lien.",
    intro:
      "Cagnes-sur-Mer se partage entre Haut-de-Cagnes, Cros-de-Cagnes et l'hippodrome, à quelques minutes de l'aéroport de Nice. Les voyageurs y arrivent souvent à des horaires décalés : un livret d'accueil numérique leur donne l'accès, le wifi et les consignes sans que vous ayez à répondre en pleine nuit.",
    body: [
      "Le lien s'envoie avant l'arrivée avec l'itinéraire depuis l'aéroport, le stationnement, le wifi, les horaires et vos adresses préférées — du village perché de Haut-de-Cagnes au bord de mer de Cros-de-Cagnes.",
      "Pour les arrivées tardives en accès autonome, une photo ou une vidéo de la boîte à clés ou du digicode évite les appels. Et tout se met à jour en ligne, sans rien imprimer.",
    ],
    neighborhoods: ["Haut-de-Cagnes", "Cros-de-Cagnes", "Hippodrome de la Côte d'Azur", "Château-Musée Grimaldi"],
    faqLocal: [
      { q: "Mes voyageurs arrivent tard depuis l'aéroport de Nice : comment les accueillir ?", a: "Mettez dans le livret l'itinéraire depuis l'aéroport, le code ou la boîte à clés avec photos, et le wifi. Ils ont tout sans vous écrire." },
      { q: "Puis-je proposer un transfert depuis l'aéroport ?", a: "Oui. Le voyageur peut demander son transfert directement depuis le livret, avec le tarif indicatif affiché." },
    ],
  },
  {
    slug: "saint-jean-cap-ferrat",
    city: "Saint-Jean-Cap-Ferrat",
    metaTitle: "Livret d'accueil numérique à Saint-Jean-Cap-Ferrat",
    metaDescription:
      "Créez le livret d'accueil numérique de votre location à Saint-Jean-Cap-Ferrat : wifi, horaires, accès, plages et adresses, en un lien.",
    intro:
      "La presqu'île de Saint-Jean-Cap-Ferrat réunit le port, les plages, les villas et le sentier du tour du Cap. Les voyageurs y cherchent la tranquillité, mais ont besoin de repères : accès au logement, stationnement, plages à proximité, commerces. Un livret d'accueil numérique les leur donne dans un seul lien.",
    body: [
      "Le livret réunit le wifi, les horaires, les règles de la maison, l'accès (boîte à clés, digicode, portail) et vos recommandations réelles : une plage, un restaurant, un sentier. Pour une villa, vous pouvez y ajouter les consignes d'équipement : piscine, climatisation, poubelles.",
      "Vous le modifiez en ligne autant de fois que nécessaire : la dernière version est toujours celle que lit le voyageur, sans impression ni fichier à renvoyer.",
    ],
    neighborhoods: ["Port de Saint-Jean", "Plage de Paloma", "Villa Ephrussi de Rothschild", "Sentier du tour du Cap"],
    faqLocal: [
      { q: "Mon logement est une villa : que mettre dans le livret ?", a: "Accès et portail, wifi, règles de la maison, consignes d'équipement (piscine, climatisation, poubelles) et vos adresses préférées, avec photos si besoin." },
      { q: "Comment présenter les plages et les balades autour du Cap ?", a: "Ajoutez vos recommandations dans le guide local du livret, classées par catégorie, et la carte intégrée trouve aussi les commerces autour de l'adresse exacte du logement." },
    ],
  },
];

export function getCityPage(slug) {
  return cityPages.find((c) => c.slug === slug) ?? null;
}
