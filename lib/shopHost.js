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
