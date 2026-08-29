"use client";

import { useState } from "react";

const categories = ["Zone à visiter", "Restaurant", "Shopping", "Mobilité", "Toilettes publiques"];

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function CategoryIcon({ category }) {
  switch (category) {
    case "Zone à visiter":
      return (
        <svg {...iconProps} width="22" height="22">
          <circle cx="17" cy="7" r="2" />
          <path d="M3 18l5-7 4 5 3-4 6 6" />
        </svg>
      );
    case "Restaurant":
      return (
        <svg {...iconProps} width="22" height="22">
          <path d="M7 2v7a2 2 0 0 0 4 0V2M9 2v20" />
          <path d="M17 2c-1.6 1-2.5 2.8-2.5 4.5S15.4 10 17 11v11" />
        </svg>
      );
    case "Shopping":
      return (
        <svg {...iconProps} width="22" height="22">
          <path d="M6 8h12l-1 13H7L6 8z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      );
    case "Mobilité":
      return (
        <svg {...iconProps} width="22" height="22">
          <rect x="4" y="5" width="16" height="12" rx="2" />
          <path d="M4 12h16" />
          <circle cx="8" cy="19" r="1.3" fill="currentColor" stroke="none" />
          <circle cx="16" cy="19" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Toilettes publiques":
      return (
        <svg {...iconProps} width="22" height="22">
          <circle cx="8.5" cy="4.5" r="2" />
          <path d="M8.5 7.5c-2.2 0-3.5 2.3-3.5 6.5h7c0-4.2-1.3-6.5-3.5-6.5z" />
          <path d="M8.5 14v7" />
          <circle cx="16" cy="4.5" r="2" />
          <path d="M13.7 9.5L16 8l2.3 1.5v4L16 15l-2.3-1.5z" />
          <path d="M16 15v6" />
        </svg>
      );
    default:
      return (
        <svg {...iconProps} width="22" height="22">
          <rect x="4" y="4" width="7" height="7" rx="1.5" />
          <rect x="13" y="4" width="7" height="7" rx="1.5" />
          <rect x="4" y="13" width="7" height="7" rx="1.5" />
          <rect x="13" y="13" width="7" height="7" rx="1.5" />
        </svg>
      );
  }
}

export default function CarteInteractive({ property, items }) {
  const [selected, setSelected] = useState({
    name: property.name,
    mapsQuery: property.address,
  });
  const [activeCategory, setActiveCategory] = useState(null);

  const availableCategories = categories.filter((c) => items.some((i) => i.category === c));
  const visibleCategories = activeCategory ? [activeCategory] : availableCategories;

  return (
    <div>
      <div className="overflow-hidden rounded border border-sand-dim">
        <iframe
          key={selected.mapsQuery}
          title={`Carte — ${selected.name}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(selected.mapsQuery)}&output=embed`}
          className="h-64 w-full"
          loading="lazy"
        />
      </div>
      <p className="mt-2 text-sm text-ink/60">
        Sur la carte : <span className="font-bold text-ink">{selected.name}</span>
      </p>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => {
            setActiveCategory(null);
            setSelected({ name: property.name, mapsQuery: property.address });
          }}
          className="flex w-16 flex-col items-center gap-1.5 text-center"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${
              activeCategory === null
                ? "border-terracotta bg-terracotta text-ink"
                : "border-sand-dim bg-sand-card text-ink/70"
            }`}
          >
            <CategoryIcon category="Tout" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wide text-ink/70">Tout</span>
        </button>

        {availableCategories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => {
              setActiveCategory(category);
              const first = items.find((i) => i.category === category);
              if (first) setSelected({ name: first.name, mapsQuery: first.mapsQuery });
            }}
            className="flex w-16 flex-col items-center gap-1.5 text-center"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${
                activeCategory === category
                  ? "border-terracotta bg-terracotta text-ink"
                  : "border-sand-dim bg-sand-card text-ink/70"
              }`}
            >
              <CategoryIcon category={category} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink/70">
              {category}
            </span>
          </button>
        ))}
      </div>

      {visibleCategories.map((category) => {
        const categoryItems = items.filter((i) => i.category === category);
        if (categoryItems.length === 0) return null;
        return (
          <div key={category} className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-terracotta">
              {category}
            </h2>
            <div className="mt-3 grid gap-3">
              {categoryItems.map((item) => {
                const active = selected.mapsQuery === item.mapsQuery;
                return (
                  <div
                    key={item.id}
                    className={`rounded border bg-sand-card p-4 transition-colors ${
                      active ? "border-terracotta" : "border-sand-dim"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected({ name: item.name, mapsQuery: item.mapsQuery })}
                      className="block w-full text-left"
                    >
                      <span className="block font-bold text-ink">{item.name}</span>
                      <span className="block text-sm text-ink/70">{item.note}</span>
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(item.mapsQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-bold uppercase tracking-wider text-aqua-deep"
                    >
                      Itinéraire →
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {items.length === 0 && (
        <p className="mt-8 text-ink/70">Pas encore de recommandations pour {property.city}.</p>
      )}
    </div>
  );
}
