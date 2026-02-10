
"use client";
import React, { useEffect, useState, Suspense } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ApplicationTable from '@/components/admin/ApplicationTable';

interface Application {
    _id: string;
    applicationNumber: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    status: string;
    createdAt: string;
}

function ApplicationsContent() {
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (authStatus === "unauthenticated") {
            router.push(`/login?callbackUrl=/admin/applications`);
        } else if (authStatus === "authenticated" && (session?.user as any)?.role !== 'admin') {
            router.push("/");
        }
    }, [authStatus, session, router]);

    const [applications, setApplications] = useState<Application[]>([]);
    const [filteredApps, setFilteredApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const searchParams = useSearchParams();
    const statusFilter = searchParams.get('status') || 'all';

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/api/applications');
                setApplications(res.data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    useEffect(() => {
        let filtered = applications;

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status.toLowerCase() === statusFilter.toLowerCase());
        }

        // Search
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(app =>
                app.fullName.toLowerCase().includes(lowerSearch) ||
                app.email.toLowerCase().includes(lowerSearch) ||
                app.applicationNumber.toLowerCase().includes(lowerSearch)
            );
        }

        setFilteredApps(filtered);
    }, [applications, statusFilter, searchTerm]);

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(searchParams);
        if (status === 'all') {
            params.delete('status');
        } else {
            params.set('status', status);
        }
        router.push(`/admin/applications?${params.toString()}`);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/admin" className="text-slate-500 hover:text-white transition-colors">
                                Dashboard
                            </Link>
                            <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="text-emerald-400">Danh sách hồ sơ</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Quản lý hồ sơ</h1>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-slate-800/20 border border-slate-700/30 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-slate-700/50">
                        {['all', 'pending', 'reviewing', 'accepted', 'rejected'].map((s) => (
                            <button
                                key={s}
                                onClick={() => handleStatusChange(s)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${statusFilter === s
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {s === 'all' ? 'Tất cả' : s === 'pending' ? 'Chờ duyệt' : s === 'reviewing' ? 'Đang xem' : s === 'accepted' ? 'Đã duyệt' : 'Từ chối'}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 w-full md:w-auto">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Tìm theo tên, email hoặc mã hồ sơ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl pl-11 pr-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                        />
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                        <p className="text-slate-500 animate-pulse">Đang tải danh sách...</p>
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        <ApplicationTable applications={filteredApps} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminApplicationsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ApplicationsContent />
        </Suspense>
    );
}
