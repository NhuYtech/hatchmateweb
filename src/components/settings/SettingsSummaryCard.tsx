import React from "react";
import { LucideIcon } from "lucide-react";

interface SettingsSummaryCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: "orange" | "blue" | "rose" | "emerald";
}

export default function SettingsSummaryCard({
  label,
  value,
  icon: Icon,
  accent,
}: SettingsSummaryCardProps) {
  const styles = {
    orange: {
      border: "border-orange-100/60",
      iconBg: "bg-gradient-to-br from-amber-50 to-orange-50",
      iconText: "text-orange-500",
      bar: "bg-gradient-to-r from-amber-400 to-orange-500",
      hover: "hover:border-orange-200 hover:shadow-orange-100/50",
    },
    blue: {
      border: "border-blue-100/60",
      iconBg: "bg-gradient-to-br from-sky-50 to-blue-50",
      iconText: "text-blue-500",
      bar: "bg-gradient-to-r from-sky-400 to-blue-500",
      hover: "hover:border-blue-200 hover:shadow-blue-100/50",
    },
    rose: {
      border: "border-rose-100/60",
      iconBg: "bg-gradient-to-br from-pink-50 to-rose-50",
      iconText: "text-rose-500",
      bar: "bg-gradient-to-r from-pink-400 to-rose-500",
      hover: "hover:border-rose-200 hover:shadow-rose-100/50",
    },
    emerald: {
      border: "border-emerald-100/60",
      iconBg: "bg-gradient-to-br from-teal-50 to-emerald-50",
      iconText: "text-emerald-600",
      bar: "bg-gradient-to-r from-teal-400 to-emerald-500",
      hover: "hover:border-emerald-200 hover:shadow-emerald-100/50",
    },
  };

  const s = styles[accent];

  return (
    <div
      className={`group relative overflow-hidden flex items-center justify-between rounded-[22px] border bg-white p-5 shadow-sm transition-all duration-300 ${s.border} ${s.hover} hover:-translate-y-0.5 hover:shadow-md`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${s.bar}`} />

      <div className="space-y-1.5 min-w-0 flex-1 pr-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 leading-none truncate">
          {label}
        </p>
        <p className="text-lg font-extrabold tracking-tight text-sky-950 truncate transition-all duration-300 group-hover:scale-[1.02] origin-left">
          {value}
        </p>
      </div>

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${s.iconBg} ${s.iconText}`}
      >
        <Icon className="h-5 w-5 stroke-[2]" />
      </div>
    </div>
  );
}
