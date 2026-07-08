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
import { Thermometer, Droplet, AlertTriangle } from "lucide-react";
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
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[350px] rounded-[24px] border border-sky-100 bg-white animate-pulse" />
        <div className="h-[350px] rounded-[24px] border border-sky-100 bg-white animate-pulse" />
        <div className="h-[350px] md:col-span-2 rounded-[24px] border border-sky-100 bg-white animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* 1. Temperature Trend Area Chart */}
      <div className="rounded-[24px] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/10 min-w-0 overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <Thermometer className="h-4.5 w-4.5" />
            </div>
            <h4 className="font-bold text-sky-950 text-sm">Nhiệt độ trung bình (°C)</h4>
          </div>
          <span className="text-xs font-semibold text-slate-400">7 ngày gần nhất</span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[36, 39]} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#ffffff", 
                  borderRadius: "16px", 
                  border: "1px solid #e0f2fe", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                }}
              />
              <Area type="monotone" dataKey="avgTemperature" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Humidity Trend Area Chart */}
      <div className="rounded-[24px] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/10 min-w-0 overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <Droplet className="h-4.5 w-4.5" />
            </div>
            <h4 className="font-bold text-sky-950 text-sm">Độ ẩm trung bình (%)</h4>
          </div>
          <span className="text-xs font-semibold text-slate-400">7 ngày gần nhất</span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[50, 70]} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#ffffff", 
                  borderRadius: "16px", 
                  border: "1px solid #e0f2fe", 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                }}
              />
              <Area type="monotone" dataKey="avgHumidity" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#humidityGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Alerts Bar Chart */}
      <div className="rounded-[24px] border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/10 md:col-span-2 min-w-0 overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
            <h4 className="font-bold text-sky-950 text-sm">Thống kê cảnh báo phát sinh</h4>
          </div>
          <span className="text-xs font-semibold text-slate-400">Số vụ theo ngày</span>
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
              <Bar dataKey="alertCount" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
