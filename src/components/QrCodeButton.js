"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { getClientLocale } from "@/lib/i18n/clientLocale";

const content = {
  fr: {
    generate: "Générer le QR code →",
    generating: "Génération…",
    title: "QR code du livret",
    hint: "À imprimer et coller dans le logement — les hôtes scannent et accèdent directement au livret, sans taper le code.",
    download: "Télécharger le PNG",
    close: "Fermer",
  },
  en: {
    generate: "Generate QR code →",
    generating: "Generating…",
    title: "Livret QR code",
    hint: "Print it and stick it in the property — guests scan it and land straight in the livret, no code to type.",
    download: "Download PNG",
    close: "Close",
  },
  es: {
    generate: "Generar código QR →",
    generating: "Generando…",
    title: "Código QR del livret",
    hint: "Imprímelo y pégalo en el alojamiento — los huéspedes escanean y entran directo al livret, sin escribir el código.",
    download: "Descargar PNG",
    close: "Cerrar",
  },
};

export default function QrCodeButton({ slug, accessCode, propertyName }) {
  const [locale] = useState(getClientLocale);
  const t = content[locale];
  const [dataUrl, setDataUrl] = useState(null);
  const [generating, setGenerating] = useState(false);

  const target = `https://tourist-book.com/logement/${slug}/entrer?code=${encodeURIComponent(accessCode)}`;

  async function generate() {
    setGenerating(true);
    const url = await QRCode.toDataURL(target, {
      width: 640,
      margin: 2,
      color: { dark: "#223339", light: "#f7f1e4" },
    });
    setDataUrl(url);
    setGenerating(false);
  }

  if (!dataUrl) {
    return (
      <button
        type="button"
        onClick={generate}
        disabled={generating}
        className="inline-block rounded border border-aqua-deep px-5 py-3 font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card disabled:opacity-60"
      >
        {generating ? t.generating : t.generate}
      </button>
    );
  }

  return (
    <div className="w-full rounded border border-sand-dim bg-sand-card p-5 text-center">
      <p className="font-display italic text-lg text-ink">{t.title}</p>
      <p className="mt-1 text-sm text-ink/70">{t.hint}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dataUrl} alt={`QR code — ${propertyName}`} className="mx-auto mt-4 h-48 w-48" />
      <div className="mt-4 flex justify-center gap-3">
        <a
          href={dataUrl}
          download={`qr-${slug}.png`}
          className="inline-block rounded bg-aqua-deep px-5 py-2.5 font-bold text-sand-card transition-colors hover:bg-aqua-deep/90"
        >
          {t.download}
        </a>
        <button
          type="button"
          onClick={() => setDataUrl(null)}
          className="inline-block rounded border border-sand-dim px-5 py-2.5 font-bold text-ink/60 transition-colors hover:border-ink/40"
        >
          {t.close}
        </button>
      </div>
    </div>
  );
}
