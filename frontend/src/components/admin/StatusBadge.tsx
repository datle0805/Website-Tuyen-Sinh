
import React from 'react';

type Status = 'pending' | 'reviewing' | 'accepted' | 'rejected';

interface StatusBadgeProps {
    status: Status | string;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    reviewing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    accepted: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const statusLabels: Record<string, string> = {
    pending: 'Chờ xử lý',
    reviewing: 'Đang xem xét',
    accepted: 'Đã chấp nhận',
    rejected: 'Đã từ chối',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const colorClass = statusColors[status.toLowerCase()] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    const label = statusLabels[status.toLowerCase()] || status;

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass} inline-flex items-center gap-1.5`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
            {label}
        </span>
    );
}
