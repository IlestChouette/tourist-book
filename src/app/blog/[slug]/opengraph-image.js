import { ImageResponse } from "next/og";
import { getBlogPost } from "@/data/blogPosts";

export const alt = "Article du blog Tourist Book";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Image de partage (Facebook, WhatsApp, LinkedIn…) : le titre de l'article en
// grand, sur les couleurs du site. Sans elle, le partage affichait le logo
// générique avec le nom du site à la place du titre.
export default async function Image({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const title = post?.title ?? "Blog Tourist Book";
  const fontSize = title.length <= 55 ? 76 : title.length <= 85 ? 64 : 54;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#6fc7be", color: "#223339" }}>
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: "64px 72px 48px" }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, letterSpacing: 6, textTransform: "uppercase" }}>
            Tourist Book · Blog
          </div>
          <div style={{ display: "flex", fontSize, fontWeight: 700, lineHeight: 1.12 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 28 }}>tourist-book.com</div>
        </div>
        <div style={{ display: "flex", height: 28 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: i % 2 === 0 ? "#e2905f" : "#f7f1e4" }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
