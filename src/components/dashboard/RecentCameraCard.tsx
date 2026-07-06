import { Camera, ImagePlus } from "lucide-react";
import type { CameraItem } from "../../types/dashboard";

interface RecentCameraCardProps {
  feeds: CameraItem[];
}

export default function RecentCameraCard({ feeds }: RecentCameraCardProps) {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Camera mới nhất</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Hình ảnh giám sát</h3>
        </div>
        <button className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
          Xem camera
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {feeds.map((feed) => (
          <div key={feed.id} className="rounded-[20px] border border-slate-200/80 bg-slate-50 p-4 shadow-sm">
            <div className="mb-4 flex h-44 items-center justify-center rounded-3xl bg-white text-slate-400">
              {feed.imageUrl ? (
                <img alt={feed.deviceName} src={feed.imageUrl} className="h-full w-full rounded-3xl object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center text-slate-400">
                  <ImagePlus className="h-8 w-8" />
                  <p className="text-sm font-semibold">Chưa có ảnh mới</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{feed.deviceName}</p>
                <Camera className="h-4 w-4 text-slate-500" />
              </div>
              <p className="text-sm text-slate-600">Cập nhật lúc {feed.capturedAt}</p>
              <p className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                AI: {feed.aiLabel ? "Có nhãn" : "Chưa có nhãn"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
