import { createAdminClient } from "@/lib/supabase/admin";
import { getLocale } from "@/lib/i18n/locale";
import { DEFAULT_ACCENT, accentDeep, accentTint } from "@/lib/accentPalette";
import AssistantWidget from "@/components/AssistantWidget";

// Contenu propre à chaque logement, accessible uniquement avec le code
// d'accès de l'hôte — pas destiné à être indexé par les moteurs de recherche.
export const metadata = { robots: { index: false, follow: false } };

export default async function LogementLayout({ children, params }) {
  const { slug } = await params;
  const locale = await getLocale();

  const admin = createAdminClient();
  const { data: property } = await admin
    .from("properties")
    .select("accent_color, plan")
    .eq("slug", slug)
    .maybeSingle();
  const accent = property?.accent_color || DEFAULT_ACCENT;

  return (
    // display: contents — ne participe pas à la mise en page (le flex column
    // du body doit voir <main> directement), mais laisse les variables CSS
    // se propager à la fois au contenu du livret et au widget assistant.
    <div
      style={{
        display: "contents",
        "--host-accent": accent,
        "--host-accent-deep": accentDeep(accent),
        "--host-accent-tint": accentTint(accent, 18),
        "--host-accent-tint-strong": accentTint(accent, 35),
      }}
    >
      {children}
      {property?.plan === "premium" && <AssistantWidget slug={slug} locale={locale} />}
    </div>
  );
}
