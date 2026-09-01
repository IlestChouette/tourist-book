import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { getPropertyBySlug } from "@/lib/properties";

const MODEL = "claude-opus-5";

function contactLine(property) {
  return [property.contact_name || property.contact, property.contact_phone].filter(Boolean).join(" · ") || "non renseigné";
}

// Repli si ANTHROPIC_API_KEY n'est pas configurée : réponses par mots-clés,
// pas de vraie IA — juste pour que le chat reste utilisable sans clé.
function simulateReply(question, property) {
  const q = question.toLowerCase();

  if (q.includes("wifi") || q.includes("wi-fi") || q.includes("internet")) {
    return `Le wifi s'appelle "${property.wifi_ssid}", mot de passe : ${property.wifi_password}.`;
  }
  if (q.includes("arriv") || q.includes("check-in") || q.includes("checkin")) {
    return `L'arrivée est possible ${property.checkin?.toLowerCase() ?? ""}.`;
  }
  if (q.includes("dépar") || q.includes("depart") || q.includes("check-out") || q.includes("checkout")) {
    return `Le départ se fait ${property.checkout?.toLowerCase() ?? ""}.`;
  }
  if (q.includes("parking") || q.includes("stationne") || q.includes("garer")) {
    return property.parking || "Pas d'information de stationnement enregistrée.";
  }
  if (q.includes("contact") || q.includes("hôte") || q.includes("hote") || q.includes("urgence")) {
    return `Tu peux joindre l'hôte ici : ${contactLine(property)}.`;
  }

  return property.local_recommendations
    ? property.local_recommendations
    : "Je suis encore en mode démo et je ne connais que quelques réponses (wifi, arrivée, départ, parking, contact). Pose-moi une question là-dessus !";
}

function buildSystemPrompt(property) {
  const lines = [
    "Tu es l'assistant virtuel du livret d'accueil numérique d'un logement de courte durée sur la Côte d'Azur.",
    "Tu réponds aux questions des voyageurs UNIQUEMENT à partir des informations ci-dessous sur ce logement précis.",
    "Réponds dans la langue du voyageur, de façon brève, chaleureuse et directe — pas de formules creuses.",
    "Si une information demandée n'est pas dans ce qui suit, dis-le honnêtement et oriente vers le contact de l'hôte plutôt que d'inventer.",
    "",
    `Logement : ${property.name} — ${property.city}`,
    property.address ? `Adresse : ${property.address}` : null,
    property.wifi_ssid || property.wifi_password
      ? `Wifi : réseau "${property.wifi_ssid ?? "-"}", mot de passe "${property.wifi_password ?? "-"}"`
      : null,
    property.checkin ? `Arrivée : ${property.checkin}` : null,
    property.checkout ? `Départ : ${property.checkout}` : null,
    property.parking ? `Stationnement : ${property.parking}` : null,
    property.house_rules ? `Règles du logement : ${property.house_rules}` : null,
    property.waste_instructions ? `Gestion des poubelles : ${property.waste_instructions}` : null,
    property.general_info ? `Informations générales : ${property.general_info}` : null,
    property.local_recommendations ? `Recommandations locales de l'hôte : ${property.local_recommendations}` : null,
    `Contact de l'hôte (à donner si besoin) : ${contactLine(property)}`,
  ].filter(Boolean);

  return lines.join("\n");
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

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return Response.json({ reply: simulateReply(lastUserMessage?.content ?? "", property) });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      system: buildSystemPrompt(property),
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const textBlock = response.content.find((b) => b.type === "text");
    return Response.json({ reply: textBlock?.text ?? "Désolé, je n'ai pas pu répondre." });
  } catch (err) {
    console.error("Assistant Anthropic API failed:", err);
    return Response.json(
      { reply: `Désolé, une erreur est survenue. Tu peux contacter directement l'hôte : ${contactLine(property)}.` }
    );
  }
}
