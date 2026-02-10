
"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
    appointmentDate: yup.string().required('Ngày hẹn là bắt buộc'),
    appointmentTime: yup.string().required('Giờ hẹn là bắt buộc'),
    appointmentLocation: yup.string().required('Địa điểm là bắt buộc'),
    appointmentNotes: yup.string().optional(),
});

type AppointmentFormData = {
    appointmentDate: string;
    appointmentTime: string;
    appointmentLocation: string;
    appointmentNotes?: string;
};

interface AppointmentFormProps {
    applicationId: string;
    onSuccess: () => void;
    initialValues?: AppointmentFormData;
}

export default function AppointmentForm({ applicationId, onSuccess, initialValues }: AppointmentFormProps) {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<AppointmentFormData>({
        resolver: yupResolver(schema) as any,
        defaultValues: initialValues || {
            appointmentLocation: 'Văn phòng tuyển sinh, Tầng 1, Tòa nhà A',
            appointmentTime: '09:00',
        }
    });

    const onSubmit = async (data: AppointmentFormData) => {
        setLoading(true);
        try {
            await api.patch(`/api/applications/${applicationId}/appointment`, data);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra khi đặt lịch hẹn. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Ngày hẹn</label>
                    <input
                        id="appointmentDate"
                        type="date"
                        {...register('appointmentDate')}
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    {errors.appointmentDate && <p className="text-red-400 text-xs mt-1">{errors.appointmentDate.message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Giờ hẹn</label>
                    <input
                        id="appointmentTime"
                        type="time"
                        {...register('appointmentTime')}
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                    {errors.appointmentTime && <p className="text-red-400 text-xs mt-1">{errors.appointmentTime.message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Địa điểm</label>
                <input
                    id="appointmentLocation"
                    type="text"
                    placeholder="Nhập địa điểm phỏng vấn..."
                    {...register('appointmentLocation')}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                {errors.appointmentLocation && <p className="text-red-400 text-xs mt-1">{errors.appointmentLocation.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Ghi chú thêm (Tùy chọn)</label>
                <textarea
                    id="appointmentNotes"
                    rows={3}
                    placeholder="Ghi chú thêm cho ứng viên..."
                    {...register('appointmentNotes')}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                ></textarea>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang lưu...
                        </>
                    ) : (
                        'Lưu lịch hẹn & Gửi Email'
                    )}
                </button>
            </div>
        </form>
    );
}
