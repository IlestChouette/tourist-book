import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request) {
  let response = NextResponse.next({ request });

  // Rafraîchit la session Supabase (hôteliers) sur chaque requête.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Zone hôtelier ("/panel") : protégée, sauf connexion/inscription.
  if (pathname.startsWith("/panel")) {
    const isAuthPage = pathname === "/panel/login" || pathname === "/panel/registro";
    if (!user && !isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/panel/login";
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Zone admin ("/admin") : page cachée, non indexée, réservée à un compte
  // admin distinct des hôteliers. L'autorisation (is_admin) est vérifiée
  // dans la page elle-même ; ici on ne fait que s'assurer qu'il y a une
  // session avant d'y accéder.
  if (pathname.startsWith("/admin")) {
    const isAuthPage = pathname === "/admin/login";
    if (!user && !isAuthPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    return response;
  }

  // Livret voyageur ("/logement/[slug]") : protégé par code d'accès.
  const match = pathname.match(/^\/logement\/([^/]+)(\/.*)?$/);
  if (match) {
    const [, slug, rest = ""] = match;
    if (rest.startsWith("/entrer")) return response;

    const unlocked = request.cookies.get(`access_${slug}`)?.value === "1";
    if (!unlocked) {
      const url = request.nextUrl.clone();
      url.pathname = `/logement/${slug}/entrer`;
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
