import React from "react";
import { FileText, Bell, UserCircle2, Calendar } from "lucide-react";

export default function ReportsPageHeader() {
  return (
    <div className="flex flex-col gap-6 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        {/* <div className="flex items-center gap-2">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500">
            Thống kê
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 border border-sky-100/50">
            <Calendar className="h-3.5 w-3.5" />
            30 ngày gần nhất
          </span>
        </div> */}
        <div>
          <h5 className="text-1xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">BÁO CÁO & THỐNG KÊ</h5>
          <p className="mt-1 text-sm text-slate-500">
            Tổng hợp hiệu suất thiết bị, dữ liệu môi trường và cảnh báo trong hệ thống HatchMate
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-semibold text-white shadow-md shadow-orange-200/50 transition duration-200 hover:from-amber-600 hover:to-orange-600 active:scale-95 hover:shadow-lg"
        >
          <FileText className="h-5 w-5 stroke-[2.5]" />
          <span>Xuất báo cáo</span>
        </button>

        <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

        {/* <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-[20px] border border-slate-100 bg-slate-50/50 text-slate-600 transition hover:bg-slate-100 active:scale-95"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="inline-flex items-center gap-3 rounded-[20px] border border-sky-100 bg-slate-50/30 px-4 py-2 shadow-sm">
          <UserCircle2 className="h-9 w-9 rounded-full bg-sky-600/10 p-1 text-sky-600" />
          <div className="text-left hidden md:block">
            <p className="text-sm font-semibold text-sky-950">Nguyễn Admin</p>
            <p className="text-[11px] font-medium text-sky-600/80">Quản trị viên</p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
