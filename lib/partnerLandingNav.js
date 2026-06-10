import { appendAuthSyncHash } from "@/lib/clientAuthStorage";

/**
 * Shop marketplace origin (shop.localhost in dev, shop.zeefit.in in prod).
 */
export function resolveShopMarketplaceOrigin() {
  const explicit =
    process.env.NEXT_PUBLIC_SHOP_SITE_ORIGIN || process.env.SHOP_SITE_ORIGIN;
  if (explicit) return String(explicit).replace(/\/$/, "");

  const main =
    process.env.NEXT_PUBLIC_MAIN_ORIGIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.MAIN_SITE_ORIGIN ||
    "http://localhost:3000";

  try {
    const u = new URL(main.includes("://") ? main : `http://${main}`);
    const port = u.port || "3000";
    if (u.hostname === "localhost" || u.hostname.endsWith(".localhost")) {
      return `${u.protocol}//shop.localhost:${port}`;
    }
    const shopHost = process.env.SHOP_HOSTNAME || "shop.zeefit.in";
    return `${u.protocol}//${shopHost}`;
  } catch {
    return "http://shop.localhost:3000";
  }
}

/** Main Zeefit app origin (localhost:3000 in dev). */
export function resolveMainSiteOrigin() {
  const explicit =
    process.env.NEXT_PUBLIC_MAIN_ORIGIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.MAIN_SITE_ORIGIN;
  if (explicit) return String(explicit).replace(/\/$/, "");

  return "http://localhost:3000";
}

export function getShopMarketplaceUrl() {
  const base = `${resolveShopMarketplaceOrigin()}/`;
  if (typeof window === "undefined") return base;
  return appendAuthSyncHash(base);
}

export function getFindExpertsPageUrl() {
  const base = `${resolveMainSiteOrigin()}/find-experts`;
  if (typeof window === "undefined") return base;
  return appendAuthSyncHash(base);
}
