import React from "react";
import { Settings, Save, RotateCcw, Bell, UserCircle2, BookOpen, ChevronRight } from "lucide-react";

interface SettingsPageHeaderProps {
  activeProfile: string;
}

export default function SettingsPageHeader({ activeProfile }: SettingsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: breadcrumb + title */}
      <div className="space-y-1.5">
        {/* Breadcrumb-style label */}
        {/* <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
          <Settings className="h-3.5 w-3.5 text-sky-400" />
          <span>HatchMate Admin</span>
          <ChevronRight className="h-3 w-3 text-slate-300" />
          <span className="text-sky-600 font-bold">Thiết lập hệ thống</span>
        </div> */}

        {/* Title row */}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-extrabold tracking-tight text-sky-950">
            CẤU HÌNH ẤP
          </h1>
          {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
            <BookOpen className="h-3.5 w-3.5" />
            {activeProfile}
          </span> */}
        </div>

        <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
          Thiết lập nhiệt độ, độ ẩm, chu kỳ đảo và cảnh báo cho hệ thống ấp trứng HatchMate
        </p>
      </div>

      {/* Right: actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Reset button */}
        {/* <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 shadow-sm transition duration-150 hover:bg-slate-50 hover:border-slate-300 active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
          <span>Khôi phục mặc định</span>
        </button> */}

        {/* Save CTA */}
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-xs font-bold text-white shadow-md shadow-orange-200/60 transition duration-150 hover:from-amber-400 hover:to-orange-400 active:scale-95"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Lưu cấu hình</span>
        </button>

        <div className="h-7 w-px bg-slate-100 hidden sm:block" />

        {/* Bell icon */}
        {/* <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-slate-100 bg-slate-50/50 text-slate-500 transition duration-150 hover:bg-slate-100 active:scale-95"
        >
          <Bell className="h-4 w-4" />
        </button> */}

        {/* Admin chip */}
        {/* <div className="inline-flex items-center gap-2.5 rounded-[14px] border border-sky-100 bg-sky-50/30 px-3 py-1.5">
          <UserCircle2 className="h-7 w-7 rounded-full bg-sky-100/80 p-1 text-sky-600" />
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-sky-950">Nguyễn Admin</p>
            <p className="text-[10px] font-semibold text-sky-500">Quản trị viên</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
