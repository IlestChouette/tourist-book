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
  star: <path d="M12 4l2.4 5 5.4.7-4 3.8 1 5.4L12 16.3 7.2 18.9l1-5.4-4-3.8 5.4-.7L12 4z" />,
  tool: <path d="M15 5a4 4 0 0 0-3.8 5.3L5 16.5 7.5 19l6.2-6.2A4 4 0 0 0 19 9l-2.5 2.5-2.5-2.5L16.5 6.5 15 5z" />,
  bed: <path d="M3 18V7M3 15h18v3M21 15v-3a3 3 0 0 0-3-3h-7v6" />,
  linge: <path d="M8 3l-5 4 3 3 2-1.5V21h8V8.5L18 10l3-3-5-4a4 4 0 0 1-8 0z" />,
  key: <path d="M8 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 12l9-9M16 7l3 3" />,
  bell: <path d="M6 17v-6a6 6 0 0 1 12 0v6l1.5 2h-15L6 17zM10 21h4" />,
  food: <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1.5-3 4-3 7h3v11" />,
  phone: <path d="M6 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15 15 0 0 1 4 6a2 2 0 0 1 2-2z" />,
  calendar: <path d="M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM4 10h16M9 4v4M15 4v4" />,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  drop: <path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z" />,
  bolt: <path d="M13 3 5 13h6l-1 8 8-10h-6l1-8z" />,
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.5 3.5-5.5 7-5.5s6.3 2 7 5.5" /></>,
};
