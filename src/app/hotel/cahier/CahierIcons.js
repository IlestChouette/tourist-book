// Icônes du cahier : un seul trait (1.75), toujours accompagnées d'un mot.
export function Icon({ name, className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}

const PATHS = {
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>,
  tache: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  probleme: <><path d="M12 4 3 19.5h18L12 4Z" /><path d="M12 10v4.5" /><path d="M12 17.5h.01" /></>,
  plainte: <><path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" /><path d="M8.5 9.5h7" /><path d="M8.5 12.5h4" /></>,
  pin: <><path d="M9 4h6l-1 5 3 3v1.5H7V12l3-3-1-5Z" /><path d="M12 13.5V20" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  back: <><path d="m14 6-6 6 6 6" /></>,
  next: <><path d="m10 6 6 6-6 6" /></>,
  close: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
  print: <><path d="M7 9V4h10v5" /><rect x="4" y="9" width="16" height="8" rx="2" /><path d="M7 14h10v6H7z" /></>,
  download: <><path d="M12 4v10" /><path d="m8 11 4 4 4-4" /><path d="M5 19h14" /></>,
  delete: <><path d="M21 5H9l-6 7 6 7h12V5Z" /><path d="m13 9 4 6" /><path d="m17 9-4 6" /></>,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.5 3.5-5.5 7-5.5s6.3 2 7 5.5" /></>,
};
