import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import Flowchart from "./Flowchart";
import { Notes, PriceCalc } from "./Interactive";

export const metadata = { title: "Présentation du cahier de consignes", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

// Présentation commerciale du cahier de consignes pour les rendez-vous avec les hôtels : privée (compte admin),
// pensée pour être montrée à l'écran, sans PowerPoint. Chaque affirmation vient de ce que le produit fait réellement.

const STEPS = [
  { t: "Écrire", d: "En quelques touches : un type (Information, À faire, Problème, Plainte client), une chambre ou un lieu, le texte, un niveau d'urgence." },
  { t: "Voir", d: "Chaque service ouvre son cahier à la prise de poste et voit tout ce qui compte, les urgences et les consignes du jour d'avant en tête." },
  { t: "Valider", d: "« C'est fait » avec son code personnel, et une précision si besoin. Pour les consignes importantes, chacun valide pour lui." },
  { t: "Suivre", d: "La direction voit qui a écrit, qui a validé, et quels sujets reviennent, avec des statistiques claires." },
];

const GROUPS = [
  {
    title: "Une communication qui circule",
    items: [
      ["Un cahier par service", "Réception, conciergerie, technique, gouvernante, petit-déjeuner… vous choisissez vos services, chacun a son cahier."],
      ["D'un service à l'autre", "Une même consigne peut partir vers plusieurs services : chacun la voit et la traite de son côté."],
      ["D'une équipe à l'autre", "Ce que l'équipe du matin écrit, l'équipe du soir et de la nuit le retrouvent. On cible un poste ou toute l'équipe."],
      ["Relève par email", "Un récapitulatif des consignes en attente part à 6h55, 14h55 et 22h55 ; à 6h55, le PDF de la veille est joint."],
    ],
  },
  {
    title: "Des processus qui tiennent",
    items: [
      ["Rien ne se perd", "Une consigne reste visible tant qu'elle n'est pas faite et passe au jour suivant : « Pas fait depuis 2 jours »."],
      ["Validation personnelle", "Chacun valide avec son code à 4 chiffres : on sait qui a fait quoi, à quelle date et à quelle heure."],
      ["À valider par toute l'équipe", "Pour une information importante, chaque personne confirme l'avoir lue ; le manager voit qui manque."],
      ["Modifier sans perdre la trace", "Un texte à corriger ? On le modifie, l'historique garde qui, quoi et quand. Un nouvel épisode ? On ajoute une suite."],
    ],
  },
  {
    title: "Un pilotage qui éclaire",
    items: [
      ["Suivi pour la direction", "Qui a écrit, qui a validé, par service. Les noms sont visibles du manager et des responsables de service."],
      ["Ce qui revient, chambre par chambre", "Les statistiques montrent les problèmes récurrents par chambre et les sujets qui reviennent : humidité, climatisation, serrure…"],
      ["Retrouver en un instant", "Une recherche dans tout l'historique : « colis 405 » trouve tout ce qui parle de colis et de la 405."],
      ["Vos données, toujours à vous", "Export Excel à tout moment. Les consignes sont conservées 36 mois, avec un avertissement et un fichier à télécharger avant leur suppression."],
    ],
  },
];

const EXAMPLES = [
  { who: "Réception", flow: "Chambre 108 : traces d'humidité au plafond", then: "La technique la voit dans son cahier, la gouvernante est prévenue, la direction voit si le sujet revient." },
  { who: "Direction", flow: "Arrivées de groupe cet après-midi", then: "Une consigne « Général » à valider par toute l'équipe : chacun confirme, le manager voit qui manque." },
  { who: "Conciergerie", flow: "Colis pour la 405, à remettre en main propre", then: "Écrit le matin, visible le soir. Terminé avec date, heure et nom : retrouvé en un instant si besoin." },
];

const FAQ = [
  ["Et si mon équipe n'est pas à l'aise avec le numérique ?", "Écrire une consigne se fait en quelques touches, sur de grands boutons. Pas de mot de passe à retenir : un code personnel à 4 chiffres, comme une badgeuse."],
  ["Faut-il installer quelque chose ?", "Rien du tout. Le cahier s'ouvre dans le navigateur de la tablette ou de l'ordinateur du poste. Chaque poste s'active avec un code ou un lien envoyé par email."],
  ["Est-ce que ça remplace notre PMS ?", "Non, ça le complète. Le PMS gère les réservations et la facturation ; le cahier gère ce qui se dit entre les équipes : consignes, suivi et validation."],
  ["Et si nous avons plusieurs hôtels ?", "Un même compte peut gérer plusieurs hôtels : chacun a son logo, ses services, son équipe et son abonnement."],
  ["Et si je veux arrêter ?", "C'est résiliable à tout moment, et vos consignes s'exportent en Excel quand vous le souhaitez."],
];

const SETUP = [
  ["Créer l'espace de l'hôtel", "Nom, logo et couleurs : le cahier est à vos couleurs, y compris l'aperçu quand on partage le lien."],
  ["Choisir les services", "Réception, conciergerie, technique, gouvernante… comme dans votre organisation."],
  ["Donner un code à chacun", "Chaque personne reçoit son code à 4 chiffres, et le manager nomme les responsables de service."],
  ["Activer les postes", "Un code ou un lien par email active la tablette ou l'ordinateur de chaque service. C'est prêt."],
];

const nav = [["comment", "Comment ça marche"], ["avantages", "Avantages"], ["communication", "Communication"], ["apercu", "Aperçu"], ["prix", "Prix"], ["parcours", "Parcours"]];

function Section({ id, eyebrow, title, intro, children }) {
  return (
    <section id={id} className="scroll-mt-24 px-6 py-16 sm:py-24 print:py-8">
      <div className="mx-auto max-w-6xl">
        {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta-deep">{eyebrow}</p>}
        <h2 className="mt-3 max-w-3xl font-display italic text-4xl leading-tight text-ink sm:text-5xl">{title}</h2>
        {intro && <p className="mt-5 max-w-3xl text-xl leading-relaxed text-ink/75">{intro}</p>}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export default async function CahierDemoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data: me } = await supabase.from("hosts").select("is_admin").eq("id", user.id).single();
  if (!me?.is_admin) notFound();

  // La vidéo vit dans un bucket privé : un lien signé d'une heure, généré seulement pour l'administrateur connecté.
  const { data: signed } = await createAdminClient().storage.from("pitch").createSignedUrl("cahier-hotels.mp4", 3600);
  const videoUrl = signed?.signedUrl ?? null;

  return (
    <main className="flex-1 bg-sand text-ink">
      <header className="sticky top-0 z-30 border-b border-sand-dim bg-sand/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-6 py-3">
          <Link href="/admin" className="inline-flex shrink-0 items-center gap-3">
            <Image src="/tourist book long.png" alt="Tourist Book" width={278} height={106} className="h-9 w-auto" />
            <span className="rounded-md bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-sand">Privé</span>
          </Link>
          <nav className="ml-auto flex flex-wrap items-center gap-1 text-sm font-bold text-ink/70" aria-label="Sections">
            {nav.map(([id, label]) => <a key={id} href={`#${id}`} className="rounded-full px-3 py-1.5 hover:bg-sand-card hover:text-ink">{label}</a>)}
          </nav>
        </div>
      </header>

      {/* 1. Accroche */}
      <section className="bg-[#2f7d76] px-6 py-16 text-[#f7f1e4] sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
         <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f7f1e4]/80">Le cahier de consignes numérique pour hôtels</p>
          <h1 className="mt-5 max-w-4xl font-display italic text-5xl leading-[1.08] sm:text-6xl">Chaque équipe sait ce qu&apos;elle doit faire, à chaque relève.</h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed text-[#f7f1e4]/90 sm:text-2xl">Un cahier par service, tout l&apos;hôtel au même niveau d&apos;information, et une direction qui voit ce qui se passe.</p>
          <ul className="mt-10 grid max-w-3xl gap-3 text-lg sm:text-xl">
            {["Ce que dit l'équipe du matin, l'équipe du soir le sait.", "Une consigne importante est suivie jusqu'au bout.", "La direction voit, comprend et décide avec des faits."].map((t) => (
              <li key={t} className="flex gap-3"><span aria-hidden="true" className="font-bold text-[#f4b393]">✓</span><span>{t}</span></li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap items-center gap-4 print:hidden">
            <a href="#comment" className="rounded-xl bg-terracotta px-8 py-4 text-lg font-bold text-ink hover:bg-terracotta-deep">Voir comment ça marche ↓</a>
            <span className="rounded-xl border border-[#f7f1e4]/50 px-6 py-4 text-lg font-bold">15 € par service et par mois</span>
          </div>
         </div>
         {videoUrl && (
          <figure className="w-full">
            <video controls playsInline preload="metadata" className="aspect-video w-full rounded-2xl border-2 border-[#f7f1e4]/40 bg-black shadow-2xl">
              <source src={videoUrl} type="video/mp4" />
            </video>
            <figcaption className="mt-3 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#f7f1e4]/80">Le cahier en 1 min 30</figcaption>
          </figure>
         )}
        </div>
      </section>

      {/* 2. En 30 secondes */}
      <Section id="comment" eyebrow="En 30 secondes" title="Un cahier de consignes, sur écran, pour chaque service de l'hôtel" intro="C'est le cahier de la réception que vous connaissez, avec tout ce que le papier ne sait pas faire : il se partage, se retrouve, se valide et se mesure.">
        <ol className="grid gap-5 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-sand-dim bg-sand-card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-aqua-deep text-lg font-bold text-white">{i + 1}</span>
              <h3 className="mt-4 font-display italic text-3xl text-ink">{s.t}</h3>
              <p className="mt-2 text-lg leading-snug text-ink/75">{s.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 3. Avantages */}
      <section id="avantages" className="scroll-mt-24 bg-sand-card px-6 py-16 sm:py-24 print:py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta-deep">Ce que vos équipes y gagnent</p>
          <h2 className="mt-3 max-w-3xl font-display italic text-4xl leading-tight sm:text-5xl">Tout ce dont une relève a besoin, au même endroit</h2>
          <div className="mt-12 grid gap-10">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <h3 className="font-display italic text-3xl text-aqua-deep">{g.title}</h3>
                <ul className="mt-5 grid gap-4 md:grid-cols-2">
                  {g.items.map(([t, d]) => (
                    <li key={t} className="rounded-xl border border-sand-dim bg-sand p-5">
                      <p className="text-xl font-bold text-ink"><span aria-hidden="true" className="mr-2 text-terracotta-deep">✓</span>{t}</p>
                      <p className="mt-1.5 text-lg leading-snug text-ink/75">{d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Communication */}
      <Section id="communication" eyebrow="La bonne communication" title="Quand l'information circule, tout l'hôtel avance ensemble" intro="Trois exemples, tels qu'ils se passent dans le cahier (exemples fictifs).">
        <div className="grid gap-5 md:grid-cols-3">
          {EXAMPLES.map((e) => (
            <article key={e.who} className="rounded-2xl border border-sand-dim bg-sand-card p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-aqua-deep">{e.who}</p>
              <p className="mt-3 text-xl font-bold leading-snug text-ink">{e.flow}</p>
              <p className="mt-3 border-t border-sand-dim pt-3 text-lg leading-snug text-ink/75">{e.then}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-2xl bg-aqua-deep p-8 text-white">
          <p className="font-display italic text-3xl leading-snug">Un hôtel où chacun connaît le dernier épisode, c&apos;est un hôtel où les clients le sentent.</p>
          <p className="mt-3 text-lg text-white/85">Moins de questions « qui est au courant ? », plus de temps pour ce qui fait la différence : l&apos;accueil.</p>
        </div>
      </Section>

      {/* 5. Aperçu */}
      <section id="apercu" className="scroll-mt-24 bg-sand-card px-6 py-16 sm:py-24 print:py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta-deep">Aperçu</p>
          <h2 className="mt-3 max-w-3xl font-display italic text-4xl leading-tight sm:text-5xl">Ce que voient vos équipes, et ce que voit la direction</h2>
          <p className="mt-4 text-lg text-ink/60">Données d&apos;exemple.</p>
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">Dans le cahier de la réception</p>
              <div className="grid gap-4">
                <div className="rounded-2xl border-2 border-terracotta-deep bg-sand p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-xl bg-ink px-3 py-1 text-lg font-bold text-sand">108</span>
                    <span className="rounded-xl bg-terracotta/30 px-3 py-1 text-sm font-bold">⚠ Problème</span>
                    <span className="rounded-xl bg-terracotta-deep px-3 py-1 text-sm font-bold text-white">Pas fait depuis 2 jours</span>
                  </div>
                  <p className="mt-3 text-xl leading-snug">Traces d&apos;humidité au plafond : voir avec la technique avant ce soir.</p>
                  <p className="mt-2 text-sm text-ink/60">Pour : technique · Écrite le 28 oct. à 09:30</p>
                  <span className="mt-3 inline-flex rounded-xl bg-aqua-deep px-5 py-2.5 font-bold text-white">✓ C&apos;est fait</span>
                </div>
                <div className="rounded-2xl border-2 border-sand-dim bg-sand p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-xl bg-ink px-3 py-1 text-lg font-bold text-sand">Général</span>
                    <span className="rounded-xl bg-ink/10 px-3 py-1 text-sm font-bold">Information</span>
                  </div>
                  <p className="mt-3 text-xl leading-snug">Aujourd&apos;hui : 3 arrivées de groupe, renfort à la réception de 15h à 19h.</p>
                  <p className="mt-3 rounded-xl bg-ink/[0.06] px-4 py-2.5 text-base">À valider par chaque personne · <strong>4 sur 5</strong> ont validé</p>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/60">Pour la direction : les sujets qui reviennent</p>
              <div className="rounded-2xl border border-sand-dim bg-sand p-6">
                {[["Fuite et humidité", 9], ["Climatisation et chauffage", 6], ["Serrure, porte, clés", 5], ["Bruit", 3], ["Propreté et linge", 2]].map(([label, n]) => (
                  <div key={label} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-lg"><span>{label}</span><span className="tabular-nums font-bold">{n}</span></div>
                    <div className="mt-1 h-3 overflow-hidden rounded-full bg-sand-dim"><div className="h-full rounded-full bg-aqua-deep" style={{ width: `${(n / 9) * 100}%` }} /></div>
                  </div>
                ))}
                <p className="mt-5 border-t border-sand-dim pt-4 text-lg text-ink/75">La chambre 108 revient : c&apos;est le moment d&apos;agir sur la cause plutôt que sur le symptôme.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Prix */}
      <Section id="prix" eyebrow="Un prix simple" title="15 € par service et par mois. C'est tout." intro="Pas de module à choisir, pas d'option cachée : vous payez les services que vous activez, vous commencez par celui qui en a le plus besoin et vous ajoutez les autres quand vous le voulez.">
        <PriceCalc />
        <ul className="mt-6 grid gap-3 text-xl sm:grid-cols-3">
          {["Résiliable à tout moment", "Vos données exportables en Excel", "Mise en route en une dizaine de minutes"].map((t) => (
            <li key={t} className="rounded-xl border border-sand-dim bg-sand-card px-5 py-4"><span aria-hidden="true" className="mr-2 text-aqua-deep">✓</span>{t}</li>
          ))}
        </ul>
      </Section>

      {/* 7. Mise en route + FAQ */}
      <section className="bg-sand-card px-6 py-16 sm:py-24 print:py-8">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta-deep">Mise en route</p>
            <h2 className="mt-3 font-display italic text-4xl leading-tight sm:text-5xl">Prêt en quatre étapes</h2>
            <ol className="mt-8 grid gap-4">
              {SETUP.map(([t, d], i) => (
                <li key={t} className="flex gap-4 rounded-xl border border-sand-dim bg-sand p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-lg font-bold text-ink">{i + 1}</span>
                  <div><p className="text-xl font-bold">{t}</p><p className="mt-1 text-lg leading-snug text-ink/75">{d}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta-deep">Vos questions</p>
            <h2 className="mt-3 font-display italic text-4xl leading-tight sm:text-5xl">Les réponses, avant même de les poser</h2>
            <div className="mt-8 grid gap-3">
              {FAQ.map(([q, a]) => (
                <details key={q} className="rounded-xl border border-sand-dim bg-sand px-5 py-4" open>
                  <summary className="cursor-pointer text-xl font-bold">{q}</summary>
                  <p className="mt-2 text-lg leading-snug text-ink/75">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Diagramme de flux */}
      <Section id="parcours" eyebrow="Tout le parcours" title="Du moment où l'on écrit une consigne jusqu'à la décision de la direction" intro="À chaque question, une réponse claire : oui, on continue ; non, le cahier la garde visible jusqu'à ce qu'elle soit faite.">
        <Flowchart />
      </Section>

      {/* 9. Appel final */}
      <section className="bg-[#2f7d76] px-6 py-20 text-center text-[#f7f1e4] sm:py-28">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display italic text-4xl leading-tight sm:text-6xl">Commençons par un service, aujourd&apos;hui.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-[#f7f1e4]/90">On configure ensemble le premier cahier, vos équipes l&apos;adoptent dès la prochaine relève, et vous ajoutez les autres services au rythme qui vous convient.</p>
          <p className="mx-auto mt-4 max-w-2xl text-xl font-bold text-[#f4b393]">Les premiers hôtels sont accompagnés personnellement, avec un support à leurs côtés.</p>
          <p className="mt-8 inline-block rounded-xl border border-[#f7f1e4]/50 px-6 py-4 text-xl font-bold">15 € par service et par mois · résiliable à tout moment</p>
          <p className="mt-10 text-lg text-[#f7f1e4]/80">Tourist Book · Cahier de consignes pour hôtels</p>
        </div>
      </section>

      {/* Notes du présentateur : masquées par défaut (touche N) */}
      <Notes>
        <aside className="fixed inset-y-0 right-0 z-30 w-full max-w-md overflow-y-auto border-l-2 border-terracotta bg-sand-card p-6 pb-24 shadow-2xl">
          <h2 className="font-display italic text-3xl">Notes (7 principes)</h2>
          <p className="mt-1 text-sm text-ink/60">Visible seulement pour vous (touche N). Chaque point repose sur ce que le produit fait vraiment.</p>
          <ol className="mt-5 grid gap-4 text-base">
            {[
              ["1 · Réciprocité", "Donnez d'abord : « Je configure votre premier service avec vous, ici, maintenant. » La démonstration sur leur propre hôtel est le cadeau."],
              ["2 · Engagement et cohérence", "Obtenez des petits « oui » : « Vous voulez que le soir sache ce que le matin a décidé ? Qu'une consigne importante soit suivie jusqu'au bout ? » Puis : « On commence par un service ? »"],
              ["3 · Preuve sociale", "Ne pas affirmer qu'un hôtel l'utilise tant que ce n'est pas vrai. Dites plutôt : « Rejoignez les premiers hôtels qui adoptent le cahier. » Quand vous aurez un premier hôtel ou un témoignage réel, ajoutez-le ici."],
              ["4 · Autorité", "Parlez le métier : relève, main courante, services, chambres. Insistez sur le suivi horodaté et la conservation de 36 mois avec export. Si vous le souhaitez : le produit est pensé par quelqu'un du terrain hôtelier."],
              ["5 · Sympathie", "Leur logo, leurs couleurs, leurs services : « C'est VOTRE cahier. » Écoutez d'abord comment ils font aujourd'hui, et reprenez leurs mots."],
              ["6 · Rareté", "Vrai et à utiliser : « Les premiers hôtels sont accompagnés personnellement, avec un support à leurs côtés. » Ajoutez un créneau de mise en route cette semaine seulement s'il est réel."],
              ["7 · Unité", "« Nous voulons la même chose : des équipes qui travaillent ensemble et des clients bien accueillis. » Parlez de « nos équipes » et de « votre hôtel et nous »."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-lg border border-sand-dim bg-sand p-4"><p className="font-bold text-terracotta-deep">{t}</p><p className="mt-1 text-ink/80">{d}</p></li>
            ))}
          </ol>
          <h3 className="mt-8 font-display italic text-2xl">Questions pour conclure</h3>
          <ul className="mt-3 grid gap-2 text-ink/80">
            {["Quel service gagnerait le plus à avoir son cahier dès cette semaine ?", "Qui serait le responsable du premier service ?", "Voulez-vous que nous activions la tablette de la réception maintenant ?"].map((q) => <li key={q} className="rounded-lg bg-sand p-3">{q}</li>)}
          </ul>
        </aside>
      </Notes>
    </main>
  );
}
