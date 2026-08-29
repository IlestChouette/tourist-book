"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/uploadMedia";
import Hero from "@/components/Hero";

export default function RegistroPage() {
  const [form, setForm] = useState({ nombre: "", email: "", password: "" });
  const [logo, setLogo] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!acceptedTerms) {
      setError("Debes aceptar los Términos de uso y la Política de privacidad para continuar.");
      return;
    }

    setSending(true);
    setError("");

    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      setSending(false);
      setError(signUpError.message);
      return;
    }

    if (!data.session) {
      setSending(false);
      setError(
        "Cuenta creada, pero falta confirmar el email. Revisa tu bandeja de entrada (o desactiva \"Confirm email\" en Supabase mientras probamos)."
      );
      return;
    }

    let logoUrl = null;
    if (logo) {
      try {
        const ext = logo.name.split(".").pop();
        logoUrl = await uploadMedia(`${data.user.id}/logo.${ext}`, logo);
      } catch {
        // El logo es opcional: si falla la subida, seguimos sin bloquear el registro.
      }
    }

    const { error: insertError } = await supabase.from("hosts").insert({
      id: data.user.id,
      email: form.email,
      name: form.nombre,
      logo_url: logoUrl,
      accepted_terms_at: new Date().toISOString(),
    });

    setSending(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    window.location.href = "/panel";
  }

  return (
    <main className="flex-1">
      <Hero backHref="/" backLabel="Inicio" eyebrow="Tourist Book" title="Crear cuenta de hotelero" />
      <section className="mx-auto max-w-sm px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Nombre</span>
            <input required value={form.nombre} onChange={update("nombre")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Email</span>
            <input required type="email" value={form.email} onChange={update("email")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Contraseña</span>
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={update("password")}
              className="input"
            />
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Logo (opcional — aparecerá en el check-in de tus huéspedes)
            </span>
            <div className="flex items-center gap-3">
              {logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(logo)}
                  alt=""
                  className="h-12 w-12 rounded object-contain bg-sand-card border border-sand-dim"
                />
              )}
              <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
            </div>
          </label>

          <label className="flex items-start gap-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />
            <span>
              He leído y acepto los{" "}
              <a href="/terminos" target="_blank" className="font-bold text-aqua-deep">
                Términos de uso y suscripción
              </a>{" "}
              y la{" "}
              <a href="/privacidad" target="_blank" className="font-bold text-aqua-deep">
                Política de privacidad
              </a>
              .
            </span>
          </label>
          <button
            type="submit"
            disabled={sending}
            className="mt-2 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {sending ? "Creando…" : "Crear cuenta →"}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        </form>
        <p className="mt-4 text-sm text-ink/70">
          ¿Ya tienes cuenta?{" "}
          <Link href="/panel/login" className="font-bold text-aqua-deep">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
