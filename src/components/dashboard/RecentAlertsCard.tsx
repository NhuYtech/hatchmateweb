import { AlertTriangle, Bell, CheckCircle2 } from "lucide-react";
import type { AlertItem } from "../../types/dashboard";

interface RecentAlertsCardProps {
  alerts: AlertItem[];
}

const levelStyles: Record<string, { label: string; className: string; icon: typeof Bell }> = {
  danger: { label: "Nguy hiểm", className: "bg-rose-100 text-rose-800 border-rose-200", icon: AlertTriangle },
  warning: { label: "Cảnh báo", className: "bg-amber-100 text-amber-800 border-amber-200", icon: Bell },
  info: { label: "Thông tin", className: "bg-slate-100 text-slate-700 border-slate-200", icon: CheckCircle2 },
};

export default function RecentAlertsCard({ alerts }: RecentAlertsCardProps) {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Cảnh báo mới nhất</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Sự kiện cần chú ý</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">3 cảnh báo</span>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => {
          const level = levelStyles[alert.level];
          const Icon = level.icon;
          return (
            <div key={alert.id} className="rounded-[20px] border border-slate-200/80 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{alert.deviceId}</p>
                  <p className="mt-2 text-sm text-slate-700">{alert.title}</p>
                </div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${level.className}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {level.label}
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-500">{alert.timestamp}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
