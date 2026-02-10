
"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Stats {
    total: number;
    pending: number;
    reviewing: number;
    accepted: number;
    rejected: number;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/admin`);
        } else if (status === "authenticated" && (session?.user as any)?.role !== 'admin') {
            router.push("/");
        }
    }, [status, session, router]);

    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        reviewing: 0,
        accepted: 0,
        rejected: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/applications/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, color, icon }: any) => (
        <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-600 transition-all duration-300">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ease-out`}>
                {icon}
            </div>
            <div className="relative z-10">
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">{title}</h3>
                <p className={`text-4xl font-bold ${color}`}>{loading ? "..." : value}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-400 mt-2">Tổng quan tình hình tuyển sinh</p>
                    </div>
                    <Link href="/admin/applications" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-2">
                        <span>Xem tất cả hồ sơ</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Tổng hồ sơ"
                        value={stats.total}
                        color="text-white"
                        icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" /><path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z" /></svg>}
                    />
                    <StatCard
                        title="Chờ duyệt"
                        value={stats.pending}
                        color="text-yellow-400"
                        icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>}
                    />
                    <StatCard
                        title="Đã duyệt"
                        value={stats.accepted}
                        color="text-emerald-400"
                        icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>}
                    />
                    <StatCard
                        title="Bị từ chối"
                        value={stats.rejected}
                        color="text-red-400"
                        icon={<svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" /></svg>}
                    />
                </div>

                {/* Quick Actions / Recent can go here */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-white">Thao tác nhanh</h3>
                        <div className="space-y-3">
                            <Link href="/admin/applications?status=pending" className="block p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all flex justify-between items-center group">
                                <span className="text-slate-300 group-hover:text-white">Duyệt hồ sơ mới</span>
                                <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">{stats.pending} hồ sơ</span>
                            </Link>
                            <Link href="/admin/applications" className="block p-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all flex justify-between items-center group">
                                <span className="text-slate-300 group-hover:text-white">Tìm kiếm hồ sơ</span>
                                <svg className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-white">Hệ thống</h3>
                        <div className="space-y-4 text-sm text-slate-400">
                            <div className="flex justify-between py-2 border-b border-slate-700/30">
                                <span>Database Status</span>
                                <span className="text-emerald-400 font-mono">Connected</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-700/30">
                                <span>Email Service</span>
                                <span className="text-emerald-400 font-mono">Active (Resend)</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-700/30">
                                <span>Version</span>
                                <span className="font-mono">v1.0.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
