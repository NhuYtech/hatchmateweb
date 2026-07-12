import type { KpiSummary } from "@/src/types/dashboard";
import { Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  summary: KpiSummary;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function WelcomeBanner({ summary }: WelcomeBannerProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-5 sm:p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5 text-xs sm:text-sm font-semibold text-sky-800 mb-3 sm:mb-4">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Giữ nhịp hệ thống HatchMate
        </div>
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          Chào mừng trở lại, Admin
        </p>
        <h3 className="mt-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-slate-950 max-w-3xl leading-snug">
          Giám sát toàn bộ hệ thống ấp trứng HatchMate theo thời gian thực
        </h3>
        <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600/90">
          Theo dõi trạng thái thiết bị, nhiệt độ, độ ẩm và cảnh báo quan trọng trên cùng một trang điều khiển.
        </p>
      </div>
    </section>
  );
}
