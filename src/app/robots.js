const BASE_URL = "https://tourist-book.com";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkin", "/logement", "/panel/alojamientos", "/panel/perfil", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
