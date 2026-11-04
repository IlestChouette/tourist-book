import { WifiIcon, CompassIcon, CarIcon, ChatIcon, ShieldIcon, KeyIcon, BookIcon, MailIcon } from "@/components/icons";

const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", width: 24, height: 24, "aria-hidden": true };

const PlayIcon = () => (<svg {...base}><circle cx="12" cy="12" r="9" /><path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor" /></svg>);
const MapIcon = () => (<svg {...base}><path d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z" /><circle cx="12" cy="11" r="2.2" /></svg>);
const IdIcon = () => (<svg {...base}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M6 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M14.5 10h3.5M14.5 13.5H18" /></svg>);
const LinkIcon = () => (<svg {...base}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></svg>);
const FileIcon = () => (<svg {...base}><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5M10 15l2 2 3.5-4" /></svg>);
const ScaleIcon = () => (<svg {...base}><path d="M12 4v16M7 20h10M5 8h14" /><path d="M5 8l-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z" /></svg>);
const LockIcon = () => (<svg {...base}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>);
const CheckIcon = () => (<svg {...base} width="16" height="16" strokeWidth="2.2"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);

export const ICONS = {
  play: PlayIcon, map: MapIcon, id: IdIcon, link: LinkIcon, file: FileIcon, scale: ScaleIcon, lock: LockIcon, check: CheckIcon,
  wifi: WifiIcon, compass: CompassIcon, car: CarIcon, chat: ChatIcon, shield: ShieldIcon, key: KeyIcon, book: BookIcon, mail: MailIcon,
};
export const Icon = ({ name }) => { const I = ICONS[name] ?? CheckIcon; return <I />; };

// L'écran du téléphone garde des couleurs fixes : le produit s'affiche pareil en mode clair et sombre.
const SCREEN = "#f7f1e4";
const INK = "#223339";

function Frame({ children, label }) {
  return (
    <figure className="mx-auto w-[264px] sm:w-[288px]" aria-label={label}>
      <div className="rounded-[2.4rem] bg-[#223339] p-[9px] shadow-[0_28px_50px_-18px_rgba(18,32,42,0.55)]">
        <div className="relative overflow-hidden rounded-[1.9rem]" style={{ background: SCREEN, color: INK }}>
          <div className="absolute left-1/2 top-2 h-[18px] w-[72px] -translate-x-1/2 rounded-full bg-[#223339]" />
          {children}
        </div>
      </div>
    </figure>
  );
}

export function LivretPhone() {
  const tiles = [
    { i: "wifi", l: "Wifi" }, { i: "key", l: "Clés", video: true }, { i: "compass", l: "Guide" },
    { i: "map", l: "Carte" }, { i: "book", l: "Règles" }, { i: "car", l: "Transfert" },
  ];
  return (
    <Frame label="Exemple de livret d'accueil sur un téléphone">
      <div className="bg-[#6fc7be] px-5 pb-5 pt-10">
        <p className="font-display text-[1.35rem] italic leading-tight">Villa Mimosa</p>
        <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest opacity-70">Bienvenue, Emma</p>
      </div>
      <div className="grid grid-cols-3 gap-2.5 px-4 pb-3 pt-4">
        {tiles.map((t) => (
          <div key={t.l} className="relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl bg-white text-[#2c7670] shadow-[0_1px_0_#e0d5bc]">
            <Icon name={t.i} />
            <span className="text-[11px] font-bold" style={{ color: INK }}>{t.l}</span>
            {t.video && <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#e2905f] text-[#223339]"><svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor" /></svg></span>}
          </div>
        ))}
      </div>
      <div className="mx-4 mb-4 flex items-center gap-2 rounded-xl bg-[#223339] px-3 py-2.5 text-[#f7f1e4]">
        <ChatIcon />
        <span className="text-[11px] font-bold">Une question ? Demandez à l'assistant</span>
      </div>
    </Frame>
  );
}

export function CheckinPhone() {
  const rows = [
    { l: "Pièce d'identité", done: true }, { l: "Selfie", done: true }, { l: "Signature", sign: true }, { l: "Règlement accepté", done: true },
  ];
  return (
    <Frame label="Exemple d'enregistrement voyageur sur un téléphone">
      <div className="bg-[#6fc7be] px-5 pb-5 pt-10">
        <p className="font-display text-[1.35rem] italic leading-tight">Votre check-in</p>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">{[0, 1, 2, 3].map((n) => <span key={n} className={`h-1.5 flex-1 rounded-full ${n < 3 ? "bg-[#223339]" : "bg-[#223339]/25"}`} />)}</div>
      </div>
      <ul className="grid gap-2 px-4 pt-4">
        {rows.map((r) => (
          <li key={r.l} className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-[13px] font-bold">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${r.done ? "bg-[#2c7670] text-white" : "border-2 border-dashed border-[#e2905f]"}`}>{r.done && <CheckIcon />}</span>
            <span className="flex-1">{r.l}</span>
            {r.sign && <svg viewBox="0 0 60 20" width="54" height="18" fill="none" stroke="#e2905f" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M2 14c6-12 9-12 9-2s4 6 8-3 6 4 10 2 5-7 8-1 8 1 12-4" /></svg>}
          </li>
        ))}
      </ul>
      <div className="px-4 pb-5 pt-3"><div className="rounded-xl bg-[#e2905f] py-3 text-center text-[13px] font-bold">Envoyer mon enregistrement</div></div>
    </Frame>
  );
}
