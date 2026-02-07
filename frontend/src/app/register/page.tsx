"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import api from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength === 3) return 'bg-emerald-400';
    return 'bg-emerald-500';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return 'Yếu';
    if (passwordStrength === 2) return 'Trung bình';
    if (passwordStrength === 3) return 'Mạnh';
    return 'Rất mạnh';
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/api/auth/register", { email, password, name });
      const data = res.data;
      if (!res.status || res.status >= 400) throw new Error(data.message || "Registration failed");

      await signIn("credentials", { redirect: false, email, password });
      window.location.href = "/";
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-60 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>

      {/* Floating decorative elements */}
      <div className="absolute top-32 left-32 w-2 h-2 bg-teal-400 rounded-full animate-float opacity-60"></div>
      <div className="absolute top-60 right-32 w-3 h-3 bg-emerald-400 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-float opacity-50" style={{ animationDelay: '2s' }}></div>

      {/* Main card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-10 animate-slideUp">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 mb-4 animate-float shadow-lg shadow-teal-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-heading">Tạo tài khoản</h1>
            <p className="text-slate-400">Bắt đầu hành trình học tập của bạn</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name field */}
            <div className={`space-y-2 animate-fadeIn stagger-1 opacity-0`} style={{ animationFillMode: 'forwards' }}>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                Họ và tên
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300 ${focusedField === 'name' ? 'opacity-40' : ''}`}></div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="Nguyễn Văn A"
                  className="relative w-full h-12 px-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'name' ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Email field */}
            <div className={`space-y-2 animate-fadeIn stagger-2 opacity-0`} style={{ animationFillMode: 'forwards' }}>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-40' : ''}`}></div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="your@email.com"
                  className="relative w-full h-12 px-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'email' ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password field */}
            <div className={`space-y-2 animate-fadeIn stagger-3 opacity-0`} style={{ animationFillMode: 'forwards' }}>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                Mật khẩu
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-40' : ''}`}></div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="••••••••"
                  className="relative w-full h-12 px-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'password' ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              {/* Password strength indicator */}
              {password && (
                <div className="animate-fadeIn">
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? getStrengthColor() : 'bg-slate-700'
                          }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Độ mạnh: <span className={`font-medium ${passwordStrength >= 3 ? 'text-emerald-400' : passwordStrength === 2 ? 'text-yellow-400' : 'text-red-400'}`}>{getStrengthText()}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password field */}
            <div className={`space-y-2 animate-fadeIn stagger-4 opacity-0`} style={{ animationFillMode: 'forwards' }}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300">
                Xác nhận mật khẩu
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur opacity-0 group-hover:opacity-25 transition-opacity duration-300 ${focusedField === 'confirmPassword' ? 'opacity-40' : ''}`}></div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  required
                  placeholder="••••••••"
                  className={`relative w-full h-12 px-4 rounded-xl bg-slate-800/50 border text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all duration-300 ${confirmPassword && confirmPassword !== password
                      ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
                      : confirmPassword && confirmPassword === password
                        ? 'border-emerald-500/50 focus:border-emerald-500/50 focus:ring-emerald-500/20'
                        : 'border-slate-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/20'
                    }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {confirmPassword && confirmPassword === password ? (
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : confirmPassword && confirmPassword !== password ? (
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className={`w-5 h-5 transition-colors duration-300 ${focusedField === 'confirmPassword' ? 'text-emerald-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 animate-shake">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Submit button */}
            <div className="animate-fadeIn stagger-5 opacity-0" style={{ animationFillMode: 'forwards' }}>
              <button
                type="submit"
                disabled={loading || (confirmPassword !== '' && password !== confirmPassword)}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    Tạo tài khoản
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-6 animate-fadeIn stagger-6 opacity-0" style={{ animationFillMode: 'forwards' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/80 text-slate-400">hoặc đăng ký với</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-2 gap-4 animate-fadeIn opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
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

          {/* Sign in link */}
          <p className="text-center text-slate-400 mt-6 animate-fadeIn opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200">
              Đăng nhập
            </Link>
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-6 text-sm text-slate-500 animate-fadeIn opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
          <p>Bằng việc đăng ký, bạn đồng ý với</p>
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
