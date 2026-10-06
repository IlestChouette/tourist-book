"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { uploadMedia } from "@/lib/uploadMedia";

const label = "text-xs font-bold uppercase tracking-wider text-ink/60";
const btn = "rounded bg-aqua-deep px-4 py-2 text-sm font-bold text-sand-card hover:bg-aqua-deep/90 disabled:opacity-60";
const btnGhost = "rounded border border-sand-dim px-3 py-1.5 text-sm font-bold text-ink/70 hover:border-aqua-deep";

function Card({ title, hint, children }) {
  return (
    <div className="mt-6 rounded border border-sand-dim bg-sand-card p-5">
      <h2 className="font-display italic text-2xl text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink/60">{hint}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function GestionClient({ userId, hotel, tags, places, staff, stations }) {
  const router = useRouter();
  const [message, setMessage] = useState(null); // { text, error }
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(hotel.name);
  const [emails, setEmails] = useState(hotel.emails.join("\n"));
  const [managerPin, setManagerPin] = useState("");
  const [newStaff, setNewStaff] = useState({ name: "", pin: "", roleIds: [] });
  const [placesText, setPlacesText] = useState("");
  const [newTag, setNewTag] = useState("");
  const [stationLabel, setStationLabel] = useState("Réception");

  const manager = staff.find((s) => s.is_manager);
  const roles = tags.filter((t) => t.kind === "role" || t.kind === "custom");
  const rooms = places.filter((p) => p.kind === "room");

  async function call(body, okText) {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/hotel/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMessage({ text: data.error || "Une erreur est survenue.", error: true });
      return false;
    }
    if (okText) setMessage({ text: okText });
    router.refresh();
    return true;
  }

  async function handleLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const url = await uploadMedia(`${userId}/hotel-logo.${ext}`, file);
      await call({ action: "update_hotel", logoUrl: `${url}?v=${Date.now()}` }, "Logo enregistré.");
    } catch (err) {
      setMessage({ text: err.message, error: true });
      setBusy(false);
    }
  }

  async function logout() {
    await createClient().auth.signOut();
    window.location.href = "/hotel";
  }

  const toggleRole = (current, id) => (current.includes(id) ? current.filter((r) => r !== id) : [...current, id]);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Link href="/hotel/cahier" className="rounded bg-terracotta px-5 py-3 font-bold text-ink hover:bg-terracotta-deep">
          Ouvrir le cahier →
        </Link>
        <Link href="/hotel/statistiques" className="rounded border border-aqua-deep px-5 py-3 font-bold text-aqua-deep hover:bg-aqua-deep hover:text-sand-card">
          Statistiques
        </Link>
        <button type="button" onClick={logout} className={`${btnGhost} px-5 py-3`}>Se déconnecter</button>
      </div>

      {message && (
        <p className={`mt-4 rounded border p-3 text-sm font-bold ${message.error ? "border-terracotta-deep text-terracotta-deep" : "border-aqua-deep text-aqua-deep"}`} role="status">
          {message.text}
        </p>
      )}

      <Card title="Votre hôtel" hint="Le logo apparaît en haut du cahier.">
        <div className="flex flex-wrap items-center gap-4">
          {hotel.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hotel.logoUrl} alt="Logo" className="h-20 w-20 rounded border border-sand-dim bg-sand object-contain" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded border border-dashed border-sand-dim text-xs text-ink/50">Pas de logo</div>
          )}
          <input type="file" accept="image/*" onChange={handleLogo} disabled={busy} />
        </div>
        <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); call({ action: "update_hotel", name }, "Nom enregistré."); }}>
          <label className="grid gap-1.5">
            <span className={label}>Nom de l'hôtel</span>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="input" />
          </label>
          <button type="submit" disabled={busy} className={btn}>Enregistrer</button>
        </form>
      </Card>

      <Card
        title="Votre PIN"
        hint={manager?.hasPin ? "Votre PIN est défini. Saisissez-en un nouveau pour le changer." : "Définissez votre PIN à 4 chiffres : il vous identifie quand vous utilisez le poste de réception."}
      >
        <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); call({ action: "set_manager_pin", pin: managerPin }, "PIN enregistré.").then((ok) => ok && setManagerPin("")); }}>
          <input required type="password" inputMode="numeric" maxLength={4} pattern="\d{4}" value={managerPin} onChange={(e) => setManagerPin(e.target.value.replace(/\D/g, ""))} className="input w-32 text-center text-xl tracking-[0.5em]" aria-label="PIN à 4 chiffres" />
          <button type="submit" disabled={busy || managerPin.length !== 4} className={btn}>Enregistrer le PIN</button>
        </form>
      </Card>

      <Card title="Équipe" hint="Chaque personne a un PIN à 4 chiffres (ce peut être le même que celui de Skello) et un ou plusieurs postes. Désactiver quelqu'un bloque son PIN ; ce qu'il a écrit reste dans le cahier.">
        <ul className="grid gap-3">
          {staff.filter((s) => !s.is_manager).map((s) => (
            <li key={s.id} className={`rounded border border-sand-dim p-3 ${s.active ? "" : "opacity-60"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-ink">{s.name}{!s.active && " (désactivé)"}</strong>
                <div className="flex gap-2">
                  <button type="button" disabled={busy} className={btnGhost} onClick={() => { const pin = window.prompt(`Nouveau PIN à 4 chiffres pour ${s.name} :`); if (pin) call({ action: "update_staff", id: s.id, pin }, "PIN modifié."); }}>
                    Changer le PIN
                  </button>
                  <button type="button" disabled={busy} className={btnGhost} onClick={() => call({ action: "update_staff", id: s.id, active: !s.active })}>
                    {s.active ? "Désactiver" : "Réactiver"}
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {roles.map((r) => (
                  <button key={r.id} type="button" disabled={busy} onClick={() => call({ action: "update_staff", id: s.id, roleIds: toggleRole(s.role_ids, r.id) })} className={`rounded-full border px-3 py-1 text-sm font-bold ${s.role_ids.includes(r.id) ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim text-ink/60"}`}>
                    {r.name}
                  </button>
                ))}
              </div>
            </li>
          ))}
          {staff.filter((s) => !s.is_manager).length === 0 && <li className="text-sm text-ink/60">Personne pour l'instant.</li>}
        </ul>

        <form className="mt-5 grid gap-3 border-t border-sand-dim pt-4" onSubmit={(e) => { e.preventDefault(); call({ action: "add_staff", ...newStaff }, "Personne ajoutée.").then((ok) => ok && setNewStaff({ name: "", pin: "", roleIds: [] })); }}>
          <div className="flex flex-wrap gap-3">
            <label className="grid gap-1.5">
              <span className={label}>Nom</span>
              <input required value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} className="input" />
            </label>
            <label className="grid gap-1.5">
              <span className={label}>PIN</span>
              <input required type="password" inputMode="numeric" maxLength={4} pattern="\d{4}" value={newStaff.pin} onChange={(e) => setNewStaff({ ...newStaff, pin: e.target.value.replace(/\D/g, "") })} className="input w-28 text-center tracking-[0.4em]" />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => (
              <button key={r.id} type="button" onClick={() => setNewStaff({ ...newStaff, roleIds: toggleRole(newStaff.roleIds, r.id) })} className={`rounded-full border px-3 py-1 text-sm font-bold ${newStaff.roleIds.includes(r.id) ? "border-aqua-deep bg-aqua-deep text-sand-card" : "border-sand-dim text-ink/60"}`}>
                {r.name}
              </button>
            ))}
          </div>
          <button type="submit" disabled={busy || newStaff.pin.length !== 4} className={`${btn} w-fit`}>Ajouter la personne</button>
        </form>
      </Card>

      <Card title="Chambres et lieux" hint="Les consignes se rattachent à une chambre ou à un lieu. Ajoutez des plages (101-135) ou des noms séparés par des virgules (Spa, Bar, Restaurant).">
        <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); call({ action: "add_places", text: placesText }, "Lieux ajoutés.").then((ok) => ok && setPlacesText("")); }}>
          <label className="grid flex-1 gap-1.5">
            <span className={label}>Ajouter</span>
            <input required value={placesText} onChange={(e) => setPlacesText(e.target.value)} placeholder="101-135, 201-240, Spa, Bar, Lobby" className="input" />
          </label>
          <button type="submit" disabled={busy} className={btn}>Ajouter</button>
        </form>
        <p className="mt-4 text-sm text-ink/70">
          <strong>{rooms.length}</strong> chambre{rooms.length > 1 ? "s" : ""}. Cliquez sur × pour en supprimer une seule.
        </p>
        <div className="mt-2 flex max-h-56 flex-wrap gap-2 overflow-y-auto rounded border border-sand-dim bg-sand p-3">
          {places.map((p) => (
            <span key={p.id} className="flex items-center gap-1 rounded-full border border-sand-dim bg-sand-card px-3 py-1 text-sm text-ink">
              {p.name}
              <button type="button" disabled={busy} aria-label={`Supprimer ${p.name}`} onClick={() => call({ action: "delete_place", id: p.id })} className="text-ink/40 hover:text-terracotta-deep">×</button>
            </span>
          ))}
          {places.length === 0 && <span className="text-sm text-ink/60">Aucune chambre ni lieu pour l'instant.</span>}
        </div>
        {rooms.length > 0 && (
          <button type="button" className={`${btnGhost} mt-3`} onClick={() => window.confirm("Supprimer toutes les chambres ?") && Promise.all(rooms.map((r) => fetch("/api/hotel/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete_place", id: r.id }) }))).then(() => router.refresh())}>
            Supprimer toutes les chambres
          </button>
        )}
      </Card>

      <Card title="Étiquettes" hint="Elles servent à dire à qui s'adresse une consigne (équipe du matin, du soir, de nuit, ou un poste).">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t.id} className="flex items-center gap-1 rounded-full border border-sand-dim px-3 py-1 text-sm text-ink">
              {t.name}
              <button type="button" aria-label={`Supprimer ${t.name}`} onClick={() => call({ action: "delete_tag", id: t.id })} className="text-ink/40 hover:text-terracotta-deep">×</button>
            </span>
          ))}
        </div>
        <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); call({ action: "add_tag", name: newTag }, "Étiquette ajoutée.").then((ok) => ok && setNewTag("")); }}>
          <input required value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Nouvelle étiquette" className="input" aria-label="Nouvelle étiquette" />
          <button type="submit" disabled={busy} className={btn}>Ajouter</button>
        </form>
      </Card>

      <Card title="Emails de relève" hint="Les consignes en attente sont envoyées à 6h55, 14h55 et 22h55 (heure de Paris) à ces adresses. À 6h55 le PDF de la veille est joint. Une adresse par ligne.">
        <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); call({ action: "set_emails", emails }, "Adresses enregistrées."); }}>
          <textarea rows={3} value={emails} onChange={(e) => setEmails(e.target.value)} className="input" aria-label="Adresses email" />
          <button type="submit" disabled={busy} className={`${btn} w-fit`}>Enregistrer</button>
        </form>
      </Card>

      <Card title="Postes de réception" hint="Sur l'ordinateur de la réception, activez le poste une seule fois : ensuite chacun s'identifie avec son PIN, sans mot de passe. Puis déconnectez-vous du compte manager sur cet ordinateur.">
        <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); call({ action: "activate_station", label: stationLabel }, "Ce poste est activé. Déconnectez-vous du compte manager pour le laisser à l'équipe."); }}>
          <label className="grid gap-1.5">
            <span className={label}>Nom du poste</span>
            <input value={stationLabel} onChange={(e) => setStationLabel(e.target.value)} className="input" />
          </label>
          <button type="submit" disabled={busy} className={btn}>Activer cet ordinateur</button>
        </form>
        {stations.length > 0 && (
          <ul className="mt-4 grid gap-2">
            {stations.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded border border-sand-dim p-3 text-sm">
                <span><strong className="text-ink">{s.label}</strong> <span className="text-ink/50">· activé le {new Date(s.created_at).toLocaleDateString("fr-FR")}</span></span>
                <button type="button" disabled={busy} className={btnGhost} onClick={() => window.confirm("Désactiver ce poste ? Il ne pourra plus ouvrir le cahier.") && call({ action: "delete_station", id: s.id })}>Désactiver</button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
