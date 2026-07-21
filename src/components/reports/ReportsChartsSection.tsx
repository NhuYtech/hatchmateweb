"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

import { ReportChartPoint } from "@/src/types/report";

interface ReportsChartsSectionProps {
  data: ReportChartPoint[];
}

export default function ReportsChartsSection({ data }: ReportsChartsSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full min-w-0">
        <div className="h-[350px] rounded-[24px] border border-sky-100 bg-white animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0">
      {/* 3. Alerts Bar Chart */}
      <div className="rounded-[24px] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/10 min-w-0 overflow-hidden">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <h4 className="font-bold text-sky-950 text-sm">THỐNG KÊ CẢNH BÁO</h4>
          </div>
          <span className="text-xs font-semibold text-slate-400 shrink-0">Số vụ theo ngày</span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e0f2fe",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                }}
              />
              <Bar dataKey="alertCount" name="Số cảnh báo" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
