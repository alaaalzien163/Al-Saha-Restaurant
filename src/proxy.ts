import { NextResponse, type NextRequest } from "next/server";
import { refreshSession } from "@/lib/supabase/proxy";
import {
  DEFAULT_LOCALE,
  localePrefixFor,
  splitLocale,
} from "@/i18n/constants";

const ADMIN_ROOT = "/admin";
const ADMIN_LOGIN = "/admin/login";

/** Header next-intl reads to resolve the locale outside of a layout render. */
const LOCALE_HEADER = "X-NEXT-INTL-LOCALE";

/**
 * Next.js proxy (the Next 16 name for middleware).
 *
 * Responsibilities:
 * 1. Locale routing — resolve the active locale, rewrite unprefixed requests
 *    internally to `app/[lang]`, and canonicalise `/en/...` away so every
 *    page has exactly one URL.
 * 2. Publish the resolved locale on the `X-NEXT-INTL-LOCALE` request header so
 *    server actions (which never render the root layout) can localise their
 *    responses.
 * 3. Refresh the Supabase session cookie on admin traffic.
 * 4. Optimistically redirect unauthenticated admin traffic to the login page.
 *
 * Steps 3–4 are defence-in-depth only. The authoritative check runs on the
 * server in the admin layout via `requireAdmin()`, and RLS remains the final
 * layer. Session refresh stays scoped to `/admin` so public traffic never pays
 * for an auth round-trip.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale, routePath } = splitLocale(pathname);
  const activeLocale = locale ?? DEFAULT_LOCALE;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, activeLocale);

  let cookieSource: NextResponse | null = null;

  if (isAdminRoute(routePath)) {
    const { response, user } = await refreshSession(request);
    cookieSource = response;

    const blocked = adminRedirect(request, routePath, locale, user !== null);
    if (blocked) return withCookies(blocked, cookieSource);
  }

  let result: NextResponse;

  if (locale === null) {
    // No prefix: serve the default locale without changing the public URL.
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
    result = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  } else if (locale === DEFAULT_LOCALE) {
    // `/en/...` duplicates `/...` — canonicalise to the unprefixed URL.
    const url = request.nextUrl.clone();
    url.pathname = routePath;
    result = NextResponse.redirect(url);
  } else {
    result = NextResponse.next({ request: { headers: requestHeaders } });
  }

  return cookieSource ? withCookies(result, cookieSource) : result;
}

function isAdminRoute(routePath: string): boolean {
  return routePath === ADMIN_ROOT || routePath.startsWith(`${ADMIN_ROOT}/`);
}

/**
 * Redirects unauthenticated users away from the admin area and authenticated
 * users away from the login page, keeping them on the locale they requested.
 * Returns `null` when the request may proceed.
 */
function adminRedirect(
  request: NextRequest,
  routePath: string,
  locale: string | null,
  isAuthenticated: boolean,
): NextResponse | null {
  const prefix = localePrefixFor(locale ?? DEFAULT_LOCALE);
  const isLoginPath = routePath === ADMIN_LOGIN;

  if (!isLoginPath && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}${ADMIN_LOGIN}`;
    url.search = `?next=${encodeURIComponent(pathnameOnly(request))}`;
    return NextResponse.redirect(url);
  }

  if (isLoginPath && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = `${prefix}${ADMIN_ROOT}`;
    url.search = "";
    return NextResponse.redirect(url);
  }

  return null;
}

function pathnameOnly(request: NextRequest): string {
  const { pathname, search } = request.nextUrl;
  return search ? `${pathname}${search}` : pathname;
}

function withCookies(target: NextResponse, source: NextResponse): NextResponse {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie);
  }
  return target;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
