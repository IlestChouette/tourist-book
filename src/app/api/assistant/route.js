import { cookies } from "next/headers";
import { getPropertyBySlug } from "@/lib/properties";
import { recommendationsForCity } from "@/data/recommendations";

// SIMULATION : réponses générées par mots-clés, pas de vrai appel IA pour l'instant.
// Pour brancher un vrai assistant plus tard, il faudra une clé API Anthropic
// (voir @anthropic-ai/sdk déjà installé) et remplacer le contenu de cette fonction.
function simulateReply(question, property) {
  const q = question.toLowerCase();
  const recos = recommendationsForCity(property.city);

  if (q.includes("wifi") || q.includes("wi-fi") || q.includes("internet")) {
    return `Le wifi s'appelle "${property.wifi_ssid}", mot de passe : ${property.wifi_password}.`;
  }
  if (q.includes("arriv") || q.includes("check-in") || q.includes("checkin")) {
    return `L'arrivée est possible ${property.checkin.toLowerCase()}.`;
  }
  if (q.includes("dépar") || q.includes("depart") || q.includes("check-out") || q.includes("checkout")) {
    return `Le départ se fait ${property.checkout.toLowerCase()}.`;
  }
  if (q.includes("parking") || q.includes("stationne") || q.includes("garer")) {
    return property.parking;
  }
  if (q.includes("resto") || q.includes("manger") || q.includes("café") || q.includes("boire")) {
    const r = recos.find((r) => r.category === "Restaurant");
    return r
      ? `Je te conseille "${r.name}" — ${r.note}`
      : `Je n'ai pas encore de recommandation restaurant enregistrée pour ${property.city}, demande à ton hôte : ${property.contact}.`;
  }
  if (q.includes("visit") || q.includes("faire") || q.includes("voir") || q.includes("après-midi") || q.includes("apres-midi")) {
    const r = recos.find((r) => r.category === "Zone à visiter");
    return r
      ? `Une idée : "${r.name}" — ${r.note}`
      : `Je n'ai pas encore d'idée de visite enregistrée pour ${property.city}.`;
  }
  if (q.includes("toilette")) {
    const r = recos.find((r) => r.category === "Toilettes publiques");
    return r ? `${r.name} — ${r.note}` : "Je n'ai pas encore cette info, désolé.";
  }
  if (q.includes("contact") || q.includes("hôte") || q.includes("hote") || q.includes("urgence")) {
    return `Tu peux joindre l'hôte ici : ${property.contact}.`;
  }

  return "Je suis encore en mode démo et je ne connais que quelques réponses (wifi, arrivée, départ, parking, restos, visites, contact). Pose-moi une question là-dessus !";
}

export async function POST(request) {
  const { slug, messages } = await request.json();

  const cookieStore = await cookies();
  if (cookieStore.get(`access_${slug}`)?.value !== "1") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  const property = await getPropertyBySlug(slug);

  if (!property) {
    return Response.json({ error: "Logement introuvable" }, { status: 404 });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
  const reply = simulateReply(lastUserMessage?.content ?? "", property);

  // Petite latence artificielle pour un rendu plus naturel dans le chat.
  await new Promise((resolve) => setTimeout(resolve, 500));

  return Response.json({ reply });
}
