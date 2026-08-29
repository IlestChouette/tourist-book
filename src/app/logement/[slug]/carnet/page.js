"use client";

import { use, useEffect, useState } from "react";
import Hero from "@/components/Hero";

export default function CarnetPage({ params }) {
  const { slug } = use(params);
  const [property, setProperty] = useState(null);
  const [loadingProperty, setLoadingProperty] = useState(true);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ nom: "", message: "" });
  const [sending, setSending] = useState(false);

  async function load() {
    const res = await fetch(`/api/guestbook?slug=${slug}`);
    setEntries(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetch(`/api/properties/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProperty(data);
        setLoadingProperty(false);
      })
      .catch(() => setLoadingProperty(false));
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...form }),
    });
    setForm({ nom: "", message: "" });
    setSending(false);
    await load();
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
    <main className="flex-1">
      <Hero
        backHref={`/logement/${slug}`}
        backLabel={property.name}
        title="Carnet de visite"
        subtitle="Les messages laissés par les voyageurs précédents — et le tien, si tu veux."
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4 rounded border border-sand-dim bg-sand-card p-5">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Ton prénom</span>
            <input
              required
              className="input"
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Ton message</span>
            <textarea
              required
              rows={3}
              className="input"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="rounded bg-terracotta px-5 py-3 text-center font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {sending ? "Envoi…" : "Laisser un message"}
          </button>
        </form>

        <div className="mt-8 grid gap-4">
          {loading && <p className="text-ink/60">Chargement…</p>}
          {!loading && entries.length === 0 && (
            <p className="text-ink/60">Aucun message pour l'instant — sois le premier.</p>
          )}
          {entries.map((entry) => (
            <div key={entry.id} className="rounded border border-sand-dim bg-sand-card p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-ink">{entry.nom}</span>
                <span className="text-xs text-ink/50">
                  {new Date(entry.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <p className="mt-2 text-ink/80">{entry.message}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
