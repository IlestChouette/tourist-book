"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./CahierIcons";

const key =
  "flex h-16 w-full items-center justify-center rounded-2xl border-2 border-sand-dim bg-sand text-3xl font-bold text-ink transition active:scale-95 active:bg-sand-card focus-visible:outline focus-visible:outline-4 focus-visible:outline-aqua-deep";

// Clavier numérique à l'écran, pensé pour le doigt : 4 chiffres, aucune touche
// « valider » — dès le 4e chiffre le code part. Fonctionne aussi avec le
// clavier de l'ordinateur.
export default function PinPad({ onComplete, busy = false, message = "" }) {
  const [digits, setDigits] = useState("");
  const complete = useRef(onComplete);
  complete.current = onComplete;

  // Un code complet part une seule fois. Le garde « submitted » évite qu'un
  // changement de `busy` (fin de la requête) renvoie le même code en boucle, ce
  // qui épuiserait les essais autorisés.
  const submitted = useRef(false);
  useEffect(() => {
    if (digits.length < 4) {
      submitted.current = false;
      return;
    }
    if (submitted.current || busy) return;
    submitted.current = true;
    complete.current(digits);
    setTimeout(() => setDigits(""), 350);
  }, [digits, busy]);

  useEffect(() => {
    function onKey(e) {
      if (/^\d$/.test(e.key)) setDigits((d) => (d.length < 4 ? d + e.key : d));
      else if (e.key === "Backspace") setDigits((d) => d.slice(0, -1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const press = (n) => setDigits((d) => (d.length < 4 ? d + n : d));

  return (
    <div className="mx-auto w-full max-w-xs">
      <div className="flex justify-center gap-4" role="img" aria-label={`${digits.length} chiffre${digits.length > 1 ? "s" : ""} sur 4`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-5 w-5 rounded-full border-2 border-ink ${i < digits.length ? "bg-ink" : "bg-transparent"}`} />
        ))}
      </div>
      <p className="mt-4 min-h-7 text-center text-lg font-bold text-terracotta-deep" role="alert">
        {message}
      </p>
      <div className="mt-2 grid grid-cols-3 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} type="button" disabled={busy} onClick={() => press(String(n))} className={key} aria-label={String(n)}>
            {n}
          </button>
        ))}
        <span />
        <button type="button" disabled={busy} onClick={() => press("0")} className={key} aria-label="0">0</button>
        <button type="button" disabled={busy} onClick={() => setDigits((d) => d.slice(0, -1))} className={`${key} text-ink/70`} aria-label="Effacer le dernier chiffre">
          <Icon name="delete" className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
