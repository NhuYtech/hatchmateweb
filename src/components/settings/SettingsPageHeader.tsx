import React from "react";
import { Settings, Save, RotateCcw, Bell, UserCircle2, BookOpen } from "lucide-react";

interface SettingsPageHeaderProps {
  activeProfile: string;
}

export default function SettingsPageHeader({ activeProfile }: SettingsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100/80 bg-white/90 backdrop-blur-md px-6 py-5 shadow-sm shadow-sky-100/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500 flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5" />
            <span>Thiết lập hệ thống</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-semibold text-orange-700 border border-orange-100/50">
            <BookOpen className="h-3.5 w-3.5" />
            Profile: {activeProfile}
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sky-950">Cấu hình ấp</h1>
          <p className="mt-1 text-sm text-slate-500">
            Thiết lập nhiệt độ, độ ẩm, chu kỳ đảo và cảnh báo cho hệ thống ấp trứng HatchMate
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 duration-150"
        >
          <RotateCcw className="h-4 w-4 text-slate-500" />
          <span>Khôi phục mặc định</span>
        </button>

        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-xs font-bold text-white shadow-md shadow-orange-100 transition hover:from-amber-600 hover:to-orange-600 active:scale-95 duration-150"
        >
          <Save className="h-4 w-4" />
          <span>Lưu cấu hình</span>
        </button>

        <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-slate-100 bg-slate-50/50 text-slate-600 transition hover:bg-slate-100 active:scale-95"
        >
          <Bell className="h-4.5 w-4.5" />
        </button>

        <div className="inline-flex items-center gap-3 rounded-[16px] border border-sky-100 bg-slate-50/30 px-3.5 py-1.5 shadow-sm">
          <UserCircle2 className="h-8 w-8 rounded-full bg-sky-600/10 p-1 text-sky-600" />
          <div className="text-left hidden md:block">
            <p className="text-xs font-bold text-sky-950">Nguyễn Admin</p>
            <p className="text-[10px] font-medium text-sky-600/80">Quản trị viên</p>
          </div>
        </div>
      </div>
    </div>
  );
}
