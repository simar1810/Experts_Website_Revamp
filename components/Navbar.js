'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import GetStartedModal from './GetStartedModal';
import LoginModal from './LoginModal';
import { Bell, User, ChevronDown, Menu, X, ArrowLeftIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ userName = "Simarpreet Singh" }) {
    const pathname = usePathname();
    const {
        isAuthenticated,
        user,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        isRegisterModalOpen,
        openRegisterModal,
        closeRegisterModal
    } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const isActive = (path) => pathname === path ? "text-[#84cc16] border-b-2 border-[#84cc16] md:pb-1 font-bold" : "text-gray-500 hover:text-gray-900 font-medium";

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Experts', href: '/experts' },
        { name: 'Pricing', href: '/pricing' },
    ];

    const handleLogout = () => {
        logout();
        setIsProfileDropdownOpen(false);
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <nav className="flex md:grid md:grid-cols-3 items-center justify-between px-4 sm:px-6 lg:px-8 py-3 md:py-4 max-w-7xl mx-auto gap-2">
                    {/* Left Section - Logo */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <Link href="/" className="text-base sm:text-2xl font-bold font-serif italic text-black truncate sm:whitespace-nowrap">
                            Wellness<span className="text-[#84cc16]">Z </span>Experts
                        </Link>
                    </div>

                    {/* Center Section - Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center gap-6 lg:gap-12">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className={`${isActive(link.href)} text-sm transition-colors uppercase tracking-wider`}>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-4 md:justify-end">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2 sm:gap-6">
                                <button className="text-gray-900 p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <Bell className="w-5 h-5 fill-current" />
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="flex items-center gap-2 border border-gray-200 rounded-xl px-2 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        <div className="w-6 h-6 sm:w-7 sm:h-7 bg-[#84cc16] rounded-full flex items-center justify-center text-white shadow-inner shrink-0">
                                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                        </div>
                                        <span className="hidden sm:inline text-xs font-black text-gray-800 tracking-tight">{user?.name || userName}</span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isProfileDropdownOpen && (
                                        <>
                                            {/* Invisible backdrop for closing */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            ></div>

                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-20 animate-in fade-in zoom-in duration-200">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 sm:gap-3">
                                <button
                                    onClick={openRegisterModal}
                                    className="bg-[#84cc16] text-white px-3 py-2 sm:px-8 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg shadow-lime-500/10 font-bold hover:bg-[#76b813] transition-all text-[11px] sm:text-sm whitespace-nowrap flex items-center gap-1"
                                >
                                    Get Started <ArrowLeftIcon className="w-3 h-3 rotate-180" />
                                </button>
                                <button
                                    onClick={openLoginModal}
                                    className="hidden sm:block text-[#84cc16] px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl font-bold hover:bg-gray-50 transition-colors border-2 border-[#84cc16] text-sm whitespace-nowrap"
                                >
                                    Log In
                                </button>
                            </div>
                        )
                        }

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Navigation Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="flex flex-col p-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-3 rounded-lg text-sm transition-colors ${pathname === link.href ? 'bg-lime-50 text-lime-600 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {!isAuthenticated ? (
                                <button onClick={openLoginModal} className="w-full text-left px-4 py-3 rounded-lg text-sm text-[#84cc16] font-bold hover:bg-gray-50 border-t border-gray-50 mt-2">
                                    Log In
                                </button>
                            ) : (
                                <button
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
