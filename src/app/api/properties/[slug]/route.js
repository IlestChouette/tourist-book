import { getPropertyBySlug } from "@/lib/properties";

export async function GET(request, { params }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) {
    return Response.json({ error: "Logement introuvable" }, { status: 404 });
  }
  return Response.json(property);
}
