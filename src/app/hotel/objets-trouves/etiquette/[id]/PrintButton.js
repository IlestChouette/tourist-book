"use client";

export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="h-11 rounded-lg bg-aqua-deep px-5 text-sm font-bold text-sand-card hover:bg-aqua-deep/90">
      Imprimer l'étiquette
    </button>
  );
}
