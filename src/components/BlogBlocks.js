// Blocs visuels du blog — pensés pour remplacer les murs de paragraphes :
// chaque article se compose de ces blocs plutôt que de texte continu.

export function Lead({ text }) {
  return <p className="text-lg text-ink/80">{text}</p>;
}

export function IconGrid({ items }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-ink">
            <Icon />
          </span>
          <div>
            <h3 className="font-bold text-ink">{title}</h3>
            <p className="mt-1 text-base text-ink/70 sm:text-sm">{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StepFlow({ items }) {
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      {items.map((s) => (
        <div key={s.n}>
          <span className="font-display italic text-3xl text-terracotta-deep">{s.n}</span>
          <h3 className="mt-2 font-bold text-ink">{s.title}</h3>
          <p className="mt-1 text-base text-ink/70 sm:text-sm">{s.text}</p>
        </div>
      ))}
    </div>
  );
}

export function CompareBlock({ left, right }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-sand-dim bg-sand p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-ink/50">{left.title}</span>
        <ul className="mt-3 grid gap-2 text-base text-ink/80 sm:text-sm">
          {left.items.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="text-ink/40">–</span>
              {i}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-aqua-deep bg-aqua-deep/[0.06] p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-aqua-deep">{right.title}</span>
        <ul className="mt-3 grid gap-2 text-base text-ink/80 sm:text-sm">
          {right.items.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="text-aqua-deep">✓</span>
              {i}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ChatExample({ exchanges }) {
  return (
    <div className="grid gap-3 rounded-xl border border-sand-dim bg-sand-card p-5">
      {exchanges.map((e, i) => (
        <div key={i} className="grid gap-2">
          <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-sand px-4 py-2.5 text-sm text-ink">{e.q}</div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-terracotta px-4 py-2.5 text-sm text-ink">{e.a}</div>
        </div>
      ))}
    </div>
  );
}

export function StatRow({ items }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((s) => (
        <div key={s.label} className="rounded-xl border border-sand-dim bg-sand-card p-5 text-center">
          <div className="font-display italic text-3xl text-terracotta-deep">{s.value}</div>
          <div className="mt-2 text-xs font-bold uppercase tracking-wider text-ink/60">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function Quote({ text }) {
  return (
    <p className="border-l-4 border-terracotta pl-5 font-display italic text-2xl text-ink">
      {text}
    </p>
  );
}

export function TextBlock({ heading, paragraphs }) {
  return (
    <div>
      {heading && <h2 className="font-display italic text-2xl text-ink">{heading}</h2>}
      {paragraphs.map((p, i) => (
        <p key={i} className="mt-3 text-ink/80">
          {p}
        </p>
      ))}
    </div>
  );
}

export function Note({ text }) {
  return <p className="text-xs text-ink/50">{text}</p>;
}

const blockComponents = {
  lead: Lead,
  icons: IconGrid,
  steps: StepFlow,
  compare: CompareBlock,
  chat: ChatExample,
  stats: StatRow,
  quote: Quote,
  text: TextBlock,
  note: Note,
};

export function BlogBlock({ block }) {
  const Component = blockComponents[block.type];
  if (!Component) return null;
  return <Component {...block} />;
}
