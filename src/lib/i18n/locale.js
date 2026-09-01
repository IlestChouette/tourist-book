import { cookies, headers } from "next/headers";

export const LOCALES = ["fr", "en", "es"];
export const DEFAULT_LOCALE = "fr";

// Détecte la langue à utiliser : le choix explicite de l'utilisateur (cookie,
// posé par le sélecteur de langue) prime toujours ; sinon on déduit la
// meilleure langue depuis l'en-tête Accept-Language du navigateur ; à défaut
// on retombe sur le français, langue par défaut du site.
export async function getLocale() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  if (LOCALES.includes(cookieLocale)) return cookieLocale;

  const acceptLanguage = (await headers()).get("accept-language") || "";
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase().slice(0, 2));

  for (const lang of preferred) {
    if (LOCALES.includes(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}
