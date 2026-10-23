import { WifiIcon, CompassIcon, CarIcon, ChatIcon, ShieldIcon, BookIcon, UsersIcon, MoonIcon, PartyIcon, PawIcon, SmokeIcon, CameraIcon, KeyIcon, CalendarIcon } from "@/components/icons";

// Contenu du blog — français uniquement, même choix que les pages villes
// (voir cityPages.js) : sans hreflang, seule cette version a une vraie
// chance d'être indexée par Google.
export const blogPosts = [
  {
    slug: "airbnb-regles-de-la-maison-20-novembre-2026",
    title: "Airbnb change ses règles de la maison le 20 novembre 2026 : ce que les hôtes doivent savoir",
    metaDescription:
      "Airbnb distingue 7 règles de la maison et de simples demandes : fini les corvées de départ imposées. Ce qui change le 20 novembre 2026 et comment s'y préparer.",
    excerpt: "Fini les corvées de départ imposées : Airbnb sépare les règles de la maison des simples demandes. L'essentiel en un coup d'œil.",
    publishedAt: "2026-10-23",
    blocks: [
      {
        type: "lead",
        text: "Airbnb change les règles du jeu pour les corvées de départ. Voici l'essentiel en un coup d'œil : ce qui change, ce que vous pouvez encore demander, et ce qu'il faut faire d'ici le 20 novembre 2026.",
      },
      {
        type: "steps",
        items: [
          { n: "20 oct.", title: "Annonce", text: "Airbnb prévient les hôtes et ouvre le nouvel éditeur de règles dans l'annonce." },
          { n: "Maintenant", title: "Vous vous préparez", text: "Relisez vos consignes de départ et réécrivez celles qui sont des corvées imposées." },
          { n: "20 nov.", title: "Entrée en vigueur", text: "La nouvelle politique des règles de la maison s'applique." },
        ],
      },
      {
        type: "stats",
        items: [
          { value: "7", label: "Règles de la maison standard" },
          { value: "0", label: "Corvée de départ imposable" },
          { value: "1", label: "Seul endroit pour tout écrire : l'annonce" },
        ],
      },
      {
        type: "text",
        heading: "Les 7 règles de la maison",
        paragraphs: [
          "Ce sont les seules vraies règles : le voyageur doit les respecter, et vous pouvez annuler sans frais s'il les enfreint. Vous les réglez directement dans l'éditeur de l'annonce.",
        ],
      },
      {
        type: "icons",
        items: [
          { icon: UsersIcon, title: "Voyageurs maximum", text: "Combien de personnes peuvent dormir sur place." },
          { icon: MoonIcon, title: "Heures de calme", text: "Les horaires où l'on évite le bruit." },
          { icon: PartyIcon, title: "Événements", text: "Fêtes et rassemblements : autorisés ou non." },
          { icon: PawIcon, title: "Animaux", text: "Acceptés ou non, et combien." },
          { icon: SmokeIcon, title: "Tabac", text: "Vapotage compris." },
          { icon: CameraIcon, title: "Photo et tournage commercial", text: "Autorisés ou non dans le logement." },
          { icon: KeyIcon, title: "Fermeture à clé au départ", text: "Obligatoire ou non, avec des précisions possibles sur la remise des clés." },
        ],
      },
      {
        type: "text",
        heading: "Corvées de départ : ce qui change",
        paragraphs: [
          "Tout ce qui n'est pas l'une des sept règles est une demande : le voyageur est invité à la suivre, sans obligation. Elle doit rester raisonnable.",
        ],
      },
      {
        type: "compare",
        left: {
          title: "Ce que vous ne pouvez plus exiger",
          items: [
            "Laver et ranger la vaisselle",
            "Enlever les draps ou lancer une lessive",
            "Sortir les poubelles hors du logement",
            "Interdire un équipement annoncé, comme la climatisation",
          ],
        },
        right: {
          title: "Ce que vous pouvez demander",
          items: [
            "Mettre la vaisselle utilisée dans l'évier",
            "Rassembler les serviettes utilisées",
            "Trier les déchets dans les bacs à l'intérieur",
            "Éteindre la climatisation en partant",
          ],
        },
      },
      {
        type: "text",
        heading: "À savoir en plus",
        paragraphs: [],
      },
      {
        type: "icons",
        items: [
          { icon: BookIcon, title: "Un seul endroit", text: "Règles et demandes se placent dans l'annonce, pas dans les messages ni sur des affichettes dans le logement." },
          { icon: ShieldIcon, title: "Contrats très limités", text: "Autorisés seulement pour une obligation légale, une copropriété, les séjours mensuels, Airbnb Luxe ou un équipement optionnel." },
          { icon: CalendarIcon, title: "Règles mises en avant", text: "Visibles sur l'annonce avant la réservation, dans l'onglet Voyages et dans les rappels de réservation." },
          { icon: ChatIcon, title: "Contrôle et recours", text: "Une demande non conforme est signalée dans l'éditeur : vous recevez un e-mail et pouvez faire appel." },
        ],
      },
      {
        type: "text",
        heading: "Et votre livret d'accueil ?",
        paragraphs: [
          "Il reste le bon endroit pour l'information utile : wifi, fonctionnement des appareils, accès, bonnes adresses. Notre lecture, à vérifier de votre côté : gardez dans le livret ce qui informe et conseille, et faites en sorte que les règles qui engagent le voyageur soient celles de l'annonce, sans en ajouter de nouvelles dans le livret ou les messages.",
          "Si vous utilisez un check-in électronique, un point demande de la prudence. Selon la presse spécialisée, la politique limite par défaut la collecte de coordonnées ou de pièces d'identité, avec des exceptions pour les obligations légales, ce qui peut concerner l'enregistrement des voyageurs étrangers en France. La page officielle d'Airbnb ne détaille pas ce point : relisez le texte exact avant de changer votre procédure.",
        ],
      },
      {
        type: "steps",
        items: [
          { n: "1", title: "Faites le tri", text: "Relisez vos consignes de départ et repérez celles qui sont des corvées imposées." },
          { n: "2", title: "Réécrivez", text: "Gardez comme règles ce qui compte parmi les sept ; reformulez le reste en demandes simples et aimables." },
          { n: "3", title: "Prévoyez le travail ailleurs", text: "Draps, vaisselle, déchets : intégrez-les à votre organisation de ménage ou à vos tarifs." },
        ],
      },
      {
        type: "text",
        heading: "Bon à savoir",
        paragraphs: [
          "Selon la presse spécialisée, la politique concerne les réservations effectuées à partir du 20 novembre ; les réservations déjà faites gardent les règles affichées à la réservation. L'application exacte peut dépendre de votre annonce : vérifiez dans votre espace hôte.",
          "Si les corvées de départ faisaient partie de votre équation, revoyez vos frais de ménage : c'est ce que plusieurs professionnels cités par la presse spécialisée soulèvent. Une demande aimable passe aussi mieux qu'une consigne sèche, et Airbnb permet d'envoyer les règles de la maison en réponse rapide pendant le séjour.",
        ],
      },
      {
        type: "quote",
        text: "Moins de corvées imposées, plus de clarté : ce que vous attendez du voyageur doit tenir en quelques règles nettes.",
      },
      {
        type: "note",
        text: "Sources : Airbnb, Centre de ressources, « Important changes to house rules » (20 octobre 2026) ; Skift, 21 octobre 2026 ; RentalScaleUp. Les points attribués à la presse spécialisée ne figurent pas sur la page officielle consultée. Cet article donne un aperçu général et ne remplace pas un avis juridique — vérifiez les conditions exactes dans votre espace hôte Airbnb.",
      },
    ],
  },
  {
    slug: "livret-accueil-numerique-avantages-hote",
    title: "Livret d'accueil numérique : à quoi ça sert et comment ça simplifie le travail de l'hôte",
    metaDescription:
      "Ce qu'un livret d'accueil numérique change concrètement pour un hôte Airbnb : moins de messages répétés, un accès centralisé pour le voyageur, et une gestion multi-logements simplifiée.",
    excerpt: "Le même message WhatsApp, encore et encore — voici ce qu'un livret d'accueil numérique change concrètement pour un hôte.",
    publishedAt: "2026-09-16",
    blocks: [
      {
        type: "lead",
        text: "Un voyageur qui arrive un dimanche à 23h demande le code wifi. Le suivant, une semaine plus tard, pose exactement la même question. Un livret d'accueil numérique existe pour que cette conversation n'ait plus jamais lieu deux fois.",
      },
      {
        type: "icons",
        items: [
          {
            icon: WifiIcon,
            title: "Un lien, avant l'arrivée",
            text: "Wifi, horaires, code d'accès : tout est envoyé au voyageur avant même qu'il pose la question, et reste disponible pendant tout le séjour.",
          },
          {
            icon: CompassIcon,
            title: "Vos vraies recommandations",
            text: "Pas une liste générique : les adresses que vous recommandez vraiment, situées sur une carte par rapport au logement exact.",
          },
          {
            icon: CarIcon,
            title: "Le transfert, sans échange de messages",
            text: "Le voyageur réserve son transfert aéroport directement depuis le livret, avec un tarif déjà calculé.",
          },
          {
            icon: ChatIcon,
            title: "Un assistant qui répond à sa place",
            text: "Les questions du quotidien trouvent une réponse dans le livret, sans que l'hôte ait à répondre lui-même.",
          },
          {
            icon: ShieldIcon,
            title: "Le check-in, en option",
            text: "Pour les hôtes qui gèrent l'arrivée à distance, le livret peut inclure un check-in électronique avec vérification d'identité.",
          },
          {
            icon: BookIcon,
            title: "Un compte, plusieurs logements",
            text: "Chaque logement a son propre livret, mais tout se gère et se met à jour depuis le même compte.",
          },
        ],
      },
      {
        type: "compare",
        left: {
          title: "Sans livret d'accueil",
          items: [
            "Le même message réécrit à chaque réservation",
            "Un PDF qui se perd dans la boîte mail",
            "Une seule langue, celle de l'hôte",
            "Aucun suivi si plusieurs logements",
          ],
        },
        right: {
          title: "Avec Tourist Book",
          items: [
            "Un lien unique, toujours à jour",
            "Accessible sur mobile, à tout moment",
            "Traduit automatiquement dans la langue du voyageur",
            "Un livret par logement, géré depuis un seul compte",
          ],
        },
      },
      {
        type: "quote",
        text: "L'objectif n'est pas d'ajouter un outil de plus — c'est de ne plus avoir à répondre deux fois à la même question.",
      },
    ],
  },
  {
    slug: "enregistrement-voyageurs-loi-check-in-electronique",
    title: "Enregistrer ses voyageurs : ce que demande la loi, et comment l'automatiser",
    metaDescription:
      "Les hébergements touristiques ont une obligation d'enregistrement de leurs voyageurs en France. Ce qu'elle implique concrètement, et comment le check-in électronique l'automatise sans échange de messages.",
    excerpt: "Une obligation que beaucoup d'hôtes découvrent trop tard — et comment le check-in électronique l'automatise proprement.",
    publishedAt: "2026-09-16",
    blocks: [
      {
        type: "lead",
        text: "En France, les hébergeurs touristiques ont une obligation d'enregistrement de leurs voyageurs, renforcée pour les voyageurs étrangers non-résidents : identité complète, nationalité et numéro de pièce d'identité doivent être recueillis et conservés, traditionnellement via une fiche individuelle remise aux autorités sur demande.",
      },
      {
        type: "compare",
        left: {
          title: "Ce que la loi demande",
          items: [
            "Identité complète du voyageur (nom, prénom, nationalité)",
            "Numéro et type de pièce d'identité",
            "Conservation sécurisée de ces informations",
            "Un enregistrement par séjour, surtout pour les voyageurs étrangers",
          ],
        },
        right: {
          title: "Ce que le check-in Tourist Book automatise",
          items: [
            "Le voyageur renseigne lui-même ses informations avant l'arrivée",
            "La pièce d'identité et un selfie de vérification sont téléchargés en ligne",
            "Tout est stocké dans un espace privé, jamais accessible publiquement",
            "L'hôte retrouve chaque dossier en un clic, sans ressaisie",
          ],
        },
      },
      {
        type: "steps",
        items: [
          {
            n: "1",
            title: "L'hôte envoie le lien",
            text: "Un lien de check-in unique, généré pour cette réservation précise.",
          },
          {
            n: "2",
            title: "Le voyageur remplit et signe",
            text: "Identité, pièce d'identité, selfie de vérification, et signature du règlement intérieur.",
          },
          {
            n: "3",
            title: "L'hôte a un dossier complet",
            text: "Accessible depuis le panel, en sécurité, sans avoir échangé un seul message.",
          },
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: ShieldIcon,
            title: "Stockage privé",
            text: "Les documents ne sont jamais publics : seul l'hôte y accède, depuis son panel, via un lien à durée limitée.",
          },
          {
            icon: ChatIcon,
            title: "Dans la langue du voyageur",
            text: "Le formulaire de check-in est disponible en français, anglais et espagnol.",
          },
        ],
      },
      {
        type: "note",
        text: "Cet article donne un aperçu général et ne remplace pas un avis juridique — les obligations exactes varient selon le type d'hébergement et la commune. Vérifiez votre situation auprès de votre mairie ou d'un professionnel du droit.",
      },
    ],
  },
  {
    slug: "assistant-ia-livret-accueil",
    title: "Un assistant qui répond aux voyageurs à toute heure, à partir de votre livret",
    metaDescription:
      "L'assistant intégré au livret d'accueil répond aux questions du quotidien des voyageurs — wifi, horaires, parking — uniquement à partir des informations réelles du logement, à toute heure.",
    excerpt: "Le même genre de question, à 2h du matin, dans une langue que vous ne parlez pas — voici comment l'assistant du livret y répond à votre place.",
    publishedAt: "2026-09-16",
    blocks: [
      {
        type: "lead",
        text: "Wifi, horaires, parking, restaurant à proximité — ce sont toujours les mêmes questions, posées à des heures où l'hôte n'a pas forcément envie de répondre. L'assistant intégré au livret y répond à sa place, directement, avec les vraies informations du logement.",
      },
      {
        type: "chat",
        exchanges: [
          { q: "What's the wifi password?", a: "Le wifi s'appelle « Villa Azur », mot de passe : soleil2026." },
          { q: "Puedo llegar antes de las 15h ?", a: "L'arrivée est possible à partir de 15h. Pour un accès plus tôt, contacte directement l'hôte." },
          { q: "Où est-ce qu'on peut se garer ?", a: "Un parking public se trouve à 200m, rue de la Liberté — gratuit après 19h." },
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: ChatIcon,
            title: "Disponible à toute heure",
            text: "L'assistant répond à n'importe quel moment, dans la langue du voyageur — pas seulement pendant les horaires de l'hôte.",
          },
          {
            icon: WifiIcon,
            title: "Les vraies infos du logement",
            text: "Il ne répond qu'à partir de ce que l'hôte a renseigné pour ce logement précis — jamais une réponse générique.",
          },
          {
            icon: ShieldIcon,
            title: "Honnête quand il ne sait pas",
            text: "Si une information n'a pas été renseignée, l'assistant le dit clairement et redirige vers l'hôte, plutôt que d'inventer une réponse.",
          },
        ],
      },
      {
        type: "quote",
        text: "L'assistant ne remplace pas l'hôte — il absorbe les questions auxquelles l'hôte a déjà répondu cent fois.",
      },
    ],
  },
  {
    slug: "loi-le-meur-2026-meubles-tourisme-cote-azur",
    title: "Loi Le Meur 2026 : ce que les hôtes de la Côte d'Azur doivent faire avant le 20 mai",
    metaDescription:
      "La loi Le Meur généralise la déclaration en mairie et le numéro d'enregistrement à 13 caractères pour tous les meublés de tourisme avant le 20 mai 2026. Ce qui change, avec les échéances et les sanctions.",
    excerpt: "Déclaration en mairie, numéro à 13 caractères, DPE : ce qui devient obligatoire pour tous les meublés de tourisme avant le 20 mai 2026.",
    publishedAt: "2026-09-17",
    blocks: [
      {
        type: "lead",
        text: "La loi n° 2024-1039 du 19 novembre 2024, dite loi Le Meur, resserre les obligations administratives des meublés de tourisme partout en France — résidence principale comme secondaire, sans exception de commune. Voici ce qui doit être en ordre avant le 20 mai 2026.",
      },
      {
        type: "stats",
        items: [
          { value: "20 mai 2026", label: "Date limite du numéro d'enregistrement" },
          { value: "13", label: "Caractères dans le numéro (via Declaloc)" },
          { value: "20 000 €", label: "Amende maximale en cas de manquement" },
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: ShieldIcon,
            title: "Déclaration en mairie",
            text: "Obligatoire dans toutes les communes sans exception, pour une résidence principale comme secondaire.",
          },
          {
            icon: BookIcon,
            title: "Numéro d'enregistrement affiché",
            text: "Un numéro à 13 caractères, obtenu via le téléservice Declaloc, à ajouter sur chaque annonce.",
          },
          {
            icon: ChatIcon,
            title: "Copropriété informée",
            text: "Tout copropriétaire déclarant son bien comme meublé de tourisme doit désormais en informer le syndic.",
          },
        ],
      },
      {
        type: "steps",
        items: [
          {
            n: "1",
            title: "Déclarer en mairie",
            text: "Le formulaire ou téléservice dépend de votre commune — à vérifier directement auprès d'elle.",
          },
          {
            n: "2",
            title: "Obtenir le numéro Declaloc",
            text: "13 caractères à afficher sur toutes vos annonces avant le 20 mai 2026.",
          },
          {
            n: "3",
            title: "Vérifier le DPE",
            text: "Un logement classé F ou G peut déjà être soumis à des restrictions locales en 2026.",
          },
        ],
      },
      {
        type: "note",
        text: "Sources : loi n° 2024-1039 du 19 novembre 2024, Declaloc, presse spécialisée (Lodgify, AGN Avocats, Epsilium, LMNP.ai). Cet article donne un aperçu général — vérifiez les modalités exactes applicables à votre commune.",
      },
    ],
  },
  {
    slug: "aeroport-nice-tourisme-2025-chiffres-hotes-airbnb",
    title: "15,23 millions de passagers à Nice en 2025 : ce que ça change pour les hôtes Airbnb",
    metaDescription:
      "L'aéroport Nice Côte d'Azur a dépassé les 15 millions de passagers en 2025, 2e aéroport de France après Paris. Ce que ce volume de voyageurs implique concrètement pour l'accueil.",
    excerpt: "2e aéroport de France, 12 millions de séjours touristiques : ce que le volume de voyageurs sur la Côte d'Azur implique pour l'accueil.",
    publishedAt: "2026-09-17",
    blocks: [
      {
        type: "lead",
        text: "En 2025, l'aéroport Nice Côte d'Azur a franchi les 15 millions de passagers pour la première fois — le 2e aéroport de France après Paris. Un volume qui change la donne pour l'accueil des voyageurs sur toute la Côte d'Azur.",
      },
      {
        type: "stats",
        items: [
          { value: "15,23 M", label: "Passagers à l'aéroport de Nice en 2025" },
          { value: "+4,7 %", label: "Croissance du trafic international en un an" },
          { value: "12 M+", label: "Séjours touristiques sur la Côte d'Azur en 2025" },
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: CompassIcon,
            title: "Une demande forte, toute l'année",
            text: "Le 2e aéroport de France n'est pas qu'un pic estival — les arrivées se répartissent sur une bonne partie de l'année.",
          },
          {
            icon: CarIcon,
            title: "Le transfert, une vraie question",
            text: "Avec autant de vols, l'information d'arrivée (horaires, transfert) compte double pour un voyageur qui débarque dans une ville inconnue.",
          },
          {
            icon: WifiIcon,
            title: "L'accueil comme différenciateur",
            text: "Avec autant de logements disponibles, la qualité de l'accueil fait la différence entre deux annonces similaires.",
          },
        ],
      },
      {
        type: "quote",
        text: "Un marché qui reçoit 15 millions de voyageurs par an ne pardonne pas un accueil improvisé.",
      },
      {
        type: "note",
        text: "Sources : Aéroport Nice Côte d'Azur (bilan 2025, via Air Journal) ; Observatoire du Tourisme de la Côte d'Azur.",
      },
    ],
  },
  {
    slug: "voyageurs-etrangers-cote-azur-traduction-livret-accueil",
    title: "Plus de la moitié des voyageurs sont étrangers sur la Côte d'Azur : pourquoi la traduction n'est plus un luxe",
    metaDescription:
      "Plus de 50 % des touristes sur la Côte d'Azur sont étrangers en 2025, jusqu'à 58 % l'été. Pourquoi un livret d'accueil traduit automatiquement devient indispensable, pas accessoire.",
    excerpt: "Jusqu'à 58 % de clientèle étrangère l'été sur la Côte d'Azur — la langue n'est plus un détail, c'est la moitié de vos voyageurs.",
    publishedAt: "2026-09-17",
    blocks: [
      {
        type: "lead",
        text: "Plus de la moitié des touristes qui séjournent sur la Côte d'Azur en 2025 viennent de l'étranger — jusqu'à 58 % en plein été dans l'hôtellerie marchande. La langue n'est plus un détail secondaire du livret d'accueil, c'est la moitié de vos voyageurs.",
      },
      {
        type: "stats",
        items: [
          { value: "50 %+", label: "Voyageurs étrangers sur la Côte d'Azur en 2025" },
          { value: "58 %", label: "Part de clientèle étrangère en août" },
          { value: "15 %+", label: "Nuitées internationales venant des États-Unis, 1er marché étranger" },
        ],
      },
      {
        type: "text",
        heading: "Qui sont ces voyageurs ?",
        paragraphs: [
          "Les États-Unis sont devenus le premier marché étranger de la Côte d'Azur, avec plus de 15 % des nuitées internationales. Suivent le Royaume-Uni et l'Irlande (15,5 % des séjours étrangers), l'Italie (15,8 %, portée par la proximité géographique), l'Allemagne et les pays scandinaves.",
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: ChatIcon,
            title: "Traduit automatiquement",
            text: "Le livret Tourist Book s'affiche en français, anglais et espagnol, sans travail supplémentaire pour l'hôte.",
          },
          {
            icon: CompassIcon,
            title: "Vos recommandations, comprises par tous",
            text: "Une recommandation locale ne sert à rien si le voyageur ne la comprend pas.",
          },
          {
            icon: ShieldIcon,
            title: "Honnête sur ses limites",
            text: "L'italien, l'allemand et le scandinave ne sont pas encore couverts, même s'ils représentent une bonne partie des voyageurs de la région.",
          },
        ],
      },
      {
        type: "note",
        text: "Sources : Observatoire du Tourisme de la Côte d'Azur, bilan touristique 2025 ; Destination Côte d'Azur France.",
      },
    ],
  },
  {
    slug: "taxe-sejour-numero-enregistrement-mentions-obligatoires-2026",
    title: "Taxe de séjour et numéro d'enregistrement : les mentions obligatoires à afficher en 2026",
    metaDescription:
      "Montant de la taxe de séjour, numéro d'enregistrement à 13 caractères : ce que la loi impose d'afficher aux voyageurs en 2026, et ce qu'Airbnb gère ou non à votre place.",
    excerpt: "Deux mentions doivent légalement être visibles par vos voyageurs — voici ce que ça implique concrètement en 2026.",
    publishedAt: "2026-09-17",
    blocks: [
      {
        type: "lead",
        text: "Deux mentions doivent légalement être visibles par vos voyageurs : le montant de la taxe de séjour, et le numéro d'enregistrement de votre logement. Voici ce que ça implique concrètement en 2026.",
      },
      {
        type: "stats",
        items: [
          { value: "0,20 € – 4,90 €", label: "Barème 2026 de la taxe de séjour, par adulte et par nuit" },
          { value: "13", label: "Caractères du numéro d'enregistrement (Declaloc)" },
          { value: "150 €", label: "Amende par infraction en cas d'absence d'affichage" },
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: BookIcon,
            title: "Le montant, pas juste le principe",
            text: "Le voyageur doit savoir combien il paie exactement, pas seulement qu'une taxe de séjour existe.",
          },
          {
            icon: ShieldIcon,
            title: "Le numéro, sur chaque annonce",
            text: "Généralisé à toutes les communes avant le 20 mai 2026, quelle que soit la taille de la ville.",
          },
          {
            icon: ChatIcon,
            title: "Une responsabilité qui reste la vôtre",
            text: "Airbnb collecte et reverse la taxe dans plus de 29 000 communes françaises, mais la déclaration en mairie et le numéro d'enregistrement restent à la charge de l'hôte.",
          },
        ],
      },
      {
        type: "note",
        text: "Sources : barème 2026 indexé sur l'inflation INSEE, article L.2333-34 du Code général des collectivités territoriales, Declaloc. Cet article donne un aperçu général et ne remplace pas un avis juridique — vérifiez votre situation auprès de votre mairie.",
      },
    ],
  },
  {
    slug: "location-linge-airbnb-alpes-maritimes-draps-serviettes",
    title: "Draps et serviettes en location courte durée : acheter ou louer son linge dans les Alpes-Maritimes ?",
    metaDescription:
      "Acheter son linge ou le louer ? Avantages, limites et questions à poser, avec des prestataires de location de linge dans les Alpes-Maritimes (Nice, Cannes, Antibes, Menton, Grasse).",
    excerpt: "Beaucoup d'hôtes achètent leurs draps sans savoir que des entreprises les louent, lavés et repassés — voici comment choisir.",
    publishedAt: "2026-09-30",
    blocks: [
      {
        type: "lead",
        text: "Une location courte durée, c'est des draps et des serviettes à laver, sécher, repasser et remettre en place à chaque départ. La plupart des hôtes achètent leur linge et s'en occupent eux-mêmes ; beaucoup ignorent que des entreprises le louent, propre et repassé, livré avant chaque arrivée.",
      },
      {
        type: "compare",
        left: {
          title: "Acheter et laver soi-même",
          items: [
            "Un investissement de départ, puis un stock à renouveler quand il s'use",
            "Machines, séchage et repassage à chaque rotation",
            "Un jeu de rechange à prévoir pour les arrivées le jour même",
            "Du temps (ou une femme de ménage) qui passe dans la lessive",
          ],
        },
        right: {
          title: "Louer le linge à un prestataire",
          items: [
            "Un coût en plus à chaque séjour, mais pas de stock à acheter",
            "Linge lavé, repassé et livré selon votre planning",
            "Le prestataire remplace le linge usé, pas vous",
            "Un rendu constant : des draps et serviettes toujours impeccables",
          ],
        },
      },
      {
        type: "text",
        heading: "Quand la location devient intéressante",
        paragraphs: [
          "Plus vous enchaînez de séjours courts, plus le linge pèse dans votre temps. Avec plusieurs logements, les arrivées et les départs le même jour, ou une saison très chargée, la lessive et le repassage deviennent le vrai goulot d'étranglement — et c'est là qu'un prestataire se justifie.",
          "C'est un coût de plus : à vous de le comparer, tarifs en main, avec ce que vous coûtent vos propres machines, l'électricité, le temps de repassage et le renouvellement du stock.",
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: ShieldIcon,
            title: "Quelle qualité de linge ?",
            text: "Demandez le grammage et la matière des draps et serviettes, et si vous pouvez voir un échantillon avant de vous engager.",
          },
          {
            icon: CarIcon,
            title: "Livraison et reprise",
            text: "Jours et créneaux de passage, délai en cas de rotation le jour même, livraison dans l'appartement ou à une adresse relais.",
          },
          {
            icon: BookIcon,
            title: "Comment c'est facturé ?",
            text: "Au kit de lit, à la pièce ou à l'abonnement ? Un dépôt de garantie ? Un minimum de kits ? Demandez tout par écrit.",
          },
          {
            icon: ChatIcon,
            title: "Que se passe-t-il en cas de tache ?",
            text: "Linge taché, abîmé ou perdu : qui paie, et à partir de quand ? C'est la ligne que personne ne lit avant le premier problème.",
          },
          {
            icon: CompassIcon,
            title: "Votre zone est-elle couverte ?",
            text: "Nice n'est pas Menton : vérifiez que la livraison couvre bien votre commune, y compris en haute saison.",
          },
          {
            icon: WifiIcon,
            title: "Accepte-t-il les locations meublées ?",
            text: "Certains prestataires travaillent surtout pour l'hôtellerie et la restauration : confirmez qu'ils prennent de petits volumes.",
          },
        ],
      },
      {
        type: "text",
        heading: "Quelques prestataires dans les Alpes-Maritimes",
        paragraphs: [
          "White and Clean (whiteandclean.fr) : nettoyage professionnel et location de linge haut de gamme — draps, housses, taies et serviettes, lavés, repassés et livrés selon le planning des voyageurs. Zones annoncées : Nice, Cannes, Antibes, Monaco, Menton et Grasse.",
          "Fée Mon Linge (feemonlinge.fr) : blanchisserie, pressing et location de linge à Cannes (La Bocca), avec service de collecte et livraison.",
          "Blanc Signature (blancsignature.fr) : linge hôtelier livré et installé dans des villas et appartements de la Côte d'Azur.",
          "Crystal Blanc (Grasse) : location et entretien de linge pour les professionnels de l'hôtellerie et de la restauration — à contacter pour savoir s'ils travaillent avec les locations meublées.",
          "KEYS Conciergerie (keys-conciergerie.fr) : gère le linge complet (collecte, lavage, repassage, livraison, mise en place) à Nice, Antibes, Cannes et aux alentours, mais dans le cadre de sa conciergerie — ce n'est pas un service de location seule.",
        ],
      },
      {
        type: "steps",
        items: [
          { n: "1", title: "Comptez vos rotations", text: "Nombre de séjours par mois, nombre de lits : c'est la base de tout devis." },
          { n: "2", title: "Demandez 2 ou 3 devis", text: "Même volume, même période, mêmes questions — sinon les prix ne se comparent pas." },
          { n: "3", title: "Testez sur un logement", text: "Un mois sur un seul appartement, avant de tout confier." },
        ],
      },
      {
        type: "note",
        text: "Prestataires cités d'après leurs sites publics à la date de publication, à titre d'information et sans partenariat avec Tourist Book. Tarifs, zones et conditions changent : vérifiez directement auprès de chaque entreprise.",
      },
    ],
  },
  {
    slug: "gestion-tarifs-location-saisonniere-difficultes-experts",
    title: "Tarifs en location saisonnière : ce qui est vraiment le plus difficile (et comment s'en sortir)",
    metaDescription:
      "Quelle est la vraie difficulté pour fixer ses tarifs en location saisonnière ? Ce que disent les experts français, anglais, espagnols, allemands et italiens, le calendrier 2027 de la Côte d'Azur et une méthode simple.",
    excerpt: "Ce n'est pas de trouver un prix : c'est de le tenir à jour, nuit après nuit. Ce que disent les experts, en cinq langues.",
    publishedAt: "2026-10-07",
    blocks: [
      {
        type: "lead",
        text: "« Qu'est-ce qui est le plus difficile pour vous dans la gestion des tarifs ? » La question revient sans cesse chez les propriétaires et les concierges. En lisant les spécialistes du sujet en français, anglais, espagnol, allemand et italien, la réponse est étonnamment la même partout : la difficulté n'est pas de trouver un prix, c'est de le garder juste.",
      },
      {
        type: "stats",
        items: [
          { value: "15,5 %", label: "Commission unique d'Airbnb côté hôte, au lieu d'environ 3 % + frais voyageur, annoncée pour tous les hôtes d'ici fin 2026" },
          { value: "+36 %", label: "Revenu par logement avec prix dynamique, d'après une étude de 541 logements dans 34 pays (éditeur d'outil : à lire avec recul)" },
          { value: "15–30 %", label: "Commission habituelle d'une conciergerie, selon l'étendue des services" },
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: BookIcon,
            title: "Trouver le bon prix de départ",
            text: "Beaucoup de propriétaires fixent leur prix au ressenti ou par attachement : 300 € la nuit quand le marché en vaut 220. Les guides le répètent : partez des données et des coûts réels, pas de l'émotion.",
          },
          {
            icon: CompassIcon,
            title: "Le garder à jour",
            text: "Le prix posé en janvier puis oublié est l'erreur la plus citée, dans toutes les langues : des semaines trop chères qui restent vides, des pics de demande bradés.",
          },
          {
            icon: ChatIcon,
            title: "Anticiper les événements",
            text: "Festivals, salons, ponts, vacances scolaires : la demande monte d'un coup, et il faut le voir avant les autres. Une nuit sous-vendue pendant un événement ne se rattrape pas.",
          },
          {
            icon: ShieldIcon,
            title: "Séjour minimum et nuits « trou »",
            text: "Trop strict en basse saison, il laisse des nuits isolées vides ; trop souple en haute saison, il fait perdre les longs séjours rentables. Les experts conseillent de le faire varier avec la saison.",
          },
          {
            icon: WifiIcon,
            title: "Comprendre ses vrais coûts",
            text: "Ménage, commission de la plateforme, taxe de séjour, entretien, et pour un concierge sa propre commission : le prix affiché n'est pas la marge réelle. Une commission annoncée à 15 % peut dépasser 25 % une fois les prestations ajoutées.",
          },
          {
            icon: CarIcon,
            title: "Faire confiance à un outil (ou non)",
            text: "PriceLabs, Beyond, Wheelhouse : ils calculent une tarification par nuit, mais il faut fixer un prix de base, un minimum et un maximum, et surveiller leurs recommandations.",
          },
        ],
      },
      {
        type: "compare",
        left: {
          title: "Un prix fixe toute l'année",
          items: [
            "Hors saison : des nuits vides à plein tarif",
            "Pendant les événements : des nuits vendues trop bon marché",
            "On regarde les concurrents une fois par an, si on y pense",
            "Les mauvaises surprises arrivent en fin de saison",
          ],
        },
        right: {
          title: "Un prix revu régulièrement",
          items: [
            "Un tarif plancher calculé à partir des coûts réels",
            "Les dates d'événements marquées dans le calendrier",
            "Un coup d'œil chaque semaine aux concurrents proches",
            "Des remises de dernière minute pour remplir les trous",
          ],
        },
      },
      {
        type: "text",
        heading: "Ce que disent les spécialistes, langue par langue",
        paragraphs: [
          "En français, des conciergeries et des plateformes comme hoomy ou La Conciergerie du Pouldu parlent de « yield management » : vendre la bonne nuit, au bon prix, au bon moment. Elles insistent sur la durée minimale de séjour qui varie avec les vacances scolaires, les week-ends et les ponts, et rappellent que l'offre progresse plus vite que la demande, ce qui pousse à se différencier.",
          "En anglais, Smoobu recense huit erreurs classiques : prix fixe à l'année, aucune comparaison avec les voisins, coûts sous-estimés, dernière minute oubliée, tendances de marché ignorées, tarification émotionnelle, pas de différence haute et basse saison, événements locaux ratés. BiggerPockets et HostTools défendent la même idée : arrêter de deviner et suivre des données.",
          "En espagnol, Interhome, Net2Rent et Chekin expliquent que le prix dynamique consiste à ajuster chaque nuit selon la demande prévue, au lieu d'avoir un tarif haute saison et un tarif basse saison. Ils citent la saisonnalité, le jour de la semaine et les événements locaux comme les trois leviers.",
          "En allemand, Favorent et Your.Rentals décrivent un calcul fondé sur quatre sources : son propre taux de réservation, les prix des logements comparables, la demande de la région et les événements, la météo ou les vacances. Ils ajoutent un avertissement utile : trop de tarifs saisonniers et de séjours minimums différents finissent par dérouter les voyageurs.",
          "En italien, Smartness et BnB Academy conseillent de construire le prix de base à partir des coûts réels, de marquer les événements récurrents et, en basse saison, de viser une occupation cible de 40 à 50 % plutôt que de courir après chaque nuit. Pendant un événement, expliquent-ils, on ne multiplie pas le prix par un coefficient fixe : on regarde combien d'offre reste libre.",
        ],
      },
      {
        type: "text",
        heading: "Ce qui change en 2026 : les frais d'Airbnb",
        paragraphs: [
          "Airbnb passe à une commission unique de 15,5 % payée par l'hôte, à la place d'environ 3 % côté hôte plus des frais côté voyageur. Selon les éditeurs d'outils qui suivent le sujet, le changement touche tous les hôtes d'ici la fin 2026, avec une date annoncée au 13 octobre 2026 pour l'Espace économique européen. Vérifiez la date exacte dans votre compte.",
          "Concrètement, si vous étiez sur l'ancien modèle, votre revenu net par nuit baisse à prix égal. Les options citées sont de relever le prix de base, de tarifer plus finement, de développer la réservation directe et de diversifier les plateformes. Aucune n'est gratuite : relever le prix peut vous faire perdre en visibilité.",
        ],
      },
      {
        type: "text",
        heading: "À marquer dans votre calendrier : la Côte d'Azur en 2027",
        paragraphs: [
          "Carnaval de Nice : du 9 au 28 février 2027. Fête du Citron à Menton : du 13 au 28 février 2027. MIPIM à Cannes : du 15 au 19 mars 2027. Festival de Cannes : du 11 au 22 mai 2027. Grand Prix de Monaco : du 3 au 6 juin 2027.",
          "Ce sont les dates annoncées par les organisateurs et les offices de tourisme à ce jour : confirmez-les avant de bloquer vos tarifs. Les logements autour de Cannes, de Nice, de Menton et de Monaco voient la demande monter bien avant ces dates, parfois plusieurs mois avant.",
        ],
      },
      {
        type: "steps",
        items: [
          { n: "1", title: "Calculez votre plancher", text: "Ménage, commission de la plateforme, taxe de séjour, commission du concierge : le prix en dessous duquel vous perdez de l'argent." },
          { n: "2", title: "Marquez le calendrier", text: "Événements, vacances scolaires, ponts, week-ends : ce sont vos jours à surveiller en priorité." },
          { n: "3", title: "Revoyez chaque semaine", text: "Dix minutes pour comparer avec trois logements proches et ajuster. Ou un outil, avec un minimum et un maximum que vous contrôlez." },
        ],
      },
      {
        type: "quote",
        text: "Le bon prix n'existe pas : il se recalcule.",
      },
      {
        type: "note",
        text: "Sources consultées en octobre 2026 : Smoobu, Houst, Lodgify, hoomy, La Conciergerie du Pouldu, ALB Conciergerie, BiggerPockets, HostTools, Interhome, Net2Rent, Chekin, Favorent, Your.Rentals, Smartness, BnB Academy, PriceLabs, ainsi que les sites des organisateurs pour les dates 2027. Plusieurs chiffres viennent d'éditeurs d'outils de tarification, qui ont intérêt à promouvoir la tarification dynamique : lisez-les comme des indications, pas comme des garanties. Cet article ne remplace pas un conseil fiscal ou juridique.",
      },
    ],
  },
  {
    slug: "trouver-conciergerie-airbnb-courte-duree",
    title: "Où trouver une conciergerie Airbnb pour un appartement en courte durée ? Cinq pistes et les questions à poser avant de signer",
    metaDescription:
      "Où trouver une conciergerie Airbnb spécialisée dans la courte durée : réseau de co-hôtes Airbnb, conciergeries locales, groupements professionnels, bouche-à-oreille. Commissions, carte G et questions à poser avant de signer.",
    excerpt: "Annuaires, co-hôtes Airbnb, conciergeries locales : où chercher, ce que ça coûte vraiment, et les questions à poser avant de signer.",
    publishedAt: "2026-10-13",
    blocks: [
      {
        type: "lead",
        text: "Trouver une conciergerie n'est pas difficile : il y en a des centaines. Le difficile, c'est de trouver celle qui connaît la courte durée dans votre quartier, qui annonce clairement ce qu'elle prend, et dont le pourcentage affiché correspond à ce que vous verrez réellement sur votre compte. Voici où chercher, et quoi demander avant de signer.",
      },
      {
        type: "stats",
        items: [
          { value: "15–30 %", label: "Commission habituellement annoncée par les conciergeries, selon l'étendue des services (sources du secteur : à vérifier devis en main)" },
          { value: "3", label: "Co-hôtes maximum par annonce sur Airbnb" },
          { value: "3 devis", label: "Le minimum à comparer, sur le revenu net estimé et pas sur le taux affiché" },
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: CompassIcon,
            title: "Le réseau de co-hôtes d'Airbnb",
            text: "Airbnb propose des pages par ville : vous indiquez la localisation du logement, vous consultez les profils et les notes des co-hôtes disponibles, vous leur écrivez, puis vous en invitez un sur votre annonce. C'est la piste la plus simple pour comparer des profils avec des avis réels.",
          },
          {
            icon: ChatIcon,
            title: "Les conciergeries de votre ville",
            text: "Une recherche sur la carte (« conciergerie Airbnb » + votre ville) donne les structures locales avec leurs avis. Lisez les avis des propriétaires, pas seulement ceux des voyageurs, et regardez depuis quand elles gèrent des logements comme le vôtre.",
          },
          {
            icon: ShieldIcon,
            title: "Les groupements professionnels",
            text: "Plusieurs conciergeries se regroupent au sein d'organisations professionnelles : c'est un premier signe de sérieux, sans remplacer la vérification du contrat. Demandez toujours depuis quand elles exercent et sous quel statut.",
          },
          {
            icon: BookIcon,
            title: "Les plateformes et les groupes de propriétaires",
            text: "Des plateformes de mise en relation permettent de publier votre besoin ou de consulter des profils de co-hôtes de votre région, et les groupes de propriétaires sont utiles pour obtenir des retours sans filtre.",
          },
          {
            icon: WifiIcon,
            title: "Le bouche-à-oreille",
            text: "D'autres hôtes de votre immeuble ou de votre quartier ont sans doute déjà essayé. Demandez-leur ce qu'ils paient réellement, ce qui s'est mal passé, et pourquoi ils ont changé, s'ils l'ont fait.",
          },
        ],
      },
      {
        type: "text",
        heading: "Conciergerie ou co-hôte : ce n'est pas la même chose",
        paragraphs: [
          "Un co-hôte est en général une personne de confiance qui vous aide à gérer une location précise, parfois pour un nombre limité de logements. Une conciergerie est une entreprise externe, avec des équipes, des process et souvent plusieurs logements gérés dans le même secteur. Airbnb précise que les conciergeries peuvent participer à son réseau, mais par l'intermédiaire de salariés individuels plutôt que de la structure elle-même.",
          "Le bon choix dépend de votre besoin. Pour un seul appartement et un propriétaire encore impliqué, un co-hôte local peut suffire. Pour plusieurs logements, ou si vous vivez loin, une conciergerie organisée est plus solide : remplaçant en cas d'absence, ménage coordonné, astreinte.",
        ],
      },
      {
        type: "compare",
        left: {
          title: "Le pourcentage affiché",
          items: [
            "« 20 % » sur la page d'accueil",
            "Souvent calculé sur le revenu net, après la commission de la plateforme",
            "Ménage et linge refacturés à part, parfois avec une marge",
            "Frais d'entrée ou de mise en service en plus",
          ],
        },
        right: {
          title: "Ce qui arrive sur votre compte",
          items: [
            "Le revenu net après tous les frais, pour une même hypothèse de nuits",
            "La marge éventuelle sur le ménage, demandée par écrit",
            "Les frais d'entrée et les conditions de sortie, détaillés",
            "Un exemple chiffré sur votre logement, pas un exemple général",
          ],
        },
      },
      {
        type: "text",
        heading: "Les commissions, en clair",
        paragraphs: [
          "Les sources du secteur annoncent le plus souvent une fourchette de 15 à 30 % des revenus, avec une moyenne autour de 20 à 25 % pour une gestion complète et environ 15 % pour une offre allégée (messages et calendrier). D'autres guides évoquent des fourchettes plus larges. Ces chiffres viennent surtout des conciergeries elles-mêmes : ils donnent un ordre de grandeur, pas une vérité.",
          "Le piège le plus fréquent est la base de calcul. Une conciergerie qui annonce 20 % le calcule souvent sur le revenu net de la plateforme, auquel s'ajoutent le ménage, le linge et les frais d'entrée. Comparer deux offres sur le seul taux, c'est comparer deux loyers sans regarder les charges : demandez à chacune de chiffrer, pour votre logement, le montant net que vous recevrez.",
        ],
      },
      {
        type: "steps",
        items: [
          { n: "1", title: "Demandez le statut et la carte G", text: "Si la conciergerie gère les fonds du propriétaire ou la location de façon globale, la carte professionnelle de gestion immobilière (carte G) est en principe requise. Pour de l'accueil, du ménage et de la maintenance sans encaisser de fonds, le cadre est différent. Dans les deux cas, demandez un mandat ou un contrat écrit qui précise les prestations." },
          { n: "2", title: "Faites chiffrer le revenu net", text: "Une même hypothèse de nuits, trois devis, et la ligne finale : ce que vous encaissez après plateforme, ménage, linge et commission." },
          { n: "3", title: "Posez la question du ménage", text: "Refacturé au coût réel, ou avec une marge ? C'est souvent là que se cache la différence entre deux offres à pourcentage identique." },
          { n: "4", title: "Vérifiez l'engagement", text: "Frais d'entrée, durée minimale, préavis, conditions de sortie : tout doit figurer dans le contrat, pas seulement dans la brochure." },
          { n: "5", title: "Réclamez des indicateurs", text: "Taux d'occupation, tarifs pratiqués, compte rendu mensuel. Une conciergerie sérieuse sait vous montrer ce qu'elle fait de votre logement." },
        ],
      },
      {
        type: "text",
        heading: "À Nice, Cannes, Menton, Antibes : l'angle local",
        paragraphs: [
          "Sur la Côte d'Azur, la demande est forte mais très inégale d'un mois à l'autre : Carnaval, Festival de Cannes, MIPIM, Grand Prix. Une conciergerie qui connaît votre secteur sait quand elle doit monter les prix, imposer un séjour minimum ou prévoir plus de ménages, et elle vous répond en connaissant vos voisins, votre syndic et vos accès.",
          "Demandez combien de logements elle gère dans votre quartier, et demandez-lui de vous citer deux propriétaires que vous pouvez appeler.",
        ],
      },
      {
        type: "text",
        heading: "Un livret d'accueil, que vous ayez une conciergerie ou non",
        paragraphs: [
          "Quelle que soit l'option, les mêmes questions reviennent chez les voyageurs : wifi, code d'accès, parking, où jeter les poubelles. Un livret d'accueil numérique les règle une fois pour toutes, et reste le même que vous gériez vous-même ou que vous confiiez le logement à une conciergerie : le voyageur a un seul lien, et vous pouvez le modifier à tout moment.",
          "Si vous confiez votre logement, c'est aussi un bon moyen de garder la main : les consignes du logement sont écrites par vous, au même endroit, et la conciergerie les applique.",
        ],
      },
      {
        type: "quote",
        text: "Le bon prestataire est celui dont vous savez calculer le coût réel avant de signer.",
      },
      {
        type: "note",
        text: "Sources consultées en octobre 2026 : pages et guides de conciergeries et d'éditeurs d'outils (Houst, RentaPlus, PriceLabs, Lodgify, Minut), rapports et articles sur la loi Hoguet et la carte G, pages du réseau de co-hôtes d'Airbnb. Les fourchettes de commission viennent largement des professionnels eux-mêmes ; vérifiez toujours le contrat, et pour toute question juridique sur la carte G ou le mandat, consultez la CCI ou un avocat.",
      },
    ],
  },
  {
    slug: "comment-devenir-concierge-airbnb",
    title: "Comment devenir concierge Airbnb ? Salaire, conditions, rentabilité : les réponses aux six questions les plus posées",
    metaDescription:
      "Comment devenir concierge Airbnb : étapes pour se lancer, salaire d'un gestionnaire et d'un concierge, plafonds à ne pas dépasser, conditions pour louer sur Airbnb, rentabilité d'une conciergerie et comment y travailler.",
    excerpt: "Se lancer à son compte ou y travailler : salaire, plafonds, conditions, rentabilité. Les réponses aux six questions les plus posées, chiffres et limites compris.",
    publishedAt: "2026-10-13",
    blocks: [
      {
        type: "lead",
        text: "Concierge Airbnb, c'est un métier que l'on peut exercer de deux façons : en lançant sa propre conciergerie, ou en travaillant dans une conciergerie existante. Les deux ont leurs règles, leurs revenus et leurs pièges. Voici comment s'y prendre, avec les réponses aux six questions que les gens posent le plus souvent, chiffres à l'appui — et leurs limites, parce que beaucoup de chiffres du secteur viennent de ceux qui vendent la conciergerie.",
      },
      {
        type: "stats",
        items: [
          { value: "1 000–5 000 €", label: "Investissement de départ annoncé pour une conciergerie lancée en micro-entreprise, depuis chez soi (sources du secteur)" },
          { value: "15 000 €", label: "Plafond de recettes du micro-BIC pour un meublé de tourisme non classé, depuis 2025 (abattement de 30 %)" },
          { value: "15–30 %", label: "Commission habituellement annoncée par les conciergeries, selon l'étendue des services" },
        ],
      },
      {
        type: "steps",
        items: [
          { n: "1", title: "Choisir son modèle", text: "Accueil et ménage seulement, ou gestion complète (annonce, prix, messages, calendrier) ? Le second demande plus de responsabilités, et un cadre légal plus strict." },
          { n: "2", title: "Poser le cadre légal", text: "Statut (micro-entreprise ou société), assurance de responsabilité civile professionnelle et, si vous gérez la location de façon globale ou des fonds du propriétaire, la carte professionnelle de gestion immobilière (carte G). Vérifiez votre cas auprès de la CCI." },
          { n: "3", title: "Définir ses prestations et ses tarifs", text: "Un contrat écrit qui détaille chaque prestation, la commission, le ménage et le linge, les frais d'entrée et les conditions de sortie." },
          { n: "4", title: "Trouver ses premiers logements", text: "Un ou deux propriétaires de votre entourage, des annonces locales, le réseau de co-hôtes d'Airbnb : la qualité des premiers retours compte plus que le volume." },
          { n: "5", title: "S'équiper", text: "Un calendrier synchronisé, des modèles de messages, un livret d'accueil par logement pour ne pas répondre dix fois à la même question, et un prestataire de ménage fiable." },
        ],
      },
      {
        type: "text",
        heading: "Quel est le salaire moyen d'un gestionnaire de conciergerie Airbnb ?",
        paragraphs: [
          "Il n'existe pas de grille officielle fiable pour ce métier récent. Les repères trouvés varient beaucoup : un guide du secteur daté de 2024 situe un débutant autour de 21 800 € par an, soit environ 1 800 € bruts par mois, et un profil expérimenté jusqu'à 55 000 € par an. Une offre d'emploi d'un réseau national annonce de 2 000 € à 8 000 € par mois pour un poste d'exploitation, avec un statut d'indépendant : la fourchette est très large parce qu'elle mêle fixe et commissions.",
          "Retenez que le salaire d'un gestionnaire dépend surtout de trois choses : le nombre de logements suivis, la ville, et la part variable (commission sur les réservations). Pour un chiffre fiable, regardez les offres actuelles sur les sites d'emploi et la convention collective applicable à votre employeur.",
        ],
      },
      {
        type: "text",
        heading: "Quel est le salaire d'un concierge ?",
        paragraphs: [
          "Tout dépend du type de concierge. Pour un concierge d'entreprise, une étude de cabinet de recrutement reprise par le Journal du Net donne un salaire médian de 2 620 € bruts par mois en 2026, avec une fourchette de 1 823 € à 3 417 €. Un concierge d'hôtel suit en général les grilles de la convention collective de l'hôtellerie, avec des variations selon la catégorie de l'établissement et l'ancienneté.",
          "Un concierge Airbnb indépendant n'a pas de salaire : il a un chiffre d'affaires, fait de commissions et de prestations, dont il retire ses charges. C'est ce qui rend la comparaison avec un salaire délicate.",
        ],
      },
      {
        type: "text",
        heading: "Quel montant ne pas dépasser sur Airbnb ?",
        paragraphs: [
          "Il n'y a pas un seul plafond : il y en a plusieurs, et ils ne visent pas la même chose. Côté fiscalité, depuis 2025 un meublé de tourisme non classé relève du micro-BIC jusqu'à 15 000 € de recettes par an, avec un abattement de 30 %. Pour un meublé classé ou une chambre d'hôtes, le plafond reste de 77 700 € avec un abattement de 50 %. Au-delà, le régime réel devient en principe obligatoire.",
          "Côté nombre de nuits, une résidence principale louée en entier ne peut l'être que 120 nuits par an, et une commune peut descendre cette limite jusqu'à 90 nuits par délibération. La location d'une chambre chez soi, en continuant d'y habiter, n'est pas concernée. Dépasser la limite expose à une amende civile qui peut atteindre 15 000 €.",
          "Ces règles changent. Vérifiez les montants du jour sur impots.gouv.fr et service-public.fr, et l'arrêté de votre commune.",
        ],
      },
      {
        type: "text",
        heading: "Quelles sont les conditions pour faire du Airbnb ?",
        paragraphs: [
          "En France, la déclaration en mairie est exigée pour les meublés de tourisme, et un numéro d'enregistrement doit figurer sur l'annonce là où il est obligatoire : plusieurs centaines de communes l'imposent déjà, dont Nice, et un téléservice national doit généraliser le dispositif. Les plateformes peuvent suspendre une annonce dont le numéro est absent ou invalide.",
          "Selon votre situation, d'autres conditions s'ajoutent : une autorisation de changement d'usage dans certaines communes, le règlement de copropriété qui peut encadrer ou interdire la location touristique, la taxe de séjour à reverser, l'assurance du logement et, pour une résidence principale, la limite de nuits. Les règles liées au DPE concernent surtout les baux d'habitation ; pour un meublé de tourisme, confirmez votre cas auprès de votre mairie.",
          "Notre article sur la loi Le Meur détaille le calendrier pour la Côte d'Azur.",
        ],
      },
      {
        type: "text",
        heading: "Est-ce rentable d'ouvrir une conciergerie ?",
        paragraphs: [
          "Cela peut l'être, mais pas aussi facilement que les brochures le laissent croire. Les sources du secteur évoquent une mise de départ de 1 000 à 5 000 € pour une activité en micro-entreprise à domicile, bien davantage avec un local, et des charges fixes mensuelles de l'ordre de 1 500 à 2 500 € dès qu'il y a des outils, des assurances et des salariés. Les marges nettes annoncées vont de 22 à 34 % selon une franchise, alors qu'une étude de cabinet pour les grands opérateurs multi-sites affiche une rentabilité de 2,8 % : l'écart vient de la taille et du modèle.",
          "Un ordre de grandeur donné par un prestataire : un logement loué 100 € la nuit, 20 nuits par mois, c'est environ 2 000 € de revenus ; à 20 % de commission, la conciergerie touche autour de 400 € par mois sur ce logement, avant ses charges. Le seuil de rentabilité est souvent estimé entre dix et quinze logements, et atteint entre quatre et sept mois. Ce sont des estimations commerciales, pas des moyennes de marché.",
          "Ce qui fait la différence : la zone (une ville touristique toute l'année comme Nice ou Cannes n'est pas une station saisonnière), la saisonnalité, la qualité du ménage et la capacité à garder les propriétaires.",
        ],
      },
      {
        type: "text",
        heading: "Comment est-ce que je peux travailler dans une conciergerie Airbnb ?",
        paragraphs: [
          "Les postes vont du ménage et de l'accueil des voyageurs à la coordination des prestataires et à la responsabilité d'un secteur : agent de ménage ou de linge, agent d'accueil et de check-in, assistant gestionnaire, responsable d'exploitation ou city manager, parfois revenue manager ou chargé de relation propriétaires.",
          "Pour postuler, commencez par les pages carrières des réseaux de conciergerie et les sites d'emploi généralistes (Indeed, France Travail, Welcome to the Jungle), puis contactez directement les conciergeries de votre ville : beaucoup recrutent en continu, surtout en station balnéaire ou en montagne, avec des contrats saisonniers. Une carrière type commence au ménage ou à l'accueil, puis évolue vers la coordination et la gestion d'un secteur.",
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: BookIcon,
            title: "Un livret par logement",
            text: "Wifi, accès, parking, poubelles : les mêmes questions reviennent à chaque séjour. Un livret d'accueil numérique les règle une fois pour toutes, dans la langue du voyageur.",
          },
          {
            icon: ChatIcon,
            title: "Moins de messages à traiter",
            text: "Quand les réponses sont dans le livret, la conciergerie répond moins souvent aux mêmes demandes, et peut suivre plus de logements avec la même équipe.",
          },
          {
            icon: ShieldIcon,
            title: "Un compte, plusieurs logements",
            text: "Pour une conciergerie qui gère plusieurs appartements, un seul compte regroupe les livrets, avec le même niveau de qualité pour chaque propriétaire.",
          },
        ],
      },
      {
        type: "quote",
        text: "Se lancer est simple ; durer demande un contrat clair, des chiffres vrais et des propriétaires satisfaits.",
      },
      {
        type: "note",
        text: "Sources consultées en octobre 2026 : guides et pages de conciergeries et d'éditeurs d'outils (Houst, RentaPlus, PriceLabs, Welkeys, ALB Conciergerie, Eldorado Immobilier, Minut), Journal du Net (salaires, données Michael Page), guides fiscaux sur la loi Le Meur (jedeclaremonmeuble, Optimhome, Legalstart) et pages spécialisées sur l'enregistrement des meublés de tourisme. Les fourchettes de salaires et de rentabilité viennent largement de professionnels du secteur : ce sont des ordres de grandeur, à vérifier. Pour toute décision fiscale ou juridique, consultez impots.gouv.fr, service-public.fr, votre mairie, la CCI ou un professionnel.",
      },
    ],
  },
  {
    slug: "tarif-conciergerie-airbnb-commission-menage",
    title: "Quel est le tarif d'une conciergerie ? Commission, ménage, frais : comment calculer ce que vous paierez vraiment",
    metaDescription:
      "Tarif d'une conciergerie Airbnb : commission en pourcentage, forfaits, tarif horaire du ménage, marge cachée et calcul du revenu net propriétaire. Les réponses aux six questions les plus posées, avec exemples chiffrés.",
    excerpt: "Pourcentage, forfait, ménage, linge, frais d'entrée : ce que coûte une conciergerie, comment on la rémunère, et comment calculer votre revenu net avant de signer.",
    publishedAt: "2026-10-13",
    blocks: [
      {
        type: "lead",
        text: "« Quel est le tarif d'une conciergerie ? » n'a pas une réponse, mais trois : le pourcentage affiché, le coût réel une fois le ménage et le linge ajoutés, et ce qui reste sur votre compte. Voici les repères du marché, les six questions que l'on pose le plus souvent, et un calcul à refaire sur chaque devis. Attention : la plupart des chiffres du secteur viennent de conciergeries ou d'éditeurs d'outils, donc ce sont des ordres de grandeur, pas des vérités.",
      },
      {
        type: "stats",
        items: [
          { value: "15–40 %", label: "Fourchette de commission annoncée pour la location courte durée, souvent HT (TVA en plus), selon la ville et le niveau de service" },
          { value: "12,31 €", label: "SMIC horaire brut en France depuis le 1er juin 2026 : le plancher d'un salarié, avant charges" },
          { value: "200–500 €", label: "Frais d'installation annoncés par certaines conciergeries, contre 0 € chez d'autres" },
        ],
      },
      {
        type: "text",
        heading: "Quel est le tarif d'une conciergerie pour un particulier ?",
        paragraphs: [
          "Le mot recouvre deux métiers. Pour la gestion d'un logement en courte durée (Airbnb, Booking), le tarif est le plus souvent un pourcentage des loyers générés : de 15 à 40 % HT selon la ville, la taille du bien et le niveau de service, avec 20 % de TVA en plus quand le taux est annoncé hors taxes. Un forfait fixe mensuel existe aussi, de l'ordre de quelques centaines d'euros par mois, mais il est moins répandu.",
          "Pour une conciergerie privée (courses, démarches, réservations, pressing), le tarif est un abonnement mensuel ou une prestation à l'unité. Les sites spécialisés évoquent des abonnements de 50 à 400 € par mois et des prestations de 50 à 300 € selon la complexité. Ces chiffres viennent surtout de sites de business plans : demandez toujours les grilles de plusieurs prestataires de votre ville.",
        ],
      },
      {
        type: "text",
        heading: "Comment se rémunère une conciergerie ?",
        paragraphs: [
          "Elle se rémunère de quatre façons, souvent combinées : une commission sur les loyers (le modèle le plus courant), un forfait mensuel fixe, une marge sur les prestations qu'elle refacture (ménage, linge, consommables), et parfois des frais d'installation. Un modèle plus marginal consiste à vous verser un loyer fixe et à garder la différence avec les recettes.",
          "La marge sur le ménage est le point le plus sous-estimé. Le ménage est refacturé au voyageur ou au propriétaire, mais le prestataire est payé moins cher : la différence reste à la conciergerie. Certaines sources estiment qu'une part de 30 à 50 % du prix du ménage peut rester chez la conciergerie ; ce n'est pas une règle, mais c'est une question à poser.",
        ],
      },
      {
        type: "compare",
        left: {
          title: "Ce que l'on lit sur la brochure",
          items: [
            "« Commission de 20 % »",
            "Ménage et linge « selon la prestation »",
            "Frais d'installation « offerts » ou « à partir de… »",
            "Aucun exemple chiffré sur votre logement",
          ],
        },
        right: {
          title: "Ce que vous devez obtenir par écrit",
          items: [
            "La base de calcul : loyer seul, ou total voyageur avec frais ?",
            "Le prix du ménage et le coût réel payé au prestataire",
            "Le linge, les consommables et les frais ponctuels, ligne par ligne",
            "Un exemple chiffré sur votre logement, avec le revenu net final",
          ],
        },
      },
      {
        type: "text",
        heading: "Comment calculer les frais de conciergerie ?",
        paragraphs: [
          "La formule est simple, et c'est elle qui compte : revenu net propriétaire = chiffre d'affaires voyageurs − commission de la plateforme − commission de la conciergerie − ménage − linge et consommables − frais fixes ou ponctuels. Refaites-la pour chaque devis, avec la même hypothèse de nuits, et comparez le dernier chiffre, pas le pourcentage.",
          "Un exemple illustratif, aux chiffres inventés : un logement qui génère 2 000 € par mois, une commission de 20 % (400 €), six ménages par mois facturés 60 € alors que le prestataire est payé 50 €. La marge de 10 € par ménage ajoute 60 € par mois, soit 460 € de frais de gestion effectifs avant le linge et les consommables : le taux réel est d'environ 23 %, pas de 20 %.",
        ],
      },
      {
        type: "steps",
        items: [
          { n: "1", title: "Fixez une même hypothèse", text: "Le même nombre de nuits, le même prix moyen, le même nombre de ménages pour chaque conciergerie que vous comparez." },
          { n: "2", title: "Demandez la base de calcul", text: "La commission porte-t-elle sur le loyer seul, sur le revenu net de la plateforme, ou sur le total payé par le voyageur ?" },
          { n: "3", title: "Détaillez les prestations annexes", text: "Ménage, linge, consommables, check-in, maintenance : le prix de chaque ligne et ce qui est inclus dans la commission." },
          { n: "4", title: "Ajoutez les frais ponctuels", text: "Installation, audit photo, frais administratifs mensuels, options payantes comme l'optimisation tarifaire." },
          { n: "5", title: "Terminez par le net", text: "Ce qui reste sur votre compte par mois, et le taux réel que cela représente sur le chiffre d'affaires." },
        ],
      },
      {
        type: "text",
        heading: "Quel est le tarif horaire pour le ménage à la conciergerie ?",
        paragraphs: [
          "Les conciergeries facturent rarement à l'heure : elles ont des forfaits par logement et par rotation. Le tarif horaire sert surtout à comprendre ce que paie la conciergerie à son prestataire. Les repères trouvés vont de 12 à 18 € de l'heure pour une femme de ménage en direct, et de 22 à 44 € via une société spécialisée ; en Île-de-France, un ménagiste indépendant est cité entre 18 et 25 € de l'heure.",
          "Pour un salarié, le plancher est le SMIC horaire brut de 12,31 € depuis le 1er juin 2026, avant charges patronales : un tarif horaire inférieur à ce niveau dans une facture d'entreprise doit vous interpeller. Un conseil des guides du secteur : demandez le tarif payé au prestataire et celui refacturé. Un écart de plus de 30 % signale une marge, qui peut être légitime si elle est annoncée.",
        ],
      },
      {
        type: "text",
        heading: "Quel est le tarif pour 1h de ménage ?",
        paragraphs: [
          "Comptez en ordre de grandeur de 12 à 25 € de l'heure en direct selon la région et l'expérience, et de 22 à 44 € via une société. Ces chiffres sont des fourchettes publiées par des sites du secteur : ils varient fortement entre Paris, la Côte d'Azur et les villes moyennes.",
          "En location courte durée, on raisonne plutôt au forfait par logement. Une grille 2026 pour le ménage seul, sans linge ni options, indique par exemple de 35 à 50 € pour un studio de moins de 30 m², de 50 à 70 € pour un T2, de 70 à 95 € pour un T3 et de 95 à 130 € pour un T4 ou une maison. Le temps réel dépend de la surface, du nombre de lits et de l'état dans lequel le voyageur a laissé le logement.",
        ],
      },
      {
        type: "text",
        heading: "Est-ce rentable d'avoir une conciergerie ?",
        paragraphs: [
          "Cela dépend de ce que vous valorisez : votre temps, votre distance, votre taux d'occupation. Une conciergerie vous coûte souvent entre 20 et 30 % des revenus une fois le ménage et les frais annexes ajoutés. Elle est rentable si elle augmente le revenu (meilleurs prix, plus de nuits, meilleurs avis) ou si elle libère un temps que vous ne pouvez pas donner : logement loin de chez vous, plusieurs biens, accueil à toute heure.",
          "Elle l'est moins pour un propriétaire disponible, proche du logement, avec un seul bien et peu de rotations. Un test simple : calculez le nombre d'heures que vous passez par mois sur les messages, les arrivées, le ménage et le dépannage, multipliez par ce que vaut votre heure, et comparez au coût net de la conciergerie sur votre devis.",
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: BookIcon,
            title: "Un livret pour moins de messages",
            text: "Wifi, accès, parking, poubelles : un livret d'accueil numérique règle les questions qui reviennent à chaque séjour, que vous gériez seul ou avec une conciergerie.",
          },
          {
            icon: ShieldIcon,
            title: "Un contrat qui détaille les prestations",
            text: "Quelle que soit la formule, un contrat écrit avec les tarifs de chaque prestation évite les mauvaises surprises en fin de mois.",
          },
          {
            icon: ChatIcon,
            title: "Un rapport mensuel",
            text: "Occupation, prix pratiqués, coûts : une bonne conciergerie sait montrer ce qu'elle fait de votre logement.",
          },
        ],
      },
      {
        type: "quote",
        text: "Comparez le net qui arrive sur votre compte, pas le pourcentage écrit en gros.",
      },
      {
        type: "note",
        text: "Sources consultées en octobre 2026 : guides et blogs de conciergeries et d'éditeurs d'outils (RentaPlus, Toploc, Lodgify, PriceLabs, Welkeys, Abby, Eldorado Immobilier), sites de business plans pour les conciergeries privées, et info.gouv.fr pour le SMIC. Les fourchettes viennent largement de professionnels du secteur : ce sont des ordres de grandeur à vérifier sur des devis réels. Les exemples chiffrés sont illustratifs.",
      },
    ],
  },
  {
    slug: "que-propose-airbnb-frais-alternatives-rentabilite",
    title: "Quel service propose Airbnb ? Frais, qui peut louer, alternatives et rentabilité : les réponses aux six questions les plus posées",
    metaDescription:
      "Quel service propose Airbnb, comment louer un logement, qui a le droit de faire Airbnb, quel est le pourcentage des frais de service, quelles alternatives et quelle rentabilité face à la location longue durée.",
    excerpt: "Ce qu'Airbnb fait vraiment, combien la plateforme prélève, qui peut y louer, quelles alternatives, et si c'est plus rentable qu'une location à l'année.",
    publishedAt: "2026-10-13",
    blocks: [
      {
        type: "lead",
        text: "Airbnb n'est pas un hôtel et n'est pas une agence : c'est une plateforme qui met en relation des personnes qui louent un logement et des voyageurs, et qui prend une commission au passage. Mais autour de cette phrase simple, les mêmes questions reviennent : comment louer, qui en a le droit, combien ça coûte, y a-t-il mieux, est-ce vraiment rentable ? Voici les réponses, avec leurs limites.",
      },
      {
        type: "stats",
        items: [
          { value: "15,5 %", label: "Commission unique payée par l'hôte, annoncée à la place du partage hôte (~3 %) et voyageur (~14 %) — calendrier variable selon les profils" },
          { value: "120 nuits", label: "Plafond par an pour louer sa résidence principale en entier, que la commune peut abaisser jusqu'à 90" },
          { value: "×2,6", label: "Ordre de grandeur cité par un courtier : ce que rapporte Airbnb face à la longue durée pour de petites surfaces, avant charges et vacance" },
        ],
      },
      {
        type: "text",
        heading: "Quel service propose Airbnb ?",
        paragraphs: [
          "Airbnb est une place de marché : l'hôte publie une annonce, le voyageur réserve et paie via la plateforme, qui reverse le montant à l'hôte après le séjour en gardant sa commission. Elle fournit aussi la messagerie entre les deux, le système d'avis, le paiement sécurisé, la traduction des annonces et un dispositif de protection (AirCover) dont les conditions sont à lire dans l'aide d'Airbnb.",
          "Ce qu'Airbnb ne fait pas : elle n'accueille pas vos voyageurs, ne fait pas le ménage, ne règle pas les questions réglementaires de votre commune, et ne remplace pas la préparation du logement. Tout cela reste à la charge de l'hôte ou de la conciergerie qui travaille pour lui.",
        ],
      },
      {
        type: "text",
        heading: "Comment puis-je louer un logement sur Airbnb ?",
        paragraphs: [
          "Si vous voulez réserver un logement en tant que voyageur : indiquez la destination et les dates, comparez les annonces et les avis, vérifiez le prix total avec les frais, lisez les règles de la maison et l'annulation, puis payez via la plateforme. Pour mettre un logement en location en tant qu'hôte : créez un compte, publiez l'annonce avec des photos et des règles claires, fixez vos prix et votre calendrier, vérifiez les obligations de votre commune, puis acceptez les réservations.",
        ],
      },
      {
        type: "steps",
        items: [
          { n: "1", title: "Vérifier que vous avez le droit de louer", text: "Propriétaire ou locataire avec accord écrit du bailleur, règlement de copropriété, déclaration en mairie, limite de nuits pour une résidence principale." },
          { n: "2", title: "Préparer le logement et l'annonce", text: "Photos lumineuses, description exacte, équipements réels, règles claires." },
          { n: "3", title: "Fixer les prix et le séjour minimum", text: "En partant des coûts réels et des logements comparables du quartier, et en les revoyant régulièrement." },
          { n: "4", title: "Organiser l'accueil", text: "Remise des clés, ménage, linge, et un livret d'accueil qui répond aux questions avant qu'elles ne soient posées." },
        ],
      },
      {
        type: "text",
        heading: "Qui a le droit de faire Airbnb ?",
        paragraphs: [
          "Un propriétaire peut louer son logement, sous réserve de la réglementation locale : déclaration en mairie, numéro d'enregistrement là où il est exigé, règlement de copropriété, limite de nuits pour une résidence principale, taxe de séjour. Un locataire ne peut pas sous-louer son logement principal sans l'accord écrit de son bailleur, qui doit aussi porter sur le loyer : sans cet accord, il s'expose à des sanctions, jusqu'à la résiliation du bail et au remboursement des sous-loyers.",
          "Les logements sociaux (HLM) sont en principe exclus de la sous-location. Quant aux résidences secondaires, elles ne bénéficient pas de la limite de 120 nuits mais relèvent d'autres règles, notamment le changement d'usage dans certaines communes. Pour votre situation précise, vérifiez auprès de votre mairie, de votre bailleur et de votre syndic.",
        ],
      },
      {
        type: "text",
        heading: "Quel est le pourcentage des frais de service sur Airbnb ?",
        paragraphs: [
          "Airbnb remplace progressivement l'ancien partage, avec environ 3 % côté hôte et des frais de 14 à 16 % côté voyageur, par une commission unique de 15,5 % payée par l'hôte, calculée sur le prix des nuits et le ménage et non sur les taxes. Selon plusieurs sources, le basculement pour l'Espace économique européen est annoncé à partir du 13 octobre 2026, avec des calendriers différents selon les profils d'hôtes.",
          "À prix égal, le voyageur voit un montant plus bas et l'hôte reçoit moins. Un exemple chiffré cité par la presse : pour une nuit à 100 €, l'hôte passerait d'environ 97 € à environ 84,50 €, tandis que le voyageur paierait 100 € au lieu de 115 €. Selon le statut fiscal, la TVA peut s'ajouter aux frais en France : lisez l'aide d'Airbnb pour votre cas.",
        ],
      },
      {
        type: "text",
        heading: "Quels sites de location ressemblent à Airbnb ?",
        paragraphs: [
          "Les principales alternatives sont Booking.com, dont la commission pour les hôtes est citée entre 15 et 20 %, Abritel (Vrbo), avec une commission ou un abonnement selon l'offre, Gîtes de France, plus rural et avec un label, Tripadvisor Rentals, qui annonce peu de commission, et des plateformes plus petites. Les chiffres varient d'une source à l'autre et d'un pays à l'autre : consultez les conditions de chaque plateforme.",
          "Une étude s'appuyant sur les conditions générales des plateformes évalue à environ 17 % le total des commissions payées pour une réservation, dont une partie à la charge du voyageur. Retenez surtout que multiplier les plateformes augmente la visibilité mais exige de synchroniser les calendriers pour éviter les doubles réservations.",
        ],
      },
      {
        type: "text",
        heading: "Quelle est la meilleure plateforme gratuite pour la location saisonnière ?",
        paragraphs: [
          "Il n'existe pas de plateforme à la fois gratuite et aussi visible qu'Airbnb : celles qui ne prennent pas de commission demandent souvent un abonnement annuel, et celles qui sont gratuites génèrent peu de trafic. La question utile est : à qui vendez-vous ? Une annonce sur une petite plateforme sans commission fonctionne pour une clientèle fidèle ou locale, moins pour attirer des voyageurs étrangers.",
          "L'option sans commission de plateforme la plus citée est la réservation directe : un site ou une page de réservation, un moteur de paiement et une synchronisation de calendrier. Elle suppose de faire venir soi-même les voyageurs, souvent des clients déjà passés par Airbnb. Un livret d'accueil bien tenu aide à les fidéliser, mais ne se substitue pas à un canal de réservation.",
        ],
      },
      {
        type: "text",
        heading: "Quel est le plus rentable, Airbnb ou location ?",
        paragraphs: [
          "En rendement brut, la courte durée gagne presque toujours : les guides citent 6 à 12 % pour Airbnb contre 3 à 5 % pour une location meublée classique. Mais il faut retrancher la vacance, le ménage, le linge, les commissions, la gestion, la taxe de séjour et la fiscalité, plus défavorable depuis 2025 pour les meublés de tourisme non classés (plafond de 15 000 € et abattement de 30 % en micro-BIC).",
          "Les comparatifs se contredisent : une étude citée par la presse trouve un revenu net plus élevé pour la longue durée dans un cas précis (8 610 € contre 7 680 € sur un an avec 120 nuits Airbnb), d'autres calculs penchent vers la courte durée en zone très touristique. Le bon réflexe est de simuler votre logement avec le taux d'occupation réel de votre quartier, vos charges, et le temps que vous y passez.",
        ],
      },
      {
        type: "quote",
        text: "Ce n'est pas la plateforme qui rend un logement rentable : c'est l'écart entre ce qu'il rapporte et ce qu'il demande.",
      },
      {
        type: "note",
        text: "Sources consultées en octobre 2026 : pages d'aide et comparatifs d'éditeurs d'outils (Smoobu, Hostaway, Hostfully, Lodgify, Toploc, PriceLabs), presse économique (MoneyVox, Tout sur mes finances, MeilleurTaux), guides juridiques sur la sous-location et la loi Le Meur. Les chiffres de commission et de rentabilité viennent largement de professionnels du secteur : à vérifier sur les conditions de chaque plateforme et sur impots.gouv.fr ou service-public.fr.",
      },
    ],
  },
  {
    slug: "comment-marche-une-conciergerie-airbnb",
    title: "Comment marche une conciergerie ? Tâches, obligations, tarifs et activités possibles",
    metaDescription:
      "Comment marche une conciergerie Airbnb : ses tâches, ses obligations légales (carte G, assurance), ses tarifs et sa rentabilité, et les activités possibles autour de la location courte durée.",
    excerpt: "Ce qu'une conciergerie fait au quotidien, ce que la loi lui demande, ce qu'elle coûte et ce qu'elle peut proposer d'autre.",
    publishedAt: "2026-10-13",
    blocks: [
      {
        type: "lead",
        text: "Une conciergerie de location courte durée est une entreprise qui s'occupe du logement à la place du propriétaire : elle accueille les voyageurs, organise le ménage et le linge, répond aux messages, et parfois gère l'annonce et les prix. Voici comment cela marche concrètement, ce que cela demande légalement, ce que cela coûte, et ce qu'on peut y faire.",
      },
      {
        type: "stats",
        items: [
          { value: "15–30 %", label: "Commission habituellement annoncée sur les loyers, selon l'étendue des services" },
          { value: "RC Pro", label: "L'assurance de responsabilité civile professionnelle est présentée comme indispensable dès le premier mandat" },
          { value: "Carte G", label: "La carte professionnelle de gestion immobilière, requise dès que la conciergerie gère les fonds ou la location pour le compte du propriétaire" },
        ],
      },
      {
        type: "icons",
        items: [
          {
            icon: ChatIcon,
            title: "Avant le séjour",
            text: "Réponses aux demandes, envoi des consignes d'arrivée, vérification du calendrier, coordination du ménage et du linge.",
          },
          {
            icon: WifiIcon,
            title: "Pendant le séjour",
            text: "Accueil ou remise des clés, assistance en cas de problème (panne, retard, objet oublié), échange avec le voyageur et le prestataire.",
          },
          {
            icon: ShieldIcon,
            title: "Après le séjour",
            text: "État des lieux, ménage, linge, contrôle des consommables, avis, compte rendu au propriétaire.",
          },
        ],
      },
      {
        type: "text",
        heading: "Quelles sont les tâches d'une conciergerie ?",
        paragraphs: [
          "Les missions se rangent en trois familles : l'opérationnel sur place (accueil, remise des clés, ménage, linge, état des lieux, petite maintenance), la relation (messages des voyageurs, avis, imprévus) et la gestion (création ou optimisation de l'annonce, calendrier, prix, suivi des revenus). Certaines conciergeries se limitent à la première famille, d'autres couvrent les trois, ce qui change à la fois le prix et le cadre légal.",
          "Elles coordonnent aussi des prestataires : équipes de ménage, artisans, blanchisserie. C'est souvent là que se joue la qualité, parce que le voyageur ne fait pas la différence entre la conciergerie et le logement.",
        ],
      },
      {
        type: "text",
        heading: "Quelles sont les obligations d'une conciergerie ?",
        paragraphs: [
          "Il faut d'abord un statut et un numéro SIRET dès que l'activité est régulière : la micro-entreprise est courante pour démarrer. Ensuite, la réglementation dépend du périmètre. Une activité limitée au ménage, au linge et à la gestion des entrées et sorties relève des obligations commerciales classiques. Dès que la conciergerie gère la location pour le compte du propriétaire ou manipule des fonds, la loi Hoguet et la carte professionnelle de gestion immobilière (carte G) entrent en jeu, avec une garantie financière dont le montant minimal dépend de l'encaissement ou non de fonds. Ces conditions sont à vérifier auprès de la CCI.",
          "Quel que soit le périmètre, l'assurance de responsabilité civile professionnelle est considérée comme indispensable : ni l'assurance habitation du propriétaire ni les protections de la plateforme ne couvrent tout. Un contrat écrit qui détaille les prestations, la commission, le ménage, le linge et les conditions de sortie protège les deux parties. Enfin, les obligations du logement restent celles du propriétaire : déclaration en mairie, numéro d'enregistrement, taxe de séjour, limite de nuits.",
        ],
      },
      {
        type: "text",
        heading: "Quels sont les tarifs d'une conciergerie ?",
        paragraphs: [
          "Le tarif est le plus souvent un pourcentage des loyers, de 15 à 30 % selon les sources (jusqu'à 40 % HT pour certaines, avec 20 % de TVA en plus), plus le ménage, le linge et parfois des frais d'installation. La différence entre le pourcentage affiché et le coût réel vient souvent de la marge sur le ménage et de la base de calcul.",
          "Pour calculer ce que vous paierez vraiment, comparez le revenu net pour la même hypothèse de nuits : c'est le seul chiffre qui permet de comparer deux offres. Notre article sur le tarif d'une conciergerie détaille la méthode.",
        ],
      },
      {
        type: "text",
        heading: "Est-il rentable d'ouvrir une conciergerie ?",
        paragraphs: [
          "Cela peut l'être, à condition de compter juste. Les sources du secteur annoncent un investissement de départ de l'ordre de 1 000 à 5 000 € en micro-entreprise à domicile, des charges fixes de 1 500 à 2 500 € par mois dès qu'il y a des outils, des assurances et des salariés, et un seuil de rentabilité entre dix et quinze logements gérés. La marge dépend de la zone, de la saisonnalité et de la qualité du ménage. Un cabinet d'étude affiche une rentabilité de seulement 2,8 % pour les grands opérateurs multi-sites : le modèle ne pardonne pas la désorganisation.",
          "Un test avant de se lancer : combien de logements pouvez-vous suivre réellement avec votre temps, et que se passe-t-il le jour où deux voyageurs arrivent en même temps ?",
        ],
      },
      {
        type: "text",
        heading: "Quelles sont les activités possibles pour une conciergerie ?",
        paragraphs: [
          "Autour du cœur de métier, une conciergerie peut proposer : l'accueil et le check-in en personne ou à distance, le ménage et le linge, la photographie et la création d'annonces, la tarification et la gestion du calendrier, la petite maintenance et l'entretien courant, l'achat de consommables, des services aux voyageurs comme des courses d'arrivée ou des transferts, et de plus en plus des outils numériques pour les voyageurs.",
          "Les deux dernières catégories sont celles où un livret d'accueil numérique aide le plus : il règle les questions pratiques à la source, dans la langue du voyageur, et laisse l'équipe se concentrer sur ce qui demande vraiment une personne. Pour une conciergerie qui gère plusieurs logements, un seul compte regroupe les livrets de tous les appartements.",
        ],
      },
      {
        type: "steps",
        items: [
          { n: "1", title: "Choisir le périmètre", text: "Opérationnel seulement, ou gestion complète : c'est ce qui détermine le cadre légal et le prix." },
          { n: "2", title: "Poser le cadre", text: "Statut, assurance RC Pro, carte G si nécessaire, modèle de contrat écrit." },
          { n: "3", title: "Standardiser", text: "Check-lists de ménage, modèles de messages, livret par logement, prestataires de remplacement." },
          { n: "4", title: "Mesurer", text: "Temps passé par logement, marge par prestation, taux d'occupation : sans chiffres, pas de décisions." },
        ],
      },
      {
        type: "quote",
        text: "Une conciergerie solide se reconnaît à ce qu'elle a mis par écrit.",
      },
      {
        type: "note",
        text: "Sources consultées en octobre 2026 : guides et pages de conciergeries et d'éditeurs d'outils (PriceLabs, RentaPlus, Eldorado Immobilier, Welkeys, Propulse by CA, Toute la franchise), articles sur la loi Hoguet et la carte G, sites d'assurance professionnelle. Les chiffres viennent largement de professionnels du secteur : ordres de grandeur à vérifier. Pour toute question juridique, consultez la CCI ou un avocat.",
      },
    ],
  },
];

export function getBlogPost(slug) {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}
