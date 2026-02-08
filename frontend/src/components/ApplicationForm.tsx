"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "./atoms/Button";
import { Input } from "./atoms/Input";
import { submitApplication } from "@/lib/api/applicationApi";
import { User, Mail, GraduationCap, ChevronDown } from "lucide-react";

const schema = yup.object().shape({
    fullName: yup.string().required("Vui lòng nhập họ tên"),
    dateOfBirth: yup.string().required("Vui lòng chọn ngày sinh"),
    gender: yup.string().oneOf(["male", "female", "other"], "Vui lòng chọn giới tính").required(),
    phoneNumber: yup.string().required("Vui lòng nhập số điện thoại"),
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    address: yup.string().required("Vui lòng nhập địa chỉ"),
    city: yup.string().required("Vui lòng nhập tỉnh/thành phố"),
    country: yup.string().required("Vui lòng nhập quốc gia"),
    educationLevel: yup.string().required("Vui lòng chọn trình độ học vấn"),
});

interface ApplicationFormProps {
    onSuccess: (data: any) => void;
    initialEmail?: string;
    token?: string;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSuccess, initialEmail, token }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: initialEmail || "",
            gender: "male",
            educationLevel: "Lớp 1",
            country: "Việt Nam",
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const result = await submitApplication(data, token);
            onSuccess(result);
        } catch (error: any) {
            alert(error.response?.data?.message || "Đã có lỗi xảy ra khi nộp hồ sơ");
        }
    };

    const educationLevels = [
        "Mẫu giáo",
        "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5",
        "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9",
        "Lớp 10", "Lớp 11", "Lớp 12",
        "Đại học",
        "TOEIC"
    ];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Personal Info */}
            <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform transition-all hover:border-[#DB2777]/30 stagger-1 animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#DB2777]/20 p-2.5 rounded-2xl">
                        <User className="w-5 h-5 text-[#F472B6]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-heading">Thông tin cá nhân</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Họ và tên"
                        placeholder="Nguyễn Văn A"
                        {...register("fullName")}
                        error={errors.fullName?.message}
                        className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 focus:border-[#DB2777] focus:ring-[#DB2777]/20 rounded-2xl transition-all"
                    />
                    <div className="relative group">
                        <Input
                            label="Ngày sinh"
                            type="date"
                            {...register("dateOfBirth")}
                            error={errors.dateOfBirth?.message}
                            className="bg-slate-950/50 border-white/10 text-white focus:border-[#DB2777] focus:ring-[#DB2777]/20 rounded-2xl transition-all dark-date-input pr-12"
                        />
                        <div className="absolute right-4 top-[38px] text-slate-500 pointer-events-none group-focus-within:text-[#DB2777] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mt-6">
                    <label className="text-sm font-semibold text-slate-400 ml-1">Giới tính</label>
                    <div className="flex flex-wrap gap-4">
                        {["male", "female", "other"].map((val) => (
                            <label key={val} className="flex items-center gap-2 px-5 py-3 bg-slate-950/50 border border-white/5 border-white/10 rounded-2xl cursor-pointer hover:border-[#DB2777]/50 hover:bg-[#DB2777]/5 transition-all shadow-sm active:scale-95 group">
                                <input
                                    type="radio"
                                    value={val}
                                    {...register("gender")}
                                    className="w-4 h-4 accent-[#DB2777]"
                                />
                                <span className="text-sm font-medium text-slate-300 capitalize">
                                    {val === 'male' ? 'Nam' : val === 'female' ? 'Nữ' : 'Khác'}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform transition-all hover:border-[#DB2777]/30 stagger-2 animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#DB2777]/20 p-2.5 rounded-2xl">
                        <Mail className="w-5 h-5 text-[#F472B6]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-heading">Thông tin liên lạc</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Số điện thoại"
                        placeholder="090 123 4567"
                        {...register("phoneNumber")}
                        error={errors.phoneNumber?.message}
                        className="bg-slate-950/50 border-white/10 text-white rounded-2xl"
                    />
                    <Input
                        label="Email"
                        type="email"
                        readOnly
                        {...register("email")}
                        error={errors.email?.message}
                        className="bg-slate-800/50 text-slate-500 cursor-not-allowed border-white/5 rounded-2xl italic"
                    />
                </div>

                <div className="mt-6">
                    <Input
                        label="Địa chỉ"
                        placeholder="Số 123 Đường ABC..."
                        {...register("address")}
                        error={errors.address?.message}
                        className="bg-slate-950/50 border-white/10 text-white rounded-2xl"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Input
                        label="Tỉnh/Thành phố"
                        placeholder="Hà Nội"
                        {...register("city")}
                        error={errors.city?.message}
                        className="bg-slate-950/50 border-white/10 text-white rounded-2xl"
                    />
                    <Input
                        label="Quốc gia"
                        placeholder="Việt Nam"
                        {...register("country")}
                        error={errors.country?.message}
                        className="bg-slate-950/50 border-white/10 text-white rounded-2xl"
                    />
                </div>
            </section>

            {/* Education Info */}
            <section className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform transition-all hover:border-[#DB2777]/30 stagger-3 animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#DB2777]/20 p-2.5 rounded-2xl">
                        <GraduationCap className="w-5 h-5 text-[#F472B6]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white font-heading">Trình độ học vấn</h3>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-400 ml-1">Đăng ký trình độ/lớp</label>
                    <div className="relative group">
                        <select
                            {...register("educationLevel")}
                            className="appearance-none flex h-14 w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-2 text-base text-white focus:border-[#DB2777] focus:outline-none focus:ring-4 focus:ring-[#DB2777]/10 transition-all cursor-pointer group-hover:bg-slate-900"
                        >
                            {educationLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#F472B6]">
                            <ChevronDown className="w-5 h-5" />
                        </div>
                    </div>
                    {errors.educationLevel && (
                        <p className="text-xs text-red-500 mt-1 ml-1">{errors.educationLevel.message}</p>
                    )}
                </div>
            </section>

            <div className="pt-8 animate-slideUp stagger-4">
                <Button
                    type="submit"
                    className="w-full h-16 text-xl font-bold shadow-[0_12px_24px_rgba(202,138,4,0.2)] bg-[#CA8A04] hover:bg-[#A16207] text-white hover:shadow-[0_16px_32px_rgba(202,138,4,0.3)] transform transition-all active:scale-[0.98] rounded-2xl cursor-pointer"
                    isLoading={isSubmitting}
                >
                    Nộp hồ sơ ngay
                </Button>
                <p className="text-center mt-6 text-slate-500 text-sm italic">
                    Bằng việc nhấn "Nộp hồ sơ", bạn đồng ý với các điều khoản của chúng tôi.
                </p>
            </div>
        </form>
    );
};
