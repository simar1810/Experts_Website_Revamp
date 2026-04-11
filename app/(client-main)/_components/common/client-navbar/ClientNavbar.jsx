"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GetStartedModal from "@/components/GetStartedModal";
import LoginModal from "@/components/LoginModal";
import { Bell, Menu, X, ArrowLeftIcon, LogOut } from "lucide-react";

import ClientNavbarDropdown from "./ClientNavbarDropdown";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function ClientNavbar({ isDashboard = false }) {
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
      ? "text-[#84cc16] border-b-2 border-[#84cc16] pb-1 font-bold"
      : "text-gray-500 hover:text-gray-900 font-medium border-b-2 border-transparent pb-1";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Experts", href: "/find-experts" },
    { name: "Pricing - [TESTING]", href: "/pricing" },
    // { name: "Resources", href: "/blogs" },
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
          {/* Left Section - Logo */}
          <div
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 shrink-0",
              isDashboard && "hidden",
            )}
          >
            <Link
              href="/"
              className="text-base sm:text-2xl font-bold font-serif italic text-black truncate sm:whitespace-nowrap"
            >
              Wellness<span className="text-[#84cc16]">Z </span>Experts
            </Link>
          </div>
          {/* Center Section - Desktop Navigation */}
          <div
            className={cn(
              "hidden items-center gap-6 md:flex lg:gap-12",
              isDashboard ? "min-w-0 flex-1 justify-start" : "justify-center",
            )}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${isActive(link.href)} text-sm transition-colors tracking-wider`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div
            className={cn(
              "flex shrink-0 items-center gap-1.5 sm:gap-4 md:justify-end",
            )}
          >
            {isAuthenticated ? (
              <div className="flex items-center gap-2 sm:gap-6">
                <button
                  type="button"
                  className="text-gray-900 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Bell className="w-5 h-5 fill-current" />
                </button>

                <ClientNavbarDropdown />
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3">
                <button
                  type="button"
                  onClick={openRegisterModal}
                  className="bg-[#84cc16] text-white px-3 py-2 sm:px-8 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg shadow-lime-500/10 font-bold hover:bg-[#76b813] transition-all text-[11px] sm:text-sm whitespace-nowrap flex items-center gap-1"
                >
                  Get Started <ArrowLeftIcon className="w-3 h-3 rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={openLoginModal}
                  className="hidden sm:block text-[#84cc16] px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors border-2 border-[#84cc16] text-sm whitespace-nowrap"
                >
                  Log In
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
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
                <>
                  <button
                    type="button"
                    onClick={() => {
                      openRegisterModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm bg-[#84cc16] text-white font-bold hover:bg-[#76b813] mt-2 flex items-center gap-2"
                  >
                    Get Started <ArrowLeftIcon className="w-3 h-3 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      openLoginModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-sm text-[#84cc16] font-bold hover:bg-gray-50 border border-[#84cc16]"
                  >
                    Log In
                  </button>
                </>
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
