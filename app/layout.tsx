import type { Metadata } from "next";
import "./globals.css";

import AdminLayoutWrapper from "@/src/components/admin/AdminLayoutWrapper";
import { AuthProvider } from "@/src/components/AuthProvider";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Hệ thống giám sát và quản lý máy ấp trứng HatchMate",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className="font-times h-screen overflow-hidden flex flex-col text-slate-900"
      >
        <AuthProvider>
          <AdminLayoutWrapper>
            {children}
          </AdminLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}