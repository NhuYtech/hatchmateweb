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
  const accentClasses = {
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-100/70",
      hover: "hover:border-orange-300 hover:shadow-orange-100/40",
    },
    blue: {
      bg: "bg-blue-50/70",
      text: "text-blue-600",
      border: "border-blue-100/70",
      hover: "hover:border-blue-300 hover:shadow-blue-100/40",
    },
    rose: {
      bg: "bg-rose-50/70",
      text: "text-rose-600",
      border: "border-rose-100/70",
      hover: "hover:border-rose-300 hover:shadow-rose-100/40",
    },
    emerald: {
      bg: "bg-emerald-50/70",
      text: "text-emerald-600",
      border: "border-emerald-100/70",
      hover: "hover:border-emerald-300 hover:shadow-emerald-100/40",
    },
  };

  const activeStyles = accentClasses[accent] || accentClasses.blue;

  return (
    <div
      className={`group flex items-center justify-between rounded-[24px] border bg-white p-5 shadow-sm shadow-sky-100/10 transition-all duration-300 ${activeStyles.border} ${activeStyles.hover} hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>
        <p className="text-xl font-extrabold tracking-tight text-sky-950 transition-all duration-300 group-hover:scale-[1.03] origin-left">
          {value}
        </p>
      </div>

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${activeStyles.bg} ${activeStyles.text}`}
      >
        <Icon className="h-5 w-5 stroke-[2.2]" />
      </div>
    </div>
  );
}
