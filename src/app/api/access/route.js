import { NextResponse } from "next/server";
import { getPropertyBySlug } from "@/lib/properties";

export async function POST(request) {
  const { slug, code } = await request.json();
  const property = await getPropertyBySlug(slug);

  if (!property || String(code ?? "").trim() !== property.access_code) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(`access_${slug}`, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
