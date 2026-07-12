"use client";

import React, { useState } from "react";
import { ChevronDown, Calendar, RotateCcw, LayoutGrid } from "lucide-react";

interface ReportFilterBarProps {
  onDateRangeChange?: (value: string) => void;
  onScopeChange?: (value: string) => void;
  onTypeChange?: (value: string) => void;
  onDeviceChange?: (value: string) => void;
  onReset?: () => void;
}

export default function ReportFilterBar({
  onDateRangeChange,
  onScopeChange,
  onTypeChange,
  onDeviceChange,
  onReset,
}: ReportFilterBarProps) {
  const [dateRange, setDateRange] = useState("30_days");
  const [scope, setScope] = useState("all");
  const [reportType, setReportType] = useState("env");
  const [device, setDevice] = useState("all");

  const handleReset = () => {
    setDateRange("30_days");
    setScope("all");
    setReportType("env");
    setDevice("all");
    if (onReset) onReset();
  };

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white p-6 shadow-sm shadow-sky-100/20">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Cấu hình thời gian & Phạm vi Báo cáo
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập khoảng thời gian và đối tượng để kết xuất dữ liệu phân tích hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 transition duration-150 self-start md:self-auto hover:-translate-y-0.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Đặt lại bộ lọc</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {/* 1. Date Range Filter */}
        <div className="lg:col-span-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                if (onDateRangeChange) onDateRangeChange(e.target.value);
              }}
              className="h-12 w-full appearance-none rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
            >
              <option value="today">Thời gian: Hôm nay</option>
              <option value="7_days">7 ngày qua</option>
              <option value="30_days">30 ngày qua</option>
              <option value="custom">Tùy chỉnh khoảng ngày</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* 2. Scope Filter */}
        <div className="lg:col-span-3">
          <div className="relative">
            <select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value);
                if (onScopeChange) onScopeChange(e.target.value);
              }}
              className="h-12 w-full appearance-none rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
            >
              <option value="all">Phạm vi: Toàn hệ thống</option>
              <option value="device">Theo thiết bị riêng lẻ</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <LayoutGrid className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* 3. Report Type Filter */}
        <div className="lg:col-span-3">
          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                if (onTypeChange) onTypeChange(e.target.value);
              }}
              className="h-12 w-full appearance-none rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
            >
              <option value="env">Loại: Tổng quan môi trường</option>
              <option value="alerts">Cảnh báo hệ thống</option>
              <option value="activity">Hoạt động thiết bị</option>
              <option value="cycle">Chu kỳ ấp</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* 4. Device Filter */}
        <div className="lg:col-span-3">
          <div className="relative">
            <select
              value={device}
              disabled={scope === "all"}
              onChange={(e) => {
                setDevice(e.target.value);
                if (onDeviceChange) onDeviceChange(e.target.value);
              }}
              className={`h-12 w-full appearance-none rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition duration-200 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50 ${
                scope === "all" ? "opacity-50 cursor-not-allowed bg-slate-100" : "hover:border-slate-300"
              }`}
            >
              <option value="all">Tất cả thiết bị</option>
              <option value="SEI-IoT-001">SEI-IoT-001 (Alpha)</option>
              <option value="SEI-IoT-002">SEI-IoT-002 (Bravo)</option>
              <option value="SEI-IoT-003">SEI-IoT-003 (Delta)</option>
              <option value="SEI-IoT-004">SEI-IoT-004 (Echo)</option>
              <option value="SEI-IoT-005">SEI-IoT-005 (Foxtrot)</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
