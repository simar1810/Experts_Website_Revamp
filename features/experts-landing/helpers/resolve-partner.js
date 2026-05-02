"use server";

import { headers } from "next/headers";
import { normalizeHost } from "@/lib/shopHost";

/**
 * Decide if the request is for a tenant-specific (whitelabel) experts listing.
 *
 * Host examples:
 * - zeefit.in, www.zeefit.in → main marketing site (no tenant)
 * - shop.zeefit.in → product shop host (not a tenant; no partner)
 * - acme.zeefit.in → tenant "acme"
 * - brand.localhost → tenant "brand" (local dev)
 * - localhost, localhost:3000 → main site
 */
export const resolvePartner = async function () {
  const headersList = await headers();
  const forwardedHostHeader = headersList.get("x-forwarded-host") || "";
  const hostHeader = headersList.get("host") || "";
  const pathnameRaw = headersList.get("x-url") || "/";

  const host = normalizeHost(forwardedHostHeader || hostHeader);
  let parts = host.split(".");
  if (parts[0] === "www") {
    parts.shift();
  }

  if (parts[0] === "shop") {
    const url = new URL(pathnameRaw);
    return {
      success: false,
      partner: null,
      pathname: url.pathname || "/",
    };
  }

  let partner = null;
  let success = false;

  const normalizedHost = parts.join(".");
  const isLocalhostDomain =
    normalizedHost === "localhost" || normalizedHost.endsWith(".localhost");
  const isZeefitTenantDomain = normalizedHost.endsWith(".zeefit.in");

  if (isLocalhostDomain && parts.length >= 2) {
    partner = parts[0];
    success = true;
  } else if (isZeefitTenantDomain && parts.length >= 3) {
    partner = parts[0];
    success = true;
  }

  const url = new URL(pathnameRaw);

  return {
    success,
    partner,
    pathname: url.pathname || "/",
  };
};
