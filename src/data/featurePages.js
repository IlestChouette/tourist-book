// Pages « fonction » du livret (référencement) : ce que le produit fait, décrit sans rien promettre de plus.
// Français uniquement, comme les pages villes et le blog.
export const featurePages = [
  {
    slug: "check-in-electronique-airbnb",
    path: "/check-in-electronique-airbnb",
    seoTitle: "Check-in en ligne et auto-enregistrement",
    h1: "Check-in électronique et auto-enregistrement des voyageurs",
    eyebrow: "Offre Premium",
    metaDescription: "Le check-in électronique Tourist Book : un lien unique par réservation, pièce d'identité, signature et règlement accepté avant l'arrivée. Offre Premium.",
    intro: "Vos voyageurs font leur enregistrement avant d'arriver, depuis leur téléphone, avec un lien unique par réservation. Vous recevez tout dans votre panel, vous vérifiez, et les identifiants du livret leur sont envoyés automatiquement. Une arrivée autonome, sans rendez-vous à caler.",
    sections: [
      {
        h2: "Comment fonctionne l'auto-enregistrement",
        steps: [
          { t: "Un lien par réservation", d: "Vous créez la réservation et envoyez le lien de check-in au voyageur (WhatsApp, email ou messagerie Airbnb)." },
          { t: "Le voyageur remplit", d: "Pièce d'identité, selfie et signature électronique, directement sur son téléphone, dans sa langue." },
          { t: "Il accepte le règlement", d: "Le règlement intérieur est accepté et la date de l'acceptation est enregistrée." },
          { t: "Vous vérifiez", d: "Depuis votre panel, vous contrôlez les informations. Les identifiants d'accès au livret partent ensuite automatiquement vers le voyageur." },
        ],
      },
      {
        h2: "Ce que vous y gagnez",
        list: [
          "Des arrivées autonomes : plus besoin d'être là, ni de caler un horaire.",
          "Un enregistrement fait avant le séjour, pas à la porte avec les valises.",
          "Un règlement intérieur accepté et tracé à chaque réservation.",
          "Un parcours conforme à l'article R.611-42 pour l'enregistrement des voyageurs.",
          "En français, anglais et espagnol, avec votre logo.",
        ],
      },
      {
        h2: "Des documents rangés en lieu sûr",
        text: "Les documents, selfies et signatures sont stockés dans un espace privé, jamais accessible publiquement. Vous seul les voyez depuis votre panel, via un lien à durée limitée.",
      },
    ],
    faq: [
      { q: "Le check-in électronique est-il inclus dans toutes les offres ?", a: "Non : il fait partie de l'offre Premium, avec l'assistant virtuel. L'offre Essentiel donne le livret numérique, le guide local, le transfert et votre logo." },
      { q: "Mes voyageurs doivent-ils créer un compte ?", a: "Non. Ils ouvrent le lien reçu, remplissent leur enregistrement, puis reçoivent leurs identifiants d'accès au livret." },
      { q: "Est-ce sécurisé ?", a: "Les documents sont stockés dans un espace privé, visibles seulement par vous, depuis votre panel, via un lien à durée limitée." },
      { q: "Qu'en est-il de la nouvelle politique d'Airbnb sur les règles de la maison ?", a: "Notre article sur les changements du 20 novembre 2026 détaille ce point, notamment la prudence demandée sur la collecte de pièces d'identité. Vérifiez votre cas dans les sources indiquées." },
      { q: "Combien ça coûte ?", a: "L'offre Premium est à 59,99 € par an ou 10 € par mois en saisonnier, par logement. L'offre annuelle démarre avec 1 mois offert la première fois." },
    ],
    links: [
      { href: "/blog/enregistrement-voyageurs-loi-check-in-electronique", label: "Enregistrer ses voyageurs : ce que demande la loi" },
      { href: "/blog/airbnb-regles-de-la-maison-20-novembre-2026", label: "Airbnb : règles de la maison au 20 novembre 2026" },
      { href: "/livret-accueil-interactif-video", label: "Le livret d'accueil interactif avec vidéos" },
    ],
  },
  {
    slug: "livret-accueil-interactif-video",
    path: "/livret-accueil-interactif-video",
    seoTitle: "Livret d'accueil interactif avec vidéos",
    h1: "Le livret d'accueil interactif, avec photos et vidéos",
    eyebrow: "Livret numérique",
    metaDescription: "Un livret d'accueil interactif : vidéos pour les clés et les poubelles, carte locale, recherche, assistant, 3 langues. Dès 7 €/mois sans engagement.",
    intro: "Un livret qui s'ouvre d'un lien ou d'un QR code, sur le téléphone du voyageur, sans application. Il ne se lit pas comme un PDF : il se parcourt par tuiles, avec des photos et des vidéos là où un texte ne suffit pas, une carte locale et une recherche.",
    sections: [
      {
        h2: "Ce que le voyageur peut ouvrir",
        list: [
          "Wifi, horaires d'arrivée et de départ, itinéraire, stationnement et contact.",
          "Les règles de la maison, les poubelles et les informations sur le logement.",
          "Votre guide local : restaurants, plages, musées, classés par catégorie, avec une recherche.",
          "Une carte qui trouve les adresses autour de l'adresse exacte du logement.",
          "La réservation d'un transfert, avec le tarif indicatif affiché, et un livre d'or.",
          "Avec l'offre Premium : un assistant virtuel qui répond aux questions courantes, à toute heure.",
        ],
      },
      {
        h2: "Des photos et des vidéos là où elles servent",
        text: "Une photo de la boîte à clés, une courte vidéo pour retrouver l'entrée d'un immeuble ancien, une vidéo pour le tri des déchets : le livret les affiche au bon endroit, au moment où le voyageur en a besoin.",
      },
      {
        h2: "Interactif et toujours à jour",
        list: [
          "Vous modifiez le livret en ligne autant de fois que vous le voulez : rien à imprimer, rien à exporter.",
          "Français, anglais et espagnol, traduits automatiquement, avec votre logo et vos couleurs.",
          "Un seul compte pour autant de logements que vous voulez, chacun avec son propre livret et son offre.",
        ],
      },
    ],
    faq: [
      { q: "Faut-il que mes voyageurs installent une application ?", a: "Non. Le livret s'ouvre dans le navigateur du téléphone, avec un lien ou un QR code." },
      { q: "Puis-je ajouter mes propres vidéos ?", a: "Oui : vous pouvez joindre des vidéos et des photos, par exemple pour l'accès au logement, les clés ou les poubelles." },
      { q: "Est-ce que le livret est traduit ?", a: "Oui, en français, anglais et espagnol. Même le texte que vous écrivez vous-même est traduit automatiquement." },
      { q: "Combien de temps pour le créer ?", a: "Environ 5 minutes pour un premier logement : nom, photos, wifi, horaires. Le lien est utilisable tout de suite." },
      { q: "Combien ça coûte ?", a: "Dès 7 € par mois sans engagement, ou à l'année dès 39,99 € avec 1 mois offert la première fois. L'offre se choisit par logement." },
    ],
    links: [
      { href: "/blog/livret-accueil-numerique-avantages-hote", label: "Livret d'accueil numérique : à quoi ça sert ?" },
      { href: "/check-in-electronique-airbnb", label: "Le check-in électronique et l'auto-enregistrement" },
      { href: "/livret-accueil-nice", label: "Le livret d'accueil à Nice" },
    ],
  },
];

export const getFeaturePage = (slug) => featurePages.find((p) => p.slug === slug) ?? null;
