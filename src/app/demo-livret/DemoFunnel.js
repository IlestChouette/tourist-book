"use client";

import { useEffect, useRef, useState } from "react";

// Vidéo d'explication, hébergée dans le bucket public « media » de Supabase (pas dans le dépôt :
// elle alourdirait chaque déploiement). Tant que le fichier n'y est pas, on affiche un message.
const VIDEO_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/demo/livret-demo.mp4`;

const QUESTIONS = [
  { q: "Combien de logements gérez-vous ?", options: ["1", "2 à 5", "6 à 20", "Plus de 20"] },
  { q: "Comment accueillez-vous vos voyageurs aujourd'hui ?", options: ["Un PDF ou des emails", "WhatsApp ou messages", "Un livret papier", "Rien de formel"] },
  { q: "Qu'est-ce qui vous ferait gagner le plus de temps ?", options: ["Les questions répétitives (wifi, horaires)", "Le check-in et les pièces d'identité", "La traduction pour les voyageurs étrangers", "Les transferts"] },
];

const label = "text-xs font-bold uppercase tracking-wider text-ink/60";

export default function DemoFunnel() {
  const [step, setStep] = useState(0); // 0..2 = questions, 3 = coordonnées, 4 = merci
  const [answers, setAnswers] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [videoOk, setVideoOk] = useState(true);
  const [source, setSource] = useState("");
  const top = useRef(null);

  // D'où vient le visiteur (pub, réseau social…) : paramètres utm_* et page de provenance.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign"].map((k) => p.get(k)).filter(Boolean).join(" / ");
    setSource([utm, document.referrer ? `depuis ${new URL(document.referrer).hostname}` : ""].filter(Boolean).join(" · "));
  }, []);

  function pick(option) {
    setAnswers((a) => [...a.slice(0, step), option]);
    setStep((s) => s + 1);
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/demo-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, answers, source }) }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setBusy(false);
    if (!res?.ok) return setError(data?.error || "Une erreur est survenue. Réessayez.");
    setStep(4);
    top.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-12">
        <h2 className="font-display italic text-3xl text-ink">Le livret en 2 minutes</h2>
        <div className="mt-5 overflow-hidden rounded-xl border border-sand-dim bg-sand-card">
          {videoOk ? (
            <video controls playsInline preload="metadata" className="aspect-video w-full bg-black">
              {/* l'erreur d'un fichier absent se déclenche sur <source>, pas sur <video> */}
              <source src={VIDEO_URL} type="video/mp4" onError={() => setVideoOk(false)} />
            </video>
          ) : (
            <div className="flex aspect-video items-center justify-center p-8 text-center text-ink/70">La vidéo arrive très bientôt. En attendant, réservez votre démonstration ci-dessous.</div>
          )}
        </div>
        <ul className="mt-6 grid gap-3 text-ink/80 sm:grid-cols-3">
          <li className="rounded-lg border border-sand-dim bg-sand-card p-4"><strong className="text-ink">Un lien, un QR code.</strong> Wifi, horaires, guide local, transfert, livre d&apos;or.</li>
          <li className="rounded-lg border border-sand-dim bg-sand-card p-4"><strong className="text-ink">En français, anglais, espagnol.</strong> Traduit automatiquement, à votre logo.</li>
          <li className="rounded-lg border border-sand-dim bg-sand-card p-4"><strong className="text-ink">Check-in avant l&apos;arrivée.</strong> Pièce d&apos;identité, signature, règlement accepté (offre Premium).</li>
        </ul>
      </section>

      <section ref={top} id="demo" className="mx-auto max-w-2xl px-6 pb-20">
        <div className="rounded-xl border border-sand-dim bg-sand-card p-6 sm:p-8">
          {step < 3 && (
            <>
              <p className={label}>Question {step + 1} sur 3</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-dim"><div className="h-full bg-terracotta transition-all" style={{ width: `${(step / 3) * 100}%` }} /></div>
              <h2 className="mt-5 font-display italic text-2xl text-ink">{QUESTIONS[step].q}</h2>
              <div className="mt-5 grid gap-3">
                {QUESTIONS[step].options.map((o) => (
                  <button key={o} type="button" onClick={() => pick(o)} className="rounded-lg border-2 border-sand-dim bg-sand px-4 py-3.5 text-left font-bold text-ink transition-colors hover:border-terracotta">{o}</button>
                ))}
              </div>
              {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="mt-5 text-sm font-bold text-ink/60 underline underline-offset-4">← Question précédente</button>}
            </>
          )}

          {step === 3 && (
            <form onSubmit={submit} className="grid gap-4">
              <h2 className="font-display italic text-2xl text-ink">Réserver une démonstration gratuite</h2>
              <p className="text-ink/70">Laissez vos coordonnées : on vous écrit pour fixer un moment qui vous convient. Sans engagement.</p>
              <label className="grid gap-1.5"><span className={label}>Nom</span><input required autoComplete="name" maxLength={120} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></label>
              <label className="grid gap-1.5"><span className={label}>Téléphone</span><input required type="tel" autoComplete="tel" maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" /></label>
              <label className="grid gap-1.5"><span className={label}>Email</span><input required type="email" autoComplete="email" maxLength={200} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></label>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" />
              {error && <p className="font-bold text-terracotta-deep" role="alert">{error}</p>}
              <button type="submit" disabled={busy} className="rounded bg-terracotta px-6 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60">{busy ? "Envoi…" : "Réserver ma démonstration gratuite →"}</button>
              <button type="button" onClick={() => setStep(2)} className="text-sm font-bold text-ink/60 underline underline-offset-4">← Question précédente</button>
            </form>
          )}

          {step === 4 && (
            <div className="text-center" role="status">
              <h2 className="font-display italic text-2xl text-ink">Merci, c&apos;est reçu !</h2>
              <p className="mt-3 text-ink/70">On vous écrit très vite pour fixer l&apos;heure de votre démonstration gratuite.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
