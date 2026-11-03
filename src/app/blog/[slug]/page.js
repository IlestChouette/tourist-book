import { notFound } from "next/navigation";
import Link from "next/link";
import Hero from "@/components/Hero";
import { BlogBlock } from "@/components/BlogBlocks";
import { blogPosts, getBlogPost } from "@/data/blogPosts";
import { blogSeo } from "@/data/blogSeo";
import { cityPages } from "@/data/cityPages";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric" });

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const url = `https://tourist-book.com/blog/${post.slug}`;
  // openGraph/twitter explicites : sinon la page hérite de ceux du layout
  // (« Tourist Book ») et Facebook n'affiche pas le titre de l'article.
  // L'image vient de opengraph-image.js (titre de l'article).
  const seo = blogSeo[post.slug];
  return {
    title: `${seo?.seoTitle ?? post.title} — Tourist Book`,
    description: seo?.description ?? post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      siteName: "Tourist Book",
      locale: "fr_FR",
      title: post.title,
      description: post.metaDescription,
      publishedTime: post.publishedAt,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.metaDescription },
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
    publisher: { "@type": "Organization", name: "Tourist Book", url: "https://tourist-book.com" },
    mainEntityOfPage: `https://tourist-book.com/blog/${post.slug}`,
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://tourist-book.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://tourist-book.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://tourist-book.com/blog/${post.slug}` },
    ],
  };
  // Maillage interne : trois autres articles (les suivants dans la liste, en boucle).
  const idx = blogPosts.findIndex((p) => p.slug === post.slug);
  const related = [1, 2, 3].map((n) => blogPosts[(idx + n) % blogPosts.length]).filter((p) => p.slug !== post.slug);

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Hero compact backHref="/blog" backLabel="Blog" eyebrow={dateFormatter.format(new Date(post.publishedAt))} title={post.title} />
      <article className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
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
        <section className="mt-12" aria-labelledby="related">
          <h2 id="related" className="font-display italic text-2xl text-ink">À lire aussi</h2>
          <ul className="mt-4 grid gap-3">
            {related.map((p) => (
              <li key={p.slug}><Link href={`/blog/${p.slug}`} className="font-bold text-aqua-deep underline underline-offset-4">{p.title}</Link></li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink/70">
            Votre logement est sur la Côte d&apos;Azur ? Découvrez le livret d&apos;accueil numérique pour{" "}
            {cityPages.map((c, i) => (
              <span key={c.slug}>{i > 0 ? (i === cityPages.length - 1 ? " et " : ", ") : ""}<Link href={`/livret-accueil-${c.slug}`} className="font-bold text-aqua-deep underline underline-offset-4">{c.city}</Link></span>
            ))}
            .
          </p>
        </section>
      </article>
    </main>
  );
}
