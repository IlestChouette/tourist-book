"use client";

import { use, useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import { resizeImage } from "@/lib/uploadMedia";

// Récupère la signature dessinée sur le canvas sous forme de Blob PNG, ou
// null si rien n'a été dessiné — évite d'envoyer un canvas vide comme signature.
function getSignatureBlob(canvas, hasDrawn) {
  if (!hasDrawn) return Promise.resolve(null);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export default function CheckinPage({ params }) {
  const { token } = use(params);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", documentNumber: "", nationality: "" });
  const [idDocument, setIdDocument] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [consent, setConsent] = useState(false);
  const [houseRulesAccepted, setHouseRulesAccepted] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);

  function startDrawing(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    drawingRef.current = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  function draw(e) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#141413";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  }

  function stopDrawing() {
    drawingRef.current = false;
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }

  useEffect(() => {
    fetch(`/api/checkin/${token}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setReservation(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!idDocument || !selfie) {
      setError("Ajoute ta pièce d'identité et un selfie pour continuer.");
      return;
    }
    if (!hasSignature) {
      setError("Signe dans le cadre prévu pour continuer.");
      return;
    }
    if (reservation.houseRules && houseRulesAccepted === null) {
      setError("Indique si tu acceptes le règlement intérieur pour continuer.");
      return;
    }
    if (!consent) {
      setError("Tu dois autoriser l'envoi de tes documents pour continuer.");
      return;
    }
    setSending(true);
    setError("");

    let data;
    try {
      const [resizedDocument, resizedSelfie, signatureBlob] = await Promise.all([
        resizeImage(idDocument),
        resizeImage(selfie),
        getSignatureBlob(canvasRef.current, hasSignature),
      ]);

      const formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("documentNumber", form.documentNumber);
      formData.append("nationality", form.nationality);
      formData.append("idDocument", resizedDocument);
      formData.append("selfie", resizedSelfie);
      formData.append("signature", signatureBlob, "signature.png");
      if (reservation.houseRules) {
        formData.append("houseRulesAccepted", houseRulesAccepted ? "true" : "false");
      }

      const res = await fetch(`/api/checkin/${token}`, { method: "POST", body: formData });

      try {
        data = await res.json();
      } catch {
        throw new Error(
          "Impossible d'envoyer le check-in (les photos sont peut-être trop lourdes). Essaie avec d'autres photos."
        );
      }

      if (!res.ok) {
        throw new Error(data.error || "Impossible de terminer le check-in.");
      }
    } catch (err) {
      setSending(false);
      setError(err.message);
      return;
    }

    setSending(false);
    setResult(data);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-14">
        <p className="text-ink/60">Chargement…</p>
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-14">
        <p className="text-ink">Lien de check-in invalide.</p>
      </main>
    );
  }

  if (result) {
    return (
      <main className="flex-1">
        <Hero eyebrow="Check-in" title="C'est fait !" />
        <section className="mx-auto max-w-2xl px-6 py-10">
          <div className="rounded border border-sand-dim bg-sand-card p-5">
            <p className="text-ink">
              Ton check-in a bien été enregistré. L&apos;hôtelier va vérifier tes documents, mais tu peux déjà
              accéder au livret de ton logement.
            </p>
            <p className="mt-4 text-sm text-ink/70">
              Note bien ces identifiants — ils te permettront de retrouver le livret depuis un autre
              appareil, ou si tu reviens plus tard sur ce lien :
            </p>
            <p className="mt-1 text-ink">
              Identifiant : <span className="font-bold">{result.username}</span>
            </p>
            <p className="text-ink">
              Mot de passe : <span className="font-bold">{result.password}</span>
            </p>
            <p className="mt-3 text-xs text-ink/60">
              Pour te reconnecter plus tard, ouvre le lien de ton livret et choisis « Déjà fait ton
              check-in ? »
            </p>
          </div>
          <a
            href={`/logement/${result.slug}`}
            className="mt-6 inline-block rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
          >
            Aller au livret →
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <Hero
        eyebrow={reservation.propertyName}
        title={`Bienvenue, ${reservation.guestName}`}
        subtitle={`Arrivée le ${reservation.arrivalDate} · Départ le ${reservation.departureDate}`}
        logo={reservation.hostLogoUrl}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Prénom</span>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Nom</span>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="input"
              />
            </label>
          </div>
          <span className="-mt-2 text-xs text-ink/60">Exactement comme sur ta pièce d&apos;identité.</span>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Téléphone</span>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="input"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="input"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
                N° de passeport / carte d&apos;identité
              </span>
              <input
                required
                value={form.documentNumber}
                onChange={(e) => setForm((f) => ({ ...f, documentNumber: e.target.value }))}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Nationalité</span>
              <input
                required
                value={form.nationality}
                onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))}
                className="input"
              />
            </label>
          </div>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">
              Pièce d&apos;identité (carte d&apos;identité ou passeport)
            </span>
            <input
              required
              type="file"
              accept="image/*"
              onChange={(e) => setIdDocument(e.target.files?.[0] ?? null)}
            />
            <span className="text-xs text-ink/60">
              Le document doit être au nom de <strong>{reservation.guestName}</strong>, le même nom que la
              réservation.
            </span>
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Selfie</span>
            <input required type="file" accept="image/*" onChange={(e) => setSelfie(e.target.files?.[0] ?? null)} />
            <span className="text-xs text-ink/60">
              Prends une photo de toi maintenant — elle sert uniquement à vérifier que le document est bien le
              tien.
            </span>
          </label>

          <div className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Signature</span>
            <canvas
              ref={canvasRef}
              width={500}
              height={150}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              className="w-full touch-none rounded border border-sand-dim bg-sand-card"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink/60">Signe avec ton doigt ou ta souris dans le cadre ci-dessus.</span>
              <button
                type="button"
                onClick={clearSignature}
                className="text-xs font-bold text-aqua-deep underline underline-offset-2"
              >
                Effacer
              </button>
            </div>
          </div>

          {reservation.houseRules && (
            <div className="grid gap-3 rounded border border-sand-dim bg-sand-card p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Règlement intérieur</span>
              <p className="whitespace-pre-line text-sm text-ink/80">{reservation.houseRules}</p>
              <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    name="houseRulesAccepted"
                    checked={houseRulesAccepted === true}
                    onChange={() => setHouseRulesAccepted(true)}
                  />
                  J&apos;accepte ce règlement intérieur
                </label>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    name="houseRulesAccepted"
                    checked={houseRulesAccepted === false}
                    onChange={() => setHouseRulesAccepted(false)}
                  />
                  Je n&apos;accepte pas ce règlement intérieur
                </label>
              </div>
            </div>
          )}

          <label className="flex items-start gap-2 text-sm text-ink/80">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1"
            />
            <span>
              J&apos;autorise l&apos;envoi de mes documents à l&apos;hôte pour vérification, et leur conservation
              sécurisée le temps de mon séjour.
            </span>
          </label>

          <button
            type="submit"
            disabled={sending}
            className="mt-2 rounded bg-terracotta px-5 py-4 text-center font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {sending ? "Envoi…" : "Terminer le check-in →"}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        </form>
      </section>
    </main>
  );
}
