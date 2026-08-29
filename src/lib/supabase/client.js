"use client";

import { createBrowserClient } from "@supabase/ssr";

// Client navigateur : utilisé dans les composants "use client" (formulaires
// de connexion/inscription des hôteliers).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
