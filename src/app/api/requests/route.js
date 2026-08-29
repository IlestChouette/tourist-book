import { listRequests, addRequest } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const items = await listRequests();
  const filtered = slug ? items.filter((i) => i.slug === slug) : items;
  return Response.json(filtered);
}

export async function POST(request) {
  const body = await request.json();
  const item = await addRequest(body);
  return Response.json(item, { status: 201 });
}
