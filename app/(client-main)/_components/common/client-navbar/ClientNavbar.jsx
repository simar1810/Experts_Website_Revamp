"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import {
  Album,
  ArrowLeftIcon,
  LogOut,
  MessageCircle,
  Menu,
  User,
  X,
} from "lucide-react";

import ClientNavbarDropdown from "./ClientNavbarDropdown";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import WellnessZLogoLink from "@/components/WellnessZLogoLink";
import Image from "next/image";
import GetStartedModal from "@/components/GetStartedModal";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";

const APP_DRAWER_ITEMS = [
  { label: "Chat", href: "/dashboard/enquiries", icon: MessageCircle },
  { label: "My Coach", href: "/dashboard", icon: User },
  { label: "My Programs", href: "/dashboard/programs", icon: Album },
];

export default function ClientNavbar({ isDashboard, hideNavLinks = false }) {
  const pathname = usePathname();
  if (["/experts"].includes(pathname)) return <></>;
  return (
    <Container isDashboard={isDashboard} hideNavLinks={hideNavLinks} />
  );
}

function Container({ isDashboard = false, hideNavLinks = false }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);

  const {
    isAuthenticated,
    logout,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    isRegisterModalOpen,
    openRegisterModal,
    closeRegisterModal,
  } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isTabActive = (path) => {
    if (path === "/") return pathname === "/" || pathname === "/home";
    return pathname === path || pathname?.startsWith(path + "/");
  };

  const isActive = (path) => {
    return isTabActive(path)
      ? "text-[var(--brand-primary)] border-b-2 border-[var(--brand-primary)] pb-1 font-bold"
      : "text-gray-500 hover:text-gray-900 font-medium border-b-2 border-transparent pb-1";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Coaches", href: "/find-experts" },
    { name: "Browse Programs", href: "/discover-programs" },
  ];

  return (
    <>
      <header className="sticky font-lato top-0 z-50 bg-white border-b border-gray-100">
        <nav
          className={cn(
            "flex items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-3 md:py-4 lg:px-8",
            isDashboard
              ? "w-full max-w-none"
              : "max-w-7xl mx-auto md:grid md:grid-cols-3",
          )}
        >
          {isDashboard ? (
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <SidebarTrigger
                aria-label="Open sidebar"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-zinc-700 hover:bg-gray-100 hover:text-zinc-700 md:hidden [&_svg]:size-5"
              />
              <div
                className={cn(
                  "hidden min-w-0 flex-1 items-center gap-4 overflow-x-auto md:flex md:gap-6 lg:gap-12",
                  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                )}
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${isActive(link.href)} shrink-0 text-sm transition-colors tracking-wider`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          {!isDashboard ? (
            <div className="flex shrink-0 items-center gap-2">
              <WellnessZLogoLink href="/" compact />
            </div>
          ) : null}
          {!isDashboard ? (
            <div className="hidden items-center justify-center gap-6 md:flex lg:gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${isActive(link.href)} whitespace-nowrap text-sm transition-colors tracking-wider`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="flex shrink-0 items-center justify-end gap-1.5 sm:gap-4">
            {isAuthenticated ? (
              <div className="hidden md:block">
                <ClientNavbarDropdown />
              </div>
            ) : (
              <button
                type="button"
                onClick={openLoginModal}
                className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-(--brand-primary) px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-lime-500/10 transition-all hover:bg-[#76b813] sm:rounded-xl sm:px-8 sm:py-2.5 sm:text-sm"
              >
                Login/Signup{" "}
                <ArrowLeftIcon className="h-3 w-3 rotate-180" />
              </button>
            )}

            {/* Mobile site nav — dashboard: right side; other pages: same control */}
            <button
              type="button"
              aria-label="Open navigation menu"
              className={cn(
                "rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-black md:hidden",
                isDashboard &&
                  "inline-flex size-9 shrink-0 items-center justify-center text-zinc-700",
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="size-5" />
              ) : isDashboard ? (
                <Menu className="size-5" />
              ) : (
                <Image
                  src="/svg/hamburger.svg"
                  height={20}
                  width={20}
                  alt="Hamburger menu"
                />
              )}
            </button>
          </div>
        </nav>

        {!hideNavLinks && isMobileMenuOpen && (
          <div
            id="client-nav-mobile-menu"
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm transition-colors ${isTabActive(link.href) ? "bg-lime-50 text-lime-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    openLoginModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg bg-(--brand-primary) px-4 py-3 text-left text-sm font-bold text-white hover:bg-[#76b813]"
                >
                  Login/Signup <ArrowLeftIcon className="h-3 w-3 rotate-180" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-500 font-bold hover:bg-red-50 border-t border-gray-50 mt-2 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {isAuthenticated ? (
        <button
          type="button"
          aria-label="Open app drawer"
          onClick={() => setIsAppDrawerOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex size-14 items-center justify-center rounded-full bg-[#67BC2A] text-white shadow-xl shadow-lime-700/20 transition-all hover:bg-[#58a923] focus:outline-none focus:ring-2 focus:ring-[#67BC2A] focus:ring-offset-2 md:hidden"
        >
          <User className="size-6" strokeWidth={2} />
        </button>
      ) : null}

      <Sheet open={isAppDrawerOpen} onOpenChange={setIsAppDrawerOpen}>
        <SheetContent
          side="bottom"
          showCloseButton
          className="font-lato gap-0 rounded-t-3xl border border-gray-200 bg-white p-0 shadow-xl [&>button]:right-4 [&>button]:top-4"
        >
          <SheetHeader className="border-b border-gray-100 px-5 pb-4 pt-5 text-left">
            <SheetTitle className="font-lato text-lg font-bold text-gray-900">
              App Menu
            </SheetTitle>
            <SheetDescription className="font-lato text-sm text-gray-500">
              Jump to your conversations, coach, and programs.
            </SheetDescription>
          </SheetHeader>
          <nav className="px-4 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="grid gap-2">
              {APP_DRAWER_ITEMS.map(({ label, href, icon: Icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/dashboard" && pathname?.startsWith(href));

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsAppDrawerOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-colors",
                      active
                        ? "bg-[#67BC2A] text-white"
                        : "bg-gray-50 text-gray-800 hover:bg-gray-100",
                    )}
                  >
                    <Icon className="size-5 shrink-0" strokeWidth={1.8} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <GetStartedModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToRegister={openRegisterModal}
      />
    </>
  );
}
