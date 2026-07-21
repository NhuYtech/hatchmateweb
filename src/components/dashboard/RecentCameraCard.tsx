import { Camera, ImagePlus } from "lucide-react";
import type { CameraItem } from "../../types/dashboard";

interface RecentCameraCardProps {
  feeds: CameraItem[];
}

export default function RecentCameraCard({ feeds }: RecentCameraCardProps) {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">Ảnh camera mới nhất</h3>
          <p className="text-sm text-slate-500 mt-1">Giám sát hình ảnh thời gian thực từ các trạm ấp</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition border border-slate-200/60 cursor-pointer">
          Xem camera
        </button>
      </div>

      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 flex-1">
        {feeds.map((feed) => (
          <div key={feed.id} className="rounded-[20px] border border-slate-200/80 bg-slate-50/50 p-3 sm:p-4 shadow-sm hover:shadow transition-all duration-200 flex flex-col">
            <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/40 flex items-center justify-center">
              {feed.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={feed.deviceName}
                  src={feed.imageUrl}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-center text-slate-400">
                  <div className="rounded-full bg-white p-3 shadow-inner border border-slate-100/60">
                    <ImagePlus className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">Chưa có hình ảnh</p>
                </div>
              )}
            </div>
            <div className="space-y-2.5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-slate-800">{feed.deviceName}</p>
                  <Camera className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Cập nhật lúc: {feed.capturedAt}</p>
              </div>
              <div className="pt-2">
                {feed.aiLabel ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/40 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                    AI: {feed.aiLabel}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200/60 px-2.5 py-1 text-xs font-medium text-slate-500">
                    Chưa có nhãn AI
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
