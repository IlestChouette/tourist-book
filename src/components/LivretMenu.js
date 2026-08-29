"use client";

import { useState } from "react";
import Link from "next/link";

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
    <svg {...iconProps} width="24" height="24">
      <path d="M3 8.5a14 14 0 0 1 18 0" />
      <path d="M6.5 12a9 9 0 0 1 11 0" />
      <path d="M9.5 15.5a4.5 4.5 0 0 1 5 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg {...iconProps} width="24" height="24">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg {...iconProps} width="24" height="24">
      <path d="M5 4c-1 0-1.6.8-1.4 1.8C4.5 10.5 9.5 15.5 14.2 16.4c1 .2 1.8-.4 1.8-1.4v-2c0-.5-.4-1-.9-1.1l-2.6-.6c-.4-.1-.9 0-1.1.4l-.8 1.2A11 11 0 0 1 6.9 9.4l1.2-.8c.4-.3.5-.7.4-1.1L8 4.9C7.9 4.4 7.4 4 6.9 4H5z" />
    </svg>
  );
}

function ParkingIcon() {
  return <span className="text-lg font-bold leading-none">P</span>;
}

function CarIcon() {
  return (
    <svg {...iconProps} width="24" height="24">
      <path d="M4 16V11l2-4h12l2 4v5" />
      <path d="M4 16h16" />
      <circle cx="7.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg {...iconProps} width="24" height="24">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 9l-2 6-6 2 2-6 6-2z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg {...iconProps} width="24" height="24">
      <path d="M12 21s-6.5-6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg {...iconProps} width="24" height="24">
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5v-13z" />
    </svg>
  );
}

export default function LivretMenu({ property, slug }) {
  const [active, setActive] = useState(null);

  const infoItems = [
    { key: "wifi", label: "Wifi", icon: <WifiIcon />, detail: `${property.wifi_ssid} · ${property.wifi_password}` },
    {
      key: "horaires",
      label: "Horaires",
      icon: <ClockIcon />,
      detail: `Arrivée ${property.checkin.toLowerCase()} · Départ ${property.checkout.toLowerCase()}`,
    },
    { key: "parking", label: "Stationnement", icon: <ParkingIcon />, detail: property.parking },
    { key: "contact", label: "Contact", icon: <PhoneIcon />, detail: property.contact },
  ];

  const navItems = [
    { key: "transfert", label: "Transfert", icon: <CarIcon />, href: `/logement/${slug}/transfert` },
    { key: "tours", label: "Tours", icon: <CompassIcon />, href: `/logement/${slug}/tours` },
    { key: "carte", label: "Carte locale", icon: <PinIcon />, href: `/logement/${slug}/carte` },
    { key: "carnet", label: "Carnet", icon: <BookIcon />, href: `/logement/${slug}/carnet` },
  ];

  const activeInfo = infoItems.find((i) => i.key === active);

  return (
    <div>
      <div className="grid grid-cols-4 gap-x-3 gap-y-6">
        {infoItems.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setActive(active === item.key ? null : item.key)}
            className="flex flex-col items-center gap-2 text-center"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-colors ${
                active === item.key ? "bg-terracotta" : "bg-aqua-deep"
              } text-sand-card`}
            >
              {item.icon}
            </span>
            <span className="text-[11px] font-bold uppercase leading-tight tracking-wide text-ink/70">
              {item.label}
            </span>
          </button>
        ))}

        {navItems.map((item) => (
          <Link key={item.key} href={item.href} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-ink">
              {item.icon}
            </span>
            <span className="text-[11px] font-bold uppercase leading-tight tracking-wide text-ink/70">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {activeInfo && (
        <div className="mt-6 rounded border border-sand-dim bg-sand-card p-4">
          <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{activeInfo.label}</span>
          <p className="mt-1 text-ink">{activeInfo.detail}</p>
        </div>
      )}
    </div>
  );
}
