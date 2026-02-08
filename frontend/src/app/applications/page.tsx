"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ApplicationCard } from "@/components/ApplicationCard";
import { getApplications } from "@/lib/api/applicationApi";
import { Button } from "@/components/atoms/Button";
import { PlusCircle, Search, Filter } from "lucide-react";

export default function ApplicationsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/applications");
        } else if (status === "authenticated") {
            fetchApplications();
        }
    }, [status, router]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await getApplications();
            setApplications(data);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredApplications = filterStatus === "all"
        ? applications
        : applications.filter((app: any) => app.status === filterStatus);

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-cta)]"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen py-12 px-4 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 italic">Hồ Sơ Của Tôi</h1>
                    <p className="text-gray-600">Quản lý và theo dõi trạng thái hồ sơ tuyển sinh của bạn.</p>
                </div>
                <Button onClick={() => router.push('/submit')} className="flex items-center">
                    <PlusCircle className="w-5 h-5 mr-2" /> Nộp hồ sơ mới
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-2 text-gray-500">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Lọc theo:</span>
                </div>
                <div className="flex space-x-2">
                    {['all', 'pending', 'reviewing', 'accepted', 'rejected'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filterStatus === s
                                ? "bg-[var(--color-cta)] text-white shadow-md scale-105"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {s === 'all' ? 'Tất cả' : s === 'pending' ? 'Chờ duyệt' : s === 'reviewing' ? 'Đang xét' : s === 'accepted' ? 'Trúng tuyển' : 'Từ chối'}
                        </button>
                    ))}
                </div>
            </div>

            {filteredApplications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((app: any) => (
                        <ApplicationCard key={app._id} application={app} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-16 text-center">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Chưa có hồ sơ nào</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Bạn chưa nộp bất kỳ hồ sơ tuyển sinh nào hoặc không tìm thấy hồ sơ phù hợp với bộ lọc.
                    </p>
                    <Button variant="outline" onClick={() => router.push('/submit')}>
                        Bắt đầu nộp hồ sơ ngay
                    </Button>
                </div>
            )}
        </main>
    );
}
