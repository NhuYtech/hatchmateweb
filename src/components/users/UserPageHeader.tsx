import React from "react";
import { Plus, Bell, UserCircle2, Users } from "lucide-react";

interface UserPageHeaderProps {
  totalUsers: number;
}

export default function UserPageHeader({ totalUsers }: UserPageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100/80 bg-white/90 backdrop-blur-md px-6 py-5 shadow-sm shadow-sky-100/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        {/* <div className="flex items-center gap-2">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500">
            Thành viên
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 border border-sky-100/50">
            <Users className="h-3.5 w-3.5" />
            {totalUsers} người dùng
          </span>
        </div> */}
        <div>
          <h5 className="text-1xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">QUẢN LÝ NGƯỜI DÙNG</h5>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi tài khoản, phân quyền và quản lý người dùng trong hệ thống HatchMate
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-semibold text-white shadow-md shadow-orange-200/50 transition duration-200 hover:from-amber-600 hover:to-orange-600 active:scale-95 hover:shadow-lg"
        >
          <Plus className="h-5 w-5 stroke-[2.5]" />
          <span>Thêm người dùng</span>
        </button>
      </div>
    </div>
  );
}
