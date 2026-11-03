// Parcours complet d'une consigne, avec les « si / non / alors » : rectangle = ce qui se passe, losange = une question
// (Oui continue vers le bas, Non part sur le côté). Dessiné en SVG, sans bibliothèque ; couleurs via les variables du thème.
const W = 960, H = 1900;
const CX = 380;           // colonne centrale
const RX = 760;           // colonne de droite
const LX = 130;           // colonne de gauche

const tone = {
  start: { fill: "var(--aqua-deep)", stroke: "var(--aqua-deep)", text: "#fff" },
  step: { fill: "var(--sand-card)", stroke: "var(--ink)", text: "var(--ink)" },
  ok: { fill: "color-mix(in srgb, var(--aqua-deep) 14%, var(--sand-card))", stroke: "var(--aqua-deep)", text: "var(--ink)" },
  warn: { fill: "color-mix(in srgb, var(--terracotta) 22%, var(--sand-card))", stroke: "var(--terracotta-deep)", text: "var(--ink)" },
  ask: { fill: "var(--sand)", stroke: "var(--terracotta-deep)", text: "var(--ink)" },
};

function wrap(text, max) {
  const out = [];
  let line = "";
  for (const w of text.split(" ")) {
    if ((line + " " + w).trim().length > max) { out.push(line); line = w; } else line = (line + " " + w).trim();
  }
  if (line) out.push(line);
  return out;
}

function Label({ x, y, lines, size = 15, weight = 600, fill }) {
  const lh = size * 1.28, y0 = y - ((lines.length - 1) * lh) / 2;
  return (
    <text x={x} y={y0} textAnchor="middle" dominantBaseline="central" fontSize={size} fontWeight={weight} style={{ fill }}>
      {lines.map((l, i) => <tspan key={i} x={x} dy={i ? lh : 0}>{l}</tspan>)}
    </text>
  );
}

function Box({ x, y, w = 270, h = 74, text, kind = "step", round = 12, max = 30 }) {
  const t = tone[kind];
  return (
    <g>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={round} style={{ fill: t.fill, stroke: t.stroke }} strokeWidth="2" />
      <Label x={x} y={y} lines={wrap(text, max)} fill={t.text} />
    </g>
  );
}

function Diamond({ x, y, w = 300, h = 104, text, max = 24 }) {
  const t = tone.ask;
  return (
    <g>
      <polygon points={`${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}`} style={{ fill: t.fill, stroke: t.stroke }} strokeWidth="2.5" />
      <Label x={x} y={y} lines={wrap(text, max)} size={14.5} fill={t.text} />
    </g>
  );
}

function Tag({ x, y, text, yes }) {
  return (
    <g>
      <rect x={x - 24} y={y - 12} width="48" height="24" rx="12" style={{ fill: yes ? "var(--aqua-deep)" : "var(--terracotta-deep)" }} />
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill="#fff">{text}</text>
    </g>
  );
}

const Arrow = ({ d, dashed }) => (
  <path d={d} fill="none" strokeWidth="2.2" style={{ stroke: "var(--ink)", opacity: 0.7 }} strokeDasharray={dashed ? "7 6" : undefined} markerEnd="url(#arrow)" />
);

export default function Flowchart() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sand-dim bg-sand-card p-4 sm:p-8">
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto w-full min-w-[640px] max-w-[960px]" role="img" aria-label="Parcours complet d'une consigne dans le cahier, avec les décisions oui et non">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" style={{ fill: "var(--ink)", opacity: 0.8 }} />
          </marker>
        </defs>

        {/* 1. Écrire */}
        <Box x={CX} y={60} kind="start" round={37} text="Une information à transmettre" />
        <Arrow d={`M${CX} 97 V138`} />
        <Box x={CX} y={175} text="On écrit la consigne avec son code personnel : type, chambre ou lieu, texte, urgent ou non" max={34} h={84} w={310} />
        <Arrow d={`M${CX} 217 V262`} />
        <Diamond x={CX} y={318} text="Pour plusieurs services ?" max={30} />
        <Tag x={CX - 175} y={304} text="Oui" yes />
        <Arrow d={`M${CX - 150} 318 H${LX + 4} V388`} />
        <Box x={LX} y={430} kind="ok" w={230} h={84} text="Une copie dans chaque service : chacun la traite de son côté" max={26} />
        <Arrow d={`M${LX} 472 V540 H${CX - 140}`} />
        <Tag x={CX + 20} y={388} text="Non" />
        <Arrow d={`M${CX} 370 V500`} />

        {/* 2. Traiter */}
        <Box x={CX} y={540} text="Elle apparaît dans le cahier du service, visible à chaque prise de poste" max={32} w={290} h={84} />
        <Arrow d={`M${CX} 582 V632`} />
        <Diamond x={CX} y={690} text="Quelqu'un l'a faite ?" />
        <Tag x={CX + 20} y={768} text="Oui" yes />
        <Arrow d={`M${CX} 742 V842`} />
        <Tag x={CX + 180} y={676} text="Non" />
        <Arrow d={`M${CX + 150} 690 H${RX - 130}`} />
        <Box x={RX} y={690} kind="warn" w={260} h={104} text="Elle reste en haut du cahier et passe au jour suivant : « Pas fait depuis N jours »" max={28} />
        <Arrow dashed d={`M${RX} 638 V540 H${CX + 150}`} />
        <text x={RX} y={598} textAnchor="middle" fontSize="13" fontWeight="600" style={{ fill: "var(--ink)", opacity: 0.7 }}>retour au cahier</text>

        <Diamond x={CX} y={898} text="À valider par toute l'équipe ?" w={320} h={110} />
        <Tag x={CX + 188} y={884} text="Oui" yes />
        <Arrow d={`M${CX + 160} 898 H${RX - 130}`} />
        <Box x={RX} y={898} kind="step" w={260} h={84} text="Chaque personne valide avec son code, avec une précision si besoin" max={28} />
        <Arrow d={`M${RX} 940 V1010`} />
        <Diamond x={RX} y={1068} w={290} text="Tout le monde a validé ?" max={22} />
        <Tag x={RX - 168} y={1054} text="Oui" yes />
        <Arrow d={`M${RX - 145} 1068 H${CX + 160} V1150 H${CX + 60}`} />
        <Tag x={RX + 60} y={1130} text="Non" />
        <Arrow d={`M${RX} 1120 V1186`} />
        <Box x={RX} y={1226} kind="warn" w={260} h={84} text="Le manager voit qui manque" max={28} />
        <Arrow dashed d={`M${RX + 130} 1226 H${W - 30} V540 H${CX + 150}`} />
        <Tag x={CX + 20} y={970} text="Non" />
        <Arrow d={`M${CX} 953 V1118`} />
        <Box x={CX} y={1160} kind="ok" w={320} h={92} text="Consigne terminée : date, heure et personne enregistrées, retrouvable dans la recherche" max={34} />

        {/* 3. Corriger */}
        <Arrow d={`M${CX} 1206 V1268`} />
        <Diamond x={CX} y={1320} text="Il faut corriger ou compléter ?" w={320} h={104} />
        <Tag x={CX - 190} y={1306} text="Oui" yes />
        <Arrow d={`M${CX - 160} 1320 H${LX + 4} V1380`} />
        <Box x={LX} y={1422} w={230} h={84} text="On modifie (historique conservé) ou on ajoute une suite" max={26} />
        <Arrow dashed d={`M${LX - 115} 1422 H28 V540 H${CX - 145}`} />
        <Tag x={CX + 20} y={1388} text="Non" />
        <Arrow d={`M${CX} 1372 V1470`} />

        {/* 4. Relève */}
        <Box x={CX} y={1510} kind="start" w={330} h={80} text="Relève : un email récapitule le cahier à 6h55, 14h55 et 22h55" max={34} />
        <Arrow d={`M${CX} 1550 V1596`} />
        <Diamond x={CX} y={1650} text="Il reste des consignes ouvertes ?" w={330} h={104} />
        <Tag x={CX + 196} y={1636} text="Oui" yes />
        <Arrow d={`M${CX + 165} 1650 H${RX - 130}`} />
        <Box x={RX} y={1650} kind="ok" w={260} h={94} text="Elles figurent dans l'email ; à 6h55 le PDF de la veille est joint" max={28} />
        <Tag x={CX - 20} y={1730} text="Non" />
        <Arrow d={`M${CX} 1702 V1770`} />
        <Box x={CX} y={1808} kind="ok" round={37} w={330} h={74} text="Tout est à jour, rien à signaler" max={34} />
      </svg>

      <p className="mx-auto mt-10 max-w-[960px] text-center font-display italic text-2xl text-ink">Et pour la direction : voir, comprendre, décider</p>
      <svg viewBox="0 0 960 500" className="mx-auto mt-4 w-full min-w-[640px] max-w-[960px]" role="img" aria-label="Parcours de la direction : suivi, statistiques et décisions">
        <defs>
          <marker id="arrow2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" style={{ fill: "var(--ink)", opacity: 0.8 }} />
          </marker>
        </defs>
        <g style={{ ["--m"]: "url(#arrow2)" }}>
          <Box x={CX} y={50} kind="start" round={37} w={330} text="La direction ouvre le Suivi et les statistiques" max={34} />
          <path d={`M${CX} 87 V128`} fill="none" strokeWidth="2.2" style={{ stroke: "var(--ink)", opacity: 0.7 }} markerEnd="url(#arrow2)" />
          <Box x={CX} y={166} w={330} h={76} text="Qui a écrit, qui a validé, quels services, quelles chambres, quels sujets" max={36} />
          <path d={`M${CX} 204 V248`} fill="none" strokeWidth="2.2" style={{ stroke: "var(--ink)", opacity: 0.7 }} markerEnd="url(#arrow2)" />
          <Diamond x={CX} y={306} text="Un sujet revient dans la même chambre ?" w={350} h={112} max={26} />
          <Tag x={CX + 212} y={292} text="Oui" yes />
          <path d={`M${CX + 175} 306 H${RX - 130}`} fill="none" strokeWidth="2.2" style={{ stroke: "var(--ink)", opacity: 0.7 }} markerEnd="url(#arrow2)" />
          <Box x={RX} y={306} kind="ok" w={260} h={94} text="Une action durable : maintenance, formation ou nouvelle procédure" max={28} />
          <Tag x={CX + 22} y={382} text="Non" />
          <path d={`M${CX} 362 V424`} fill="none" strokeWidth="2.2" style={{ stroke: "var(--ink)", opacity: 0.7 }} markerEnd="url(#arrow2)" />
          <Box x={CX} y={456} kind="ok" round={30} w={360} h={62} text="Tout est sous contrôle, l'hôtel continue d'avancer" max={40} />
        </g>
      </svg>
    </div>
  );
}
