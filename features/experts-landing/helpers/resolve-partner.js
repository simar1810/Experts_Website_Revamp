"use server"

import { headers } from "next/headers"

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