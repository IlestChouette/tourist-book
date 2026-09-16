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
];

export function getBlogPost(slug) {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}
