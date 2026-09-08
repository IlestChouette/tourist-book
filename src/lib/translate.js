import crypto from "crypto";
import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";

// Champs de texte libre saisis par l'hôte, à traduire pour le voyageur —
// on exclut volontairement les noms, adresses, codes et identifiants
// techniques (wifi, contact, lockbox...) qui ne doivent jamais être traduits.
const TRANSLATABLE_FIELDS = [
  "description",
  "house_rules",
  "waste_instructions",
  "general_info",
  "local_recommendations",
  "key_instructions",
  "checkin",
  "checkout",
  "parking",
];

// Modèle rapide et économique : suffisant pour traduire de courts textes
// d'hôte, pas besoin de la puissance d'Opus utilisée pour l'assistant.
const MODEL = "claude-haiku-4-5-20251001";

const LOCALE_NAME = { en: "English", es: "Spanish" };

function hash(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

async function claudeTranslateBatch(fields, locale) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const targetLanguage = LOCALE_NAME[locale];
  if (!apiKey || !targetLanguage || Object.keys(fields).length === 0) return fields;

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2048,
      system: `You translate short pieces of text written by a short-term rental host for their guests, from French to ${targetLanguage}. Keep the warm, direct tone — don't make it more formal than the original. Reply with ONLY a JSON object using the exact same keys as the input, each value replaced by its translation. No explanation, no markdown code fences.`,
      messages: [{ role: "user", content: JSON.stringify(fields) }],
    });
    // Claude respecte rarement à 100% la consigne "pas de markdown" — on
    // retire les éventuels ```json ... ``` avant de parser plutôt que de
    // compter sur le modèle pour ne jamais les ajouter.
    const text = (message.content[0]?.text ?? "").trim().replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    return JSON.parse(text);
  } catch (err) {
    console.error("claudeTranslateBatch failed:", err);
    return fields;
  }
}

// Traduit les champs de texte libre d'un logement pour l'affichage au
// voyageur, avec mise en cache en base — le texte de l'hôte change rarement,
// pas la peine de rappeler l'API à chaque visite du livret. Une seule
// requête Claude traduit tous les champs qui en ont besoin d'un coup.
// Si ANTHROPIC_API_KEY n'est pas configurée, renvoie le logement tel quel
// (le texte reste dans la langue d'origine plutôt que de bloquer l'affichage).
export async function translateProperty(property, locale) {
  if (locale === "fr" || !process.env.ANTHROPIC_API_KEY) return property;

  const admin = createAdminClient();
  const translated = { ...property };

  const { data: cachedRows } = await admin
    .from("translation_cache")
    .select("field, translated_text, source_hash")
    .eq("property_id", property.id)
    .eq("locale", locale);
  const cacheByField = Object.fromEntries((cachedRows ?? []).map((r) => [r.field, r]));

  const toTranslate = {};
  for (const field of TRANSLATABLE_FIELDS) {
    const original = property[field];
    if (!original) continue;

    const cached = cacheByField[field];
    if (cached && cached.source_hash === hash(original)) {
      translated[field] = cached.translated_text;
    } else {
      toTranslate[field] = original;
    }
  }

  const results = await claudeTranslateBatch(toTranslate, locale);

  const upserts = [];
  for (const [field, original] of Object.entries(toTranslate)) {
    const translatedText = typeof results[field] === "string" ? results[field] : original;
    translated[field] = translatedText;
    if (translatedText !== original) {
      upserts.push({
        property_id: property.id,
        field,
        locale,
        source_hash: hash(original),
        translated_text: translatedText,
      });
    }
  }
  if (upserts.length > 0) {
    await admin.from("translation_cache").upsert(upserts, { onConflict: "property_id,field,locale" });
  }

  return translated;
}
