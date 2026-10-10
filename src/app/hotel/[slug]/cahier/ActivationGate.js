"use client";

import Link from "next/link";
import { useState } from "react";
import PinPad from "../../cahier/PinPad";

// Écran d'un poste pas encore activé : un code à 6 chiffres donné par le
// manager (valable 10 minutes, utilisable une fois), sur le même clavier que le
// code personnel.
export default function ActivationGate({ slug, hotelName, logoUrl }) {
  const [digits, setDigits] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(code) {
    setBusy(true);
    setError("");
    const res = await fetch("/api/hotel/activate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, code }) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      window.location.reload();
      return;
    }
    setError(data.error || "Une erreur est survenue. Réessayez.");
    setBusy(false);
  }

  return (
    <main className="flex-1 bg-sand-card/50">
      <header className="bg-aqua">
        <div className="mx-auto flex max-w-xl items-center gap-4 px-6 py-5">
          {logoUrl && (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#f7f1e4]/60 bg-[#f7f1e4] p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="" className="h-full w-full object-contain" />
            </span>
          )}
          <span className="font-display italic text-3xl text-ink">{hotelName}</span>
        </div>
      </header>
      <section className="mx-auto max-w-xl px-6 py-10 text-center">
        <h1 className="text-3xl font-bold text-ink">Activer cet appareil</h1>
        <p className="mt-3 text-xl text-ink/75">Demandez à votre manager le code d'activation à 6 chiffres, puis tapez-le ici.</p>
        <div className="mt-8">
          <SixDigits busy={busy} message={error} onChange={setDigits} onComplete={submit} digits={digits} />
        </div>
        <p className="mt-10 text-lg text-ink/60">
          Vous êtes le manager ?{" "}
          <Link href="/hotel/connexion" className="font-bold text-aqua-deep underline underline-offset-4">Connectez-vous</Link>
        </p>
      </section>
    </main>
  );
}

// Même principe que le clavier du code personnel, mais 6 chiffres.
function SixDigits({ busy, message, onComplete }) {
  return <PinPad length={6} busy={busy} message={message} onComplete={onComplete} />;
}
