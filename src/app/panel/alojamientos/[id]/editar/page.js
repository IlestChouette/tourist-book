"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/uploadMedia";
import Hero from "@/components/Hero";
import { getClientLocale } from "@/lib/i18n/clientLocale";
import fieldsDict from "@/lib/i18n/dictionaries/propertyForm";

const MAX_PHOTOS = 5;
const MAX_KEY_PHOTOS = 4;

const pageContent = {
  fr: { eyebrow: "Panel hôtelier", loading: "Chargement…", notFound: "Logement introuvable", title: "Modifier le logement", saving: "Enregistrement…", submit: "Enregistrer →" },
  en: { eyebrow: "Host panel", loading: "Loading…", notFound: "Property not found", title: "Edit property", saving: "Saving…", submit: "Save →" },
  es: { eyebrow: "Panel hotelero", loading: "Cargando…", notFound: "Alojamiento no encontrado", title: "Editar alojamiento", saving: "Guardando…", submit: "Guardar cambios →" },
};

export default function EditarAlojamientoPage({ params }) {
  const { id } = use(params);
  const [locale] = useState(getClientLocale);
  const t = fieldsDict[locale];
  const p = pageContent[locale];

  const [form, setForm] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [existingWastePhoto, setExistingWastePhoto] = useState(null);
  const [newWastePhoto, setNewWastePhoto] = useState(null);
  const [existingKeyPhotos, setExistingKeyPhotos] = useState([]);
  const [newKeyPhotos, setNewKeyPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("properties").select("*").eq("id", id).single();
      if (data) {
        setForm({
          name: data.name ?? "",
          city: data.city ?? "",
          postal_code: data.postal_code ?? "",
          address: data.address ?? "",
          address_details: data.address_details ?? "",
          wifi_ssid: data.wifi_ssid ?? "",
          wifi_password: data.wifi_password ?? "",
          checkin: data.checkin ?? "",
          checkout: data.checkout ?? "",
          parking: data.parking ?? "",
          contact_name: data.contact_name ?? data.contact ?? "",
          contact_phone: data.contact_phone ?? "",
          description: data.description ?? "",
          house_rules: data.house_rules ?? "",
          waste_instructions: data.waste_instructions ?? "",
          general_info: data.general_info ?? "",
          local_recommendations: data.local_recommendations ?? "",
          key_instructions: data.key_instructions ?? "",
          key_lockbox_code: data.key_lockbox_code ?? "",
          slug: data.slug,
        });
        setExistingPhotos(data.photos ?? []);
        setExistingWastePhoto(data.waste_photo ?? null);
        setExistingKeyPhotos(data.key_photos ?? []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  const totalPhotos = existingPhotos.length + newPhotos.length;
  const totalKeyPhotos = existingKeyPhotos.length + newKeyPhotos.length;

  function handlePhotos(e) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_PHOTOS - totalPhotos);
    setNewPhotos((p) => [...p, ...files].slice(0, MAX_PHOTOS - existingPhotos.length));
  }

  function removeExistingPhoto(index) {
    setExistingPhotos((p) => p.filter((_, i) => i !== index));
  }

  function removeNewPhoto(index) {
    setNewPhotos((p) => p.filter((_, i) => i !== index));
  }

  function handleWastePhoto(e) {
    setNewWastePhoto(e.target.files?.[0] ?? null);
  }

  function handleKeyPhotos(e) {
    const files = Array.from(e.target.files ?? []).slice(0, MAX_KEY_PHOTOS - totalKeyPhotos);
    setNewKeyPhotos((p) => [...p, ...files].slice(0, MAX_KEY_PHOTOS - existingKeyPhotos.length));
  }

  function removeExistingKeyPhoto(index) {
    setExistingKeyPhotos((p) => p.filter((_, i) => i !== index));
  }

  function removeNewKeyPhoto(index) {
    setNewKeyPhotos((p) => p.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    try {
      const uploadedUrls = [];
      for (let i = 0; i < newPhotos.length; i++) {
        const file = newPhotos[i];
        const ext = file.name.split(".").pop();
        const url = await uploadMedia(`${user.id}/${form.slug}/${Date.now()}-${i + 1}.${ext}`, file);
        uploadedUrls.push(url);
      }

      let wastePhotoUrl = existingWastePhoto;
      if (newWastePhoto) {
        const ext = newWastePhoto.name.split(".").pop();
        wastePhotoUrl = await uploadMedia(`${user.id}/${form.slug}/basuras-${Date.now()}.${ext}`, newWastePhoto);
      }

      const uploadedKeyUrls = [];
      for (let i = 0; i < newKeyPhotos.length; i++) {
        const file = newKeyPhotos[i];
        const ext = file.name.split(".").pop();
        const url = await uploadMedia(`${user.id}/${form.slug}/llaves-${Date.now()}-${i + 1}.${ext}`, file);
        uploadedKeyUrls.push(url);
      }

      const { error: updateError } = await supabase
        .from("properties")
        .update({
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
          general_info: form.general_info,
          local_recommendations: form.local_recommendations,
          key_instructions: form.key_instructions,
          key_lockbox_code: form.key_lockbox_code,
          photos: [...existingPhotos, ...uploadedUrls],
          key_photos: [...existingKeyPhotos, ...uploadedKeyUrls],
        })
        .eq("id", id);

      if (updateError) throw updateError;
      window.location.href = `/panel/alojamientos/${id}`;
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex-1">
        <Hero eyebrow={p.eyebrow} title={p.loading} />
      </main>
    );
  }

  if (!form) {
    return (
      <main className="flex-1">
        <Hero eyebrow={p.eyebrow} title={p.notFound} />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}`}
        backLabel={form.name}
        eyebrow={p.eyebrow}
        title={p.title}
      />
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
              {t.photos(totalPhotos, MAX_PHOTOS)}
            </span>
            <div className="mt-2 flex flex-wrap gap-3">
              {existingPhotos.map((url, i) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-20 w-20 rounded object-cover border border-sand-dim" />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(i)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-ink"
                  >
                    ×
                  </button>
                </div>
              ))}
              {newPhotos.map((file, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="h-20 w-20 rounded object-cover border border-sand-dim"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(i)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-ink"
                  >
                    ×
                  </button>
                </div>
              ))}
              {totalPhotos < MAX_PHOTOS && (
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
                {newWastePhoto ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(newWastePhoto)}
                      alt=""
                      className="h-20 w-20 rounded object-cover border border-sand-dim"
                    />
                    <button
                      type="button"
                      onClick={() => setNewWastePhoto(null)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-ink"
                    >
                      ×
                    </button>
                  </div>
                ) : existingWastePhoto ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={existingWastePhoto}
                      alt=""
                      className="h-20 w-20 rounded object-cover border border-sand-dim"
                    />
                    <button
                      type="button"
                      onClick={() => setExistingWastePhoto(null)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-ink"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-dashed border-sand-dim text-xs text-ink/50">
                    {t.addPhoto}
                    <input type="file" accept="image/*" onChange={handleWastePhoto} className="hidden" />
                  </label>
                )}
              </div>
            </div>
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
                {t.keyPhotos(totalKeyPhotos, MAX_KEY_PHOTOS)}
              </span>
              <div className="mt-2 flex flex-wrap gap-3">
                {existingKeyPhotos.map((url, i) => (
                  <div key={url} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-20 w-20 rounded object-cover border border-sand-dim" />
                    <button
                      type="button"
                      onClick={() => removeExistingKeyPhoto(i)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-ink"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {newKeyPhotos.map((file, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="h-20 w-20 rounded object-cover border border-sand-dim"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewKeyPhoto(i)}
                      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-ink"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {totalKeyPhotos < MAX_KEY_PHOTOS && (
                  <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-dashed border-sand-dim text-xs text-ink/50">
                    {t.addPhoto}
                    <input type="file" accept="image/*" multiple onChange={handleKeyPhotos} className="hidden" />
                  </label>
                )}
              </div>
            </div>
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
