"use client";

import { useEffect, useState } from "react";
import { ChatIcon } from "@/components/icons";

const content = {
  fr: {
    cta: "Nous contacter",
    title: "Une question ?",
    subtitle: "Laisse tes coordonnées et ta question, on te répond directement.",
    name: "Nom",
    phone: "Téléphone",
    email: "Email",
    propertiesCount: "Nombre de logements gérés",
    message: "Ton message (optionnel)",
    messagePlaceholder: "Ex : j'ai 3 appartements à Nice, comment ça marche ?",
    submit: "Envoyer →",
    sending: "Envoi…",
    success: "Merci ! On te répond très vite.",
    error: "Une erreur est survenue, réessaie.",
    close: "Fermer",
  },
  en: {
    cta: "Contact us",
    title: "A question?",
    subtitle: "Leave your details and your question, we'll get back to you directly.",
    name: "Name",
    phone: "Phone",
    email: "Email",
    propertiesCount: "Number of properties managed",
    message: "Your message (optional)",
    messagePlaceholder: "E.g. I have 3 apartments in Nice, how does it work?",
    submit: "Send →",
    sending: "Sending…",
    success: "Thanks! We'll get back to you very soon.",
    error: "Something went wrong, try again.",
    close: "Close",
  },
  es: {
    cta: "Contáctanos",
    title: "¿Alguna pregunta?",
    subtitle: "Déjanos tus datos y tu pregunta, te respondemos directamente.",
    name: "Nombre",
    phone: "Teléfono",
    email: "Email",
    propertiesCount: "Número de alojamientos que gestionas",
    message: "Tu mensaje (opcional)",
    messagePlaceholder: "Ej: tengo 3 apartamentos en Niza, ¿cómo funciona?",
    submit: "Enviar →",
    sending: "Enviando…",
    success: "¡Gracias! Te respondemos muy pronto.",
    error: "Ocurrió un error, intenta de nuevo.",
    close: "Cerrar",
  },
};

const EMPTY_FORM = { name: "", phone: "", email: "", propertiesCount: "", message: "" };

const buttonClasses = {
  outline:
    "rounded border border-aqua-deep px-5 py-2.5 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card",
  solid: "rounded bg-terracotta px-7 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep",
  dark: "rounded border border-[#f7f1e4]/60 px-7 py-3.5 font-bold text-[#f7f1e4] transition-colors hover:bg-[#f7f1e4]/10",
  floating:
    "fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-terracotta px-5 py-3 text-sm font-bold text-ink shadow-lg transition-colors hover:bg-terracotta-deep",
};

export default function ContactButton({ locale, variant = "outline" }) {
  const t = content[locale] ?? content.fr;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState("idle");
  const [nearFooter, setNearFooter] = useState(false);

  // Le bouton flottant se retire quand le pied de page est visible : il
  // masquerait sinon ses liens (le bloc d'appel final a déjà son propre bouton).
  useEffect(() => {
    if (variant !== "floating") return;
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setNearFooter(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, [variant]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function close() {
    setOpen(false);
    setStatus("idle");
    setForm(EMPTY_FORM);
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
      {!(variant === "floating" && nearFooter) && (
        <button type="button" onClick={() => setOpen(true)} className={buttonClasses[variant]}>
          {variant === "floating" && <ChatIcon />}
          {t.cta}
        </button>
      )}

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
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.message}</span>
                  <textarea
                    value={form.message}
                    onChange={update("message")}
                    rows={4}
                    maxLength={2000}
                    placeholder={t.messagePlaceholder}
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
