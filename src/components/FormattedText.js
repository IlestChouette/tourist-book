// Rend en toute sécurité le texte libre saisi par l'hôte (règles, infos
// pratiques...), qui peut contenir un formatage léger : **gras**, *italique*
// et des lignes "## Titre". Construit de vrais éléments React (jamais de
// dangerouslySetInnerHTML) — aucun risque d'injection, même si le texte
// contenait du HTML brut, il serait affiché tel quel comme texte.

function parseInline(text, keyPrefix) {
  const nodes = [];
  let remaining = text;
  let i = 0;
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/;

  while (remaining) {
    const match = remaining.match(regex);
    if (!match) {
      nodes.push(remaining);
      break;
    }
    if (match.index > 0) nodes.push(remaining.slice(0, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[1]}</strong>);
    } else {
      nodes.push(<em key={`${keyPrefix}-${i++}`}>{match[2]}</em>);
    }
    remaining = remaining.slice(match.index + match[0].length);
  }
  return nodes;
}

function parseBlocks(text) {
  const lines = text.split("\n");
  const blocks = [];
  let buffer = [];

  function flush() {
    if (buffer.length > 0) {
      blocks.push({ type: "p", text: buffer.join("\n") });
      buffer = [];
    }
  }

  for (const line of lines) {
    const heading = line.match(/^##\s+(.*)/);
    if (heading) {
      flush();
      blocks.push({ type: "h", text: heading[1] });
    } else {
      buffer.push(line);
    }
  }
  flush();
  return blocks;
}

export default function FormattedText({ text, className = "" }) {
  if (!text) return null;
  const blocks = parseBlocks(text);

  return blocks.map((block, i) =>
    block.type === "h" ? (
      <p key={i} className={`mt-3 font-bold text-ink first:mt-0 ${className}`}>
        {parseInline(block.text, `h${i}`)}
      </p>
    ) : (
      <p key={i} className={`whitespace-pre-line text-ink first:mt-0 ${className}`}>
        {parseInline(block.text, `p${i}`)}
      </p>
    )
  );
}
