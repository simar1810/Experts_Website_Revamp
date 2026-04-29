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

  const host = hostHeader.split(":")[0];
  let parts = host.split(".");
  if (parts[0] === "www") {
    parts.shift();
  }

  let partner = null;
  let success = false;

  if (parts.length >= 2) {
    const potentialPartner = parts[0];
    if (potentialPartner !== "localhost") {
      partner = potentialPartner;
      success = true;
    }
  }

  return {
    success,
    partner
  }
}