import type { KpiSummary } from "@/src/types/dashboard";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/src/components/AuthProvider";

interface WelcomeBannerProps {
  summary: KpiSummary;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function WelcomeBanner({ summary }: WelcomeBannerProps) {
  const { currentUser } = useAuth();
  const userName = currentUser?.displayName || "Admin";

  return (
    <section className="overflow-hidden p-5 sm:p-6 w-full">
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-3 py-1.5 text-xs sm:text-sm font-bold text-black mb-3 sm:mb-4 border border-amber-200/40">
          <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600 animate-pulse" /> Giữ nhịp hệ thống <span className="text-[#f97316]">Hatch</span><span className="text-[#0284c7]">Mate</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-black tracking-wide uppercase">
          Chào mừng bạn trở lại, {userName}
        </p>
        <h5 className="mt-3 text-xl sm:text-2xl font-extrabold text-black tracking-tight max-w-3xl leading-snug">
          Giám sát toàn bộ hệ thống ấp trứng <span className="text-[#f97316]">Hatch</span><span className="text-[#0284c7]">Mate</span> theo thời gian thực
        </h5>
        {/* <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-sm font-bold text-black tracking-wide uppercase leading-6 sm:leading-7">
          Theo dõi trạng thái thiết bị, nhiệt độ, độ ẩm và cảnh báo quan trọng trên cùng một trang điều khiển.
        </p> */}
      </div>
    </section>
  );
}
