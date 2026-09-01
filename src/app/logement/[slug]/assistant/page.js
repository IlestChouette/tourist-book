"use client";

import { use, useState, useRef, useEffect } from "react";
import Hero from "@/components/Hero";

const suggestions = [
  "Une idée pour cet après-midi ?",
  "Quoi visiter dans le coin ?",
  "Un bon resto pas loin ?",
];

export default function AssistantPage({ params }) {
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
    const content = text.trim();
    if (!content || sending) return;

    const next = [...messages, { role: "user", content }];
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
        <p className="text-ink/60">Chargement…</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-14">
        <p className="text-ink">Logement introuvable.</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col">
      <Hero
        backHref={`/logement/${slug}`}
        backLabel={property.name}
        eyebrow="Assistant"
        title="Une question ?"
        subtitle="Pose ta question, je réponds à partir du livret de l'hôte."
      />

      <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-8">
        {messages.length === 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {suggestions.map((s) => (
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
              L&apos;assistant réfléchit…
            </div>
          )}
          {error && (
            <p className="text-sm text-terracotta-deep">
              Une erreur est survenue. Réessaie, ou contacte directement l&apos;hôte depuis le livret.
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écris ta question…"
            className="input flex-1"
          />
          <button
            type="submit"
            disabled={sending}
            className="rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            Envoyer
          </button>
        </form>
        <p className="mt-2 text-xs text-ink/50">
          Réponses basées sur le livret de l&apos;hôte. L&apos;IA peut se tromper.
        </p>
      </section>
    </main>
  );
}
