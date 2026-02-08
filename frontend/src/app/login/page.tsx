"use client";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, LoginFormData } from "@/lib/validationSchemas";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res && (res as any).error) {
        setError("root", { message: (res as any).error });
      } else {
        window.location.href = "/";
      }
    } catch (err: any) {
      setError("root", { message: "Có lỗi xảy ra. Vui lòng thử lại." });
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-60 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-emerald-400 rounded-full animate-float opacity-60"></div>
      <div className="absolute top-40 right-40 w-3 h-3 bg-teal-400 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>

      {/* Main card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-10 animate-slideUp">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 animate-float shadow-lg shadow-emerald-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-heading">Chào mừng trở lại</h1>
            <p className="text-slate-400">Đăng nhập để tiếp tục hành trình học tập</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email field */}
            <div className={`space-y-2 animate-fadeIn stagger-1 opacity-0`} style={{ animationFillMode: 'forwards' }}>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300 ${errors.email ? 'opacity-40 from-red-500 to-red-500' : ''}`}></div>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...register('email')}
                  className={`relative w-full h-12 px-4 rounded-xl bg-slate-800/50 border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                      : 'border-slate-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/20'
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className={`w-5 h-5 transition-colors duration-300 ${errors.email ? 'text-red-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
            </div>

            {/* Password field */}
            <div className={`space-y-2 animate-fadeIn stagger-2 opacity-0`} style={{ animationFillMode: 'forwards' }}>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Mật khẩu
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300 ${errors.password ? 'opacity-40 from-red-500 to-red-500' : ''}`}></div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`relative w-full h-12 px-4 rounded-xl bg-slate-800/50 border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.password
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                      : 'border-slate-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/20'
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className={`w-5 h-5 transition-colors duration-300 ${errors.password ? 'text-red-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end animate-fadeIn stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <a href="#" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors duration-200">
                Quên mật khẩu?
              </a>
            </div>

            {/* Error message */}
            {errors.root && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 animate-shake">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {errors.root.message}
                </p>
              </div>
            )}

            {/* Submit button */}
            <div className="animate-fadeIn stagger-4 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8 animate-fadeIn stagger-5 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/80 text-slate-400">hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-4 animate-fadeIn stagger-6 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <button
              type="button"
              onClick={() => signIn('google')}
              className="social-btn flex items-center justify-center gap-3 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white font-medium hover:bg-slate-700/50 hover:border-slate-600/50 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => signIn('facebook')}
              className="social-btn flex items-center justify-center gap-3 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white font-medium hover:bg-slate-700/50 hover:border-slate-600/50 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-slate-400 mt-8 animate-fadeIn opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
            Chưa có tài khoản?{' '}
            <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-6 text-sm text-slate-500 animate-fadeIn opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <p>Bằng việc đăng nhập, bạn đồng ý với</p>
          <p>
            <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Điều khoản dịch vụ</a>
            {' '}&{' '}
            <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors duration-200">Chính sách bảo mật</a>
          </p>
        </div>
      </div>
    </div>
  );
}
