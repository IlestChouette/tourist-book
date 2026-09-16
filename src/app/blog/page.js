import Link from "next/link";
import Hero from "@/components/Hero";
import { blogPosts } from "@/data/blogPosts";

export const metadata = {
  title: "Blog — Tourist Book",
  description: "Guides pour créer un livret d'accueil efficace, gérer l'enregistrement des voyageurs et automatiser les questions du quotidien.",
  alternates: { canonical: "/blog" },
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric" });

export default function BlogIndexPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <main className="flex-1">
      <Hero eyebrow="Blog" title="Blog" subtitle="Guides pour créer et améliorer votre livret d'accueil." />
      <section className="mx-auto max-w-5xl px-6 py-14">
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block border-b-4 border-ink pb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta-deep">À la une</span>
            <h2 className="mt-3 font-display italic text-4xl leading-[1.1] text-ink sm:text-5xl">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-ink/70">{featured.excerpt}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ink/50">
              {dateFormatter.format(new Date(featured.publishedAt))}
            </p>
            <span className="mt-2 inline-block text-sm font-bold text-aqua-deep group-hover:underline">Lire →</span>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-10 grid gap-10 sm:grid-cols-2 sm:divide-x sm:divide-sand-dim lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group sm:pl-10 sm:first:pl-0">
                <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
                  {dateFormatter.format(new Date(post.publishedAt))}
                </p>
                <h2 className="mt-2 font-display italic text-2xl leading-tight text-ink group-hover:text-aqua-deep">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm text-ink/70">{post.excerpt}</p>
                <span className="mt-3 inline-block text-sm font-bold text-aqua-deep">Lire →</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
