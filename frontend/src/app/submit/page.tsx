"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ApplicationForm } from "@/components/ApplicationForm";
import { SuccessModal } from "@/components/SuccessModal";

export default function SubmitPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [successData, setSuccessData] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/submit");
        }
    }, [status, router]);

    const handleSuccess = (data: any) => {
        setSuccessData(data);
        setIsModalOpen(true);
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-cta)]"></div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <main className="min-h-screen relative overflow-hidden font-body selection:bg-[#DB2777]/30 selection:text-white">
            {/* Premium Midnight Background */}
            <div className="fixed inset-0 bg-[#020617]" />

            {/* Requested Grid Pattern */}
            <div className="fixed inset-0 bg-grid opacity-20" />

            {/* Glowing Accents (Keeping Pink & Gold) */}
            <div className="fixed top-[-10%] left-[-5%] w-[50%] h-[50%] bg-[#DB2777]/10 rounded-full blur-[120px] animate-blob" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[55%] h-[55%] bg-[#CA8A04]/10 rounded-full blur-[140px] animate-blob stagger-3" />
            <div className="fixed top-[20%] right-[10%] w-[35%] h-[35%] bg-[#F472B6]/5 rounded-full blur-[100px] animate-blob stagger-2" />

            <div className="relative z-10 py-20 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-16 space-y-4 animate-fadeIn">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-sm mb-4">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F472B6] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F472B6]"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#F472B6]">Hệ thống tuyển sinh 4.0</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-white font-heading leading-none animate-slideUp tracking-tight italic">
                        Xây Dựng <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DB2777] to-[#CA8A04]">Tương Lai</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg font-medium leading-relaxed animate-fadeIn stagger-1">
                        Bản phác thảo cho hành trình học tập đỉnh cao của bạn bắt đầu từ đây.
                        Điền thông tin để chúng tôi cùng bạn thiết kế lộ trình.
                    </p>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/10 p-8 md:p-14 animate-slideUp stagger-2 overflow-hidden relative">
                    {/* Decorative Corner Blueprint */}
                    <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-[#DB2777]/20 rounded-tr-[40px] m-4" />
                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#DB2777]/10 blur-xl" />

                    <ApplicationForm
                        onSuccess={handleSuccess}
                        initialEmail={session.user?.email || ""}
                        token={(session.user as any)?.token}
                    />
                </div>

                {/* Trust Badge Dark */}
                <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-500 text-xs font-black uppercase tracking-widest text-center animate-fadeIn stagger-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#DB2777] rounded-full" />
                        Dữ liệu mã hóa AES-256
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#CA8A04] rounded-full" />
                        Xử lý bởi AI định hướng
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#DB2777] rounded-full" />
                        Phản hồi trong 24h
                    </div>
                </div>
            </div>

            {successData && (
                <SuccessModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    applicationNumber={successData.applicationNumber}
                    data={successData}
                />
            )}
        </main>
    );
}
