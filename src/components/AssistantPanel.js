"use client";

import { useState, useRef, useEffect } from "react";

const content = {
  fr: {
    title: "Une question ?",
    subtitle: "Pose ta question, je réponds à partir du livret de l'hôte.",
    suggestions: ["Une idée pour cet après-midi ?", "Quoi visiter dans le coin ?", "Un bon resto pas loin ?"],
    thinking: "L'assistant réfléchit…",
    error: "Une erreur est survenue. Réessaie, ou contacte directement l'hôte depuis le livret.",
    placeholder: "Écris ta question…",
    send: "Envoyer",
    disclaimer: "Réponses basées sur le livret de l'hôte. L'IA peut se tromper.",
    close: "Fermer",
  },
  en: {
    title: "A question?",
    subtitle: "Ask away — I answer from your host's welcome book.",
    suggestions: ["An idea for this afternoon?", "What to see around here?", "A good restaurant nearby?"],
    thinking: "The assistant is thinking…",
    error: "Something went wrong. Try again, or contact your host directly from the welcome book.",
    placeholder: "Type your question…",
    send: "Send",
    disclaimer: "Answers are based on your host's welcome book. The AI can make mistakes.",
    close: "Close",
  },
  es: {
    title: "¿Alguna pregunta?",
    subtitle: "Pregunta lo que quieras, respondo a partir del livret de tu anfitrión.",
    suggestions: ["¿Una idea para esta tarde?", "¿Qué visitar por aquí?", "¿Un buen restaurante cerca?"],
    thinking: "El asistente está pensando…",
    error: "Ocurrió un error. Intenta de nuevo, o contacta directamente a tu anfitrión desde el livret.",
    placeholder: "Escribe tu pregunta…",
    send: "Enviar",
    disclaimer: "Respuestas basadas en el livret de tu anfitrión. La IA puede equivocarse.",
    close: "Cerrar",
  },
};

// Reste monté en permanence (juste caché hors-écran) même fermé — la
// conversation de l'invité doit survivre à la fermeture du panneau tant
// qu'il reste sur la page du livret, pas seulement pendant qu'il est ouvert.
export default function AssistantPanel({ slug, locale = "fr", open, onClose }) {
  const t = content[locale];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function send(text) {
    const message = text.trim();
    if (!message || sending) return;

    const next = [...messages, { role: "user", content: message }];
    setMessages(next);
    setInput("");
    setSending(true);
    setError(false);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, messages: next }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-[#12202a]/40 backdrop-blur-sm transition-opacity md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-sand-card shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-sand-dim p-5">
          <div>
            <span className="font-display italic text-xl text-ink">{t.title}</span>
            <p className="mt-0.5 text-sm text-ink/60">{t.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink/40 transition hover:bg-sand hover:text-ink active:scale-90"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {t.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full border border-sand-dim bg-sand px-4 py-2 text-sm text-ink/80 transition-colors hover:border-[var(--host-accent)]"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded p-3 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-[var(--host-accent)] text-ink"
                    : "bg-sand text-ink border border-sand-dim"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="max-w-[85%] rounded border border-sand-dim bg-sand p-3 text-sm text-ink/60">
                {t.thinking}
              </div>
            )}
            {error && <p className="text-sm text-terracotta-deep">{t.error}</p>}
            <div ref={bottomRef} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border-t border-sand-dim p-4">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.placeholder}
              className="input flex-1"
            />
            <button
              type="submit"
              disabled={sending}
              className="shrink-0 rounded bg-[var(--host-accent)] px-5 py-3 font-bold text-ink transition-colors hover:bg-[var(--host-accent-deep)] disabled:opacity-60"
            >
              {t.send}
            </button>
          </div>
          <p className="mt-2 text-xs text-ink/50">{t.disclaimer}</p>
        </form>
      </div>
    </>
  );
}
