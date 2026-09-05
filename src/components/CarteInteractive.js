"use client";

import { useState } from "react";

const categories = [
  { key: "visiter", label: "Zone à visiter", query: "lieux touristiques" },
  { key: "restaurant", label: "Restaurant", query: "restaurants" },
  { key: "shopping", label: "Shopping", query: "shopping" },
  { key: "mobilite", label: "Mobilité", query: "transports en commun" },
  { key: "toilettes", label: "Toilettes publiques", query: "toilettes publiques" },
];

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function CategoryIcon({ label }) {
  switch (label) {
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

// Une adresse seule ("12 rue de la République") est ambiguë pour Google Maps
// sans la ville ni le code postal — ça ne pose pas de problème pour une rue
// mondialement connue, mais pour une adresse normale, ça retombe souvent sur
// une vue large (toute la France) au lieu de localiser le logement.
function fullAddress(property) {
  return [property.address, property.postal_code, property.city].filter(Boolean).join(", ");
}

export default function CarteInteractive({ property }) {
  const address = fullAddress(property);
  const [selected, setSelected] = useState({ name: property.name, mapsQuery: address });
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  function resetToProperty() {
    setActiveCategory(null);
    setSearchResult(null);
    setSelected({ name: property.name, mapsQuery: address });
  }

  function selectCategory(cat) {
    setActiveCategory(cat.key);
    setSearchResult(null);
    setSelected({ name: cat.label, mapsQuery: `${cat.query} près de ${address}` });
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    setActiveCategory(null);
    const mapsQuery = `${query} près de ${address}`;
    setSelected({ name: query, mapsQuery });
    setSearchResult({ name: query, mapsQuery });
  }

  return (
    <div>
      <div className="overflow-hidden rounded border border-sand-dim">
        <iframe
          key={selected.mapsQuery}
          title={`Carte — ${selected.name}`}
          src={`https://www.google.com/maps?q=${encodeURIComponent(selected.mapsQuery)}&output=embed`}
          className="h-72 w-full sm:h-96"
          loading="lazy"
        />
      </div>
      <p className="mt-2 text-sm text-ink/60">
        Sur la carte : <span className="font-bold text-ink">{selected.name}</span>
      </p>

      <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            const v = e.target.value;
            setSearch(v);
            if (!v) setSearchResult(null);
          }}
          placeholder="Rechercher un lieu (restaurant, plage, musée…)"
          className="input flex-1"
        />
        <button
          type="submit"
          className="shrink-0 rounded bg-terracotta px-5 py-2.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
        >
          Rechercher
        </button>
      </form>
      <p className="mt-1.5 text-xs text-ink/50">
        Tape un lieu et appuie sur « Rechercher », ou choisis une catégorie ci-dessous — la carte
        cherche toujours à proximité immédiate du logement.
      </p>

      {searchResult && (
        <div className="mt-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-terracotta">
            Résultat de recherche
          </h2>
          <div className="mt-3 rounded border border-terracotta bg-sand-card p-4">
            <span className="block font-bold text-ink">{searchResult.name}</span>
            <span className="block text-sm text-ink/70">Recherché près du logement</span>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(searchResult.mapsQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-bold uppercase tracking-wider text-aqua-deep"
            >
              Itinéraire →
            </a>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4">
        <button type="button" onClick={resetToProperty} className="flex w-16 flex-col items-center gap-1.5 text-center">
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${
              activeCategory === null
                ? "border-terracotta bg-terracotta text-ink"
                : "border-sand-dim bg-sand-card text-ink/70"
            }`}
          >
            <CategoryIcon label="Tout" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wide text-ink/70">Logement</span>
        </button>

        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => selectCategory(cat)}
            className="flex w-16 flex-col items-center gap-1.5 text-center"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors ${
                activeCategory === cat.key
                  ? "border-terracotta bg-terracotta text-ink"
                  : "border-sand-dim bg-sand-card text-ink/70"
              }`}
            >
              <CategoryIcon label={cat.label} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink/70">
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {selected.mapsQuery !== address && (
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selected.mapsQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-xs font-bold uppercase tracking-wider text-aqua-deep"
        >
          Itinéraire →
        </a>
      )}
    </div>
  );
}
