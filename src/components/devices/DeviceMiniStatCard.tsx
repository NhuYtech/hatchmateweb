import React from "react";
import { LucideIcon } from "lucide-react";

interface DeviceMiniStatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent: "sky" | "emerald" | "rose" | "amber" | "indigo";
}

export default function DeviceMiniStatCard({
  label,
  value,
  icon: Icon,
  accent,
}: DeviceMiniStatCardProps) {
  const accentClasses = {
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-100/70",
      hover: "hover:border-sky-300 hover:shadow-sky-100/40",
      ring: "group-hover:ring-sky-100",
    },
    emerald: {
      bg: "bg-emerald-50/70",
      text: "text-emerald-600",
      border: "border-emerald-100/70",
      hover: "hover:border-emerald-300 hover:shadow-emerald-100/40",
      ring: "group-hover:ring-emerald-100",
    },
    rose: {
      bg: "bg-rose-50/70",
      text: "text-rose-600",
      border: "border-rose-100/70",
      hover: "hover:border-rose-300 hover:shadow-rose-100/40",
      ring: "group-hover:ring-rose-100",
    },
    amber: {
      bg: "bg-amber-50/70",
      text: "text-amber-600",
      border: "border-amber-100/70",
      hover: "hover:border-amber-300 hover:shadow-amber-100/40",
      ring: "group-hover:ring-amber-100",
    },
    indigo: {
      bg: "bg-indigo-50/70",
      text: "text-indigo-600",
      border: "border-indigo-100/70",
      hover: "hover:border-indigo-300 hover:shadow-indigo-100/40",
      ring: "group-hover:ring-indigo-100",
    },
  };

  const activeStyles = accentClasses[accent] || accentClasses.sky;

  return (
    <div
      className={`group flex items-center justify-between rounded-[24px] border bg-white p-5 shadow-sm shadow-sky-100/10 transition-all duration-300 ${activeStyles.border} ${activeStyles.hover} hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {label}
        </p>
        <p className="text-3xl font-extrabold tracking-tight text-sky-950 transition-all duration-300 group-hover:scale-[1.03] origin-left">
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
