import { NextRequest, NextResponse } from "next/server";

// Détection de langue à l'arrivée sur le site.
// Priorité : 1. URL déjà localisée  2. cookie (visiteur qui revient)
// 3. langue du navigateur (Accept-Language)  4. français (marché de base).

const LOCALES = ["fr", "en"] as const;
const COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // URL déjà localisée (/fr ou /en) → on laisse passer,
  // en mémorisant cette langue pour la prochaine visite
  const pathLocale = LOCALES.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (pathLocale) {
    const response = NextResponse.next();
    if (request.cookies.get(COOKIE)?.value !== pathLocale) {
      response.cookies.set(COOKIE, pathLocale, {
        maxAge: ONE_YEAR,
        path: "/",
      });
    }
    return response;
  }

  // Cookie d'une visite précédente ?
  const cookieLocale = request.cookies.get(COOKIE)?.value;
  let locale = LOCALES.find((l) => l === cookieLocale);

  // Sinon, langue préférée du navigateur : en* → anglais, tout le reste → français
  if (!locale) {
    const preferred =
      request.headers
        .get("accept-language")
        ?.split(",")[0]
        ?.trim()
        .toLowerCase() ?? "";
    locale = preferred.startsWith("en") ? "en" : "fr";
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(COOKIE, locale, { maxAge: ONE_YEAR, path: "/" });
  return response;
}

export const config = {
  // Exclut l'API, les fichiers internes Next.js et tous les assets
  // (og-image.png, enzo.jpg, favicon…) : eux ne doivent JAMAIS être redirigés
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
