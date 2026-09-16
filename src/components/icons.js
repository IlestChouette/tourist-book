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
