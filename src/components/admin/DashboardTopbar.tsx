import { Bell, Search, UserCircle2 } from "lucide-react";

export default function DashboardTopbar() {
  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-500">
          Tổng quan hệ thống
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Tổng quan hệ thống</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Giám sát toàn bộ hệ thống ấp trứng HatchMate, theo dõi trạng thái và hành động nhanh.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:auto-cols-min sm:grid-flow-col sm:items-center">
        <label className="relative flex h-12 min-w-[260px] items-center rounded-[20px] border border-slate-200 bg-slate-50 px-4 text-slate-500 transition focus-within:border-sky-300">
          <Search className="h-4 w-4" />
          <input
            type="search"
            placeholder="Tìm thiết bị..."
            className="ml-3 min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <button
          type="button"
          className="inline-flex h-12 items-center justify-center rounded-[20px] bg-slate-50 px-4 text-slate-700 transition hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
        </button>

        <div className="inline-flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <UserCircle2 className="h-10 w-10 rounded-full bg-slate-100 p-1 text-slate-500" />
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-900">Nguyễn Admin</p>
            <p className="text-xs text-slate-500">Quản trị viên</p>
          </div>
        </div>
      </div>
    </div>
  );
}
