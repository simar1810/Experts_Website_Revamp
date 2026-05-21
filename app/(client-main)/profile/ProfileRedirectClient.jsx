"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMainSiteUrl, isShopBrowserHost } from "@/lib/shopHost";

export default function ProfileRedirectClient() {
  const router = useRouter();

  useEffect(() => {
    if (isShopBrowserHost()) {
      window.location.replace(getMainSiteUrl("/dashboard"));
      return;
    }
    router.replace("/dashboard");
  }, [router]);

  return null;
}
