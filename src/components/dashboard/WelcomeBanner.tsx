import type { KpiSummary } from "@/src/types/dashboard";
import { CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";

interface WelcomeBannerProps {
  summary: KpiSummary;
}

export default function WelcomeBanner({ summary }: WelcomeBannerProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-8 shadow-sm">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800">
            <Sparkles className="h-4 w-4" /> Giữ nhịp hệ thống HatchMate
          </div>
          <div>
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Thiết bị online</p>
                <p className="mt-1 text-3xl font-semibold text-emerald-700">{summary.onlineDevices}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white/90 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-rose-100 text-rose-700">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Cảnh báo đang mở</p>
                <p className="mt-1 text-3xl font-semibold text-rose-700">{summary.openAlerts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
