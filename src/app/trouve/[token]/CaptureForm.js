"use client";

import { useState } from "react";
import { resizeImage } from "@/lib/uploadMedia";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua-deep";
const label = "text-xs font-bold uppercase tracking-wider text-ink/60";

export default function CaptureForm({ token }) {
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  function pick(e) {
    const file = e.target.files?.[0];
    setPhoto(file ?? null);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return file ? URL.createObjectURL(file) : null;
    });
  }

  function reset() {
    setPhoto(null);
    setPreview(null);
    setRoom("");
    setDescription("");
    setDone(false);
    setError("");
  }

  async function submit(e) {
    e.preventDefault();
    if (!photo && !description.trim()) return setError("Ajoutez une photo ou écrivez de quoi il s'agit.");
    setBusy(true);
    setError("");
    const body = new FormData();
    body.append("token", token);
    body.append("room", room);
    body.append("description", description);
    if (photo) body.append("photo", await resizeImage(photo));
    try {
      const res = await fetch("/api/lost-found/capture", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Une erreur est survenue.");
      setDone(true);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="mt-8 rounded-2xl border border-sand-dim bg-sand p-8 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aqua-deep/10 text-aqua-deep">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
        </span>
        <p className="mt-4 text-xl font-bold text-ink">Enregistré, merci !</p>
        <p className="mt-1 text-sm text-ink/60">La gouvernante le voit tout de suite.</p>
        <button type="button" onClick={reset} className={`mt-6 h-14 w-full rounded-xl bg-terracotta text-base font-bold text-ink hover:bg-terracotta-deep ${focus}`}>Ajouter un autre objet</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 grid gap-5">
      <label className={`relative flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-aqua-deep bg-sand text-aqua-deep ${focus}`}>
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Photo de l'objet" className="h-56 w-full object-cover" />
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" /><circle cx="12" cy="13" r="3.5" /></svg>
            <span className="text-lg font-bold">Prendre une photo</span>
          </>
        )}
        <input type="file" accept="image/*" capture="environment" onChange={pick} className="sr-only" />
      </label>
      {preview && <p className="-mt-3 text-center text-sm text-ink/60">Touchez la photo pour la changer.</p>}

      <label className="grid gap-1.5">
        <span className={label}>Numéro de chambre (si vous le savez)</span>
        <input value={room} onChange={(e) => setRoom(e.target.value)} inputMode="text" autoComplete="off" placeholder="Ex : 214" className="input h-14 text-lg" />
      </label>
      <label className="grid gap-1.5">
        <span className={label}>C'est quoi ? (facultatif)</span>
        <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={500} placeholder="Ex : lunettes noires" className="input h-14 text-lg" />
      </label>

      {error && <p className="text-sm font-bold text-terracotta-deep" role="alert">{error}</p>}
      <button type="submit" disabled={busy} className={`h-14 rounded-xl bg-terracotta text-base font-bold text-ink hover:bg-terracotta-deep disabled:opacity-60 ${focus}`}>
        {busy ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
