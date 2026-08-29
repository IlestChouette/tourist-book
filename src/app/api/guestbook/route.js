import { listGuestbook, addGuestbookEntry, setGuestbookHidden } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const all = searchParams.get("all");
  const items = await listGuestbook();
  const filtered = slug ? items.filter((i) => i.slug === slug) : items;
  const visible = all ? filtered : filtered.filter((i) => !i.hidden);
  return Response.json(visible);
}

export async function POST(request) {
  const body = await request.json();
  const item = await addGuestbookEntry(body);
  return Response.json(item, { status: 201 });
}

export async function PATCH(request) {
  const body = await request.json();
  await setGuestbookHidden(body.id, body.hidden);
  return Response.json({ ok: true });
}
