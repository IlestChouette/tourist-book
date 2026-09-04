import Link from "next/link";
import Hero from "@/components/Hero";
import { blogPosts } from "@/data/blogPosts";

export const metadata = {
  title: "Blog — Tourist Book",
  description: "Guides et conseils pour créer un livret d'accueil efficace et accueillir vos voyageurs sans effort, par Tourist Book.",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric" });

export default function BlogIndexPage() {
  return (
    <main className="flex-1">
      <Hero eyebrow="Blog" title="Blog" subtitle="Guides pour créer et améliorer votre livret d'accueil." />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded border border-sand-dim bg-sand-card p-5 transition-colors hover:border-aqua-deep"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
                {dateFormatter.format(new Date(post.publishedAt))}
              </p>
              <h2 className="mt-2 font-display italic text-2xl text-ink">{post.title}</h2>
              <p className="mt-2 text-ink/70">{post.excerpt}</p>
              <span className="mt-3 inline-block text-sm font-bold text-aqua-deep">Lire →</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
