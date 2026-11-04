import { blogPosts } from "@/data/blogPosts";
import { cityPages } from "@/data/cityPages";
import { featurePages } from "@/data/featurePages";

const BASE_URL = "https://tourist-book.com";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/hotel", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/terminos", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" },
  { path: "/aviso-legal", priority: 0.3, changeFrequency: "yearly" },
  { path: "/mapa-del-sitio", priority: 0.2, changeFrequency: "monthly" },
];

export default function sitemap() {
  const lastModified = new Date();
  const staticEntries = routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
  const cityEntries = cityPages.map((c) => ({ url: `${BASE_URL}/livret-accueil-${c.slug}`, lastModified, changeFrequency: "monthly", priority: 0.7 }));
  const featureEntries = featurePages.map((p) => ({ url: `${BASE_URL}${p.path}`, lastModified, changeFrequency: "monthly", priority: 0.75 }));
  const blogEntries = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));
  return [...staticEntries, ...cityEntries, ...featureEntries, ...blogEntries];
}
