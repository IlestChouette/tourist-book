// Conservation des consignes, dite partout où le manager les consulte : 36 mois, puis
// suppression automatique. Prévient quand des consignes vont être supprimées.
const fmt = (d) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T12:00:00Z`));

export default function RetentionNotice({ info, className = "" }) {
  const soon = info.expiring > 0 && info.deleteFrom;
  return (
    <div className={`rounded border p-4 text-sm ${soon ? "border-terracotta-deep bg-terracotta/15 text-ink" : "border-sand-dim bg-sand-card text-ink/80"} ${className}`} role={soon ? "alert" : undefined}>
      <p>
        <strong>Conservation :</strong> les consignes sont gardées {info.months} mois, puis supprimées automatiquement et définitivement.
      </p>
      {soon && (
        <p className="mt-2">
          <strong>{info.expiring} consigne{info.expiring > 1 ? "s" : ""}</strong> seront supprimées dans les 3 mois à venir, à partir du {fmt(info.deleteFrom)}.{" "}
          <a href="/hotel/suivi" className="font-bold text-aqua-deep underline">Les retrouver et les exporter (Excel)</a>
        </p>
      )}
    </div>
  );
}
