"use client";

import React from "react";
import { Button } from "./atoms/Button";
import { CheckCircle, Mail } from "lucide-react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationNumber: string;
    data: any;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, applicationNumber, data }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Premium Dark Backdrop */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xl animate-fadeIn" onClick={onClose} />

            <div className="bg-slate-900/90 backdrop-blur-3xl rounded-[40px] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.8)] border border-white/10 max-w-lg w-full p-10 text-center relative z-10 animate-slideUp font-body">
                {/* Floating Decoration Blueprint */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#DB2777]/10 border border-[#DB2777]/20 rounded-3xl rotate-12 -z-10 animate-float" />

                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-[#DB2777]/30 rounded-full blur-2xl animate-pulse" />
                        <div className="bg-gradient-to-br from-[#DB2777] to-[#CA8A04] p-5 rounded-full relative shadow-[0_0_30px_rgba(219,39,119,0.3)]">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl font-black text-white mb-3 font-heading tracking-tight italic">
                    Nộp Hồ Sơ <span className="text-[#F472B6]">Thành Công!</span>
                </h2>
                <p className="text-slate-400 mb-8 font-medium">
                    Hồ sơ của bạn đã được ghi nhận trên hệ thống.
                    Bắt đầu hành trình chinh phục tri thức ngay!
                </p>

                <div className="bg-slate-950/50 border border-white/5 rounded-3xl p-6 mb-8 text-left shadow-inner relative overflow-hidden group hover:border-[#F472B6]/30 transition-colors">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#DB2777]/5 rounded-bl-[60px] -z-10" />

                    <div className="flex justify-between items-center mb-5 border-b border-white/5 pb-4">
                        <span className="text-[10px] text-[#F472B6] uppercase font-black tracking-widest">Mã số hồ sơ</span>
                        <span className="text-xl font-black text-[#CA8A04] font-heading">{applicationNumber}</span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-slate-500">Học sinh:</span>
                            <span className="text-sm font-black text-slate-200">{data.fullName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm font-bold text-slate-500">Lớp đăng ký:</span>
                            <span className="text-sm font-black text-slate-200">{data.educationLevel}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Button
                        className="w-full h-14 text-lg font-bold bg-[#DB2777] hover:bg-[#831843] rounded-2xl shadow-[0_12px_24px_rgba(219,39,119,0.3)] hover:shadow-[0_16px_32px_rgba(219,39,119,0.4)] transition-all active:scale-[0.98] cursor-pointer"
                        onClick={() => window.location.href = '/applications'}
                    >
                        Quản lý trực tuyến
                    </Button>
                    <Button
                        className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-2xl shadow-[0_12px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_16px_32px_rgba(16,185,129,0.4)] transition-all active:scale-[0.98] cursor-pointer"
                        onClick={() => window.location.href = `/quiz/${data._id}`}
                    >
                        Làm bài kiểm tra năng lực
                    </Button>
                    <button
                        onClick={onClose}
                        className="w-full py-2 text-slate-500 hover:text-white font-bold text-sm uppercase tracking-widest transition-colors cursor-pointer"
                    >
                        Tạo thêm hồ sơ
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                    <Mail className="w-3.5 h-3.5 opacity-50" />
                    Email xác nhận đã gửi tới {data.email}
                </div>
            </div>
        </div>
    );
};
