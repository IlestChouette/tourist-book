"use client";

import { use, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/uploadMedia";
import Hero from "@/components/Hero";

const MAX_PHOTOS = 5;
const MAX_KEY_PHOTOS = 4;

export default function EditarAlojamientoPage({ params }) {
  const { id } = use(params);
  const [form, setForm] = useState(null);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
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
          address: data.address ?? "",
          wifi_ssid: data.wifi_ssid ?? "",
          wifi_password: data.wifi_password ?? "",
          checkin: data.checkin ?? "",
          checkout: data.checkout ?? "",
          parking: data.parking ?? "",
          contact: data.contact ?? "",
          description: data.description ?? "",
          key_instructions: data.key_instructions ?? "",
          key_lockbox_code: data.key_lockbox_code ?? "",
          slug: data.slug,
        });
        setExistingPhotos(data.photos ?? []);
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
          address: form.address,
          wifi_ssid: form.wifi_ssid,
          wifi_password: form.wifi_password,
          checkin: form.checkin,
          checkout: form.checkout,
          parking: form.parking,
          contact: form.contact,
          description: form.description,
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
        <Hero eyebrow="Panel hotelero" title="Cargando…" />
      </main>
    );
  }

  if (!form) {
    return (
      <main className="flex-1">
        <Hero eyebrow="Panel hotelero" title="Alojamiento no encontrado" />
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero
        backHref={`/panel/alojamientos/${id}`}
        backLabel={form.name}
        eyebrow="Panel hotelero"
        title="Editar alojamiento"
      />
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

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Mensaje de bienvenida (opcional, pero recomendado)
            </span>
            <textarea
              rows={4}
              placeholder={
                'Hazlo personal y cálido — es lo primero que lee tu huésped. Por ejemplo: "¡Bienvenido/a! Estamos muy felices de recibirte..."'
              }
              value={form.description}
              onChange={update("description")}
              className="input"
            />
            <span className="text-xs text-ink/50">
              Este texto aparece en la primera página del livret — es la primera impresión de tu
              huésped. Un mensaje cálido y personal vale más que uno genérico.
            </span>
          </label>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Fotos ({totalPhotos}/{MAX_PHOTOS})
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
                  + Añadir
                  <input type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="mt-2 grid gap-4 rounded border border-sand-dim bg-sand-card p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Recogida de llaves
            </span>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                Indicaciones (opcional)
              </span>
              <textarea
                rows={3}
                placeholder="Ej: la llave está en la caja de seguridad junto a la puerta principal, a la izquierda del timbre."
                value={form.key_instructions}
                onChange={update("key_instructions")}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                Código del candado (si aplica)
              </span>
              <input
                placeholder="Ej: 4821"
                value={form.key_lockbox_code}
                onChange={update("key_lockbox_code")}
                className="input"
              />
            </label>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                Fotos del lugar de las llaves ({totalKeyPhotos}/{MAX_KEY_PHOTOS})
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
                    + Añadir
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
            {saving ? "Guardando…" : "Guardar cambios →"}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        </form>
      </section>
    </main>
  );
}
