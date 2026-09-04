// Contenu du blog — un seul en français pour l'instant : sans hreflang (choix
// déjà assumé ce trimestre), seule la version française a une vraie chance
// d'être indexée par Google. Traduire ce contenu n'apporterait donc pas de
// bénéfice SEO tant que cette architecture ne change pas.
export const blogPosts = [
  {
    slug: "comment-creer-livret-accueil-airbnb",
    title: "Comment créer un livret d'accueil pour votre logement Airbnb",
    metaDescription:
      "Le guide complet pour créer un livret d'accueil efficace : ce qu'il doit contenir, les erreurs à éviter, et pourquoi le format numérique change tout.",
    excerpt:
      "Ce qu'un bon livret d'accueil doit contenir, dans quel ordre, et pourquoi le format papier ne suffit plus.",
    publishedAt: "2026-09-05",
    sections: [
      {
        heading: "Pourquoi un livret d'accueil, et pas juste un message WhatsApp",
        paragraphs: [
          "La plupart des hôtes commencent avec un message envoyé à chaque voyageur : le code wifi, l'heure d'arrivée, deux ou trois recommandations. Ça fonctionne pour les cinq premières réservations. Ensuite, le même message se réécrit encore et encore, souvent à 23h un dimanche, parce qu'un voyageur n'a pas retrouvé l'information dans une conversation vieille de trois semaines.",
          "Un livret d'accueil résout ce problème une bonne fois : toute l'information vit à un seul endroit, accessible par un lien, mise à jour en temps réel. Le voyageur la consulte quand il en a besoin, pas seulement au moment où vous l'avez envoyée.",
        ],
      },
      {
        heading: "Ce qu'un livret d'accueil doit vraiment contenir",
        paragraphs: [
          "Cinq blocs couvrent l'essentiel de ce qu'un voyageur cherche, dans cet ordre d'importance :",
        ],
        list: [
          "Wifi et accès — réseau, mot de passe, comment entrer dans le logement (code, boîte à clés, interphone).",
          "Horaires — arrivée, départ, et ce qui se passe en cas de retard.",
          "Stationnement — où, et si c'est payant.",
          "Recommandations locales — deux ou trois adresses réelles valent mieux qu'une liste de vingt générées automatiquement.",
          "Contact — comment vous joindre en cas de problème, et à partir de quand c'est une urgence.",
        ],
      },
      {
        heading: "L'erreur la plus fréquente : le PDF statique",
        paragraphs: [
          "Un PDF envoyé par email a trois défauts qui reviennent sans arrêt : il se perd dans la boîte mail, il n'est pas à jour dès que quelque chose change (un nouveau code de porte, un nouveau restaurant), et il n'existe qu'en une langue. Un livret numérique se corrige en un instant, et un lien s'ouvre aussi facilement sur un téléphone que sur un ordinateur — ce qui compte, puisque la quasi-totalité des voyageurs consultent leur livret depuis leur mobile.",
        ],
      },
      {
        heading: "Le check-in électronique, une étape de plus",
        paragraphs: [
          "Pour les hôtes qui accueillent sans être sur place, un lien de check-in envoyé avant l'arrivée (pièce d'identité, données du voyageur) évite l'échange de messages du dernier moment et donne un accès immédiat au livret dès que tout est vérifié. C'est une étape que beaucoup d'hôtes ajoutent une fois le livret de base en place, pas un point de départ obligatoire.",
        ],
      },
      {
        heading: "En résumé",
        paragraphs: [
          "Un bon livret d'accueil, c'est un lien unique, à jour, dans la langue du voyageur, avec l'essentiel avant les détails. Tourist Book construit ce livret pour vous à partir des informations de votre logement — wifi, horaires, recommandations — en quelques minutes, avec le check-in électronique en option pour ceux qui en ont besoin.",
        ],
      },
    ],
  },
  {
    slug: "modele-livret-accueil-airbnb-checklist",
    title: "Modèle de livret d'accueil Airbnb : la checklist complète",
    metaDescription:
      "La checklist complète pour un livret d'accueil Airbnb, rubrique par rubrique — à copier directement dans votre propre livret.",
    excerpt: "Toutes les rubriques d'un livret d'accueil complet, prêtes à remplir avec les informations de votre logement.",
    publishedAt: "2026-09-05",
    sections: [
      {
        heading: "Comment utiliser cette checklist",
        paragraphs: [
          "Plutôt qu'un modèle à télécharger et à mettre en page vous-même, voici directement la structure d'un livret d'accueil complet, rubrique par rubrique. Reprenez chaque section avec les informations réelles de votre logement — c'est exactement la structure que suit le livret Tourist Book quand vous créez un logement.",
        ],
      },
      {
        heading: "1. Accès et wifi",
        list: [
          "Nom du réseau wifi et mot de passe",
          "Comment entrer : clé, digicode, boîte à clés, interphone",
          "Étage, porte, bâtiment si l'immeuble a plusieurs entrées",
        ],
      },
      {
        heading: "2. Horaires",
        list: [
          "Heure d'arrivée à partir de laquelle le logement est disponible",
          "Heure de départ limite",
          "Que faire en cas d'arrivée tardive ou de départ anticipé",
        ],
      },
      {
        heading: "3. Stationnement",
        list: [
          "Emplacement réservé ou stationnement libre dans la rue",
          "Zone payante ou gratuite, et horaires si applicable",
          "Alternative la plus proche si le logement n'a pas de place dédiée",
        ],
      },
      {
        heading: "4. Règles du logement",
        list: [
          "Fêtes ou invités supplémentaires : autorisés ou non",
          "Tabac, animaux",
          "Horaires de silence si l'immeuble en a",
        ],
      },
      {
        heading: "5. Gestion des poubelles",
        list: [
          "Jours de collecte",
          "Emplacement exact des containers",
          "Tri sélectif si la commune l'exige",
        ],
      },
      {
        heading: "6. Recommandations locales",
        list: [
          "Un restaurant que vous recommandez vraiment, pas une liste générique",
          "Une plage ou un lieu à visiter proche",
          "Les toilettes publiques les plus proches, souvent oubliées et très demandées",
        ],
      },
      {
        heading: "7. Contact",
        paragraphs: [
          "Un numéro ou un moyen de vous joindre, avec une indication claire de ce qui justifie un message immédiat plutôt qu'une question qui peut attendre le lendemain.",
        ],
      },
      {
        heading: "Aller plus loin",
        paragraphs: [
          "Une fois cette structure remplie, il ne reste qu'à la rendre accessible par un lien plutôt que par un document — c'est ce que fait Tourist Book automatiquement, dans les trois langues (français, anglais, espagnol), avec une recherche de lieux à proximité intégrée à la carte.",
        ],
      },
    ],
  },
  {
    slug: "qr-code-imprimable-logement-airbnb",
    title: "Le QR code imprimable pour votre logement : comment ça marche",
    metaDescription:
      "Un QR code collé dans le logement qui ouvre directement le livret d'accueil du voyageur, sans code à taper. Comment le mettre en place.",
    excerpt: "Un code QR collé dans le logement, et le voyageur accède directement à son livret d'accueil — sans rien taper.",
    publishedAt: "2026-09-05",
    sections: [
      {
        heading: "Le problème que ça résout",
        paragraphs: [
          "Même avec un livret d'accueil numérique bien fait, il reste une friction : le voyageur doit retrouver le lien, ou taper un code d'accès à 4 chiffres qu'il a reçu par message trois jours plus tôt. Une fois arrivé dans le logement, ce n'est plus le moment idéal pour chercher un SMS.",
          "Un QR code imprimé et collé dans le logement — sur le frigo, près de l'entrée — élimine complètement cette étape : le voyageur scanne avec l'appareil photo de son téléphone, et il est directement sur son livret d'accueil, connecté.",
        ],
      },
      {
        heading: "Comment le générer",
        paragraphs: [
          "Depuis le panel Tourist Book, sur la page de chaque logement, un bouton génère le QR code en un clic — il encode un lien qui inclut déjà le code d'accès du logement. Il se télécharge en image, prêt à imprimer.",
        ],
      },
      {
        heading: "Où le placer",
        list: [
          "Sur le frigo ou un endroit visible dès l'entrée",
          "À côté du livret papier si vous en gardez encore un, en complément",
          "Dans la boîte à clés elle-même, pour les voyageurs qui arrivent sans contact direct",
        ],
      },
      {
        heading: "Pourquoi c'est différent d'un simple lien envoyé par message",
        paragraphs: [
          "Un lien envoyé avant l'arrivée peut se perdre dans une conversation. Un QR code physique, lui, reste là où le voyageur en a besoin, pendant tout le séjour — pratique pour un deuxième voyageur du même groupe qui n'a pas reçu le message initial, ou pour retrouver rapidement le numéro de contact en cas de question.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug) {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}
