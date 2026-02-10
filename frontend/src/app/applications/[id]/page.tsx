
"use client";

import React, { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getApplicationById } from "@/lib/api/applicationApi";
import { Calendar, Clock, MapPin, ArrowLeft, User, Phone, Mail, Home, GraduationCap, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/admin/StatusBadge";

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

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!application) return null;

    return (
        <main className="min-h-screen bg-[#020617] text-slate-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link href="/applications" className="inline-flex items-center text-slate-500 hover:text-emerald-400 mb-8 transition-colors font-medium group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Quay lại danh sách
                </Link>

                <div className="bg-slate-800/20 backdrop-blur-xl rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl">
                    {/* Header */}
                    <div className="bg-slate-800/40 border-b border-slate-700/50 p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">Hồ sơ tuyển sinh</span>
                                    <StatusBadge status={application.status} />
                                </div>
                                <h1 className="text-4xl font-extrabold text-white tracking-tight">{application.fullName}</h1>
                                <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">Mã số: <span className="text-emerald-400 font-bold">{application.applicationNumber}</span></p>
                            </div>

                            <div className="md:text-right bg-slate-900/50 p-4 rounded-2xl border border-slate-700/30">
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Ngày nộp hồ sơ</p>
                                <p className="text-lg font-bold text-slate-200">{new Date(application.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 space-y-12">
                        {/* Appointment Section */}
                        {application.appointmentDate && application.status !== 'rejected' && (
                            <section className="bg-gradient-to-br from-emerald-600/20 to-teal-700/20 border border-emerald-500/30 text-white rounded-3xl p-8 relative overflow-hidden group">
                                <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Calendar className="w-48 h-48" />
                                </div>
                                <h2 className="text-xl font-bold mb-8 flex items-center border-b border-emerald-500/20 pb-4">
                                    <Clock className="w-5 h-5 mr-3 text-emerald-400" /> Thông tin lịch hẹn
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <InfoBlock
                                        icon={<Calendar className="w-5 h-5 text-emerald-400" />}
                                        label="Ngày hẹn"
                                        value={new Date(application.appointmentDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    />
                                    <InfoBlock
                                        icon={<Clock className="w-5 h-5 text-emerald-400" />}
                                        label="Giờ hẹn"
                                        value={application.appointmentTime}
                                    />
                                    <InfoBlock
                                        icon={<MapPin className="w-5 h-5 text-emerald-400" />}
                                        label="Địa điểm"
                                        value={application.appointmentLocation || 'Văn phòng tuyển sinh'}
                                    />
                                </div>
                                {application.appointmentNotes && (
                                    <div className="mt-8 bg-slate-900/60 rounded-2xl p-6 border border-emerald-500/10 shadow-inner">
                                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Ghi chú từ trung tâm:
                                        </p>
                                        <p className="text-slate-300 leading-relaxed italic">"{application.appointmentNotes}"</p>
                                    </div>
                                )}
                            </section>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {/* Personal Data */}
                            <section className="space-y-6">
                                <h2 className="text-lg font-bold text-white flex items-center border-b border-slate-700/50 pb-3">
                                    <User className="w-5 h-5 mr-3 text-emerald-400" /> Thông tin cá nhân
                                </h2>
                                <div className="space-y-6">
                                    <DetailRow label="Họ và tên" value={application.fullName} />
                                    <DetailRow label="Ngày sinh" value={new Date(application.dateOfBirth).toLocaleDateString('vi-VN')} />
                                    <DetailRow label="Giới tính" value={application.gender === 'male' ? 'Nam' : application.gender === 'female' ? 'Nữ' : 'Khác'} />
                                    <DetailRow label="Cấp học đăng ký" value={application.educationLevel} />
                                </div>
                            </section>

                            {/* Contact Data */}
                            <section className="space-y-6">
                                <h2 className="text-lg font-bold text-white flex items-center border-b border-slate-700/50 pb-3">
                                    <Mail className="w-5 h-5 mr-3 text-emerald-400" /> Thông tin liên lạc
                                </h2>
                                <div className="space-y-6">
                                    <DetailRow label="Số điện thoại" value={application.phoneNumber} />
                                    <DetailRow label="Email" value={application.email} />
                                    <DetailRow label="Địa chỉ" value={`${application.address}, ${application.city}, ${application.country}`} />
                                </div>
                            </section>
                        </div>

                        {/* Admin Feedback */}
                        {application.reviewNotes && (
                            <section className="bg-slate-800/40 rounded-3xl p-8 border border-slate-700/50 shadow-inner">
                                <h2 className="text-lg font-bold text-white flex items-center mb-6">
                                    <FileText className="w-5 h-5 mr-3 text-emerald-400" /> Phản hồi từ hội đồng tuyển sinh
                                </h2>
                                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/30 italic">
                                    <p className="text-slate-300 leading-relaxed">
                                        "{application.reviewNotes}"
                                    </p>
                                </div>
                            </section>
                        )}
                    </div>

                    <div className="bg-slate-800/40 p-8 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-xs text-slate-500 font-medium italic">
                            Cập nhật lần cuối: {new Date(application.updatedAt).toLocaleString('vi-VN')}
                        </p>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button className="flex-1 md:flex-none border border-slate-700 hover:border-slate-500 px-6 py-2.5 rounded-xl text-sm font-medium transition-all">
                                In hồ sơ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function InfoBlock({ icon, label, value }: { icon: React.ReactElement, label: string, value: string }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                {icon}
                {label}
            </div>
            <p className="text-white font-bold">{value}</p>
        </div>
    );
}

function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="group">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 group-hover:text-emerald-400/70 transition-colors uppercase">{label}</p>
            <p className="text-slate-200 font-medium text-base group-hover:text-white transition-colors">{value}</p>
        </div>
    );
}
