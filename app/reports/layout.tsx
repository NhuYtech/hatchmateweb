import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thống kê & Biểu đồ",
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
