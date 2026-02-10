
"use client";
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import StatusBadge from '@/components/admin/StatusBadge';
import AppointmentForm from '@/components/admin/AppointmentForm';

interface Application {
    _id: string;
    applicationNumber: string;
    userId: string;
    status: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    city: string;
    educationLevel: string;
    reviewNotes?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    appointmentLocation?: string;
    appointmentNotes?: string;
    createdAt: string;
}

export default function AdminApplicationDetail() {
    const { id } = useParams();
    const { data: session, status: authStatus } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (authStatus === "unauthenticated") {
            router.push(`/login?callbackUrl=/admin/applications/${id}`);
        } else if (authStatus === "authenticated" && (session?.user as any)?.role !== 'admin') {
            router.push("/");
        }
    }, [authStatus, session, id, router]);

    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');

    const fetchApplication = async () => {
        try {
            const res = await api.get(`/api/applications/${id}`);
            setApplication(res.data);
            setReviewNotes(res.data.reviewNotes || '');
        } catch (error) {
            console.error("Failed to fetch application", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!confirm(`Bạn có chắc chắn muốn chuyển trạng thái sang "${newStatus}"?`)) return;

        setUpdating(true);
        try {
            await api.patch(`/api/applications/${id}/status`, {
                status: newStatus,
                reviewNotes: reviewNotes
            });
            await fetchApplication();
            alert('Cập nhật trạng thái thành công!');
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi cập nhật.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!application) return <div className="p-8 text-white">Hồ sơ không tồn tại.</div>;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Breadcrumbs & Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-sm">
                            <Link href="/admin" className="text-slate-500 hover:text-white transition-colors">Dashboard</Link>
                            <span className="text-slate-700">/</span>
                            <Link href="/admin/applications" className="text-slate-500 hover:text-white transition-colors">Hồ sơ</Link>
                            <span className="text-slate-700">/</span>
                            <span className="text-emerald-400 font-mono">{application.applicationNumber}</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            Chi tiết hồ sơ
                            <StatusBadge status={application.status} />
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleStatusUpdate('reviewing')}
                            disabled={updating || application.status === 'reviewing'}
                            className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-500/20 transition-all disabled:opacity-30"
                        >
                            Đang xem xét
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('rejected')}
                            disabled={updating || application.status === 'rejected'}
                            className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-all disabled:opacity-30"
                        >
                            Từ chối
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('accepted')}
                            disabled={updating || application.status === 'accepted'}
                            className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all disabled:opacity-30 shadow-lg shadow-emerald-500/20"
                        >
                            Chấp nhận
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Personal Info */}
                        <section className="bg-slate-800/20 border border-slate-700/30 rounded-3xl p-8 space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                Thông tin cá nhân
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Họ và tên</p>
                                    <p className="text-slate-200 font-medium">{application.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Email</p>
                                    <p className="text-slate-200">{application.email}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Số điện thoại</p>
                                    <p className="text-slate-200 font-mono">{application.phoneNumber}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Ngày sinh</p>
                                    <p className="text-slate-200">{new Date(application.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Giới tính</p>
                                    <p className="text-slate-200 capitalize">{application.gender}</p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Cấp học đăng ký</p>
                                    <p className="text-emerald-400 font-medium">{application.educationLevel}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-700/30">
                                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Địa chỉ</p>
                                <p className="text-slate-200">{application.address}, {application.city}</p>
                            </div>
                        </section>

                        {/* Admin Notes */}
                        <section className="bg-slate-800/20 border border-slate-700/30 rounded-3xl p-8 space-y-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Ghi chú của Admin
                            </h2>
                            <textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Nhập ghi chú đánh giá hồ sơ... (User sẽ thấy ghi chú này khi bạn cập nhật trạng thái)"
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all h-32"
                            ></textarea>
                        </section>
                    </div>

                    {/* Right Column: Appointment */}
                    <div className="space-y-8">
                        <section className="bg-slate-800/20 border border-slate-700/30 rounded-3xl p-6 space-y-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Lên lịch hẹn / Phỏng vấn
                            </h2>

                            {application.appointmentDate && (
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl mb-4">
                                    <p className="text-xs text-emerald-500 uppercase font-bold tracking-widest mb-3">Lịch hẹn hiện tại</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Ngày:</span>
                                            <span className="text-slate-200 font-medium">{new Date(application.appointmentDate).toLocaleDateString('vi-VN')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Giờ:</span>
                                            <span className="text-slate-200 font-medium">{application.appointmentTime}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block mb-1">Địa điểm:</span>
                                            <span className="text-slate-200 text-xs block bg-slate-900/50 p-2 rounded-lg">{application.appointmentLocation}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <AppointmentForm
                                applicationId={application._id}
                                onSuccess={() => {
                                    fetchApplication();
                                    alert('Đã đặt lịch hẹn và gửi email thông báo!');
                                }}
                                initialValues={application.appointmentDate ? {
                                    appointmentDate: new Date(application.appointmentDate).toISOString().split('T')[0],
                                    appointmentTime: application.appointmentTime || '09:00',
                                    appointmentLocation: application.appointmentLocation || 'Văn phòng tuyển sinh',
                                    appointmentNotes: application.appointmentNotes || ''
                                } : undefined}
                            />
                        </section>

                        <div className="bg-slate-800/10 border border-slate-700/20 rounded-3xl p-6 text-xs text-slate-500 space-y-2">
                            <p>• Việc thay đổi trạng thái sẽ gửi mail tự động cho User.</p>
                            <p>• Nút "Chấp nhận" thường được bấm sau khi đã có lịch hẹn/phỏng vấn thành công.</p>
                            <p>• Ghi chú Admin sẽ được đính kèm trong các email cập nhật.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
