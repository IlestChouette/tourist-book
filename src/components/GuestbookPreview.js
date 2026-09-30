import { BookIcon } from "@/components/icons";

// Aperçu du livre d'or pour la page d'accueil : mêmes cartes que le vrai
// (CarnetPanel), avec les messages du livret de démonstration — ils y sont
// déjà, rédigés en français et en anglais comme le seraient de vrais voyageurs.
const entries = [
  {
    nom: "Laura",
    date: "2026-09-01",
    message:
      "Un vrai coup de cœur pour ce petit cocon niçois. La climatisation, le wifi, tout fonctionnait parfaitement. On a adoré la plage recommandée, beaucoup moins de monde qu’ailleurs.",
  },
  {
    nom: "Marco (Italie)",
    date: "2026-08-25",
    message:
      "Beautiful place, very clean and well located near the Promenade. Check-in was super easy thanks to the online guide. Grazie mille!",
  },
  {
    nom: "Sophie",
    date: "2026-08-18",
    message:
      "Vue magnifique, tout était impeccable et très bien pensé. Le livret numérique nous a évité de poser 1000 questions, tout était déjà dedans. Je recommande à 100% !",
  },
];

export default function GuestbookPreview({ label, dateLocale }) {
  const formatDate = new Intl.DateTimeFormat(dateLocale, { timeZone: "UTC" });

  return (
    <div className="rounded-2xl border border-sand-dim bg-sand p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta text-ink">
          <BookIcon />
        </span>
        <span className="font-display italic text-xl text-ink">{label}</span>
      </div>
      <div className="grid gap-3">
        {entries.map((entry) => (
          <div key={entry.nom} className="rounded border border-sand-dim bg-sand-card p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-bold text-ink">{entry.nom}</span>
              <span className="shrink-0 text-xs text-ink/50">{formatDate.format(new Date(entry.date))}</span>
            </div>
            <p className="mt-2 text-sm text-ink/80">{entry.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
