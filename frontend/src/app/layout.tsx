import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Cổng Tuyển Sinh 2026",
  description: "Website tuyển sinh chính thức - Nộp hồ sơ trực tuyến",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
