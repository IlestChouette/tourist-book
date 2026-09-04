"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/uploadMedia";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";
import fieldsDict from "@/lib/i18n/dictionaries/propertyForm";

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function randomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

const MAX_PHOTOS = 5;
const MAX_KEY_PHOTOS = 4;

const pageContent = {
  fr: { properties: "Logements", eyebrow: "Panel hôtelier", title: "Nouveau logement", saving: "Enregistrement…", submit: "Créer le logement →" },
  en: { properties: "Properties", eyebrow: "Host panel", title: "New property", saving: "Saving…", submit: "Create property →" },
  es: { properties: "Alojamientos", eyebrow: "Panel hotelero", title: "Nuevo alojamiento", saving: "Guardando…", submit: "Crear alojamiento →" },
};

export default function NuevoAlojamientoPage() {
  const [locale] = useState(getClientLocale);
  const t = fieldsDict[locale];
  const p = pageContent[locale];

  const [form, setForm] = useState({
    name: "",
    city: "",
    postal_code: "",
    address: "",
    address_details: "",
    wifi_ssid: "",
    wifi_password: "",
    checkin: "",
    checkout: "",
    parking: "",
    contact_name: "",
    contact_phone: "",
    description: "",
    house_rules: "",
    waste_instructions: "",
    waste_video_url: "",
    general_info: "",
    local_recommendations: "",
    key_instructions: "",
    key_lockbox_code: "",
    key_video_url: "",
  });
  const [photos, setPhotos] = useState([]);
  const [wastePhoto, setWastePhoto] = useState(null);
  const [keyPhotos, setKeyPhotos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handlePhotos(e) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - photos.length);
    setPhotos((p) => [...p, ...files].slice(0, MAX_PHOTOS));
  }

  function removePhoto(index) {
    setPhotos((p) => p.filter((_, i) => i !== index));
  }

  function handleWastePhoto(e) {
    setWastePhoto(e.target.files?.[0] ?? null);
  }

  function handleKeyPhotos(e) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_KEY_PHOTOS - keyPhotos.length);
    setKeyPhotos((p) => [...p, ...files].slice(0, MAX_KEY_PHOTOS));
  }

  function removeKeyPhoto(index) {
    setKeyPhotos((p) => p.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const slug = `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}`;

    try {
      const photoUrls = [];
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const ext = file.name.split(".").pop();
        const url = await uploadMedia(`${user.id}/${slug}/${i + 1}.${ext}`, file);
        photoUrls.push(url);
      }

      let wastePhotoUrl = null;
      if (wastePhoto) {
        const ext = wastePhoto.name.split(".").pop();
        wastePhotoUrl = await uploadMedia(`${user.id}/${slug}/basuras.${ext}`, wastePhoto);
      }

      const keyPhotoUrls = [];
      for (let i = 0; i < keyPhotos.length; i++) {
        const file = keyPhotos[i];
        const ext = file.name.split(".").pop();
        const url = await uploadMedia(`${user.id}/${slug}/llaves-${i + 1}.${ext}`, file);
        keyPhotoUrls.push(url);
      }

      const { data: inserted, error: insertError } = await supabase
        .from("properties")
        .insert({
          host_id: user.id,
          slug,
          name: form.name,
          city: form.city,
          postal_code: form.postal_code,
          address: form.address,
          address_details: form.address_details,
          wifi_ssid: form.wifi_ssid,
          wifi_password: form.wifi_password,
          checkin: form.checkin,
          checkout: form.checkout,
          parking: form.parking,
          contact_name: form.contact_name,
          contact_phone: form.contact_phone,
          description: form.description,
          house_rules: form.house_rules,
          waste_instructions: form.waste_instructions,
          waste_photo: wastePhotoUrl,
          waste_video_url: form.waste_video_url,
          general_info: form.general_info,
          local_recommendations: form.local_recommendations,
          key_instructions: form.key_instructions,
          key_lockbox_code: form.key_lockbox_code,
          key_video_url: form.key_video_url,
          key_photos: keyPhotoUrls,
          access_code: randomCode(),
          photos: photoUrls,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      window.location.href = `/panel/alojamientos/${inserted.id}/suscribirse`;
      return;
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex-1">
      <Hero backHref="/panel/alojamientos" backLabel={p.properties} eyebrow={p.eyebrow} title={p.title} />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.name}</span>
            <input required value={form.name} onChange={update("name")} className="input" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.city}</span>
              <input required value={form.city} onChange={update("city")} className="input" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.postalCode}</span>
              <input required value={form.postal_code} onChange={update("postal_code")} className="input" />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.address}</span>
            <input required value={form.address} onChange={update("address")} className="input" />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.addressDetails}</span>
            <input
              placeholder={t.addressDetailsPlaceholder}
              value={form.address_details}
              onChange={update("address_details")}
              className="input"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.wifiNetwork}</span>
              <input value={form.wifi_ssid} onChange={update("wifi_ssid")} className="input" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.wifiPassword}</span>
              <input value={form.wifi_password} onChange={update("wifi_password")} className="input" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.arrival}</span>
              <input
                placeholder={t.arrivalPlaceholder}
                value={form.checkin}
                onChange={update("checkin")}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.departure}</span>
              <input
                placeholder={t.departurePlaceholder}
                value={form.checkout}
                onChange={update("checkout")}
                className="input"
              />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.parking}</span>
            <input value={form.parking} onChange={update("parking")} className="input" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.contactName}</span>
              <input value={form.contact_name} onChange={update("contact_name")} className="input" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.contactPhone}</span>
              <input
                type="tel"
                placeholder={t.contactPhonePlaceholder}
                value={form.contact_phone}
                onChange={update("contact_phone")}
                className="input"
              />
            </label>
          </div>
          <p className="-mt-2 text-xs text-ink/50">{t.contactPhoneHint}</p>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.welcomeMessage}</span>
            <textarea
              rows={4}
              placeholder={t.welcomeMessagePlaceholder}
              value={form.description}
              onChange={update("description")}
              className="input"
            />
            <span className="text-xs text-ink/50">{t.welcomeMessageHint}</span>
          </label>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              {t.photos(photos.length, MAX_PHOTOS)}
            </span>
            <div className="mt-2 flex flex-wrap gap-3">
              {photos.map((file, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-20 w-20 rounded object-cover border border-sand-dim"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-ink"
                  >
                    ×
                  </button>
                </div>
              ))}
              {photos.length < MAX_PHOTOS && (
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-dashed border-sand-dim text-xs text-ink/50">
                  {t.addPhoto}
                  <input type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.houseRules}</span>
            <textarea
              rows={3}
              placeholder={t.houseRulesPlaceholder}
              value={form.house_rules}
              onChange={update("house_rules")}
              className="input"
            />
          </label>

          <div className="mt-2 grid gap-4 rounded border border-sand-dim bg-sand-card p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.wasteManagement}</span>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.wasteInstructions}</span>
              <textarea
                rows={3}
                placeholder={t.wasteInstructionsPlaceholder}
                value={form.waste_instructions}
                onChange={update("waste_instructions")}
                className="input"
              />
            </label>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.photoOptional}</span>
              <div className="mt-2 flex flex-wrap gap-3">
                {wastePhoto && (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(wastePhoto)}
                      alt=""
                      className="h-20 w-20 rounded object-cover border border-sand-dim"
                    />
                    <button
                      type="button"
                      onClick={() => setWastePhoto(null)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-ink"
                    >
                      ×
                    </button>
                  </div>
                )}
                {!wastePhoto && (
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-dashed border-sand-dim text-xs text-ink/50">
                    {t.addPhoto}
                    <input type="file" accept="image/*" onChange={handleWastePhoto} className="hidden" />
                  </label>
                )}
              </div>
            </div>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.videoUrl}</span>
              <input
                type="url"
                placeholder={t.videoUrlPlaceholder}
                value={form.waste_video_url}
                onChange={update("waste_video_url")}
                className="input"
              />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.generalInfo}</span>
            <textarea
              rows={3}
              placeholder={t.generalInfoPlaceholder}
              value={form.general_info}
              onChange={update("general_info")}
              className="input"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.localRecommendations}</span>
            <textarea
              rows={4}
              placeholder={t.localRecommendationsPlaceholder}
              value={form.local_recommendations}
              onChange={update("local_recommendations")}
              className="input"
            />
          </label>

          <div className="mt-2 grid gap-4 rounded border border-sand-dim bg-sand-card p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.keyPickup}</span>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.keyInstructions}</span>
              <textarea
                rows={3}
                placeholder={t.keyInstructionsPlaceholder}
                value={form.key_instructions}
                onChange={update("key_instructions")}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.lockboxCode}</span>
              <input
                placeholder={t.lockboxCodePlaceholder}
                value={form.key_lockbox_code}
                onChange={update("key_lockbox_code")}
                className="input"
              />
            </label>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                {t.keyPhotos(keyPhotos.length, MAX_KEY_PHOTOS)}
              </span>
              <div className="mt-2 flex flex-wrap gap-3">
                {keyPhotos.map((file, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-20 w-20 rounded object-cover border border-sand-dim"
                    />
                    <button
                      type="button"
                      onClick={() => removeKeyPhoto(i)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-ink"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {keyPhotos.length < MAX_KEY_PHOTOS && (
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-dashed border-sand-dim text-xs text-ink/50">
                    {t.addPhoto}
                    <input type="file" accept="image/*" multiple onChange={handleKeyPhotos} className="hidden" />
                  </label>
                )}
              </div>
            </div>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.videoUrl}</span>
              <input
                type="url"
                placeholder={t.videoUrlPlaceholder}
                value={form.key_video_url}
                onChange={update("key_video_url")}
                className="input"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {saving ? p.saving : p.submit}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        </form>
      </section>
    </main>
  );
}
