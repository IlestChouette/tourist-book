import { blogPosts } from "@/data/blogPosts";
import { cityPages } from "@/data/cityPages";

// llms.txt : résumé en langage clair, pour les assistants IA et les moteurs, de ce que fait Tourist Book.
// Tout ce qui est écrit ici est repris de ce que le site affiche déjà (offres, prix, fonctions).
export function GET() {
  const base = "https://tourist-book.com";
  const body = `# Tourist Book

> Tourist Book propose deux outils numériques en français : un livret d'accueil pour les hôtes de location courte durée et conciergeries de la Côte d'Azur, et un cahier de consignes pour les hôtels.

## Livret d'accueil numérique (hôtes Airbnb et conciergeries)
- Un lien et un QR code que le voyageur ouvre sur son téléphone, sans application.
- Contenu : wifi, horaires d'arrivée et de départ, itinéraire, stationnement, guide local avec recherche, carte, réservation de transfert, livre d'or.
- Disponible en français, anglais et espagnol, traduit automatiquement ; votre logo sur chaque page.
- Modifiable en ligne autant de fois que l'hôte le souhaite : rien à imprimer ni à exporter.
- Offre Premium : check-in avant l'arrivée (pièce d'identité, selfie, signature électronique, règlement intérieur accepté) et assistant virtuel.
- Prix : dès 7 € par mois sans engagement ; annuel dès 39,99 € par an avec 1 mois offert la première fois. L'offre se choisit par logement.
- Zone : Côte d'Azur (de Beausoleil à Nice, Cannes, Antibes et alentours).

## Cahier de consignes numérique (hôtels)
- Remplace le cahier papier de la réception : consignes écrites en quelques touches, validées avec un code personnel, visibles par tous les services.
- Un cahier par service (réception, conciergerie, technique, etc.), récapitulatif par email à chaque relève, statistiques pour la direction.
- Prix : 15 € par mois et par service. Interface en français.

## Pages principales
- [Accueil](${base}/)
- [Cahier de consignes pour hôtels](${base}/hotel)
- [Blog](${base}/blog)
${cityPages.map((c) => `- [Livret d'accueil à ${c.city}](${base}/livret-accueil-${c.slug})`).join("\n")}

## Articles
${blogPosts.map((p) => `- [${p.title}](${base}/blog/${p.slug})`).join("\n")}

## Mentions légales
- [Conditions d'utilisation](${base}/terminos)
- [Politique de confidentialité](${base}/privacidad)
- [Mentions légales](${base}/aviso-legal)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
