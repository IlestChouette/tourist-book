import crypto from "crypto";
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

const DEEPL_TARGET_LANG = { en: "EN-GB", es: "ES" };

function hash(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

async function deeplTranslate(text, locale) {
  const apiKey = process.env.DEEPL_API_KEY;
  const targetLang = DEEPL_TARGET_LANG[locale];
  if (!apiKey || !targetLang) return text;

  try {
    const res = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ text, source_lang: "FR", target_lang: targetLang }),
    });
    if (!res.ok) throw new Error(`DeepL API error: ${res.status}`);
    const data = await res.json();
    return data.translations?.[0]?.text ?? text;
  } catch (err) {
    console.error("deeplTranslate failed:", err);
    return text;
  }
}

// Traduit les champs de texte libre d'un logement pour l'affichage au
// voyageur, avec mise en cache en base — le texte de l'hôte change rarement,
// pas la peine de rappeler l'API de traduction à chaque visite du livret.
// Si DEEPL_API_KEY n'est pas configurée, renvoie le logement tel quel (le
// texte reste dans la langue d'origine plutôt que de bloquer l'affichage).
export async function translateProperty(property, locale) {
  if (locale === "fr" || !process.env.DEEPL_API_KEY) return property;

  const admin = createAdminClient();
  const translated = { ...property };

  await Promise.all(
    TRANSLATABLE_FIELDS.map(async (field) => {
      const original = property[field];
      if (!original) return;

      const sourceHash = hash(original);
      const { data: cached } = await admin
        .from("translation_cache")
        .select("translated_text, source_hash")
        .eq("property_id", property.id)
        .eq("field", field)
        .eq("locale", locale)
        .maybeSingle();

      if (cached && cached.source_hash === sourceHash) {
        translated[field] = cached.translated_text;
        return;
      }

      const translatedText = await deeplTranslate(original, locale);
      translated[field] = translatedText;

      if (translatedText !== original) {
        await admin
          .from("translation_cache")
          .upsert(
            { property_id: property.id, field, locale, source_hash: sourceHash, translated_text: translatedText },
            { onConflict: "property_id,field,locale" }
          );
      }
    })
  );

  return translated;
}
