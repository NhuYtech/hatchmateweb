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
  temperature: "from-amber-100 via-amber-50 to-amber-50 border-amber-100 text-amber-900",
  humidity: "from-sky-100 via-sky-50 to-sky-50 border-sky-100 text-sky-900",
  success: "from-emerald-100 via-emerald-50 to-emerald-50 border-emerald-100 text-emerald-900",
  warning: "from-amber-100 via-amber-50 to-amber-50 border-amber-100 text-amber-900",
  danger: "from-rose-100 via-rose-50 to-rose-50 border-rose-100 text-rose-900",
  default: "from-slate-100 via-slate-50 to-slate-50 border-slate-100 text-slate-900",
};

export default function StatCard({ label, value, description, accent, icon, footnote }: StatCardProps) {
  return (
    <div className={`rounded-[24px] border p-5 shadow-sm bg-white/95 border-slate-200 ${accentStyles[accent]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/90 text-current shadow-sm">
          {icon}
        </div>
      </div>
      {footnote ? <p className="mt-4 text-xs text-slate-500">{footnote}</p> : null}
    </div>
  );
}
