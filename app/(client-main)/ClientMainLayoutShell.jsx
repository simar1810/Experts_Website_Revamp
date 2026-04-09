"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { ValuesProvider } from "@/context/valuesContext";
import ClientNavbar from "./_components/common/client-navbar/ClientNavbar";

export default function ClientMainLayoutShell({ children }) {
  const pathname = usePathname() ?? "";
  const hideFooter =
    pathname === "/enquiries" || pathname.startsWith("/enquiries/");

  return (
    <div
      className={cn(
        "flex flex-col",
        hideFooter
          ? "h-dvh max-h-dvh min-h-0 overflow-hidden"
          : "min-h-dvh",
      )}
    >
      <div className="shrink-0">
        <ClientNavbar />
      </div>
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
