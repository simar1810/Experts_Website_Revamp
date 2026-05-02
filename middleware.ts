import { NextRequest, NextResponse } from "next/server";
import { isShopRequestHost, normalizeHost } from "@/lib/shopHost";

function isCollectionsPath(pathname: string) {
  return pathname === "/collections" || pathname.startsWith("/collections/");
}

/** Main site /collections/... → shop short URL: /, /chingu, /a/b, … */
function collectionsPathToShopPath(pathname: string): string {
  if (pathname === "/collections" || pathname === "/collections/") {
    return "/";
  }
  if (pathname.startsWith("/collections/")) {
    return pathname.slice("/collections".length);
  }
  return pathname;
}

/** Paths that must not be prefixed with /collections on the shop host */
function isShopPassthroughPath(pathname: string) {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/app.webmanifest" ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/svg/")
  ) {
    return true;
  }
  if (
    /\.(ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot|txt|xml|json|map|webmanifest)$/i.test(
      pathname,
    )
  ) {
    return true;
  }
  return false;
}

function rewriteShopToCollections(request: NextRequest, pathname: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);
  const rewriteUrl = request.nextUrl.clone();
  if (pathname === "/" || pathname === "") {
    rewriteUrl.pathname = "/collections";
  } else {
    rewriteUrl.pathname = `/collections${pathname}`;
  }
  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  });
}

/**
 * Base URL for the shop host (redirect target when the main site opens /collections).
 * Explicit env wins; otherwise infer dev (localhost → shop.localhost, same port).
 */
function getShopSiteOrigin(request: NextRequest): string {
  const explicit = process.env.SHOP_SITE_ORIGIN || process.env.NEXT_PUBLIC_SHOP_ORIGIN;
  if (explicit) return explicit.replace(/\/?$/, "");

  const shopHostnameSetting = process.env.SHOP_HOSTNAME || "shop.zeefit.in";
  const shopNormalized = normalizeHost(shopHostnameSetting);

  const forwardedHost = request.headers.get("x-forwarded-host") || "";
  const hostHeader = request.headers.get("host") || "";
  const fullHost = forwardedHost || hostHeader;
  const mainNormalized = normalizeHost(fullHost);

  const portMatch = fullHost.match(/:(\d+)$/);
  const portFromHeader = portMatch ? portMatch[1] : "";
  const port = request.nextUrl.port || portFromHeader || "";

  const { protocol } = request.nextUrl;

  if (mainNormalized === "localhost" || mainNormalized === "127.0.0.1") {
    const p = port || "3000";
    return `http://shop.localhost:${p}`;
  }

  if (shopNormalized === "shop.localhost" || shopNormalized.endsWith(".localhost")) {
    if (port) return `${protocol}//${shopNormalized}:${port}`;
    return `${protocol}//${shopNormalized}`;
  }

  return `https://${shopHostnameSetting}`.replace(/\/$/, "");
}

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host") || "";
  const hostHeader = request.headers.get("host") || "";
  const host = normalizeHost(forwardedHost || hostHeader);

  const shopHostname = process.env.SHOP_HOSTNAME || "shop.zeefit.in";

  const { pathname, search } = request.nextUrl;

  if (isShopRequestHost(host, shopHostname)) {
    if (isShopPassthroughPath(pathname)) {
    } else if (pathname === "/" || pathname === "") {
      return rewriteShopToCollections(request, pathname);
    } else if (isCollectionsPath(pathname)) {
      const dest = request.nextUrl.clone();
      dest.pathname = collectionsPathToShopPath(pathname);
      return NextResponse.redirect(dest, 308);
    } else {
      return rewriteShopToCollections(request, pathname);
    }
  } else if (isCollectionsPath(pathname)) {
    const shopOrigin = getShopSiteOrigin(request);
    const base = shopOrigin.replace(/\/?$/, "/");
    const shopPath = collectionsPathToShopPath(pathname);
    const destUrl = new URL(`${shopPath}${search}`, base);
    return NextResponse.redirect(destUrl, 308);
  }

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-url", request.url);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
