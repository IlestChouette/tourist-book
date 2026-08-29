"use client";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton({ className }) {
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
      Cerrar sesión
    </button>
  );
}
