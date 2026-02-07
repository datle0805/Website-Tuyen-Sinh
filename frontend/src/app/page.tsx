"use client";

import { Navbar } from "@/components/molecules/Navbar";
import { Button } from "@/components/atoms/Button";
import { ArrowRight, BookOpen, CheckCircle, Clock, FileText, Globe, GraduationCap, Users, Award, Star, ChevronRight, Play, Sparkles, TrendingUp, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Hook for scroll-triggered animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView();

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Home() {
  const heroRef = useInView();
  const featuresRef = useInView(0.2);
  const stepsRef = useInView(0.2);
  const statsRef = useInView(0.2);
  const testimonialsRef = useInView(0.2);
  const ctaRef = useInView(0.3);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: string; top: string; delay: string; duration: string }>>([]);

  useEffect(() => {
    // Generate particles only on client mount to avoid hydration mismatch
    const generatedParticles = [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`
    }));
    setParticles(generatedParticles);
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-background)] overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section
        ref={heroRef.ref}
        className="relative min-h-screen flex items-center justify-center pt-16"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 animated-bg" />

        {/* Animated blobs */}
        <div className="absolute top-20 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-60 -right-40 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {mounted && particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-float"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                animationDuration: particle.duration
              }}
            />
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        <div className={`relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${heroRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <div
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 backdrop-blur-sm animate-fadeIn"
              style={{ animationDelay: '0.2s' }}
            >
              <Sparkles className="h-4 w-4" />
              <span>Tuyển sinh 2026 đã mở đơn</span>
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 animate-slideUp opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
              Khởi đầu hành trình
              <br />
              <span className="relative">
                <span className="gradient-text">Tương lai của bạn</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" aria-hidden="true">
                  <path d="M2 10C50 4 150 4 298 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#22C55E" />
                      <stop offset="1" stopColor="#14B8A6" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 mb-12 animate-slideUp opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              Khám phá các chương trình đào tạo chất lượng cao, môi trường học tập hiện đại
              và cơ hội nghề nghiệp rộng mở. Nộp hồ sơ trực tuyến chỉ trong 3 bước.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slideUp opacity-0" style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}>
              <Link href="/register">
                <button className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-2">
                  <span>Nộp hồ sơ ngay</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
              <Link href="/programs">
                <button className="group px-8 py-4 rounded-xl border-2 border-slate-700 text-white font-semibold text-lg hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 cursor-pointer flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  <span>Xem video giới thiệu</span>
                </button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500 text-sm animate-fadeIn opacity-0" style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Bảo mật thông tin</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                <span>Xét duyệt nhanh</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-500" />
                <span>Chất lượng đảm bảo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsRef.ref}
        className="relative py-20 border-y border-slate-800/50 bg-gradient-to-b from-slate-900/50 to-transparent"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${statsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { value: 50, suffix: "+", label: "Ngành đào tạo", icon: BookOpen },
              { value: 15000, suffix: "+", label: "Sinh viên", icon: Users },
              { value: 98, suffix: "%", label: "Tỷ lệ có việc làm", icon: TrendingUp },
              { value: 25, suffix: "", label: "Năm kinh nghiệm", icon: Award },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-7 w-7 text-emerald-400" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        ref={featuresRef.ref}
        className="py-24 relative"
      >
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center mb-16 transition-all duration-1000 ${featuresRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-4">
              Tại sao chọn chúng tôi
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ưu điểm vượt trội
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Quy trình tuyển sinh hiện đại, nhanh chóng và minh bạch
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-1000 ${featuresRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              {
                icon: FileText,
                title: "Nộp hồ sơ Online",
                description: "Quy trình nộp hồ sơ hoàn toàn trực tuyến, không cần đến trường. Tiết kiệm thời gian và chi phí.",
                color: "blue",
                delay: 0
              },
              {
                icon: Clock,
                title: "Xử lý nhanh chóng",
                description: "Hệ thống tự động hóa giúp rút ngắn thời gian xét duyệt. Nhận kết quả qua email sớm nhất.",
                color: "emerald",
                delay: 100
              },
              {
                icon: BookOpen,
                title: "Đa dạng ngành học",
                description: "Hơn 50 ngành đào tạo thuộc các lĩnh vực Công nghệ, Kinh tế, Ngôn ngữ và Nghệ thuật.",
                color: "purple",
                delay: 200
              },
              {
                icon: Globe,
                title: "Chuẩn quốc tế",
                description: "Chương trình đào tạo theo chuẩn quốc tế, học bằng kép với các trường đại học hàng đầu.",
                color: "orange",
                delay: 300
              },
              {
                icon: Users,
                title: "Hỗ trợ 24/7",
                description: "Đội ngũ tư vấn tận tâm, sẵn sàng giải đáp mọi thắc mắc của bạn bất cứ lúc nào.",
                color: "pink",
                delay: 400
              },
              {
                icon: Award,
                title: "Học bổng hấp dẫn",
                description: "Nhiều suất học bổng giá trị lên đến 100% học phí dành cho sinh viên xuất sắc.",
                color: "yellow",
                delay: 500
              }
            ].map((feature, index) => {
              const colors: Record<string, { bg: string; text: string; glow: string }> = {
                blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'group-hover:shadow-blue-500/20' },
                emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'group-hover:shadow-emerald-500/20' },
                purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'group-hover:shadow-purple-500/20' },
                orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', glow: 'group-hover:shadow-orange-500/20' },
                pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', glow: 'group-hover:shadow-pink-500/20' },
                yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', glow: 'group-hover:shadow-yellow-500/20' },
              };
              const colorScheme = colors[feature.color];

              return (
                <div
                  key={index}
                  className={`group relative p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colorScheme.glow} cursor-pointer`}
                  style={{ transitionDelay: `${feature.delay}ms` }}
                >
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${colorScheme.bg} ${colorScheme.text} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Tìm hiểu thêm</span>
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section
        ref={stepsRef.ref}
        className="py-24 relative bg-gradient-to-b from-slate-900/50 to-transparent"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-16 transition-all duration-1000 ${stepsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block px-4 py-1 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-4">
              Quy trình đơn giản
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              3 bước để nhập học
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Đơn giản hóa quy trình đăng ký, tiết kiệm thời gian của bạn
            </p>
          </div>

          <div className={`relative transition-all duration-1000 ${stepsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Connector Line */}
            <div className="absolute top-24 left-0 w-full hidden lg:block">
              <div className="max-w-4xl mx-auto h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0" />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
              {[
                {
                  step: 1,
                  title: "Đăng ký tài khoản",
                  desc: "Tạo tài khoản với email cá nhân hoặc đăng nhập bằng Google/Facebook.",
                  icon: Users
                },
                {
                  step: 2,
                  title: "Điền thông tin",
                  desc: "Cập nhật thông tin cá nhân, học bạ và các giấy tờ cần thiết.",
                  icon: FileText
                },
                {
                  step: 3,
                  title: "Nhận kết quả",
                  desc: "Theo dõi trạng thái hồ sơ và nhận thông báo qua email.",
                  icon: CheckCircle
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="relative group"
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-900/30 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10">
                    {/* Step number with glow */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-2xl shadow-lg">
                        {item.step}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mb-4 p-3 rounded-xl bg-slate-800/50">
                      <item.icon className="h-6 w-6 text-emerald-400" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef.ref}
        className="py-24 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className={`text-center mb-16 transition-all duration-1000 ${testimonialsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-medium mb-4">
              Đánh giá từ sinh viên
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Sinh viên nói gì về chúng tôi
            </h2>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ${testimonialsRef.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              {
                name: "Nguyễn Minh Anh",
                role: "Sinh viên Công nghệ thông tin",
                content: "Quy trình tuyển sinh rất nhanh chóng và thuận tiện. Tôi chỉ mất 10 phút để hoàn thành hồ sơ trực tuyến.",
                rating: 5
              },
              {
                name: "Trần Văn Bình",
                role: "Sinh viên Quản trị kinh doanh",
                content: "Đội ngũ tư vấn rất tận tâm, luôn sẵn sàng giải đáp mọi thắc mắc. Cảm ơn trường đã hỗ trợ em rất nhiều.",
                rating: 5
              },
              {
                name: "Lê Thị Hương",
                role: "Sinh viên Ngôn ngữ Anh",
                content: "Môi trường học tập hiện đại, giảng viên nhiệt tình. Tôi rất hài lòng với sự lựa chọn của mình.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl glass-card hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                <p className="text-slate-300 mb-6 leading-relaxed italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        ref={ctaRef.ref}
        className="py-24 relative"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 p-12 lg:p-16 transition-all duration-1000 ${ctaRef.isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Sẵn sàng bắt đầu hành trình?
              </h2>
              <p className="text-lg text-emerald-100 mb-10 max-w-2xl mx-auto">
                Đừng bỏ lỡ cơ hội! Hạn chót nộp hồ sơ đợt 1 là ngày 30/06/2026.
                Đăng ký ngay hôm nay để nhận ưu đãi đặc biệt.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <button className="group px-8 py-4 rounded-xl bg-white text-emerald-600 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center gap-2">
                    <span>Đăng ký ngay</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 cursor-pointer">
                    Liên hệ tư vấn
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Tuyển Sinh 2026</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Cổng thông tin tuyển sinh trực tuyến hàng đầu Việt Nam.
                Nơi bắt đầu hành trình tương lai của bạn.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Thông tin</h4>
              <ul className="space-y-2">
                {["Giới thiệu", "Ngành đào tạo", "Học bổng", "Tuyển sinh"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Hỗ trợ</h4>
              <ul className="space-y-2">
                {["Hướng dẫn nộp hồ sơ", "Câu hỏi thường gặp", "Liên hệ", "Chính sách bảo mật"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>📍 123 Đường ABC, Quận XYZ, TP.HCM</li>
                <li>📞 1900 1234 56</li>
                <li>✉️ tuyensinh@university.edu.vn</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 University Admissions. All rights reserved.
            </p>
            <div className="flex gap-4">
              {["Facebook", "Youtube", "Zalo"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
