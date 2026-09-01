const BASE_URL = "https://tourist-book.com";

const routes = ["/", "/terminos", "/privacidad", "/aviso-legal", "/mapa-del-sitio", "/panel/login", "/panel/registro"];

export default function sitemap() {
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
