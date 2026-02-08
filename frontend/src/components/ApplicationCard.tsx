"use client";

import React from "react";
import { Card } from "./atoms/Card";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
    application: any;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({ application }) => {
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

    const hasAppointment = application.appointmentDate && application.status !== 'rejected';

    return (
        <Card className="p-0 overflow-hidden hover:shadow-lg transition-all border border-gray-100 group">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[var(--color-cta)] transition-colors">
                            {application.fullName}
                        </h3>
                        <p className="text-sm text-gray-500">Mã hồ sơ: {application.applicationNumber}</p>
                    </div>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider",
                        statusColors[application.status as keyof typeof statusColors] || statusColors.pending
                    )}>
                        {statusLabels[application.status as keyof typeof statusLabels] || application.status}
                    </span>
                </div>

                <div className="space-y-2 mb-6 text-sm text-gray-600">
                    <p><strong>Trình độ:</strong> {application.educationLevel}</p>
                    <p><strong>Ngày nộp:</strong> {new Date(application.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>

                {hasAppointment && (
                    <div className="bg-[var(--color-cta)]/5 border border-[var(--color-cta)]/10 rounded-lg p-4 mb-4">
                        <h4 className="text-xs font-bold text-[var(--color-cta)] uppercase tracking-widest mb-2 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" /> Lịch hẹn sắp tới
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-700">
                                <Calendar className="w-4 h-4 mr-2 text-[var(--color-cta)]" />
                                {new Date(application.appointmentDate).toLocaleDateString('vi-VN')}
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Clock className="w-4 h-4 mr-2 text-[var(--color-cta)]" />
                                {application.appointmentTime}
                            </div>
                            {application.appointmentLocation && (
                                <div className="flex items-center text-gray-700 col-span-2 mt-1">
                                    <MapPin className="w-4 h-4 mr-2 text-[var(--color-cta)]" />
                                    {application.appointmentLocation}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <Link
                    href={`/applications/${application._id}`}
                    className="flex items-center justify-center w-full py-2 bg-gray-50 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
            </div>
        </Card>
    );
};
