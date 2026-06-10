import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getMainSiteUrl, isShopBrowserHost } from "@/lib/shopHost";

const ClientNavbarDropdown = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const profileHref = getMainSiteUrl("/dashboard");
  const profileLeavesShop = isShopBrowserHost();

  const DROPDOWN_MENU_ITEMS = [
    {
      label: "Profile",
      icon: <User className="size-5" />,
      href: profileHref,
      external: profileLeavesShop,
      customClassName: "text-base",
    },
    {
      label: "Logout",
      icon: <LogOut className="size-5" />,
      onClick: () => logout(),
      customClassName: "text-base text-red-500",
    },
  ];

  return (
    <DropdownMenu onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        {/* <Button variant="secondary" className="text-gray-900">
          {user?.name}
        </Button> */}
        <Button className="h-auto flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-gray-50 transition-colors shadow-sm">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[var(--brand-primary)] rounded-full flex items-center justify-center text-white shadow-inner shrink-0">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <span className="hidden sm:inline text-gray-800">{user?.name}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200",
              menuOpen && "rotate-180",
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-auto min-w-fit max-w-xs p-2"
      >
        {DROPDOWN_MENU_ITEMS.map((item, idx) =>
          item.href ? (
            <DropdownMenuItem
              key={idx}
              asChild
              className={item.customClassName}
            >
              {item.external ? (
                <a
                  href={item.href}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              key={idx}
              onSelect={item.onClick}
              className={item.customClassName}
            >
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientNavbarDropdown;
