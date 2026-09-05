"use client";

import { useState } from "react";

const content = {
  fr: {
    cta: "Nous contacter",
    title: "Une question ?",
    subtitle: "Laisse tes coordonnées, on te répond directement.",
    name: "Nom",
    phone: "Téléphone",
    email: "Email",
    propertiesCount: "Nombre de logements gérés",
    submit: "Envoyer →",
    sending: "Envoi…",
    success: "Merci ! On te répond très vite.",
    error: "Une erreur est survenue, réessaie.",
    close: "Fermer",
  },
  en: {
    cta: "Contact us",
    title: "A question?",
    subtitle: "Leave your details, we'll get back to you directly.",
    name: "Name",
    phone: "Phone",
    email: "Email",
    propertiesCount: "Number of properties managed",
    submit: "Send →",
    sending: "Sending…",
    success: "Thanks! We'll get back to you very soon.",
    error: "Something went wrong, try again.",
    close: "Close",
  },
  es: {
    cta: "Contáctanos",
    title: "¿Alguna pregunta?",
    subtitle: "Déjanos tus datos, te respondemos directamente.",
    name: "Nombre",
    phone: "Teléfono",
    email: "Email",
    propertiesCount: "Número de alojamientos que gestionas",
    submit: "Enviar →",
    sending: "Enviando…",
    success: "¡Gracias! Te respondemos muy pronto.",
    error: "Ocurrió un error, intenta de nuevo.",
    close: "Cerrar",
  },
};

export default function ContactButton({ locale, dark = false }) {
  const t = content[locale] ?? content.fr;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", propertiesCount: "" });
  const [status, setStatus] = useState("idle");

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function close() {
    setOpen(false);
    setStatus("idle");
    setForm({ name: "", phone: "", email: "", propertiesCount: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          dark
            ? "rounded border border-[#f7f1e4]/40 px-5 py-2.5 text-sm font-bold text-[#f7f1e4] transition-colors hover:bg-[#f7f1e4]/10"
            : "rounded border border-aqua-deep px-5 py-2.5 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card"
        }
      >
        {t.cta}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <div className="sheet-backdrop absolute inset-0 bg-[#12202a]/60 backdrop-blur-sm" onClick={close} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-sheet-title"
            className="sheet-panel relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-sand-card p-6 shadow-2xl sm:max-w-sm sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4">
              <span id="contact-sheet-title" className="font-display italic text-xl text-ink">
                {t.title}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={t.close}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/40 transition hover:bg-sand hover:text-ink active:scale-90"
              >
                ×
              </button>
            </div>

            {status === "success" ? (
              <p className="mt-6 text-ink">{t.success}</p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-2 grid gap-3">
                <p className="text-sm text-ink/70">{t.subtitle}</p>
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.name}</span>
                  <input required value={form.name} onChange={update("name")} className="input" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.phone}</span>
                  <input required type="tel" value={form.phone} onChange={update("phone")} className="input" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.email}</span>
                  <input required type="email" value={form.email} onChange={update("email")} className="input" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.propertiesCount}</span>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.propertiesCount}
                    onChange={update("propertiesCount")}
                    className="input"
                  />
                </label>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-1 rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
                >
                  {status === "sending" ? t.sending : t.submit}
                </button>
                {status === "error" && <p className="text-sm text-terracotta-deep">{t.error}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
