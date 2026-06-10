import { appendAuthSyncHash } from "@/lib/clientAuthStorage";

/**
 * Shop hostname detection (kept in sync with middleware).
 * Strips a trailing :port only (handles shop.localhost:3000 — not only first ":").
 * @param {string} [value]
 */
export function normalizeHost(value = "") {
  const raw = String(value).split(",")[0].trim().toLowerCase();
  if (raw.startsWith("[")) {
    const end = raw.indexOf("]:");
    if (end !== -1) return raw.slice(1, end);
    return raw;
  }
  const withPort = raw.match(/^(.+):(\d+)$/);
  if (withPort) return withPort[1];
  return raw;
}

/**
 * @param {string} host — normalized hostname (use {@link normalizeHost} on Host / x-forwarded-host)
 * @param {string} [configuredShopHostname] — defaults to SHOP_HOSTNAME or shop.zeefit.in
 */
export function isShopRequestHost(host, configuredShopHostname) {
  const configured =
    configuredShopHostname ?? process.env.SHOP_HOSTNAME ?? "shop.zeefit.in";
  if (host === normalizeHost(configured)) return true;
  if (host === "shop.localhost") return true;
  return false;
}

/** True when running in the browser on the shop host (shop.localhost, shop.zeefit.in, …). */
export function isShopBrowserHost() {
  if (typeof window === "undefined") return false;
  return isShopRequestHost(normalizeHost(window.location.hostname));
}

/**
 * Main Zeefit site origin (inverse of middleware `getShopSiteOrigin`).
 * Used to send dashboard/profile traffic off the shop host.
 */
export function getMainSiteOrigin(options = {}) {
  const explicit =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
    (typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_MAIN_SITE_ORIGIN) ||
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_MAIN_ORIGIN) ||
    (typeof process !== "undefined" && process.env.MAIN_SITE_ORIGIN);
  if (explicit) return String(explicit).replace(/\/$/, "");

  const host =
    options.hostname ??
    (typeof window !== "undefined" ? window.location.hostname : "");
  const normalized = normalizeHost(host);
  const port =
    options.port ??
    ((typeof window !== "undefined" ? window.location.port : "") || "3000");
  const protocol =
    options.protocol ??
    (typeof window !== "undefined" ? window.location.protocol : "http:");

  if (normalized === "shop.localhost") {
    return `http://localhost:${port}`;
  }

  const shopHost = normalizeHost(
    (typeof process !== "undefined" && process.env.SHOP_HOSTNAME) ||
      "shop.zeefit.in",
  );
  if (normalized === shopHost && shopHost.startsWith("shop.")) {
    const mainHost = shopHost.slice("shop.".length);
    return `${protocol}//${mainHost}${port ? `:${port}` : ""}`;
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return `http://localhost:${port}`;
}

/**
 * Server-side: dashboard URL for the current request (shop host → main site origin).
 */
export async function getClientDashboardRedirectUrl() {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const hostHeader =
    headersList.get("x-forwarded-host") || headersList.get("host") || "";
  const host = normalizeHost(hostHeader);
  if (!isShopRequestHost(host)) return "/dashboard";

  const portMatch = hostHeader.match(/:(\d+)$/);
  const port = portMatch?.[1] || "";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const origin = getMainSiteOrigin({
    hostname: host,
    port,
    protocol: `${proto}:`,
  });
  const dest = `${origin.replace(/\/$/, "")}/dashboard`;
  // Next may treat same-deployment hosts as internal; external URL must differ by host.
  if (dest.startsWith("http://") || dest.startsWith("https://")) return dest;
  return "/dashboard";
}

/** Absolute URL on the main site when on shop; otherwise a same-origin path. */
export function getMainSiteUrl(path = "/") {
  const pathNorm = path.startsWith("/") ? path : `/${path}`;
  if (!isShopBrowserHost()) return pathNorm;
  const origin = getMainSiteOrigin({
    hostname: window.location.hostname,
    port: window.location.port,
    protocol: window.location.protocol,
  });
  const base = `${origin.replace(/\/$/, "")}${pathNorm}`;
  if (typeof window === "undefined") return base;
  return appendAuthSyncHash(base);
}
