"use server"

import { headers } from "next/headers"

export const resolvePartner = async function () {
  const headersList = await headers();
  const hostHeader = headersList.get("host")
  const partner = hostHeader?.split(".")?.at(0)
  return {
    success: typeof partner === "string" && !partner.includes("local"),
    partner
  }
}