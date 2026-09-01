"use server";

import { cookies } from "next/headers";
import { LOCALES } from "./locale";

export async function setLocale(formData) {
  const locale = formData.get("locale");
  if (!LOCALES.includes(locale)) return;

  const cookieStore = await cookies();
  cookieStore.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
