"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ArrowUpDown } from "lucide-react";

interface DeviceFilterBarProps {
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onSortChange?: (value: string) => void;
}

export default function DeviceFilterBar({
  onSearchChange,
  onStatusChange,
  onSortChange,
}: DeviceFilterBarProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("updated_desc");

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white p-6 shadow-sm shadow-sky-100/20">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Bộ lọc & Tìm kiếm
          </h3>
          {/* <p className="text-xs text-slate-500 mt-1">
            Tra cứu máy ấp nhanh theo tên, mã máy hoặc trạng thái hoạt động
          </p> */}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* 1. Search Input */}
        <div className="lg:col-span-8">
          <label className="relative flex h-12 w-full items-center rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 text-slate-500 transition-all duration-200 focus-within:border-sky-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-sky-50">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (onSearchChange) onSearchChange(e.target.value);
              }}
              placeholder="Tìm theo ID, tên máy hoặc chủ sở hữu"
              className="ml-3 min-w-0 flex-1 bg-transparent text-sm text-sky-950 outline-none placeholder:text-slate-400 font-medium"
            />
          </label>
        </div>

        {/* 2. Status Filter */}
        <div className="sm:col-span-4 lg:col-span-4">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                if (onStatusChange) onStatusChange(e.target.value);
              }}
              className="h-12 w-full appearance-none rounded-[20px] border border-slate-200 bg-slate-50/50 px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-50"
            >
              <option value="all">Tất cả</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="warning">Cảnh báo</option>
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
