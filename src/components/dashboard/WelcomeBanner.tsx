import type { KpiSummary } from "../../types/dashboard";
import { CheckCircle2, Layers } from "lucide-react";

interface WelcomeBannerProps {
  summary: KpiSummary;
}

export default function WelcomeBanner({ summary }: WelcomeBannerProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 p-8 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            Chào mừng trở lại
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
            Giám sát toàn bộ hệ thống ấp trứng HatchMate theo thời gian thực
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">
            Xem nhanh tình trạng thiết bị, cảm biến môi trường, cảnh báo mới và camera trong một mắt nhìn.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Thiết bị online</p>
              <p className="text-2xl font-semibold text-emerald-700">{summary.onlineDevices}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-3xl border border-slate-200/80 bg-slate-50 px-4 py-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Cảnh báo đang mở</p>
              <p className="text-2xl font-semibold text-rose-700">{summary.openAlerts}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
