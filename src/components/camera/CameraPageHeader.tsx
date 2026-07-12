import React from "react";
import { Camera, Bell, UserCircle2, Video } from "lucide-react";

interface CameraPageHeaderProps {
  totalCameras: number;
}

export default function CameraPageHeader({ totalCameras }: CameraPageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[24px] border border-sky-100/80 bg-white/90 backdrop-blur-md px-6 py-5 shadow-sm shadow-sky-100/30 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        {/* <div className="flex items-center gap-2">
          <div className="text-xs font-bold uppercase tracking-[0.24em] text-sky-500">
            Giám sát thị giác
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700 border border-sky-100/50">
            <Video className="h-3.5 w-3.5" />
            {totalCameras} camera đang theo dõi
          </span>
        </div> */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sky-950">Camera & AI</h1>
          <p className="mt-1 text-sm text-slate-500">
            Theo dõi camera thiết bị, ảnh chụp và kết quả phân tích AI trong hệ thống HatchMate
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-semibold text-white shadow-md shadow-orange-200/50 transition duration-200 hover:from-amber-600 hover:to-orange-600 active:scale-95 hover:shadow-lg"
        >
          <Camera className="h-5 w-5 stroke-[2.5]" />
          <span>Chụp ảnh mới</span>
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
