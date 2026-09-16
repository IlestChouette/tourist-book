import { notFound } from "next/navigation";
import Link from "next/link";
import Hero from "@/components/Hero";
import { BlogBlock } from "@/components/BlogBlocks";
import { blogPosts, getBlogPost } from "@/data/blogPosts";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric" });

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Tourist Book`,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: "Tourist Book" },
  };

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <Hero backHref="/blog" backLabel="Blog" eyebrow={dateFormatter.format(new Date(post.publishedAt))} title={post.title} />
      <article className="mx-auto max-w-3xl px-6 py-14">
        <div className="grid gap-10">
          {post.blocks.map((block, i) => (
            <BlogBlock key={i} block={block} />
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-sand-dim bg-sand-card p-7 text-center">
          <p className="font-display italic text-xl text-ink">Envie d&apos;un livret comme celui-ci pour votre logement ?</p>
          <Link
            href="/panel/registro"
            className="mt-4 inline-block rounded bg-terracotta px-6 py-3.5 font-bold text-ink transition-colors hover:bg-terracotta-deep"
          >
            Créer mon compte gratuit →
          </Link>
        </div>
      </article>
    </main>
  );
}
