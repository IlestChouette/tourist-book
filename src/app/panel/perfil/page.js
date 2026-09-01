"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/uploadMedia";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    panel: "Panel",
    eyebrow: "Panel hôtelier",
    title: "Profil",
    loading: "Chargement…",
    subtitle: "Votre logo apparaît sur la page de check-in de vos hôtes.",
    logo: "Logo",
    noLogo: "Pas de logo",
    name: "Nom",
    save: "Enregistrer",
    logoUpdated: "Logo mis à jour.",
    nameSaved: "Nom enregistré.",
  },
  en: {
    panel: "Panel",
    eyebrow: "Host panel",
    title: "Profile",
    loading: "Loading…",
    subtitle: "Your logo appears on your guests' check-in page.",
    logo: "Logo",
    noLogo: "No logo",
    name: "Name",
    save: "Save",
    logoUpdated: "Logo updated.",
    nameSaved: "Name saved.",
  },
  es: {
    panel: "Panel",
    eyebrow: "Panel hotelero",
    title: "Perfil",
    loading: "Cargando…",
    subtitle: "Tu logo aparece en la página de check-in de tus huéspedes.",
    logo: "Logo",
    noLogo: "Sin logo",
    name: "Nombre",
    save: "Guardar",
    logoUpdated: "Logo actualizado.",
    nameSaved: "Nombre guardado.",
  },
};

export default function PerfilPage() {
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user.id);

      const { data: host } = await supabase.from("hosts").select("*").eq("id", user.id).single();
      setName(host?.name ?? "");
      setLogoUrl(host?.logo_url ?? null);
      setLoading(false);
    }
    load();
  }, []);

  async function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    setSaving(true);
    setMessage("");
    try {
      const ext = file.name.split(".").pop();
      const url = await uploadMedia(`${userId}/logo.${ext}`, file);
      const supabase = createClient();
      await supabase.from("hosts").update({ logo_url: url }).eq("id", userId);
      setLogoUrl(url);
      setMessage(t.logoUpdated);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveName(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("hosts").update({ name }).eq("id", userId);
    setSaving(false);
    setMessage(error ? error.message : t.nameSaved);
  }

  if (loading) {
    return (
      <main className="flex-1">
        <Hero backHref="/panel" backLabel={t.panel} eyebrow={t.eyebrow} title={t.title} />
        <section className="mx-auto max-w-2xl px-6 py-10">
          <p className="text-ink/60">{t.loading}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero
        backHref="/panel"
        backLabel={t.panel}
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-sand-dim bg-sand-card p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.logo}</span>
          <div className="mt-3 flex items-center gap-4">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="h-20 w-20 rounded object-contain bg-sand" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded border border-dashed border-sand-dim text-xs text-ink/50">
                {t.noLogo}
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleLogoChange} disabled={saving} />
          </div>
        </div>

        <form onSubmit={handleSaveName} className="mt-6 grid gap-3">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.name}</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="w-fit rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {t.save}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-ink/70">{message}</p>}
      </section>
    </main>
  );
}
