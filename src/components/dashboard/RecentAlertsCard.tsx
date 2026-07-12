import { AlertCircle, AlertTriangle, Info, ArrowRight } from "lucide-react";
import type { AlertItem } from "../../types/dashboard";

interface RecentAlertsCardProps {
  alerts: AlertItem[];
}

const levelConfigs = {
  danger: {
    label: "Nguy hiểm",
    bgClass: "bg-rose-50/50 border-rose-100 hover:bg-rose-100/60",
    badgeClass: "bg-rose-100 text-rose-700 border-rose-200/40",
    iconColor: "text-rose-500",
    icon: AlertCircle,
  },
  warning: {
    label: "Cảnh báo",
    bgClass: "bg-amber-50/50 border-amber-100 hover:bg-amber-100/60",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200/40",
    iconColor: "text-amber-500",
    icon: AlertTriangle,
  },
  info: {
    label: "Thông tin",
    bgClass: "bg-sky-50/50 border-sky-100 hover:bg-sky-100/60",
    badgeClass: "bg-sky-100 text-sky-700 border-sky-200/40",
    iconColor: "text-sky-500",
    icon: Info,
  },
};

export default function RecentAlertsCard({ alerts }: RecentAlertsCardProps) {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Cảnh báo mới nhất</h3>
          <p className="text-sm text-slate-500 mt-1">Các sự kiện và cảnh báo hoạt động của hệ thống</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition border border-slate-200/60 cursor-pointer">
          Xem tất cả
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {alerts.map((alert) => {
          const config = levelConfigs[alert.level];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`rounded-[18px] border p-3 sm:p-4 transition-all duration-200 ${config.bgClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className={`mt-0.5 rounded-lg p-1 sm:p-1.5 ${config.iconColor} bg-white shadow-sm border border-slate-100`}>
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-800">
                        {alert.deviceName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">({alert.deviceId})</span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-slate-900">{alert.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{alert.message}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.badgeClass}`}>
                  {config.label}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pl-9 sm:pl-11">
                <span>Cập nhật: {alert.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
