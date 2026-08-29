"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/uploadMedia";
import Hero from "@/components/Hero";

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

export default function NuevoAlojamientoPage() {
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    wifi_ssid: "",
    wifi_password: "",
    checkin: "",
    checkout: "",
    parking: "",
    contact: "",
  });
  const [photos, setPhotos] = useState([]);
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

      const { data: inserted, error: insertError } = await supabase
        .from("properties")
        .insert({
          host_id: user.id,
          slug,
          name: form.name,
          city: form.city,
          address: form.address,
          wifi_ssid: form.wifi_ssid,
          wifi_password: form.wifi_password,
          checkin: form.checkin,
          checkout: form.checkout,
          parking: form.parking,
          contact: form.contact,
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
      <Hero eyebrow="Panel hotelero" title="Nuevo alojamiento" />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Nombre</span>
            <input required value={form.name} onChange={update("name")} className="input" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Ciudad</span>
              <input required value={form.city} onChange={update("city")} className="input" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Dirección</span>
              <input required value={form.address} onChange={update("address")} className="input" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Wifi (red)</span>
              <input value={form.wifi_ssid} onChange={update("wifi_ssid")} className="input" />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Wifi (contraseña)</span>
              <input value={form.wifi_password} onChange={update("wifi_password")} className="input" />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Llegada</span>
              <input
                placeholder="A partir de 15h00"
                value={form.checkin}
                onChange={update("checkin")}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Salida</span>
              <input
                placeholder="Antes de 11h00"
                value={form.checkout}
                onChange={update("checkout")}
                className="input"
              />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Aparcamiento</span>
            <input value={form.parking} onChange={update("parking")} className="input" />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Contacto</span>
            <input value={form.contact} onChange={update("contact")} className="input" />
          </label>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Fotos ({photos.length}/{MAX_PHOTOS})
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
                  + Añadir
                  <input type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Crear alojamiento →"}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        </form>
      </section>
    </main>
  );
}
