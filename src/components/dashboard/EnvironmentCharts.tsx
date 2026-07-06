"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPoint } from "../../types/dashboard";

interface EnvironmentChartsProps {
  data: ChartPoint[];
}

const rangeOptions = ["Hôm nay", "7 ngày", "30 ngày"] as const;

export default function EnvironmentCharts({ data }: EnvironmentChartsProps) {
  const [activeRange, setActiveRange] = useState<typeof rangeOptions[number]>("Hôm nay");

  return (
    <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded-[24px] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Nhiệt độ theo thời gian
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Xu hướng môi trường</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {rangeOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setActiveRange(option)}
                className={`rounded-3xl border px-4 py-2 text-sm transition ${
                  activeRange === option
                    ? "border-amber-300 bg-amber-50 text-amber-900"
                    : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
              <Tooltip
                contentStyle={{ borderRadius: 18, borderColor: "#cbd5e1", backgroundColor: "#ffffff" }}
                labelStyle={{ color: "#0f172a" }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingLeft: 10 }} />
              <Area type="monotone" dataKey="temperature" stroke="#f97316" fillOpacity={1} fill="url(#tempGradient)" name="Nhiệt độ (°C)" strokeWidth={3} />
              <Area type="monotone" dataKey="humidity" stroke="#0284c7" fillOpacity={1} fill="url(#humGradient)" name="Độ ẩm (%)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Nhiệt độ & độ ẩm</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">Theo dõi chu kỳ ấp</p>
        </div>
        <div className="space-y-4">
          <div className="rounded-[20px] bg-amber-50/90 p-4">
            <p className="text-sm font-semibold text-amber-700">Nhiệt độ mục tiêu</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">37.4°C</p>
            <p className="mt-1 text-sm text-slate-500">Ổn định quanh mức mục tiêu giúp phôi nở đều.</p>
          </div>
          <div className="rounded-[20px] bg-sky-50/90 p-4">
            <p className="text-sm font-semibold text-sky-700">Độ ẩm mục tiêu</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">61%</p>
            <p className="mt-1 text-sm text-slate-500">Độ ẩm được giữ ổn định để bảo toàn phôi và vỏ trứng.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
