import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  accent: "temperature" | "humidity" | "success" | "warning" | "danger" | "default";
  icon: ReactNode;
  footnote?: string;
}

const accentStyles: Record<StatCardProps["accent"], string> = {
  temperature: "border-amber-100 bg-gradient-to-br from-amber-50 via-white to-amber-100 text-amber-900",
  humidity: "border-sky-100 bg-gradient-to-br from-sky-50 via-white to-sky-100 text-sky-900",
  success: "border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 text-emerald-900",
  warning: "border-amber-100 bg-gradient-to-br from-amber-50 via-white to-amber-100 text-amber-900",
  danger: "border-rose-100 bg-gradient-to-br from-rose-50 via-white to-rose-100 text-rose-900",
  default: "border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900",
};

export default function StatCard({ label, value, description, accent, icon, footnote }: StatCardProps) {
  return (
    <div className={`rounded-[24px] border p-5 shadow-sm ${accentStyles[accent]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
          <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/90 text-current shadow-sm">
          {icon}
        </div>
      </div>
      {footnote ? <p className="mt-4 text-xs text-slate-500">{footnote}</p> : null}
    </div>
  );
}
