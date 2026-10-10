"use client";

import { use, useEffect, useRef, useState } from "react";
import Hero from "@/components/Hero";
import FormattedText from "@/components/FormattedText";
import { resizeImage } from "@/lib/uploadMedia";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const LANGS = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
];

// Récupère la signature dessinée sur le canvas sous forme de Blob PNG, ou
// null si rien n'a été dessiné — évite d'envoyer un canvas vide comme signature.
function getSignatureBlob(canvas, hasDrawn) {
  if (!hasDrawn) return Promise.resolve(null);
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

const content = {
  fr: {
    loading: "Chargement…",
    invalidLink: "Lien de check-in invalide.",
    welcome: (name) => `Bienvenue, ${name}`,
    stay: (arrival, departure) => `Arrivée le ${arrival} · Départ le ${departure}`,
    firstName: "Prénom",
    lastName: "Nom",
    nameHint: "Exactement comme sur ta pièce d'identité.",
    phone: "Téléphone",
    email: "Email",
    documentNumber: "N° de passeport / carte d'identité",
    nationality: "Nationalité",
    idDocument: "Pièce d'identité (carte d'identité ou passeport)",
    uploadIdDocument: "Télécharger la pièce d'identité →",
    idDocumentHint: (name) => `Le document doit être au nom de ${name}, le même nom que la réservation.`,
    selfie: "Selfie",
    takeSelfie: "Prendre le selfie →",
    selfieHint: "Prends une photo de toi maintenant — elle sert uniquement à vérifier que le document est bien le tien.",
    signature: "Signature",
    signatureHint1: "Signe avec ton doigt ou ta souris dans le cadre ci-dessus.",
    clear: "Effacer",
    signatureHint2: "Essaie de la faire ressemblante à celle de ta pièce d'identité, pour éviter un refus lors de la vérification.",
    houseRules: "Règlement intérieur",
    acceptRules: "J'accepte ce règlement intérieur",
    declineRules: "Je n'accepte pas ce règlement intérieur",
    consent: "J'autorise l'envoi de mes documents à l'hôte pour vérification, et leur conservation sécurisée le temps de mon séjour.",
    submitting: "Envoi…",
    submit: "Terminer le check-in →",
    errorMissingDocs: "Ajoute ta pièce d'identité et un selfie pour continuer.",
    errorMissingSignature: "Signe dans le cadre prévu pour continuer.",
    errorMissingRulesChoice: "Indique si tu acceptes le règlement intérieur pour continuer.",
    errorMissingConsent: "Tu dois autoriser l'envoi de tes documents pour continuer.",
    errorUploadFailed: "Impossible d'envoyer le check-in (les photos sont peut-être trop lourdes). Essaie avec d'autres photos.",
    errorGeneric: "Impossible de terminer le check-in.",
    doneEyebrow: "Check-in",
    doneTitle: "C'est fait !",
    doneText: "Ton check-in a bien été enregistré. L'hôtelier va vérifier tes documents, mais tu peux déjà accéder au livret de ton logement.",
    doneCredentialsHint: "Note bien ces identifiants — ils te permettront de retrouver le livret depuis un autre appareil, ou si tu reviens plus tard sur ce lien :",
    username: "Identifiant :",
    password: "Mot de passe :",
    doneReconnectHint: "Pour te reconnecter plus tard, ouvre le lien de ton livret et choisis « Déjà fait ton check-in ? »",
    goToLivret: "Aller au livret →",
  },
  en: {
    loading: "Loading…",
    invalidLink: "Invalid check-in link.",
    welcome: (name) => `Welcome, ${name}`,
    stay: (arrival, departure) => `Arrival on ${arrival} · Departure on ${departure}`,
    firstName: "First name",
    lastName: "Last name",
    nameHint: "Exactly as on your ID.",
    phone: "Phone",
    email: "Email",
    documentNumber: "Passport / ID card number",
    nationality: "Nationality",
    idDocument: "ID document (ID card or passport)",
    uploadIdDocument: "Upload ID document →",
    idDocumentHint: (name) => `The document must be under the name ${name}, the same name as the booking.`,
    selfie: "Selfie",
    takeSelfie: "Take a selfie →",
    selfieHint: "Take a photo of yourself now — it's only used to verify the document is really yours.",
    signature: "Signature",
    signatureHint1: "Sign with your finger or mouse in the box above.",
    clear: "Clear",
    signatureHint2: "Try to make it match the one on your ID, to avoid a rejection during verification.",
    houseRules: "House rules",
    acceptRules: "I accept these house rules",
    declineRules: "I do not accept these house rules",
    consent: "I authorize sending my documents to the host for verification, and their secure storage for the length of my stay.",
    submitting: "Sending…",
    submit: "Finish check-in →",
    errorMissingDocs: "Add your ID document and a selfie to continue.",
    errorMissingSignature: "Sign in the box provided to continue.",
    errorMissingRulesChoice: "Please indicate whether you accept the house rules to continue.",
    errorMissingConsent: "You must authorize sending your documents to continue.",
    errorUploadFailed: "Couldn't send the check-in (the photos might be too large). Try with different photos.",
    errorGeneric: "Couldn't finish the check-in.",
    doneEyebrow: "Check-in",
    doneTitle: "All done!",
    doneText: "Your check-in has been recorded. The host will verify your documents, but you can already access your livret.",
    doneCredentialsHint: "Keep these credentials — they'll let you find your livret again from another device, or if you come back to this link later:",
    username: "Username:",
    password: "Password:",
    doneReconnectHint: "To log back in later, open your livret's link and choose \"Already checked in?\"",
    goToLivret: "Go to livret →",
  },
  es: {
    loading: "Cargando…",
    invalidLink: "Enlace de check-in inválido.",
    welcome: (name) => `Bienvenido/a, ${name}`,
    stay: (arrival, departure) => `Llegada el ${arrival} · Salida el ${departure}`,
    firstName: "Nombre",
    lastName: "Apellido",
    nameHint: "Exactamente como en tu documento de identidad.",
    phone: "Teléfono",
    email: "Email",
    documentNumber: "N.º de pasaporte / DNI",
    nationality: "Nacionalidad",
    idDocument: "Documento de identidad (DNI o pasaporte)",
    uploadIdDocument: "Subir documento de identidad →",
    idDocumentHint: (name) => `El documento debe estar a nombre de ${name}, el mismo nombre de la reserva.`,
    selfie: "Selfie",
    takeSelfie: "Tomar selfie →",
    selfieHint: "Tómate una foto ahora — solo se usa para verificar que el documento es realmente tuyo.",
    signature: "Firma",
    signatureHint1: "Firma con el dedo o el mouse en el recuadro de arriba.",
    clear: "Borrar",
    signatureHint2: "Trata de que se parezca a la de tu documento de identidad, para evitar un rechazo en la verificación.",
    houseRules: "Reglas del alojamiento",
    acceptRules: "Acepto estas reglas del alojamiento",
    declineRules: "No acepto estas reglas del alojamiento",
    consent: "Autorizo el envío de mis documentos al anfitrión para su verificación, y su conservación segura durante mi estancia.",
    submitting: "Enviando…",
    submit: "Terminar check-in →",
    errorMissingDocs: "Agrega tu documento de identidad y un selfie para continuar.",
    errorMissingSignature: "Firma en el recuadro previsto para continuar.",
    errorMissingRulesChoice: "Indica si aceptas las reglas del alojamiento para continuar.",
    errorMissingConsent: "Debes autorizar el envío de tus documentos para continuar.",
    errorUploadFailed: "No se pudo enviar el check-in (las fotos quizás pesan demasiado). Prueba con otras fotos.",
    errorGeneric: "No se pudo terminar el check-in.",
    doneEyebrow: "Check-in",
    doneTitle: "¡Listo!",
    doneText: "Tu check-in quedó registrado. El anfitrión va a verificar tus documentos, pero ya puedes acceder al livret de tu alojamiento.",
    doneCredentialsHint: "Anota bien estas credenciales — te van a permitir volver a encontrar el livret desde otro dispositivo, o si vuelves más tarde a este enlace:",
    username: "Usuario:",
    password: "Contraseña:",
    doneReconnectHint: "Para volver a conectarte más tarde, abre el enlace de tu livret y elige «¿Ya hiciste tu check-in?»",
    goToLivret: "Ir al livret →",
  },
};

export default function CheckinPage({ params }) {
  const { token } = use(params);
  const [locale, setLocale] = useState("fr");
  const t = content[locale];

  // Démarre sur "fr" (même valeur que le rendu serveur) puis corrige vers la
  // vraie langue juste après le montage, pour éviter un mismatch
  // d'hydratation React — voir useClientLocale() dans clientLocale.js, dont
  // cette page ne peut pas se servir directement puisqu'elle a besoin de son
  // propre setLocale pour le changement instantané ci-dessous.
  useEffect(() => {
    const real = getClientLocale();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale((current) => (real === current ? current : real));
  }, []);

  // Change la langue tout de suite (état local, pas d'aller-retour serveur)
  // plutôt que de passer par le cookie + Server Action utilisés ailleurs sur
  // le site : cette page est entièrement cliente, donc rien ne la ferait se
  // re-rendre avec la nouvelle langue avant un rechargement complet.
  function chooseLocale(e) {
    const code = e.currentTarget.dataset.locale;
    if (code === locale) return;
    try {
      document.cookie = `locale=${code}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    } catch {
      // Cookies indisponibles (navigation privée stricte) : le changement reste
      // effectif pour cette page, juste pas mémorisé pour la prochaine visite.
    }
    setLocale(code);
  }
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
    fetch(`/api/checkin/${token}?locale=${locale}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setReservation(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, locale]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!idDocument || !selfie) {
      setError(t.errorMissingDocs);
      return;
    }
    if (!hasSignature) {
      setError(t.errorMissingSignature);
      return;
    }
    if (reservation.houseRules && houseRulesAccepted === null) {
      setError(t.errorMissingRulesChoice);
      return;
    }
    if (!consent) {
      setError(t.errorMissingConsent);
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
        throw new Error(t.errorUploadFailed);
      }

      if (!res.ok) {
        throw new Error(data.error || t.errorGeneric);
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
        <p className="text-ink/60">{t.loading}</p>
      </main>
    );
  }

  if (!reservation) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-14">
        <p className="text-ink">{t.invalidLink}</p>
      </main>
    );
  }

  if (result) {
    return (
      <main className="flex-1">
        <Hero eyebrow={t.doneEyebrow} title={t.doneTitle} />
        <section className="mx-auto max-w-2xl px-6 py-10">
          <div className="rounded border border-sand-dim bg-sand-card p-5">
            <p className="text-ink">{t.doneText}</p>
            <p className="mt-4 text-sm text-ink/70">{t.doneCredentialsHint}</p>
            <p className="mt-1 text-ink">
              {t.username} <span className="font-bold">{result.username}</span>
            </p>
            <p className="text-ink">
              {t.password} <span className="font-bold">{result.password}</span>
            </p>
            <p className="mt-3 text-xs text-ink/60">{t.doneReconnectHint}</p>
          </div>
          <a
            href={`/logement/${result.slug}`}
            className="mt-6 inline-block rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
          >
            {t.goToLivret}
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="fixed right-5 top-6 z-10 flex items-center gap-1 rounded-full bg-black/35 px-3 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-sm md:right-8 md:top-8">
        {LANGS.map((lang, i) => (
          <div key={lang.code} className="flex items-center gap-1">
            {i > 0 && <span className="text-[#f7f1e4]/40">·</span>}
            <button
              type="button"
              onClick={chooseLocale}
              data-locale={lang.code}
              disabled={locale === lang.code}
              className={locale === lang.code ? "text-[#f7f1e4]" : "text-[#f7f1e4]/60 hover:text-[#f7f1e4]"}
            >
              {lang.label}
            </button>
          </div>
        ))}
      </div>
      <Hero
        eyebrow={reservation.propertyName}
        title={t.welcome(reservation.guestName)}
        subtitle={t.stay(reservation.arrivalDate, reservation.departureDate)}
        logo={reservation.hostLogoUrl}
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.firstName}</span>
              <input
                required
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.lastName}</span>
              <input
                required
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="input"
              />
            </label>
          </div>
          <span className="-mt-2 text-xs text-ink/60">{t.nameHint}</span>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.phone}</span>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="input"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.email}</span>
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
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.documentNumber}</span>
              <input
                required
                value={form.documentNumber}
                onChange={(e) => setForm((f) => ({ ...f, documentNumber: e.target.value }))}
                className="input"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.nationality}</span>
              <input
                required
                value={form.nationality}
                onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))}
                className="input"
              />
            </label>
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.idDocument}</span>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-sand-dim bg-sand-card px-4 py-4 text-center text-sm font-bold text-aqua-deep transition-colors hover:bg-sand">
              {idDocument ? `✓ ${idDocument.name}` : t.uploadIdDocument}
              <input
                required
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => setIdDocument(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
            <span className="text-xs text-ink/60">{t.idDocumentHint(reservation.guestName)}</span>
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.selfie}</span>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded border border-dashed border-sand-dim bg-sand-card px-4 py-4 text-center text-sm font-bold text-aqua-deep transition-colors hover:bg-sand">
              {selfie ? `✓ ${selfie.name}` : t.takeSelfie}
              <input
                required
                type="file"
                accept="image/*"
                capture="user"
                onChange={(e) => setSelfie(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
            <span className="text-xs text-ink/60">{t.selfieHint}</span>
          </div>

          <div className="grid gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.signature}</span>
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
              <span className="text-xs text-ink/60">{t.signatureHint1}</span>
              <button
                type="button"
                onClick={clearSignature}
                className="text-xs font-bold text-aqua-deep underline underline-offset-2"
              >
                {t.clear}
              </button>
            </div>
            <span className="text-xs text-ink/60">{t.signatureHint2}</span>
          </div>

          {reservation.houseRules && (
            <div className="grid gap-3 rounded border border-sand-dim bg-sand-card p-4">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/60">{t.houseRules}</span>
              <FormattedText text={reservation.houseRules} className="text-sm text-ink/80" />
              <div className="grid gap-2">
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    name="houseRulesAccepted"
                    checked={houseRulesAccepted === true}
                    onChange={() => setHouseRulesAccepted(true)}
                  />
                  {t.acceptRules}
                </label>
                <label className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    name="houseRulesAccepted"
                    checked={houseRulesAccepted === false}
                    onChange={() => setHouseRulesAccepted(false)}
                  />
                  {t.declineRules}
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
            <span>{t.consent}</span>
          </label>

          <button
            type="submit"
            disabled={sending}
            className="mt-2 rounded bg-terracotta px-5 py-4 text-center font-bold text-ink transition-colors hover:bg-terracotta-deep disabled:opacity-60"
          >
            {sending ? t.submitting : t.submit}
          </button>
          {error && <p className="text-sm text-terracotta-deep">{error}</p>}
        </form>
      </section>
    </main>
  );
}
