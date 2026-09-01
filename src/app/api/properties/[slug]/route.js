import { getPropertyBySlug } from "@/lib/properties";

// Appelée avant que l'hôte ait le code d'accès (écran de saisie du code) :
// ne doit renvoyer que ce qui est affichable sans authentification. Ne
// jamais renvoyer access_code, wifi_password, etc. depuis cette route.
export async function GET(request, { params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return Response.json({ error: "Logement introuvable" }, { status: 404 });
  }
  return Response.json({ name: property.name });
}
