"use client";

import { useState } from "react";
import TransfertForm from "./TransfertForm";
import CarnetPanel from "./CarnetPanel";
import CarteInteractive from "./CarteInteractive";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function WifiIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <path d="M3 8.5a14 14 0 0 1 18 0" />
      <path d="M6.5 12a9 9 0 0 1 11 0" />
      <path d="M9.5 15.5a4.5 4.5 0 0 1 5 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <path d="M5 4c-1 0-1.6.8-1.4 1.8C4.5 10.5 9.5 15.5 14.2 16.4c1 .2 1.8-.4 1.8-1.4v-2c0-.5-.4-1-.9-1.1l-2.6-.6c-.4-.1-.9 0-1.1.4l-.8 1.2A11 11 0 0 1 6.9 9.4l1.2-.8c.4-.3.5-.7.4-1.1L8 4.9C7.9 4.4 7.4 4 6.9 4H5z" />
    </svg>
  );
}

function ParkingIcon() {
  return <span className="text-2xl font-bold leading-none md:text-base">P</span>;
}

function CarIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <path d="M4 16V11l2-4h12l2 4v5" />
      <path d="M4 16h16" />
      <circle cx="7.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 9l-2 6-6 2 2-6 6-2z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <path d="M12 21s-6.5-6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function RulesIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5v-15z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4L18 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg {...iconProps} className="h-full w-full">
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5v-13z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-4 w-4">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.4.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm5.9 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5.2.5.8 1.9.8 2 .1.2.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1.2.1 1.6.8 1.9.9.3.1.5.2.6.3.1.2.1.9-.1 1.6z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    </svg>
  );
}

// Choisit un nombre de colonnes (4 à 6) qui remplit la dernière rangée le
// mieux possible pour N tuiles, plutôt qu'un nombre fixe qui laisse parfois
// une rangée finale à moitié vide (ex. 10 tuiles sur 6 colonnes → 6 puis 4).
function bestColumns(n) {
  if (n <= 4) return Math.max(n, 1);
  let best = 6;
  let bestFullness = -1;
  for (const c of [6, 5, 4]) {
    const remainder = n % c;
    const fullness = remainder === 0 ? 1 : remainder / c;
    if (fullness > bestFullness) {
      best = c;
      bestFullness = fullness;
    }
  }
  return best;
}

function whatsappHref(phone) {
  const digits = (phone || "").replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
  if (digits.replace("+", "").length < 8) return null;
  return `https://wa.me/${digits.replace("+", "")}`;
}

export default function LivretMenu({ property, slug }) {
  const [active, setActive] = useState(null);
  const [copied, setCopied] = useState(false);

  const infoItems = [
    { key: "wifi", label: "Wifi", icon: <WifiIcon />, detail: `${property.wifi_ssid} · ${property.wifi_password}` },
    {
      key: "horaires",
      label: "Horaires",
      icon: <ClockIcon />,
      detail: `Arrivée ${property.checkin.toLowerCase()} · Départ ${property.checkout.toLowerCase()}`,
    },
    { key: "parking", label: "Stationnement", icon: <ParkingIcon />, detail: property.parking },
    {
      key: "contact",
      label: "Contact",
      icon: <PhoneIcon />,
      detail: [property.contact_name || property.contact, property.contact_phone].filter(Boolean).join(" · "),
    },
    ...(property.house_rules
      ? [{ key: "rules", label: "Règles", icon: <RulesIcon />, detail: property.house_rules }]
      : []),
    ...(property.waste_instructions || property.waste_photo
      ? [{ key: "basuras", label: "Poubelles", icon: <TrashIcon />, detail: property.waste_instructions }]
      : []),
    ...(property.general_info
      ? [{ key: "info", label: "Informations", icon: <InfoIcon />, detail: property.general_info }]
      : []),
  ];

  const navItems = [
    { key: "transfert", label: "Réserver un transfert", icon: <CarIcon /> },
    { key: "tours", label: "Tours", icon: <CompassIcon /> },
    { key: "carte", label: "Carte locale", icon: <PinIcon /> },
    { key: "carnet", label: "Livre d'or", icon: <BookIcon /> },
  ];

  const tiles = [...infoItems, ...navItems];
  const activeItem = tiles.find((i) => i.key === active);
  const isNav = navItems.some((i) => i.key === active);
  const cols = bestColumns(tiles.length);
  const wideFillers = tiles.length % cols === 0 ? 0 : cols - (tiles.length % cols);
  const whatsapp = whatsappHref(property.contact_phone);

  function close() {
    setActive(null);
    setCopied(false);
  }

  async function copyWifiPassword() {
    try {
      await navigator.clipboard.writeText(property.wifi_password || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible (permissions navigateur) : on ignore silencieusement.
    }
  }

  return (
    <div>
      <div
        className="grid grid-cols-2 gap-4 sm:gap-3 tile-grid-wide"
        style={{ "--tile-cols": cols }}
      >
        {tiles.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActive(item.key)}
              className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl text-center transition-colors md:gap-1.5 md:rounded-xl md:border md:shadow-sm ${
                isActive
                  ? "bg-terracotta-deep text-sand-card md:border-terracotta md:bg-terracotta/10 md:text-ink"
                  : "bg-terracotta text-sand-card md:border-sand-dim md:bg-sand-card md:text-ink md:hover:border-terracotta/60"
              }`}
            >
              <span className="h-9 w-9 md:h-6 md:w-6">{item.icon}</span>
              <span className="text-sm font-bold uppercase leading-tight tracking-wide md:text-[11px]">
                {item.label}
              </span>
            </button>
          );
        })}
        {tiles.length % 2 !== 0 && <div aria-hidden="true" className="aspect-square sm:hidden" />}
        {Array.from({ length: wideFillers }).map((_, i) => (
          <div key={`filler-${i}`} aria-hidden="true" className="hidden aspect-square sm:block" />
        ))}
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6">
          <div
            className="sheet-backdrop absolute inset-0 bg-[#12202a]/60 backdrop-blur-sm"
            onClick={close}
          />
          <div className="sheet-panel relative z-10 max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-sand-card p-6 shadow-2xl sm:max-w-md sm:rounded-3xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-sand-card">
                  <span className="h-5 w-5">{activeItem.icon}</span>
                </span>
                <span className="font-display italic text-xl text-ink">{activeItem.label}</span>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Fermer"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors hover:bg-sand hover:text-ink"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-4">
              {!isNav && (
                <>
                  {activeItem.detail && <p className="text-ink">{activeItem.detail}</p>}

                  {active === "wifi" && property.wifi_password && (
                    <button
                      type="button"
                      onClick={copyWifiPassword}
                      className="mt-3 inline-flex items-center gap-2 rounded border border-aqua-deep px-4 py-2 text-sm font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card"
                    >
                      <CopyIcon />
                      {copied ? "Copié !" : "Copier le mot de passe"}
                    </button>
                  )}

                  {active === "contact" && whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                    >
                      <WhatsAppIcon />
                      Écrire sur WhatsApp
                    </a>
                  )}

                  {active === "basuras" && property.waste_photo && (
                    <div className="mt-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={property.waste_photo}
                        alt=""
                        className="h-40 w-full rounded object-cover border border-sand-dim"
                      />
                    </div>
                  )}

                  {active === "horaires" &&
                    (property.key_instructions || property.key_lockbox_code || property.key_photos?.length > 0) && (
                      <div className="mt-4 border-t border-sand-dim pt-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                          Récupération des clés
                        </span>
                        {property.key_instructions && (
                          <p className="mt-2 text-ink">{property.key_instructions}</p>
                        )}
                        {property.key_lockbox_code && (
                          <p className="mt-2 text-ink">
                            Code d&apos;accès :{" "}
                            <span className="font-bold tracking-widest">{property.key_lockbox_code}</span>
                          </p>
                        )}
                        {property.key_photos?.length > 0 && (
                          <div className="mt-3 flex gap-2 overflow-x-auto">
                            {property.key_photos.map((url) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={url}
                                src={url}
                                alt=""
                                className="h-24 w-24 shrink-0 rounded object-cover border border-sand-dim"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                </>
              )}

              {isNav && (
                <>
                  {active === "transfert" && <TransfertForm slug={slug} propertyName={property.name} />}
                  {active === "tours" && (
                    <div className="rounded border border-sand-dim bg-sand p-5">
                      <p className="text-ink">
                        La réservation de tours et d&apos;activités arrive bientôt — le partenaire est en cours de
                        configuration.
                      </p>
                    </div>
                  )}
                  {active === "carte" && (
                    <CarteInteractive property={property} />
                  )}
                  {active === "carnet" && <CarnetPanel slug={slug} />}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
