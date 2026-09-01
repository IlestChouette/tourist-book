const BASE_URL = "https://tourist-book.com";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/terminos", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacidad", priority: 0.3, changeFrequency: "yearly" },
  { path: "/aviso-legal", priority: 0.3, changeFrequency: "yearly" },
  { path: "/mapa-del-sitio", priority: 0.2, changeFrequency: "monthly" },
  { path: "/panel/login", priority: 0.5, changeFrequency: "yearly" },
  { path: "/panel/registro", priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
