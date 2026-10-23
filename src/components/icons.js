const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function WifiIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M3 8.5a14 14 0 0 1 18 0" />
      <path d="M6.5 12a9 9 0 0 1 11 0" />
      <path d="M9.5 15.5a4.5 4.5 0 0 1 5 0" />
      <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CompassIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 9l-2 6-6 2 2-6 6-2z" />
    </svg>
  );
}

export function CarIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 16V11l2-4h12l2 4v5" />
      <path d="M4 16h16" />
      <circle cx="7.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="16.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChatIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H10l-4.5 4v-4H5.5A1.5 1.5 0 0 1 4 14.5v-9z" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M12 3.5l7 2.6v5.4c0 4.5-2.9 7.5-7 9-4.1-1.5-7-4.5-7-9V6.1l7-2.6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function LogoIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5v-13z" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7.5l8 6 8-6" />
    </svg>
  );
}

export function UsersIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M16.5 14.2c2.3.2 4 1.6 4.5 4.3" />
    </svg>
  );
}

export function MoonIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" />
    </svg>
  );
}

export function PartyIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M4 20l4-11 7 7-11 4z" />
      <path d="M13 4.5v2.5M18.5 6.5l-1.8 1.8M19.5 12H17" />
    </svg>
  );
}

export function PawIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <circle cx="7" cy="10" r="1.6" />
      <circle cx="11" cy="6.5" r="1.6" />
      <circle cx="16" cy="7" r="1.6" />
      <circle cx="19" cy="11.5" r="1.6" />
      <path d="M8.5 17.5c0-3 2.2-5 4-5s4.5 2 4.5 5c0 1.8-1.6 2.5-3 2.2-1-.2-1.5-.2-2.5 0-1.5.3-3-.4-3-2.2z" />
    </svg>
  );
}

export function SmokeIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <path d="M3 16h13v3H3z" />
      <path d="M19 16v3M16 16v3" />
      <path d="M18 4c-1.5 1.5 1.5 2.5 0 4M14 5c-1 1 1 2 0 3.5" />
    </svg>
  );
}

export function CameraIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M8 7l1.5-2.5h5L16 7" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

export function KeyIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <circle cx="8" cy="15" r="3.5" />
      <path d="M10.5 12.5L20 3M16 7l3 3M13.5 9.5l2 2" />
    </svg>
  );
}

export function CalendarIcon() {
  return (
    <svg {...iconProps} width="22" height="22">
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M4 10h16M9 3.5v4M15 3.5v4" />
    </svg>
  );
}
