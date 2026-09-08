import AssistantFab from "@/components/AssistantFab";
import { getLocale } from "@/lib/i18n/locale";

// Contenu propre à chaque logement, accessible uniquement avec le code
// d'accès de l'hôte — pas destiné à être indexé par les moteurs de recherche.
export const metadata = { robots: { index: false, follow: false } };

export default async function LogementLayout({ children, params }) {
  const { slug } = await params;
  const locale = await getLocale();

  return (
    <>
      {children}
      <AssistantFab slug={slug} locale={locale} />
    </>
  );
}
