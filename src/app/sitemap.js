import { blogPosts } from "@/data/blogPosts";

const BASE_URL = "https://tourist-book.com";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
  { path: "/livret-accueil-nice", priority: 0.7, changeFrequency: "monthly" },
  { path: "/livret-accueil-cannes", priority: 0.7, changeFrequency: "monthly" },
  { path: "/livret-accueil-antibes", priority: 0.7, changeFrequency: "monthly" },
  { path: "/terminos", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" },
  { path: "/aviso-legal", priority: 0.3, changeFrequency: "yearly" },
  { path: "/mapa-del-sitio", priority: 0.2, changeFrequency: "monthly" },
  { path: "/panel/login", priority: 0.5, changeFrequency: "yearly" },
  { path: "/panel/registro", priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap() {
  const lastModified = new Date();
  const staticEntries = routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
  const blogEntries = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));
  return [...staticEntries, ...blogEntries];
}
