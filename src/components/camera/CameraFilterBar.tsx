"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ArrowUpDown, RotateCcw } from "lucide-react";

interface CameraFilterBarProps {
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onDeviceChange?: (value: string) => void;
  onAiStatusChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
  onReset?: () => void;
}

export default function CameraFilterBar({
  onSearchChange,
  onStatusChange,
  onDeviceChange,
  onAiStatusChange,
  onSortChange,
  onReset,
}: CameraFilterBarProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [device, setDevice] = useState("all");
  const [aiStatus, setAiStatus] = useState("all");
  const [sort, setSort] = useState("recent");

  const handleReset = () => {
    setSearch("");
    setStatus("all");
    setDevice("all");
    setAiStatus("all");
    setSort("recent");
    if (onReset) onReset();
  };

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white p-6 shadow-sm shadow-sky-100/20">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Bộ lọc & Tìm kiếm Camera
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tra cứu luồng live camera và lịch sử phân tích thị giác máy
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        {/* 1. Search Input */}
        <div className="md:col-span-2 lg:col-span-6">
          <label className="relative flex h-12 w-full items-center rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 text-slate-500 transition-all duration-200 focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-50">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder="Tìm theo thiết bị, camera hoặc kết quả AI..."
              className="ml-3 min-w-0 flex-1 bg-transparent text-sm text-sky-950 outline-none placeholder:text-slate-400 font-medium"
            />
          </label>
        </div>

        {/* 2. Status Filter */}
        <div className="lg:col-span-3">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                if (onStatusChange) onStatusChange(e.target.value);
              }}
              className="h-12 w-full appearance-none rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
            >
              <option value="all">Camera: Tất cả</option>
              <option value="online">Đang hoạt động (Online)</option>
              <option value="offline">Ngoại tuyến (Offline)</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* 3. Device Filter */}
        <div className="lg:col-span-3">
          <div className="relative">
            <select
              value={device}
              onChange={(e) => {
                setDevice(e.target.value);
                if (onDeviceChange) onDeviceChange(e.target.value);
              }}
              className="h-12 w-full appearance-none rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
            >
              <option value="all">Thiết bị: Tất cả</option>
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

        {/* 4. AI Status Filter */}
        <div className="lg:col-span-6">
          <div className="relative">
            <select
              value={aiStatus}
              onChange={(e) => {
                setAiStatus(e.target.value);
                if (onAiStatusChange) onAiStatusChange(e.target.value);
              }}
              className="h-12 w-full appearance-none rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
            >
              <option value="all">Trạng thái AI: Tất cả</option>
              <option value="analyzed">Đã phân tích (Phôi khỏe / Hỏng)</option>
              <option value="pending">Chờ phân tích (Chưa quét)</option>
              <option value="warning">Có cảnh báo (Nứt vỏ / Quá lạnh)</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* 5. Sort Filter */}
        <div className="lg:col-span-6">
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                if (onSortChange) onSortChange(e.target.value);
              }}
              className="h-12 w-full appearance-none rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
            >
              <option value="recent">Sắp xếp: Mới cập nhật</option>
              <option value="online_first">Camera online trước</option>
              <option value="alerts_first">Nhiều cảnh báo trước</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <ArrowUpDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
