import Link from "next/link";
import Hero from "@/components/Hero";

export default function HotelHomePage() {
  const points = [
    ["Rien ne se perd", "Une consigne non clôturée revient chaque jour en priorité, jusqu'à ce que quelqu'un la valide."],
    ["Un PIN, pas de mot de passe", "Au comptoir, chacun s'identifie avec son code à 4 chiffres. Le manager voit qui a fait quoi."],
    ["La relève par email", "Les consignes en attente arrivent à 6h55, 14h55 et 22h55, juste avant chaque changement d'équipe."],
    ["Des chiffres pour la direction", "Chambres les plus touchées par les problèmes et les plaintes, délais de clôture, consignes laissées en suspens."],
  ];
  return (
    <main className="flex-1">
      <Hero
        backHref="/"
        backLabel="Accueil"
        eyebrow="Espace hôtels"
        title="Le cahier de consignes numérique"
        subtitle="Fini les messages oubliés entre deux équipes."
      />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {points.map(([title, text]) => (
            <div key={title}>
              <h2 className="font-bold text-ink">{title}</h2>
              <p className="mt-1 text-sm text-ink/70">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/hotel/inscription"
            className="rounded bg-terracotta px-6 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
          >
            Créer l'espace de mon hôtel →
          </Link>
          <Link
            href="/hotel/cahier"
            className="rounded border border-aqua-deep px-6 py-3 font-bold text-aqua-deep transition-colors hover:bg-aqua-deep hover:text-sand-card"
          >
            Ouvrir le cahier
          </Link>
        </div>
        <p className="mt-4 text-sm text-ink/60">
          Un mois d'essai gratuit. Vous avez déjà un espace ?{" "}
          <Link href="/hotel/connexion" className="font-bold text-aqua-deep">
            Connexion manager
          </Link>
        </p>
      </section>
    </main>
  );
}
