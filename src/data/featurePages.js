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
    lead: "Vos voyageurs s'enregistrent avant d'arriver, depuis leur téléphone. Vous vérifiez, et leurs identifiants partent tout seuls.",
    mock: "checkin",
    chips: ["Arrivées autonomes", "Fait avant le séjour", "Règlement accepté et daté", "FR · EN · ES"],
    bentoTitle: "Tout ce que le voyageur remplit, et ce que vous recevez",
    bento: [
      { icon: "id", t: "Pièce d'identité, selfie, signature", d: "Directement sur son téléphone, dans sa langue.", big: true },
      { icon: "link", t: "Un lien par réservation", d: "Par WhatsApp, email ou messagerie Airbnb." },
      { icon: "file", t: "Règlement accepté", d: "Avec la date, enregistrée." },
      { icon: "scale", t: "Article R.611-42", d: "Un parcours conforme pour enregistrer les voyageurs." },
      { icon: "lock", t: "Rangé en lieu sûr", d: "Espace privé : vous seul voyez les documents, par un lien à durée limitée." },
    ],
    stepsTitle: "Quatre étapes, une arrivée sans rendez-vous",
    steps: [
      { t: "Vous envoyez le lien", d: "Un lien unique par réservation." },
      { t: "Il remplit", d: "Identité, selfie, signature." },
      { t: "Il accepte le règlement", d: "La date est enregistrée." },
      { t: "Vous vérifiez", d: "Les identifiants du livret partent ensuite automatiquement." },
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
    lead: "Un lien ou un QR code, sur le téléphone du voyageur. Pas d'application, pas de PDF : des tuiles, des photos et des vidéos.",
    mock: "livret",
    chips: ["Sans application", "Photos et vidéos", "FR · EN · ES automatiques", "Votre logo et vos couleurs"],
    bentoTitle: "Ce que le voyageur ouvre",
    bento: [
      { icon: "play", t: "Des vidéos là où elles servent", d: "La boîte à clés, l'entrée d'un immeuble ancien, le tri des déchets : au bon endroit, au bon moment.", big: true },
      { icon: "wifi", t: "Tout le séjour en tuiles", d: "Wifi, horaires, règles, poubelles, contact." },
      { icon: "compass", t: "Votre guide local", d: "Restaurants, plages, musées, avec recherche." },
      { icon: "map", t: "Une carte du quartier", d: "Les adresses autour du logement exact." },
      { icon: "car", t: "Transfert et livre d'or", d: "Tarif indicatif affiché." },
      { icon: "chat", t: "Assistant virtuel", d: "En Premium, il répond à toute heure." },
    ],
    stepsTitle: "Prêt en 5 minutes",
    steps: [
      { t: "Vous créez", d: "Nom, photos, wifi, horaires." },
      { t: "Vous partagez", d: "Le lien ou le QR code, utilisable tout de suite." },
      { t: "Vous modifiez", d: "En ligne, autant de fois que vous voulez. Rien à imprimer." },
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
