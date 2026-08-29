"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { properties } from "@/data/properties";
import { partners } from "@/data/partners";
import Hero from "@/components/Hero";

function partnerMessage(r) {
  if (r.type === "transfert") {
    return [
      `Transfert — ${r.property ?? r.slug}`,
      `Voyageur : ${r.nom} (${r.telephone ?? "tél. non renseigné"})`,
      `Date : ${r.date} à ${r.heure}`,
      `Lieu de prise en charge : ${r.lieu}`,
      `Passagers : ${r.passagers}`,
      r.bagagesGrands || r.bagagesPetits
        ? `Bagages : ${r.bagagesGrands ?? 0} grand(s), ${r.bagagesPetits ?? 0} petit(s)`
        : null,
      r.vol ? `Vol : ${r.vol}` : null,
      r.remarques ? `Remarques : ${r.remarques}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }
  return [
    `Tour / activité — ${r.property ?? r.slug}`,
    `Voyageur : ${r.nom}`,
    `Date souhaitée : ${r.date}`,
    `Personnes : ${r.personnes}`,
    `Activité : ${r.activite}`,
    r.remarques ? `Remarques : ${r.remarques}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function DashboardPage() {
  const [requests, setRequests] = useState([]);
  const [guestbook, setGuestbook] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [reqRes, gbRes] = await Promise.all([
      fetch("/api/requests"),
      fetch("/api/guestbook?all=1"),
    ]);
    setRequests(await reqRes.json());
    setGuestbook(await gbRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleHidden(id, hidden) {
    await fetch("/api/guestbook", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, hidden }),
    });
    await load();
  }

  function propertyName(slug) {
    return properties.find((p) => p.slug === slug)?.name ?? slug;
  }

  return (
    <main className="flex-1">
      <Hero
        backHref="/"
        backLabel="Accueil"
        title="Tableau de bord"
        subtitle="Tes logements, les demandes envoyées, le carnet de visite."
      />

      <section className="mx-auto max-w-2xl px-6 py-10">
        <h2 className="text-xs font-bold uppercase tracking-widest text-terracotta">
          Logements ({properties.length})
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {properties.map((property) => (
            <Link
              key={property.slug}
              href={`/logement/${property.slug}`}
              className="rounded border border-sand-dim bg-sand-card p-4 transition-colors hover:border-aqua-deep"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{property.city}</span>
              <span className="mt-1 block font-display italic text-xl text-ink">{property.name}</span>
            </Link>
          ))}
        </div>

        <h2 className="mt-10 text-xs font-bold uppercase tracking-widest text-terracotta">
          Demandes envoyées ({requests.length})
        </h2>
        {loading && <p className="mt-3 text-ink/60">Chargement…</p>}
        {!loading && requests.length === 0 && (
          <p className="mt-3 text-ink/60">
            Aucune demande pour l'instant. Elles apparaîtront ici dès qu'un voyageur réservera un transfert ou une activité.
          </p>
        )}
        <div className="mt-3 grid gap-3">
          {requests.map((r) => (
            <div key={r.id} className="rounded border border-sand-dim bg-sand-card p-4">
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-ink">
                  {r.type === "transfert" ? "Transfert" : "Tour / activité"} — {propertyName(r.slug)}
                </span>
                <span className="text-xs text-ink/50">
                  {new Date(r.createdAt).toLocaleString("fr-FR")}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink/70">
                {r.nom}
                {r.telephone ? ` · ${r.telephone}` : ""} ·{" "}
                {r.type === "transfert" ? `${r.date} ${r.heure} · ${r.lieu}` : `${r.date} · ${r.activite}`}
              </p>
              {r.type === "transfert" && (r.bagagesGrands || r.bagagesPetits) && (
                <p className="mt-1 text-sm text-ink/70">
                  Bagages : {r.bagagesGrands ?? 0} grand(s), {r.bagagesPetits ?? 0} petit(s)
                </p>
              )}
              <a
                href={`https://wa.me/${partners[r.type === "transfert" ? "transfert" : "tours"].phone}?text=${encodeURIComponent(partnerMessage(r))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-bold uppercase tracking-wider text-aqua-deep"
              >
                Contacter le partenaire sur WhatsApp →
              </a>
            </div>
          ))}
        </div>

        <h2 className="mt-10 text-xs font-bold uppercase tracking-widest text-terracotta">
          Carnet de visite — modération ({guestbook.length})
        </h2>
        <div className="mt-3 grid gap-3">
          {guestbook.map((entry) => (
            <div key={entry.id} className="rounded border border-sand-dim bg-sand-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-ink">
                    {entry.nom} — {propertyName(entry.slug)}
                  </span>
                  <p className="mt-1 text-sm text-ink/70">{entry.message}</p>
                </div>
                <button
                  onClick={() => toggleHidden(entry.id, !entry.hidden)}
                  className="shrink-0 rounded border border-sand-dim px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink/70 hover:border-terracotta-deep"
                >
                  {entry.hidden ? "Réafficher" : "Masquer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
