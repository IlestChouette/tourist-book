"use client";

import { useState } from "react";
import Link from "next/link";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    back: "← Admin",
    title: "Retrouver un check-in",
    intro:
      "Recherchez par nom et/ou dates de séjour pour retrouver la pièce d'identité et le selfie d'un voyageur — utile quand un hôtelier en a besoin après le départ de l'hôte pour un motif légal.",
    name: "Nom du voyageur",
    from: "Arrivée après le",
    to: "Départ avant le",
    search: "Rechercher →",
    searching: "Recherche…",
    noResults: "Aucun résultat.",
    reveal: "Générer les liens (valables 2 min)",
    revealing: "Génération…",
    idDocument: "Pièce d'identité",
    selfie: "Selfie",
    statusLabel: { pendiente: "En attente", aprobado: "Approuvé", rechazado: "Refusé" },
  },
  en: {
    back: "← Admin",
    title: "Find a check-in",
    intro:
      "Search by name and/or stay dates to find a guest's ID document and selfie — useful when a host needs it after the guest's departure for a legal reason.",
    name: "Guest name",
    from: "Arrival after",
    to: "Departure before",
    search: "Search →",
    searching: "Searching…",
    noResults: "No results.",
    reveal: "Generate links (valid 2 min)",
    revealing: "Generating…",
    idDocument: "ID document",
    selfie: "Selfie",
    statusLabel: { pendiente: "Pending", aprobado: "Approved", rechazado: "Rejected" },
  },
  es: {
    back: "← Admin",
    title: "Buscar un check-in",
    intro:
      "Busca por nombre y/o fechas de estancia para encontrar el documento de identidad y el selfie de un huésped — útil cuando un hotelero lo necesita después de que el huésped se fue, por un motivo legal.",
    name: "Nombre del huésped",
    from: "Llegada después del",
    to: "Salida antes del",
    search: "Buscar →",
    searching: "Buscando…",
    noResults: "Sin resultados.",
    reveal: "Generar enlaces (válidos 2 min)",
    revealing: "Generando…",
    idDocument: "Documento de identidad",
    selfie: "Selfie",
    statusLabel: { pendiente: "Pendiente", aprobado: "Aprobado", rechazado: "Rechazado" },
  },
};

export default function IdentidadLookupPage() {
  const [locale] = useState(getClientLocale);
  const t = content[locale];

  const [form, setForm] = useState({ q: "", from: "", to: "" });
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [revealingId, setRevealingId] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSearch(e) {
    e.preventDefault();
    setSearching(true);
    setRevealed({});

    const params = new URLSearchParams();
    if (form.q) params.set("q", form.q);
    if (form.from) params.set("from", form.from);
    if (form.to) params.set("to", form.to);

    const res = await fetch(`/api/admin/identity-lookup?${params}`);
    const data = await res.json();
    setResults(data.results ?? []);
    setSearching(false);
  }

  async function reveal(id) {
    setRevealingId(id);
    const res = await fetch(`/api/admin/identity-lookup/${id}`);
    if (res.ok) {
      const data = await res.json();
      setRevealed((r) => ({ ...r, [id]: data }));
    }
    setRevealingId(null);
  }

  return (
    <main className="flex-1 bg-sand">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/admin" className="text-sm font-bold text-aqua-deep">
          {t.back}
        </Link>
        <h1 className="mt-3 font-display italic text-3xl text-ink">{t.title}</h1>
        <p className="mt-2 text-ink/70">{t.intro}</p>

        <form onSubmit={handleSearch} className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.name}</span>
            <input value={form.q} onChange={update("q")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.from}</span>
            <input type="date" value={form.from} onChange={update("from")} className="input" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.to}</span>
            <input type="date" value={form.to} onChange={update("to")} className="input" />
          </label>
          <button
            type="submit"
            disabled={searching}
            className="sm:col-span-3 rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {searching ? t.searching : t.search}
          </button>
        </form>

        {results && results.length === 0 && <p className="mt-6 text-ink/60">{t.noResults}</p>}

        <div className="mt-6 grid gap-4">
          {(results ?? []).map((r) => (
            <div key={r.id} className="rounded border border-sand-dim bg-sand-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-ink">{r.guestName}</span>
                  <span className="ml-2 text-sm text-ink/60">
                    {r.propertyName} · {r.arrivalDate} → {r.departureDate}
                  </span>
                </div>
                <span className="text-xs font-bold uppercase tracking-wide text-ink/60">
                  {t.statusLabel[r.verificationStatus] ?? r.verificationStatus}
                </span>
              </div>

              {!revealed[r.id] && (
                <button
                  type="button"
                  onClick={() => reveal(r.id)}
                  disabled={revealingId === r.id}
                  className="mt-3 rounded border border-aqua-deep px-4 py-1.5 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card disabled:opacity-60"
                >
                  {revealingId === r.id ? t.revealing : t.reveal}
                </button>
              )}

              {revealed[r.id] && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.idDocument}</span>
                    {revealed[r.id].idDocumentUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={revealed[r.id].idDocumentUrl} alt="" className="mt-2 w-full rounded border border-sand-dim" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.selfie}</span>
                    {revealed[r.id].selfieUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={revealed[r.id].selfieUrl} alt="" className="mt-2 w-full rounded border border-sand-dim" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
