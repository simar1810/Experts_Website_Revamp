"use client";

import { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Album,
  ChevronRight,
  MessageCircle,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "My Coach", href: "/dashboard", icon: User },
  {
    label: "Chat",
    href: "/dashboard/enquiries",
    icon: MessageCircle,
  },
  {
    label: "My Programs",
    href: "/dashboard/programs",
    icon: Album,
  },
  // {
  //   label: "Sessions/Meetings",
  //   href: "/dashboard/sessions",
  //   icon: UserCog,
  // },
];

function WellnessLogo() {
  return (
    <div className="flex w-full justify-center">
      <Link
        href="/"
        className="inline-flex w-fit max-w-full shrink-0 items-center justify-center rounded-md bg-transparent px-2 py-2 shadow-sm"
      >
        <Image
          src="/experts-logo.png"
          alt="Zeefit"
          width={400}
          height={120}
          className="h-9 max-h-9 w-auto max-w-[min(100%,148px)] object-contain object-center sm:h-10 sm:max-h-10 sm:max-w-[168px]"
          priority
        />
      </Link>
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname() ?? "";
  const { isMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, isMobile, setOpenMobile]);

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="gap-4 border-b border-zinc-800/60 p-4 pb-5">
        <WellnessLogo />
      </SidebarHeader>

      <SidebarContent className="font-lato px-2 py-3">
        <SidebarMenu className="gap-2">
          {NAV_ITEMS.map(
            ({ label, href, icon: Icon, chevron, notify }) => {
              const active =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(href));

              return (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={cn(
                      "h-10 gap-3  px-3 text-zinc-400 transition-colors hover:bg-white/6 hover:text-zinc-100 data-[active=true]:bg-[#67BC2A] data-[active=true]:text-white",
                      // Shadcn menu button sets [&_svg]:size-4 on all descendants; icons sit inside
                      // <span>, chevrons are direct <svg> children — scope larger icons to span only.
                      "[&_span_svg]:size-5 [&_span_svg]:shrink-0",
                    )}
                  >
                    <Link
                      href={href}
                      onClick={closeMobileSidebar}
                      className="flex w-full items-center gap-3"
                    >
                      <span className="relative inline-flex size-5 shrink-0 items-center justify-center">
                        <Icon
                          size={20}
                          strokeWidth={1.5}
                          className="size-5 shrink-0"
                        />
                      </span>
                      <span className="flex-1 truncate text-left text-[16px] font-semibold">
                        {label}
                      </span>
                      {notify ? (
                        <span
                          className="size-2 shrink-0 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                          aria-hidden
                        />
                      ) : null}
                      {chevron ? (
                        <ChevronRight
                          size={16}
                          className="size-4 shrink-0 text-zinc-600"
                        />
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            },
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
