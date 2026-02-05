import { Navbar } from "@/components/molecules/Navbar";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { ArrowRight, BookOpen, CheckCircle, Clock, FileText, Globe, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-background)] pt-16">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-[30%] -left-[10%] h-[700px] w-[700px] rounded-full bg-[var(--color-cta)]/10 blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-slate-800 bg-slate-900/50 px-3 py-1 text-sm font-medium text-[var(--color-cta)] backdrop-blur-sm">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[var(--color-cta)] animate-pulse" />
              Tuyển sinh 2026 đã mở đơn
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Khởi đầu hành trình <br />
              <span className="text-[var(--color-cta)]">Tương lai của bạn</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10">
              Khám phá các chương trình đào tạo chất lượng cao, môi trường học tập hiện đại và cơ hội nghề nghiệp rộng mở. Nộp hồ sơ trực tuyến chỉ trong 3 bước.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto group">
                  Nộp hồ sơ ngay
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/programs">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Xem ngành đào tạo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-[var(--color-primary)]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card hoverEffect className="relative overflow-hidden">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Nộp hồ sơ Online</h3>
              <p className="text-slate-400">
                Quy trình nộp hồ sơ hoàn toàn trực tuyến, không cần đến trường. Tiết kiệm thời gian và chi phí.
              </p>
            </Card>

            <Card hoverEffect>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Xử lý nhanh chóng</h3>
              <p className="text-slate-400">
                Hệ thống tự động hóa giúp rút ngắn thời gian xét duyệt. Nhận kết quả qua email sớm nhất.
              </p>
            </Card>

            <Card hoverEffect>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Đa dạng ngành học</h3>
              <p className="text-slate-400">
                Hơn 50 ngành đào tạo thuộc các lĩnh vực Công nghệ, Kinh tế, Ngôn ngữ và Nghệ thuật.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Quy trình tuyển sinh</h2>
            <p className="mt-4 text-slate-400">Đơn giản hóa quy trình đăng ký chỉ với 3 bước</p>
          </div>

          <div className="relative">
            {/* Connector Line */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden lg:block border-t border-slate-800" />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {[
                { step: 1, title: "Đăng ký tài khoản", desc: "Tạo tài khoản với email cá nhân." },
                { step: 2, title: "Điền thông tin", desc: "Cập nhật thông tin cá nhân và học bạ." },
                { step: 3, title: "Nhận kết quả", desc: "Theo dõi trạng thái và nhận thông báo." },
              ].map((item) => (
                <div key={item.step} className="relative flex flex-col items-center text-center bg-[var(--color-background)] z-10 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-cta)] text-white font-bold text-xl mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[var(--color-primary)] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-[var(--color-cta)]" />
            <span className="text-lg font-bold text-white">Tuyển Sinh 2026</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 University Admissions. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
