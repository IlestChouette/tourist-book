"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getClientLocale } from "@/lib/i18n/clientLocale";
import navDict from "@/lib/i18n/dictionaries/nav";

export default function LogoutButton({ className }) {
  const [locale] = useState(getClientLocale);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/panel/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={
        className ??
        "text-xs font-bold uppercase tracking-wider text-ink/60 hover:text-terracotta-deep"
      }
    >
      {navDict[locale].logout}
    </button>
  );
}
