import { Bell, Search, UserCircle2 } from "lucide-react";

export default function DashboardTopbar() {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200/80 bg-white/95 px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Tổng quan hệ thống
        </p>
        <h1 className="text-2xl font-semibold text-slate-900">Bảng điều khiển HatchMate</h1>
      </div>

      <div className="flex flex-1 flex-col gap-3 sm:ml-6 sm:flex-row sm:items-center sm:justify-end">
        <label className="relative flex h-12 w-full max-w-md items-center rounded-3xl border border-slate-200 bg-slate-50 px-4 text-slate-500 focus-within:border-slate-300 focus-within:text-slate-900 sm:w-auto">
          <Search className="h-4 w-4" />
          <input
            type="search"
            placeholder="Tìm thiết bị..."
            className="ml-3 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <button className="inline-flex h-12 items-center justify-center rounded-3xl bg-slate-50 px-4 text-slate-700 transition hover:bg-slate-100">
          <Bell className="h-5 w-5" />
        </button>

        <div className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <UserCircle2 className="h-9 w-9 text-slate-500" />
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Admin HatchMate</p>
            <p className="text-xs text-slate-500">Quản trị viên</p>
          </div>
        </div>
      </div>
    </div>
  );
}
