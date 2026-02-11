"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
    const { data: session, status } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: "/" });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[var(--color-background)]/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-cta)]">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-[var(--color-foreground)]">
                        Tuyển Sinh
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/programs" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Ngành đào tạo
                    </Link>
                    {(session?.user as any)?.role === 'admin' ? (
                        <Link href="/admin" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Quản trị hồ sơ
                        </Link>
                    ) : (
                        <Link href="/submit" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                            Nộp hồ sơ
                        </Link>
                    )}
                    <Link href="/guide" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Hướng dẫn
                    </Link>
                    <Link href="/quiz" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Kiểm tra Tiếng Anh
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    {status === "loading" ? (
                        <div className="h-10 w-10 animate-pulse bg-slate-700 rounded-lg" />
                    ) : session ? (
                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-medium">
                                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <span className="hidden sm:inline text-sm font-medium text-slate-300">
                                        {session.user?.name || "User"}
                                    </span>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700/50 rounded-lg shadow-xl z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-slate-700/50">
                                        <p className="text-sm font-medium text-white">{session.user?.name}</p>
                                        <p className="text-xs text-slate-400 truncate">{session.user?.email}</p>
                                    </div>
                                    <div className="py-1 border-b border-slate-700/50">
                                        {(session?.user as any)?.role === 'admin' ? (
                                            <Link
                                                href="/admin"
                                                onClick={() => setDropdownOpen(false)}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-emerald-400 hover:bg-slate-700 transition-colors"
                                            >
                                                Dashboard Quản trị
                                            </Link>
                                        ) : (
                                            <>
                                                <Link
                                                    href="/applications"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                                                >
                                                    Hồ sơ của tôi
                                                </Link>
                                                <Link
                                                    href="/submit"
                                                    onClick={() => setDropdownOpen(false)}
                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                                                >
                                                    Nộp hồ sơ mới
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm" className="px-2 sm:px-4">
                                    Đăng nhập
                                </Button>
                            </Link>
                            <Link href="/register" className="hidden sm:block">
                                <Button size="sm">Đăng ký ngay</Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 md:hidden text-slate-400 hover:text-white transition-colors"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/5 bg-[var(--color-background)] py-4 px-4 space-y-4 animate-fadeIn">
                    <Link
                        href="/programs"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Ngành đào tạo
                    </Link>
                    {(session?.user as any)?.role === 'admin' ? (
                        <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-base font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                            Quản trị hồ sơ
                        </Link>
                    ) : (
                        <Link
                            href="/submit"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-base font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            Nộp hồ sơ
                        </Link>
                    )}
                    <Link
                        href="/guide"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Hướng dẫn
                    </Link>
                    <Link
                        href="/quiz"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-base font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Kiểm tra Tiếng Anh
                    </Link>
                    {!session && (
                        <div className="pt-4 border-t border-white/5">
                            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full">Đăng ký ngay</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
