"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import { Menu, X, ArrowLeftIcon, LogOut } from "lucide-react";

import ClientNavbarDropdown from "./ClientNavbarDropdown";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import WellnessZLogoLink from "@/components/WellnessZLogoLink";
import Image from "next/image";

const GetStartedModal = dynamic(() => import("@/components/GetStartedModal"), {
  ssr: false,
  loading: () => (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/45"
      role="progressbar"
      aria-label="Loading sign up"
      aria-busy="true"
    >
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-white/25 border-t-white" />
    </div>
  ),
});
export default function ClientNavbar({ isDashboard }) {
  const pathname = usePathname()
  if (["/experts"].includes(pathname)) return <></>
  return <Container isDashboard={isDashboard} />
}

function Container({ isDashboard = false }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const [registerModalHydrated, setRegisterModalHydrated] = useState(false);
  useEffect(() => {
    if (isRegisterModalOpen) setRegisterModalHydrated(true);
  }, [isRegisterModalOpen]);

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
    { name: "Find Experts", href: "/find-experts" },
    // { name: "Collections", href: "/collections" },
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
              <SidebarTrigger className="shrink-0 text-zinc-700 md:hidden" />
              <div
                className={cn(
                  "flex min-w-0 flex-1 items-center gap-4 overflow-x-auto md:gap-6 lg:gap-12",
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
              <ClientNavbarDropdown />
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3">
                <button
                  type="button"
                  onClick={openRegisterModal}
                  className="flex items-center gap-1 whitespace-nowrap rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-[11px] font-bold text-white shadow-lg shadow-lime-500/10 transition-all hover:bg-[#76b813] sm:rounded-xl sm:px-8 sm:py-2.5 sm:text-sm"
                >
                  Get Started <ArrowLeftIcon className="h-3 w-3 rotate-180" />
                </button>
              </div>
            )}

            {/* Mobile site nav (dashboard shows Home/Experts in the top bar) */}
            {!isDashboard && (
              <button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-controls="client-nav-mobile-menu"
                aria-label={
                  isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-black md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 shrink-0" aria-hidden />
                ) : (
                  <Image
                    src="/svg/hamburger.svg"
                    height={20}
                    width={20}
                    alt=""
                    aria-hidden
                  />
                )}
              </button>
            )}
          </div>
        </nav>

        {!isDashboard && isMobileMenuOpen && (
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
                    openRegisterModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 py-3 text-left text-sm font-bold text-white hover:bg-[#76b813]"
                >
                  Get Started <ArrowLeftIcon className="h-3 w-3 rotate-180" />
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

      {registerModalHydrated ? (
        <GetStartedModal
          isOpen={isRegisterModalOpen}
          onClose={closeRegisterModal}
        />
      ) : null}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onSwitchToRegister={openRegisterModal}
      />
    </>
  );
}
