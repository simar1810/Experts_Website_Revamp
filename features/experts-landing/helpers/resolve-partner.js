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
  const raw = headersList.get("host") ?? "";
  const host = raw.split(":")[0]?.toLowerCase() ?? "";
  const parts = host.split(".").filter(Boolean);

  if (parts.length === 0) {
    return { success: false, partner: "" };
  }

  // e.g. localhost, 127.0.0.1 (single-token hosts)
  if (parts.length === 1) {
    return { success: false, partner: parts[0] };
  }

  // *.localhost — first label is the tenant (brand.localhost:3000)
  if (parts[parts.length - 1] === "localhost") {
    const tenant = parts[0];
    return {
      success: Boolean(tenant && tenant !== "www"),
      partner: tenant || "",
    };
  }

  // Apex only e.g. zeefit.in — no subdomain tenant
  if (parts.length === 2) {
    return { success: false, partner: "" };
  }

  // www.zeefit.in — www is the canonical main site, not a tenant slug
  if (parts[0] === "www") {
    return { success: false, partner: "" };
  }

  // tenant.zeefit.in (or deeper subdomains using first label as tenant)
  return {
    success: true,
    partner: parts[0],
  };
};
