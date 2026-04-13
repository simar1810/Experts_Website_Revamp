import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronDown, LogOut, MessageCircle, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const ClientNavbarDropdown = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const DROPDOWN_MENU_ITEMS = [
    {
      label: "Profile",
      icon: <User className="size-5" />,
      onClick: () => router.push("/dashboard"),
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
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#84cc16] rounded-full flex items-center justify-center text-white shadow-inner shrink-0">
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
        {DROPDOWN_MENU_ITEMS.map((item, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={item.onClick}
            className={`${item.customClassName}`}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClientNavbarDropdown;
