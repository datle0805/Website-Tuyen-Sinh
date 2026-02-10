
import React from 'react';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

interface Application {
    _id: string;
    applicationNumber: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: string;
    createdAt: string;
}

interface ApplicationTableProps {
    applications: Application[];
}

export default function ApplicationTable({ applications }: ApplicationTableProps) {
    if (applications.length === 0) {
        return (
            <div className="p-8 text-center text-slate-400 bg-slate-800/20 rounded-2xl border border-slate-700/30">
                Không có hồ sơ nào.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-700/30 bg-slate-900/50">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">Mã hồ sơ</th>
                        <th className="px-6 py-4">Họ và tên</th>
                        <th className="px-6 py-4">Liên hệ</th>
                        <th className="px-6 py-4">Ngày tạo</th>
                        <th className="px-6 py-4">Trạng thái</th>
                        <th className="px-6 py-4 text-right">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30 text-slate-300 text-sm">
                    {applications.map((app) => (
                        <tr key={app._id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4 font-mono text-emerald-400">{app.applicationNumber}</td>
                            <td className="px-6 py-4 font-medium text-white">{app.fullName}</td>
                            <td className="px-6 py-4 space-y-1">
                                <div className="text-slate-400">{app.email}</div>
                                <div className="text-slate-500 text-xs">{app.phoneNumber}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-400">
                                {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge status={app.status} />
                            </td>
                            <td className="px-6 py-4 text-right">
                                <Link
                                    href={`/admin/applications/${app._id}`}
                                    className="text-emerald-400 hover:text-emerald-300 font-medium text-sm transition-colors py-1.5 px-3 rounded-lg hover:bg-emerald-500/10 inline-flex items-center gap-1"
                                >
                                    Chi tiết
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
