import { getLocale } from "@/lib/i18n/locale";
import AssistantChat from "./AssistantChat";

export default async function AssistantPage({ params }) {
  const locale = await getLocale();
  return <AssistantChat params={params} locale={locale} />;
}
