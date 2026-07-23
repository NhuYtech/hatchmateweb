import React from "react";
import { LucideIcon } from "lucide-react";

interface ReportsMiniStatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent: "sky" | "emerald" | "rose" | "amber" | "indigo";
}

export default function ReportsMiniStatCard({
  label,
  value,
  icon: Icon,
  accent,
}: ReportsMiniStatCardProps) {
  const accentClasses = {
    sky: {
      bg: "bg-sky-50",
      text: "text-sky-600",
      border: "border-sky-100/70",
      hover: "hover:border-sky-300 hover:shadow-sky-100/40",
    },
    emerald: {
      bg: "bg-emerald-50/70",
      text: "text-emerald-600",
      border: "border-teal-100/70",
      hover: "hover:border-teal-300 hover:shadow-teal-100/40",
    },
    rose: {
      bg: "bg-rose-50/70",
      text: "text-rose-600",
      border: "border-orange-100/70",
      hover: "hover:border-orange-300 hover:shadow-orange-100/40",
    },
    amber: {
      bg: "bg-amber-50/70",
      text: "text-amber-600",
      border: "border-amber-100/70",
      hover: "hover:border-amber-300 hover:shadow-amber-100/40",
    },
    indigo: {
      bg: "bg-indigo-50/70",
      text: "text-indigo-600",
      border: "border-indigo-100/70",
      hover: "hover:border-indigo-300 hover:shadow-indigo-100/40",
    },
  };

  const activeStyles = accentClasses[accent] || accentClasses.sky;

  return (
    <div
      className={`group flex items-center justify-between rounded-[24px] border bg-white p-5 shadow-sm shadow-sky-100/10 transition-all duration-300 relative overflow-hidden ${activeStyles.border} ${activeStyles.hover} hover:-translate-y-1 hover:shadow-lg w-full min-w-0`}
    >
      {accent === "indigo" && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#ffffff",
            backgroundImage: `
              radial-gradient(
                circle at top right,
                rgba(173, 109, 244, 0.45),
                transparent 70%
              )
            `,
            filter: "blur(40px)",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      {accent === "emerald" && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#ffffff",
            backgroundImage: `
              radial-gradient(
                circle at top right,
                rgba(56, 193, 182, 0.45),
                transparent 70%
              )
            `,
            filter: "blur(40px)",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      {accent === "rose" && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#ffffff",
            backgroundImage: `
              radial-gradient(
                circle at top right,
                rgba(255, 140, 60, 0.45),
                transparent 70%
              )
            `,
            filter: "blur(40px)",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      <div className="space-y-1 min-w-0 flex-1 pr-2 relative z-10">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          {label}
        </h3>
        <p className="text-3xl font-extrabold tracking-tight text-sky-950 transition-all duration-300 group-hover:scale-[1.03] origin-left truncate">
          {value}
        </p>
      </div>

      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 relative z-10 ${activeStyles.bg} ${activeStyles.text}`}
      >
        <Icon className="h-5 w-5 stroke-[2.2]" />
      </div>
    </div>
  );
}
