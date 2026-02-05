"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { GraduationCap } from "lucide-react";

export function Navbar() {
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
                    <Link href="/guide" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Hướng dẫn
                    </Link>
                    <Link href="/contact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Liên hệ
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                            Đăng nhập
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button size="sm">Đăng ký ngay</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
