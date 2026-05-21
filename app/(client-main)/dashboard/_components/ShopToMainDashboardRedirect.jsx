"use client";

import { useEffect } from "react";
import { getMainSiteUrl, isShopBrowserHost } from "@/lib/shopHost";

/** Shop host has no client dashboard tenant — send users to the main site. */
export default function ShopToMainDashboardRedirect() {
  useEffect(() => {
    if (!isShopBrowserHost()) return;
    const target = getMainSiteUrl("/dashboard");
    if (window.location.href !== target) {
      window.location.replace(target);
    }
  }, []);

  return null;
}
