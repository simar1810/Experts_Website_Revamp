"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { ValuesProvider } from "@/context/valuesContext";
import ClientNavbar from "./_components/common/client-navbar/ClientNavbar";

export default function ClientMainLayoutShell({
  children,
  hideShopNavLinks = false,
}) {
  const pathname = usePathname() ?? "";
  const hideFooter =
    pathname === "/enquiries" || pathname.startsWith("/enquiries/");
  const hideNavbar = pathname === "/experts/pricing";
  const isDashboard =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/" || isDashboard) return;
    const onPageShow = (e) => {
      if (e.persisted) router.refresh();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [pathname, isDashboard, router]);

  if (isDashboard) {
    return children;
  }

  return (
    <div
      className={cn(
        "flex flex-col",
        hideFooter
          ? "h-dvh max-h-dvh min-h-0 overflow-hidden"
          : "min-h-dvh",
      )}
    >
      {!hideNavbar && (
        <div className="shrink-0">
          <ClientNavbar hideNavLinks={hideShopNavLinks} />
        </div>
      )}
      <ValuesProvider>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </ValuesProvider>
      {!hideFooter && (
        <div className="shrink-0">
          <Footer />
        </div>
      )}
    </div>
  );
}
