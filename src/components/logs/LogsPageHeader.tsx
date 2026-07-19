import React from "react";
import { Download, Bell, UserCircle2, ClipboardList } from "lucide-react";

interface LogsPageHeaderProps {
  totalToday: number;
}

export default function LogsPageHeader({ totalToday }: LogsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div>
          <h5 className="text-1xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">NHẬT KÝ HỆ THỐNG</h5>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi lịch sử hoạt động của thiết bị, cảnh báo và thao tác quản trị trong HatchMate
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-semibold text-white shadow-md shadow-orange-200/50 transition duration-200 hover:from-amber-600 hover:to-orange-600 active:scale-95 hover:shadow-lg cursor-pointer"
        >
          <Download className="h-5 w-5 stroke-[2.5]" />
          <span>Xuất nhật ký</span>
        </button>
      </div>
    </div>
  );
}
