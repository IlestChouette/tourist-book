import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Hero from "@/components/Hero";
import { getLocale } from "@/lib/i18n/locale";
import { getLivretStats, eventLabels } from "@/lib/livretStats";

export const metadata = { robots: { index: false, follow: false } };

const content = {
  fr: {
    eyebrow: "Statistiques",
    opens: "Ouvertures du livret",
    opens30: "Ouvertures (30 derniers jours)",
    checkins: (done, total) => `Check-ins terminés (sur ${total} réservation${total > 1 ? "s" : ""})`,
    buttonsTitle: "Boutons les plus utilisés",
    noButtons: "Aucun bouton utilisé pour l'instant. Les chiffres apparaissent dès que vos voyageurs ouvrent le livret.",
    times: (n) => `${n} fois`,
    note: "Une ouverture = un voyageur qui ouvre le livret sur son téléphone (un rechargement de la page ne compte pas deux fois). Les statistiques sont comptées depuis le 6 octobre 2026.",
    premiumOnly: "Les statistiques font partie de l'offre Premium.",
  },
  en: {
    eyebrow: "Statistics",
    opens: "Livret opens",
    opens30: "Opens (last 30 days)",
    checkins: (done, total) => `Completed check-ins (out of ${total} booking${total > 1 ? "s" : ""})`,
    buttonsTitle: "Most used buttons",
    noButtons: "No button used yet. Figures appear as soon as your guests open the livret.",
    times: (n) => `${n} time${n > 1 ? "s" : ""}`,
    note: "One open = one guest opening the livret on their phone (reloading the page doesn't count twice). Statistics are counted from 6 October 2026.",
    premiumOnly: "Statistics are part of the Premium plan.",
  },
  es: {
    eyebrow: "Estadísticas",
    opens: "Aperturas del livret",
    opens30: "Aperturas (últimos 30 días)",
    checkins: (done, total) => `Check-ins completados (de ${total} reserva${total > 1 ? "s" : ""})`,
    buttonsTitle: "Botones más usados",
    noButtons: "Todavía no se ha usado ningún botón. Las cifras aparecen en cuanto tus huéspedes abren el livret.",
    times: (n) => `${n} ${n > 1 ? "veces" : "vez"}`,
    note: "Una apertura = un huésped que abre el livret en su teléfono (recargar la página no cuenta dos veces). Las estadísticas se cuentan desde el 6 de octubre de 2026.",
    premiumOnly: "Las estadísticas forman parte del plan Premium.",
  },
};

export default async function EstadisticasPage({ params }) {
  const { id } = await params;
  const locale = await getLocale();
  const t = content[locale];
  const labels = eventLabels[locale];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: property } = await supabase
    .from("properties")
    .select("id, name, host_id, plan, subscription_status")
    .eq("id", id)
    .maybeSingle();
  if (!user || !property || property.host_id !== user.id) notFound();

  const isPremium = property.plan === "premium" && property.subscription_status !== "canceled";
  const hero = (
    <Hero backHref={`/panel/alojamientos/${id}`} backLabel={property.name} eyebrow={t.eyebrow} title={property.name} />
  );
  if (!isPremium) {
    return (
      <main className="flex-1">
        {hero}
        <section className="mx-auto max-w-2xl px-6 py-10">
          <p className="text-ink/70">{t.premiumOnly}</p>
        </section>
      </main>
    );
  }

  const stats = (await getLivretStats([id])).get(id);
  const maxButton = stats.buttons[0]?.total ?? 0;

  return (
    <main className="flex-1">
      {hero}
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { value: stats.opens, label: t.opens },
            { value: stats.opens30, label: t.opens30 },
            { value: stats.checkins, label: t.checkins(stats.checkins, stats.reservations) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-sand-dim bg-sand-card p-5 text-center">
              <div className="font-display italic text-4xl text-terracotta-deep tabular-nums">{s.value}</div>
              <div className="mt-2 text-xs font-bold uppercase tracking-wider text-ink/60">{s.label}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-10 font-display italic text-2xl text-ink">{t.buttonsTitle}</h2>
        {stats.buttons.length === 0 ? (
          <p className="mt-3 text-ink/60">{t.noButtons}</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {stats.buttons.map((b) => (
              <li key={b.event}>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-ink">{labels[b.event] ?? b.event}</span>
                  <span className="text-ink/60 tabular-nums">{t.times(b.total)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-sand-dim">
                  <div
                    className="h-2 rounded-full bg-aqua-deep"
                    style={{ width: `${Math.max(4, (b.total / maxButton) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-10 text-xs text-ink/50">{t.note}</p>
      </section>
    </main>
  );
}
