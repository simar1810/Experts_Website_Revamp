"use server";

import { headers } from "next/headers";

/**
 * Decide if the request is for a tenant-specific (whitelabel) experts listing.
 *
 * Host examples:
 * - zeefit.in, www.zeefit.in → main marketing site (no tenant)
 * - acme.zeefit.in → tenant "acme"
 * - brand.localhost → tenant "brand" (local dev)
 * - localhost, localhost:3000 → main site
 */
export const resolvePartner = async function () {
  const headersList = await headers();
  const hostHeader = headersList.get("host") || "";
  const pathnameRaw = headersList.get("x-url") || "/";

  const host = hostHeader.split(":")[0];
  let parts = host.split(".");
  if (parts[0] === "www") {
    parts.shift();
  }

  let partner = null;
  let success = false;

  const isLocalhostDomain = parts[parts.length - 1] === "localhost";
  const hasPartnerSubdomain = isLocalhostDomain ? parts.length >= 2 : parts.length >= 3;

  if (hasPartnerSubdomain) {
    const potentialPartner = parts[0];
    if (potentialPartner && potentialPartner !== "localhost") {
      partner = potentialPartner;
      success = true;
    }
  }

  const url = new URL(pathnameRaw);

  return {
    success,
    partner,
    pathname: url.pathname || "/",
  };
};