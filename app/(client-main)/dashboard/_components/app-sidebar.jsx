"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  Footprints,
  Home,
  LayoutGrid,
  MessageCircle,
  Newspaper,
  Search,
  Settings,
  Soup,
  Store,
  User,
  Users,
  Dumbbell,
  Album,
  UserCog,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Profile Overview", href: "/dashboard", icon: User },
  {
    label: "Coach Chats",
    href: "/dashboard/enquiries",
    icon: MessageCircle,
  },
  {
    label: "Programs",
    href: "/dashboard/programs",
    icon: Album,
  },
  {
    label: "Sessions/Meetings",
    href: "/dashboard/sessions",
    icon: UserCog,
  },
];

function WellnessLogo() {
  return (
    <Link
      href="/"
      className="text-base sm:text-2xl font-bold font-serif italic text-white truncate sm:whitespace-nowrap"
    >
      Wellness<span className="text-[#84cc16]">Z </span>Experts
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname() ?? "";

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="gap-4 border-b border-zinc-800/60 p-4 pb-5">
        <WellnessLogo />
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            name="sidebar-search"
            placeholder="Search features..."
            className="h-11 w-full rounded-full border border-zinc-800 bg-zinc-900/90 pl-10 pr-4 text-sm text-zinc-200 outline-none placeholder:text-zinc-500 focus:border-[#70C136]/40 focus:ring-1 focus:ring-[#70C136]/25"
            autoComplete="off"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="font-lato px-2 py-3">
        <SidebarMenu className="gap-2">
          {NAV_ITEMS.map(
            ({ label, href, icon: Icon, chevron, isNew, notify }) => {
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

      <SidebarFooter className="border-t border-zinc-800/60 p-3">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white ring-1 ring-zinc-700/80 transition hover:bg-zinc-800"
          aria-label="Account"
        >
          N
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
