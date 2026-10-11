import { WifiIcon, CompassIcon, CarIcon, ChatIcon, ShieldIcon, BookIcon } from "@/components/icons";

// Contenu du blog — français uniquement, même choix que les pages villes
// (voir cityPages.js) : sans hreflang, seule cette version a une vraie
// chance d'être indexée par Google.
export const blogPosts = [
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
];

export function getBlogPost(slug) {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}
