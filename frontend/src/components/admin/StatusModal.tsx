
"use client";
import React from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    status: 'accepted' | 'rejected' | 'reviewing' | 'pending';
    loading?: boolean;
}

export default function StatusModal({ isOpen, onClose, onConfirm, status, loading }: StatusModalProps) {
    if (!isOpen) return null;

    const config = {
        accepted: {
            title: 'Chấp nhận hồ sơ',
            message: 'Bạn có chắc chắn muốn chấp nhận hồ sơ này? Một email thông báo trúng tuyển sẽ được gửi đến ứng viên.',
            icon: <CheckCircle className="w-12 h-12 text-emerald-400" />,
            confirmClass: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20',
            confirmText: 'Xác nhận chấp nhận',
            color: 'text-emerald-400'
        },
        rejected: {
            title: 'Từ chối hồ sơ',
            message: 'Bạn có chắc chắn muốn từ chối hồ sơ này? Một email thông báo kết quả sẽ được gửi đến ứng viên.',
            icon: <XCircle className="w-12 h-12 text-red-400" />,
            confirmClass: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
            confirmText: 'Xác nhận từ chối',
            color: 'text-red-400'
        },
        reviewing: {
            title: 'Đang xem xét',
            message: 'Chuyển hồ sơ sang trạng thái đang xem xét để tiếp tục đánh giá hoặc chuẩn bị phỏng vấn.',
            icon: <Clock className="w-12 h-12 text-blue-400" />,
            confirmClass: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20',
            confirmText: 'Chuyển trạng thái',
            color: 'text-blue-400'
        },
        pending: {
            title: 'Đưa về chờ duyệt',
            message: 'Bạn có muốn đưa hồ sơ này quay lại trạng thái chờ duyệt ban đầu?',
            icon: <AlertTriangle className="w-12 h-12 text-yellow-400" />,
            confirmClass: 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20',
            confirmText: 'Xác nhận',
            color: 'text-yellow-400'
        }
    };

    const current = config[status];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleUp">
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="mb-6 p-4 rounded-full bg-slate-800/50">
                        {current.icon}
                    </div>

                    <h3 className={`text-2xl font-bold mb-3 ${current.color}`}>
                        {current.title}
                    </h3>

                    <p className="text-slate-400 leading-relaxed mb-8">
                        {current.message}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-all order-2 sm:order-1"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`flex-1 px-6 py-3 rounded-xl text-white font-bold transition-all shadow-lg order-1 sm:order-2 flex items-center justify-center gap-2 ${current.confirmClass} disabled:opacity-50`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : null}
                            {current.confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
