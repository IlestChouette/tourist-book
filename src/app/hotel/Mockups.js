import { Icon } from "./cahier/CahierIcons";

// Aperçus du produit, dessinés en HTML : fidèles à l'écran réel (mêmes mots,
// mêmes boutons) avec un hôtel d'exemple. Décoratifs pour les lecteurs
// d'écran : le texte de la page décrit déjà tout.
const device = "rounded-[2.2rem] bg-ink p-3 shadow-[0_30px_60px_-20px_rgba(18,32,42,0.6)]";

export function TabletMockup({ className = "" }) {
  return (
    <div aria-hidden="true" className={`${device} ${className}`}>
      <div className="overflow-hidden rounded-[1.6rem] bg-sand-card">
        <div className="flex items-center justify-between bg-aqua px-5 py-3">
          <span className="whitespace-nowrap font-display italic text-xl text-ink">Hôtel Les Mimosas</span>
          <span className="hidden gap-2 text-[10px] font-bold uppercase tracking-widest text-ink/60 sm:flex">
            <span className="rounded-full bg-sand-card/80 px-2.5 py-1">Statistiques</span>
            <span className="rounded-full bg-sand-card/80 px-2.5 py-1">Gestion</span>
          </span>
        </div>
        <div className="px-5 pb-6 pt-4">
          <p className="text-2xl font-bold text-ink">Aujourd'hui</p>
          <p className="text-sm text-ink/60">Mardi 6 octobre 2026</p>
          <p className="mt-1 text-base font-bold text-ink">Il reste 3 choses à faire.</p>
          <div className="mt-3 flex h-14 items-center justify-center gap-3 rounded-2xl bg-terracotta text-lg font-bold text-ink">
            <Icon name="plus" className="h-6 w-6" /> Écrire une consigne
          </div>

          <p className="mt-4 text-lg font-bold text-ink">À faire <span className="text-ink/50">(3)</span></p>
          {[
            { room: "214", kind: "Problème", tone: "bg-terracotta/30 text-terracotta-deep", flag: "Urgent", text: "Fuite sous le lavabo. Prévenir le technicien dès 8 h.", time: "08:42" },
            { room: "Lobby", kind: "À faire", tone: "bg-ink/[0.08] text-ink", flag: "Pas fait depuis 2 jours", text: "Changer l'ampoule du couloir du 2e étage.", time: "22:10" },
          ].map((c) => (
            <div key={c.room} className={`mt-3 rounded-2xl border-2 bg-sand p-3 ${c.flag ? "border-terracotta-deep" : "border-sand-dim"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-ink px-2 py-0.5 text-base font-bold text-sand">{c.room}</span>
                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${c.tone}`}>{c.kind}</span>
                <span className="rounded-lg bg-terracotta-deep px-2 py-0.5 text-xs font-bold text-sand-card">{c.flag}</span>
                <span className="ml-auto text-xs tabular-nums text-ink/50">{c.time}</span>
              </div>
              <p className="mt-2 text-base text-ink">{c.text}</p>
              <span className="mt-2 inline-flex h-10 items-center gap-2 rounded-xl bg-aqua-deep px-4 text-sm font-bold text-sand-card">
                <Icon name="check" className="h-5 w-5" /> C'est fait
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const phone = "mx-auto w-full max-w-[17rem] rounded-[2.2rem] bg-ink p-2.5 shadow-[0_24px_48px_-20px_rgba(18,32,42,0.55)]";
const phoneInner = "overflow-hidden rounded-[1.7rem] bg-sand-card";

export function PhoneKind() {
  return (
    <div aria-hidden="true" className={phone}>
      <div className={`${phoneInner} px-4 pb-5 pt-4`}>
        <p className="text-xs font-bold text-ink/50">Étape 1 sur 5</p>
        <p className="mt-2 text-xl font-bold leading-tight text-ink">Que voulez-vous signaler ?</p>
        <div className="mt-3 grid gap-2">
          {[
            ["info", "Une information"],
            ["tache", "Quelque chose à faire"],
            ["probleme", "Un problème"],
            ["plainte", "Une plainte client"],
          ].map(([icon, label], i) => (
            <span key={icon} className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-bold ${i === 2 ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim bg-sand text-ink"}`}>
              <Icon name={icon} className="h-5 w-5 shrink-0" /> {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PhonePin() {
  return (
    <div aria-hidden="true" className={phone}>
      <div className={`${phoneInner} px-4 pb-5 pt-4`}>
        <p className="text-center text-lg font-bold leading-tight text-ink">Votre code personnel</p>
        <p className="mt-1 text-center text-xs text-ink/60">Essayez avec votre code de la badgeuse.</p>
        <div className="mt-3 flex justify-center gap-3">
          {[1, 1, 0, 0].map((on, i) => (
            <span key={i} className={`h-3.5 w-3.5 rounded-full border-2 border-ink ${on ? "bg-ink" : ""}`} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((k, i) => (
            <span key={i} className={`flex h-10 items-center justify-center rounded-xl text-lg font-bold ${k ? "border-2 border-sand-dim bg-sand text-ink" : ""}`}>{k}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EmailMockup() {
  return (
    <div aria-hidden="true" className="mx-auto w-full max-w-[19rem] rounded-2xl border border-sand-dim bg-white p-4 text-left shadow-[0_20px_40px_-24px_rgba(18,32,42,0.5)]">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink/40">Reçu à 06:55</p>
      <p className="mt-1 text-sm font-bold text-ink">Cahier de consignes — relève de 6h55 : 3 en attente</p>
      <div className="mt-3 grid gap-2 text-xs text-ink/80">
        <p><strong className="text-terracotta-deep">PRIORITAIRE · 214 · Problème</strong><br />Fuite sous le lavabo. Prévenir le technicien dès 8 h.</p>
        <p><strong className="text-terracotta-deep">PRIORITAIRE · ouverte depuis 2 j · Lobby</strong><br />Changer l'ampoule du couloir du 2e étage.</p>
        <p><strong>Spa · Information</strong><br />Fermé lundi : prévenir les clients.</p>
      </div>
      <p className="mt-3 text-[11px] text-ink/50">+ le PDF des consignes d'hier en pièce jointe</p>
    </div>
  );
}

export function StatsMockup({ className = "" }) {
  const rows = [
    ["214", 5],
    ["118", 4],
    ["305", 3],
    ["402", 2],
  ];
  return (
    <div aria-hidden="true" className={`rounded-2xl border border-sand-dim bg-white p-5 shadow-[0_20px_40px_-24px_rgba(18,32,42,0.5)] ${className}`}>
      <p className="text-sm font-bold text-ink">Chambres les plus touchées</p>
      <p className="text-xs text-ink/50">Problèmes et plaintes · 30 derniers jours</p>
      <div className="mt-4 grid gap-3">
        {rows.map(([room, n]) => (
          <div key={room} className="grid grid-cols-[3rem_1fr_1.5rem] items-center gap-3 text-sm">
            <span className="font-bold text-ink">{room}</span>
            <span className="h-4 rounded-r-[4px] bg-[#0a8f87]" style={{ width: `${(n / 5) * 100}%` }} />
            <span className="tabular-nums text-ink/70">{n}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-terracotta/25 px-3 py-2 text-xs font-bold text-terracotta-deep">
        Chambre 214 : récurrent · 4e fois en 90 jours (fuite)
      </p>
    </div>
  );
}
