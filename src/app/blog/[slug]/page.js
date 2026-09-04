import { notFound } from "next/navigation";
import Link from "next/link";
import Hero from "@/components/Hero";
import { blogPosts, getBlogPost } from "@/data/blogPosts";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { year: "numeric", month: "long", day: "numeric" });

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return { title: `${post.title} — Tourist Book`, description: post.metaDescription };
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
      <article className="mx-auto max-w-2xl px-6 py-10">
        <div className="grid gap-8 text-ink/80">
          {post.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display italic text-2xl text-ink">{section.heading}</h2>
              {section.paragraphs?.map((p, i) => (
                <p key={i} className="mt-3">
                  {p}
                </p>
              ))}
              {section.list && (
                <ul className="mt-3 grid gap-1.5">
                  {section.list.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 rounded border border-sand-dim bg-sand-card p-5 text-center">
          <p className="text-ink">Envie d&apos;un livret comme celui-ci pour votre logement ?</p>
          <Link
            href="/panel/registro"
            className="mt-3 inline-block rounded bg-terracotta px-5 py-3 font-bold text-ink transition-colors hover:bg-terracotta-deep"
          >
            Créer mon compte gratuit →
          </Link>
        </div>
      </article>
    </main>
  );
}
