import { Suspense } from "react";
import { getLocale } from "@/lib/i18n/locale";
import EntrerForm from "./EntrerForm";

export default async function EntrerPage({ params }) {
  const locale = await getLocale();
  return (
    <Suspense>
      <EntrerForm params={params} locale={locale} />
    </Suspense>
  );
}
