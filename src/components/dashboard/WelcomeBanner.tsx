import type { KpiSummary } from "@/src/types/dashboard";
import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  summary: KpiSummary;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function WelcomeBanner({ summary }: WelcomeBannerProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800 mb-4">
          <Sparkles className="h-4 w-4" /> Giữ nhịp hệ thống HatchMate
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Chào mừng trở lại, Admin
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Giám sát toàn bộ hệ thống ấp trứng HatchMate theo thời gian thực
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          Theo dõi trạng thái thiết bị, nhiệt độ, độ ẩm và cảnh báo quan trọng trên cùng một trang điều khiển.
        </p>
      </div>
    </section>
  );
}
