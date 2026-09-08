"use client";

import { use, useState, useRef, useEffect } from "react";
import Hero from "@/components/Hero";

const content = {
  fr: {
    eyebrow: "Assistant",
    title: "Une question ?",
    subtitle: "Pose ta question, je réponds à partir du livret de l'hôte.",
    suggestions: ["Une idée pour cet après-midi ?", "Quoi visiter dans le coin ?", "Un bon resto pas loin ?"],
    loadingProperty: "Chargement…",
    notFound: "Logement introuvable.",
    thinking: "L'assistant réfléchit…",
    error: "Une erreur est survenue. Réessaie, ou contacte directement l'hôte depuis le livret.",
    placeholder: "Écris ta question…",
    send: "Envoyer",
    disclaimer: "Réponses basées sur le livret de l'hôte. L'IA peut se tromper.",
  },
  en: {
    eyebrow: "Assistant",
    title: "A question?",
    subtitle: "Ask away — I answer from your host's welcome book.",
    suggestions: ["An idea for this afternoon?", "What to see around here?", "A good restaurant nearby?"],
    loadingProperty: "Loading…",
    notFound: "Property not found.",
    thinking: "The assistant is thinking…",
    error: "Something went wrong. Try again, or contact your host directly from the welcome book.",
    placeholder: "Type your question…",
    send: "Send",
    disclaimer: "Answers are based on your host's welcome book. The AI can make mistakes.",
  },
  es: {
    eyebrow: "Asistente",
    title: "¿Alguna pregunta?",
    subtitle: "Pregunta lo que quieras, respondo a partir del livret de tu anfitrión.",
    suggestions: ["¿Una idea para esta tarde?", "¿Qué visitar por aquí?", "¿Un buen restaurante cerca?"],
    loadingProperty: "Cargando…",
    notFound: "Alojamiento no encontrado.",
    thinking: "El asistente está pensando…",
    error: "Ocurrió un error. Intenta de nuevo, o contacta directamente a tu anfitrión desde el livret.",
    placeholder: "Escribe tu pregunta…",
    send: "Enviar",
    disclaimer: "Respuestas basadas en el livret de tu anfitrión. La IA puede equivocarse.",
  },
};

export default function AssistantChat({ params, locale = "fr" }) {
  const t = content[locale];
  const { slug } = use(params);
  const [property, setProperty] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetch(`/api/properties/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProperty(data);
        setLoadingProperty(false);
      })
      .catch(() => setLoadingProperty(false));
  }, [slug]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

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

  if (loadingProperty) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-14">
        <p className="text-ink/60">{t.loadingProperty}</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-14">
        <p className="text-ink">{t.notFound}</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <Hero
        backHref={`/logement/${slug}`}
        backLabel={property.name}
        eyebrow={t.eyebrow}
        title={t.title}
        subtitle={t.subtitle}
      />

      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-8">
        {messages.length === 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {t.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-sand-dim bg-sand-card px-4 py-2 text-sm text-ink/80 transition-colors hover:border-aqua-deep"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded p-3 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-terracotta text-ink"
                  : "bg-sand-card text-ink border border-sand-dim"
              }`}
            >
              {m.content}
            </div>
          ))}
          {sending && (
            <div className="max-w-[85%] rounded border border-sand-dim bg-sand-card p-3 text-sm text-ink/60">
              {t.thinking}
            </div>
          )}
          {error && <p className="text-sm text-terracotta-deep">{t.error}</p>}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {t.send}
          </button>
        </form>
        <p className="mt-2 text-xs text-ink/50">{t.disclaimer}</p>
      </section>
    </main>
  );
}
