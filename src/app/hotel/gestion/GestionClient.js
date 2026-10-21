"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { uploadMedia } from "@/lib/uploadMedia";
import { ThemePicker, TypesEditor } from "./AppearanceEditors";
import { ServicesEditor } from "./ServicesEditor";
import ServiceAccounts from "./ServiceAccounts";
import RetentionNotice from "@/components/RetentionNotice";

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

// Lien privé et QR code des femmes de chambre (module Objets trouvés).
function LostFoundLink({ token, busy, onRegen }) {
  const [qr, setQr] = useState(null);
  const [copied, setCopied] = useState(false);
  const url = token ? `${window.location.origin}/trouve/${token}` : null;

  async function showQr() {
    setQr(await QRCode.toDataURL(url, { width: 360, margin: 2 }));
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // presse-papiers indisponible : le lien reste affiché et sélectionnable
    }
  }

  if (!token) {
    return <button type="button" disabled={busy} onClick={onRegen} className={btn}>Générer le lien</button>;
  }
  return (
    <div>
      <input readOnly value={url} onFocus={(e) => e.target.select()} className="input h-11 w-full" aria-label="Lien privé des femmes de chambre" />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copy} className={btnGhost}>{copied ? "Copié !" : "Copier le lien"}</button>
        <button type="button" onClick={showQr} className={btnGhost}>Afficher le QR code</button>
        <button type="button" disabled={busy} onClick={() => window.confirm("L'ancien lien ne fonctionnera plus. Continuer ?") && onRegen()} className={btnGhost}>Régénérer le lien</button>
      </div>
      {qr && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt="QR code du lien" className="mt-4 h-44 w-44 rounded border border-sand-dim" />
      )}
    </div>
  );
}

// Le lien du cahier pour l'équipe et le code d'activation d'un nouvel appareil.
function TeamLink({ cahierPath, services }) {
  const [pickedService, setServiceId] = useState("");
  // Toujours un service choisi (le premier par défaut) : plus de poste « tout l'hôtel ».
  const serviceId = services.some((s) => s.id === pickedService) ? pickedService : services[0]?.id ?? "";
  const [url, setUrl] = useState(cahierPath);
  const [qr, setQr] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activation, setActivation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function copy() {
    const full = `${window.location.origin}${cahierPath}`;
    setUrl(full);
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // presse-papiers indisponible : le lien reste affiché
    }
  }
  async function showQr() {
    setQr(await QRCode.toDataURL(`${window.location.origin}${cahierPath}`, { width: 360, margin: 2 }));
  }
  async function newCode() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/hotel/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create_activation_code", serviceId }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error || "Impossible de créer le code.");
    setActivation({ code: data.code, minutes: data.expiresInMinutes });
  }

  return (
    <div>
      <input readOnly value={url.startsWith("/") && typeof window !== "undefined" ? `${window.location.origin}${url}` : url} onFocus={(e) => e.target.select()} className="input h-11 w-full" aria-label="Lien du cahier pour votre équipe" />
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copy} className={btnGhost}>{copied ? "Copié !" : "Copier le lien"}</button>
        <button type="button" onClick={showQr} className={btnGhost}>Afficher le QR code</button>
        {services.length > 0 && (
          <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} aria-label="Service de l'appareil" className="input h-10">
            {services.map((s) => <option key={s.id} value={s.id}>Cahier : {s.name}</option>)}
          </select>
        )}
        <button type="button" disabled={busy || services.length === 0} onClick={newCode} className={btn}>Ajouter un appareil (code)</button>
        {services.length === 0 && <p className="basis-full text-sm text-ink/60">Choisissez d'abord vos services (carte « Services ») : chaque appareil ouvre le cahier d'un service.</p>}
      </div>
      {error && <p className="mt-3 text-sm font-bold text-terracotta-deep" role="alert">{error}</p>}
      {activation && (
        <div className="mt-4 rounded-xl border-2 border-aqua-deep bg-sand p-5 text-center">
          <p className="text-sm text-ink/70">Sur le nouvel appareil, ouvrez le lien ci-dessus et tapez ce code :</p>
          <p className="mt-2 font-display text-5xl italic tracking-[0.2em] text-ink tabular-nums">{activation.code}</p>
          <p className="mt-2 text-sm text-ink/60">Valable {activation.minutes} minutes, utilisable une seule fois.</p>
        </div>
      )}
      {qr && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={qr} alt="QR code du lien du cahier" className="mt-4 h-44 w-44 rounded border border-sand-dim" />
      )}
    </div>
  );
}

const SERVICE_PRICE = 15;
// Postes proposés d'un clic quand l'hôtel ne les a pas encore ; les autres se créent librement.
const SUGGESTED_ROLES = ["manager", "directeur", "chef de service", "premier de réception"];

// Abonnement : 15 €/mois par service, sans mois d'essai.
function BillingCard({ billing, servicesDirty = false }) {
  const [quantity, setQuantity] = useState(Math.max(1, billing.services || 1));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function go(path, body) {
    setBusy(true);
    setError("");
    const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      setBusy(false);
      return setError(data.error || "Une erreur est survenue. Réessayez.");
    }
    window.location.href = data.url;
  }

  if (billing.exempt) {
    return (
      <Card title="Abonnement" hint="Cet hôtel n'est pas facturé (démonstration).">
        <p className="rounded-lg bg-aqua-deep/10 px-4 py-3 font-bold text-aqua-deep">Aucun paiement à effectuer.</p>
      </Card>
    );
  }
  if (billing.status === "active") {
    return (
      <Card title="Abonnement" hint={`${billing.services} service${billing.services > 1 ? "s" : ""} · ${billing.services * SERVICE_PRICE} € par mois`}>
        <p className="rounded-lg bg-aqua-deep/10 px-4 py-3 font-bold text-aqua-deep">
          Abonnement actif{billing.periodEnd ? ` · prochain paiement le ${new Date(billing.periodEnd).toLocaleDateString("fr-FR")}` : ""}
        </p>
        <p className="mt-3 text-sm text-ink/70">Résiliable à tout moment, sans frais : le cahier reste actif jusqu'à la fin du mois payé.</p>
        <p className="mt-2 rounded border border-sand-dim bg-sand-card p-3 text-sm text-ink/80">
          <strong>Avant de résilier, faites une copie.</strong> Trois mois après la fin de l'abonnement, toutes les données du cahier sont supprimées définitivement ; vous êtes prévenu par email un mois avant. Téléchargez vos consignes depuis{" "}
          <Link href="/hotel/suivi" className="font-bold text-aqua-deep underline">Suivi (Télécharger pour Excel)</Link>.
        </p>
        <button type="button" disabled={busy} onClick={() => go("/api/hotel/billing/portal")} className={`${btnGhost} mt-4`}>Gérer mon abonnement, résilier, mes factures</button>
        {error && <p className="mt-3 text-sm font-bold text-terracotta-deep" role="alert">{error}</p>}
      </Card>
    );
  }
  const pastDue = billing.status === "past_due";
  return (
    <div className="mt-6 rounded border-2 border-terracotta-deep bg-sand-card p-5">
      <h2 className="font-display italic text-2xl text-ink">{pastDue ? "Paiement à régulariser" : "Activez votre abonnement"}</h2>
      <p className="mt-1 text-sm text-ink/70">
        {pastDue
          ? "Le dernier paiement a échoué. Mettez à jour votre carte pour que le cahier reste accessible à vos équipes."
          : "Le cahier s'ouvre à vos équipes dès le paiement. 15 € par mois et par service (réception, conciergerie, technique…), sans mois d'essai. Résiliable à tout moment : le cahier reste actif jusqu'à la fin du mois payé."}
      </p>
      {pastDue ? (
        <button type="button" disabled={busy} onClick={() => go("/api/hotel/billing/portal")} className={`${btn} mt-4`}>Mettre à jour le paiement</button>
      ) : (
        <div className="mt-4 flex flex-wrap items-end gap-4">
          {billing.managed ? (
            <p className="pb-2 text-lg font-bold text-ink">
              {billing.planned} service{billing.planned > 1 ? "s" : ""} · {billing.planned * SERVICE_PRICE} € par mois
              <span className="block text-sm font-normal text-ink/60">Les services se choisissent dans la carte « Services » plus haut.</span>
            </p>
          ) : (
            <>
              <label className="grid gap-1.5">
                <span className={label}>Nombre de services</span>
                <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="input h-11 w-28">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <p className="pb-2 text-lg font-bold text-ink">{quantity * SERVICE_PRICE} € par mois</p>
            </>
          )}
          <button type="button" disabled={busy || (billing.managed && (servicesDirty || billing.planned === 0))} onClick={() => go("/api/hotel/billing/checkout", { quantity })} className={btn}>Payer et activer</button>
          {billing.managed && (servicesDirty || billing.planned === 0) && (
            <p className="basis-full text-sm font-bold text-terracotta-deep">
              {servicesDirty ? "Enregistrez d'abord vos services (carte « Services » plus haut)." : "Choisissez d'abord vos services dans la carte « Services » plus haut."}
            </p>
          )}
        </div>
      )}
      {error && <p className="mt-3 text-sm font-bold text-terracotta-deep" role="alert">{error}</p>}
    </div>
  );
}

export default function GestionClient({ userId, hotel, tags, places, staff, stations, lostFound, cahierPath, billing, appearance, servicesInfo, hotelServices = [], serviceAccounts = null, supervisorsEnabled = false, retention = null }) {
  const [pickedStationService, setStationService] = useState("");
  const stationService = hotelServices.some((s) => s.id === pickedStationService) ? pickedStationService : hotelServices[0]?.id ?? "";
  const [servicesDirty, setServicesDirty] = useState(false);
  const serviceNameById = Object.fromEntries(hotelServices.map((s) => [s.id, s.name]));
  const router = useRouter();
  const [message, setMessage] = useState(null); // { text, error }
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(hotel.name);
  const [emails, setEmails] = useState(hotel.emails.join("\n"));
  const [replyTo, setReplyTo] = useState(hotel.replyTo ?? "");
  const [managerPin, setManagerPin] = useState("");
  const [newStaff, setNewStaff] = useState({ name: "", pin: "", roleIds: [], serviceIds: [] });
  const [placesText, setPlacesText] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newRole, setNewRole] = useState("");
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
    if (data.notice) setMessage({ text: data.notice });
    else if (okText) setMessage({ text: okText });
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
    // Côté serveur : fiable même si le navigateur ne peut pas effacer la session.
    await fetch("/api/hotel/logout", { method: "POST" }).catch(() => {});
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
        hint={manager?.hasPin ? "Votre PIN est défini. Saisissez-en un nouveau pour le changer." : "Définissez votre PIN à 4 chiffres : il vous identifie quand vous utilisez un autre poste, par exemple celui de la réception ou d'un autre service."}
      >
        <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); call({ action: "set_manager_pin", pin: managerPin }, "PIN enregistré.").then((ok) => ok && setManagerPin("")); }}>
          <input required type="password" inputMode="numeric" maxLength={4} pattern="\d{4}" value={managerPin} onChange={(e) => setManagerPin(e.target.value.replace(/\D/g, ""))} className="input w-32 text-center text-xl tracking-[0.5em]" aria-label="PIN à 4 chiffres" />
          <button type="submit" disabled={busy || managerPin.length !== 4} className={btn}>Enregistrer le PIN</button>
        </form>
      </Card>

      <Card title="Équipe" hint="Chaque personne a un PIN à 4 chiffres et un ou plusieurs postes. Conseil : reprenez le code de votre badgeuse ou de votre contrôle d'accès (celui de l'arrivée et du départ), ou créez-le vous-même : avec un code existant, personne n'a un nouveau code à retenir. À l'écran, il est écrit « Essayez avec votre code de badgeuse ou de contrôle d'accès : celui de votre arrivée et de votre départ ». Désactiver quelqu'un bloque son PIN ; ce qu'il a écrit reste dans le cahier.">
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
              {hotelServices.length > 0 && (
                <div className="mt-3 border-t border-sand-dim pt-3">
                  <span className={label}>Services (consignes à valider par tous)</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {hotelServices.map((sv) => {
                      const on = (s.service_ids ?? []).includes(sv.id);
                      return (
                        <button key={sv.id} type="button" disabled={busy} aria-pressed={on} onClick={() => call({ action: "update_staff", id: s.id, serviceIds: toggleRole(s.service_ids ?? [], sv.id) })} className={`rounded-full border px-3 py-1 text-sm font-bold ${on ? "border-ink bg-ink text-sand" : "border-sand-dim text-ink/60"}`}>
                          {sv.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {supervisorsEnabled && hotelServices.length > 0 && (
                <div className="mt-3 border-t border-sand-dim pt-3">
                  <button type="button" disabled={busy} aria-pressed={s.is_supervisor} onClick={() => call({ action: "update_staff", id: s.id, supervisor: !s.is_supervisor }, s.is_supervisor ? "Ce n'est plus un responsable." : "Responsable enregistré.")} className={`rounded-full border px-3 py-1 text-sm font-bold ${s.is_supervisor ? "border-terracotta-deep bg-terracotta-deep text-sand-card" : "border-sand-dim text-ink/60"}`}>
                    {s.is_supervisor ? "Responsable de ses services ✓" : "Nommer responsable de ses services"}
                  </button>
                  <p className="mt-1 text-sm text-ink/60">Avec son code personnel, un responsable voit qui a écrit et qui a validé les consignes des services cochés ci-dessus, et seulement ceux-là.</p>
                </div>
              )}
            </li>
          ))}
          {staff.filter((s) => !s.is_manager).length === 0 && <li className="text-sm text-ink/60">Personne pour l'instant.</li>}
        </ul>

        <form className="mt-5 grid gap-3 border-t border-sand-dim pt-4" onSubmit={(e) => { e.preventDefault(); call({ action: "add_staff", ...newStaff }, "Personne ajoutée.").then((ok) => ok && setNewStaff({ name: "", pin: "", roleIds: [], serviceIds: [] })); }}>
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
            {SUGGESTED_ROLES.filter((n) => !roles.some((r) => r.name.toLowerCase() === n)).map((n) => (
              <button key={n} type="button" disabled={busy} onClick={() => call({ action: "add_tag", kind: "role", name: n }, "Poste ajouté.")} className="rounded-full border border-dashed border-ink/40 px-3 py-1 text-sm font-bold text-ink/70 hover:border-ink">
                + {n}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input value={newRole} onChange={(e) => setNewRole(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (newRole.trim()) call({ action: "add_tag", kind: "role", name: newRole }, "Poste ajouté.").then((ok) => ok && setNewRole("")); } }} maxLength={40} placeholder="Un autre poste : serveur, cuisinier, barista…" className="input h-10 min-w-0 flex-1" aria-label="Nouveau poste" />
            <button type="button" disabled={busy || !newRole.trim()} onClick={() => call({ action: "add_tag", kind: "role", name: newRole }, "Poste ajouté.").then((ok) => ok && setNewRole(""))} className={btnGhost}>Ajouter ce poste</button>
          </div>
          {hotelServices.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {hotelServices.map((sv) => (
                <button key={sv.id} type="button" aria-pressed={newStaff.serviceIds.includes(sv.id)} onClick={() => setNewStaff({ ...newStaff, serviceIds: toggleRole(newStaff.serviceIds, sv.id) })} className={`rounded-full border px-3 py-1 text-sm font-bold ${newStaff.serviceIds.includes(sv.id) ? "border-ink bg-ink text-sand" : "border-sand-dim text-ink/60"}`}>
                  Service : {sv.name}
                </button>
              ))}
            </div>
          )}
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

      {servicesInfo && (
        <Card title="Services" hint="Chaque service est facturé 15 € par mois. Cochez ceux qui utilisent le cahier : vous pouvez en ajouter ou en retirer à tout moment.">
          <ServicesEditor
            selected={servicesInfo.selected}
            initialCustom={servicesInfo.custom}
            onDirtyChange={setServicesDirty}
            price={SERVICE_PRICE}
            subscribed={billing?.status === "active" && !billing?.exempt}
            busy={busy}
            onSave={(services, customServices) => call({ action: "set_services", services, customServices }, "Services enregistrés.")}
          />
        </Card>
      )}

      {serviceAccounts && hotelServices.length > 0 && (
        <Card title="Accès des services" hint="Pour chaque service : un email et un mot de passe, ou simplement un lien envoyé par email (sans mot de passe). La personne se connecte sur la page de connexion de l'hôtel et l'ordinateur ouvre directement le cahier de son service (jusqu'à 3 services par ordinateur, sans retaper le mot de passe). Chacun signe ensuite avec son code personnel. L'email doit être nouveau : il ne peut pas déjà avoir un compte Tourist Book.">
          <ServiceAccounts services={hotelServices} accounts={serviceAccounts} busy={busy} call={call} />
        </Card>
      )}

      {appearance && (
        <>
          <Card title="Couleur du cahier" hint="Le fond et la couleur du bouton « Écrire une consigne » pour toute l'équipe. Les palettes sont choisies pour rester lisibles à toute heure.">
            <ThemePicker value={appearance.theme} busy={busy} onPick={(theme) => call({ action: "set_theme", theme }, "Couleur enregistrée.")} />
          </Card>
          <Card title="Types de consigne" hint="Retrouvez ici tous vos types : modifiez-les, désactivez-les ou supprimez-les. Ajoutez les vôtres (client VIP, lingerie, maintenance…) avec une icône et une couleur ; ils s'ajoutent aux quatre types d'origine.">
            <TypesEditor key={JSON.stringify(appearance.types)} initial={appearance.types} busy={busy} onSave={(types) => call({ action: "set_types", types }, "Types enregistrés.")} />
          </Card>
        </>
      )}

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
        {hotel.replyTo !== null && (
          <form className="mt-5 grid gap-3 border-t border-sand-dim pt-4" onSubmit={(e) => { e.preventDefault(); call({ action: "set_reply_to", email: replyTo }, "Adresse enregistrée."); }}>
            <label className="grid gap-1.5">
              <span className={label}>Adresse de réponse (email officiel de l'hôtel)</span>
              <input type="email" value={replyTo} onChange={(e) => setReplyTo(e.target.value)} placeholder="reception@votrehotel.com" className="input" />
            </label>
            <p className="text-xs text-ink/50">Les emails de relève s'affichent au nom de votre hôtel. Si quelqu'un y répond, la réponse arrive à cette adresse.</p>
            <button type="submit" disabled={busy} className={`${btn} w-fit`}>Enregistrer</button>
          </form>
        )}
      </Card>

      {lostFound && (
        <Card title="Objets trouvés — lien des femmes de chambre" hint="Chaque femme de chambre garde ce lien dans son téléphone (ou vous collez le QR code sur le chariot). Sans mot de passe ni PIN, il ne permet que d'ajouter un objet : jamais de lire le registre. Si le lien est diffusé par erreur, régénérez-le.">
          <LostFoundLink token={lostFound.token} busy={busy} onRegen={() => call({ action: "regen_lost_found_token" }, "Lien généré.")} />
        </Card>
      )}

      <Card title="Le lien du cahier pour votre équipe" hint="Ce lien est propre à votre hôtel : mettez-le en favori sur chaque ordinateur ou tablette. Un nouvel appareil doit être activé une fois avec un code à 6 chiffres, que vous générez ici. Sans code, le lien ne montre rien.">
        <TeamLink cahierPath={cahierPath} services={hotelServices} />
      </Card>

      <Card title="Postes de réception" hint="Appareils déjà activés. Vous pouvez aussi activer l'ordinateur sur lequel vous êtes connecté, sans code : puis déconnectez-vous du compte manager.">
        <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); call({ action: "activate_station", label: stationLabel, serviceId: stationService }, "Ce poste est activé. Déconnectez-vous du compte manager pour le laisser à l'équipe."); }}>
          <label className="grid gap-1.5">
            <span className={label}>Nom du poste</span>
            <input value={stationLabel} onChange={(e) => setStationLabel(e.target.value)} className="input" />
          </label>
          {hotelServices.length > 0 && (
            <label className="grid gap-1.5">
              <span className={label}>Cahier</span>
              <select value={stationService} onChange={(e) => setStationService(e.target.value)} className="input">
                {hotelServices.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
          )}
          <button type="submit" disabled={busy || hotelServices.length === 0} className={btn}>Activer cet ordinateur</button>
        </form>
        {stations.length > 0 && (
          <ul className="mt-4 grid gap-2">
            {stations.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded border border-sand-dim p-3 text-sm">
                <span><strong className="text-ink">{s.label}</strong>{s.service_id && <span className="ml-2 rounded bg-ink px-2 py-0.5 text-xs font-bold uppercase text-sand">{serviceNameById[s.service_id] ?? "Service"}</span>} <span className="text-ink/50">· activé le {new Date(s.created_at).toLocaleDateString("fr-FR")}</span></span>
                <button type="button" disabled={busy} className={btnGhost} onClick={() => window.confirm("Désactiver ce poste ? Il ne pourra plus ouvrir le cahier.") && call({ action: "delete_station", id: s.id })}>Désactiver</button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {retention && (
        <Card title="Conservation des données" hint="Vos consignes restent consultables et exportables pendant toute cette durée. Ce délai est fixe.">
          <RetentionNotice info={retention} />
        </Card>
      )}

      {billing && <BillingCard billing={billing} servicesDirty={servicesDirty} />}
    </div>
  );
}
