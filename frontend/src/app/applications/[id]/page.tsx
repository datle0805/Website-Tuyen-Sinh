"use client";

import React, { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getApplicationById } from "@/lib/api/applicationApi";
import { Button } from "@/components/atoms/Button";
import { Calendar, Clock, MapPin, ArrowLeft, User, Phone, Mail, Home, GraduationCap, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: session, status } = useSession();
    const router = useRouter();
    const [application, setApplication] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push(`/login?callbackUrl=/applications/${id}`);
        } else if (status === "authenticated") {
            fetchApplication();
        }
    }, [status, id, router]);

    const fetchApplication = async () => {
        try {
            setLoading(true);
            const data = await getApplicationById(id);
            setApplication(data);
        } catch (error) {
            console.error("Failed to fetch application", error);
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        reviewing: "bg-blue-100 text-blue-800 border-blue-200",
        accepted: "bg-green-100 text-green-800 border-green-200",
        rejected: "bg-red-100 text-red-800 border-red-200",
    };

    const statusLabels = {
        pending: "Đang chờ",
        reviewing: "Đang xét duyệt",
        accepted: "Đã trúng tuyển",
        rejected: "Từ chối",
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-cta)]"></div>
            </div>
        );
    }

    if (!application) return null;

    return (
        <main className="min-h-screen py-12 px-4 max-w-4xl mx-auto">
            <Link href="/applications" className="inline-flex items-center text-gray-500 hover:text-[var(--color-cta)] mb-8 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách
            </Link>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-sm font-bold text-[var(--color-cta)] uppercase tracking-widest">Hồ sơ tuyển sinh</span>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider",
                                    statusColors[application.status as keyof typeof statusColors] || statusColors.pending
                                )}>
                                    {statusLabels[application.status as keyof typeof statusLabels] || application.status}
                                </span>
                            </div>
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 italic">{application.fullName}</h1>
                            <p className="text-gray-500">Mã số: <span className="font-mono font-bold text-gray-700">{application.applicationNumber}</span></p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-gray-400 mb-1">Ngày nộp hồ sơ</p>
                            <p className="text-lg font-bold text-gray-700">{new Date(application.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-10 space-y-12">
                    {/* Appointment Section */}
                    {application.appointmentDate && application.status !== 'rejected' && (
                        <section className="bg-[var(--color-cta)] text-white rounded-2xl p-8 shadow-inner transform relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Calendar className="w-32 h-32" />
                            </div>
                            <h2 className="text-xl font-bold mb-6 flex items-center border-b border-white/20 pb-4">
                                <Clock className="w-6 h-6 mr-2" /> Lịch hẹn / Phỏng vấn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex items-start">
                                    <Calendar className="w-6 h-6 mr-3 mt-1 text-white/70" />
                                    <div>
                                        <p className="text-xs text-white/70 uppercase font-bold tracking-wider mb-1">Ngày</p>
                                        <p className="text-lg font-bold">{new Date(application.appointmentDate).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <Clock className="w-6 h-6 mr-3 mt-1 text-white/70" />
                                    <div>
                                        <p className="text-xs text-white/70 uppercase font-bold tracking-wider mb-1">Giờ</p>
                                        <p className="text-lg font-bold">{application.appointmentTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <MapPin className="w-6 h-6 mr-3 mt-1 text-white/70" />
                                    <div>
                                        <p className="text-xs text-white/70 uppercase font-bold tracking-wider mb-1">Địa điểm</p>
                                        <p className="text-lg font-bold">{application.appointmentLocation || 'Văn phòng tuyển sinh'}</p>
                                    </div>
                                </div>
                            </div>
                            {application.appointmentNotes && (
                                <div className="mt-8 bg-black/10 rounded-xl p-4 text-sm">
                                    <p className="font-bold mb-1">Ghi chú từ trung tâm:</p>
                                    <p className="text-white/90 leading-relaxed">{application.appointmentNotes}</p>
                                </div>
                            )}
                        </section>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Personal Data */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center border-b border-gray-100 pb-2 italic">
                                <User className="w-5 h-5 mr-2 text-[var(--color-cta)]" /> Thông tin cá nhân
                            </h2>
                            <div className="space-y-4">
                                <DetailRow icon={<User />} label="Họ và tên" value={application.fullName} />
                                <DetailRow icon={<Calendar />} label="Ngày sinh" value={new Date(application.dateOfBirth).toLocaleDateString('vi-VN')} />
                                <DetailRow icon={<User />} label="Giới tính" value={application.gender === 'male' ? 'Nam' : application.gender === 'female' ? 'Nữ' : 'Khác'} />
                                <DetailRow icon={<GraduationCap />} label="Bậc đăng ký" value={application.educationLevel} />
                            </div>
                        </section>

                        {/* Contact Data */}
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center border-b border-gray-100 pb-2 italic">
                                <Mail className="w-5 h-5 mr-2 text-[var(--color-cta)]" /> Thông tin liên lạc
                            </h2>
                            <div className="space-y-4">
                                <DetailRow icon={<Phone />} label="Số điện thoại" value={application.phoneNumber} />
                                <DetailRow icon={<Mail />} label="Email" value={application.email} />
                                <DetailRow icon={<Home />} label="Địa chỉ" value={`${application.address}, ${application.city}, ${application.country}`} />
                            </div>
                        </section>
                    </div>

                    {/* Admin Feedback */}
                    {application.reviewNotes && (
                        <section className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4 italic">
                                <FileText className="w-5 h-5 mr-2 text-[var(--color-cta)]" /> Phản hồi từ hội đồng
                            </h2>
                            <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 italic">
                                "{application.reviewNotes}"
                            </p>
                        </section>
                    )}
                </div>

                <div className="bg-gray-50 p-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500 italic">Cập nhật lần cuối: {new Date(application.updatedAt).toLocaleString('vi-VN')}</p>
                    {application.status === 'pending' && (
                        <div className="flex gap-4">
                            <Button variant="outline">Chỉnh sửa hồ sơ</Button>
                            <Button>In hồ sơ</Button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

function DetailRow({ icon, label, value }: { icon: React.ReactElement, label: string, value: string }) {
    return (
        <div className="flex items-start">
            <div className="w-8 flex justify-center pt-1 text-gray-300">
                {React.cloneElement(icon, { className: "w-4 h-4" } as any)}
            </div>
            <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-gray-800 font-medium">{value}</p>
            </div>
        </div>
    );
}
