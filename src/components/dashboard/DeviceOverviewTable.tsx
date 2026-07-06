import { ArrowRight, Camera, CircleDashed, WifiOff } from "lucide-react";
import type { DeviceItem } from "../../types/dashboard";

interface DeviceOverviewTableProps {
  devices: DeviceItem[];
}

const statusStyles: Record<string, string> = {
  online: "bg-emerald-100 text-emerald-800 border-emerald-200",
  incubating: "bg-amber-100 text-amber-800 border-amber-200",
  warning: "bg-rose-100 text-rose-800 border-rose-200",
  offline: "bg-slate-100 text-slate-700 border-slate-200",
};

const statusLabels: Record<string, string> = {
  online: "Online",
  incubating: "Đang ấp",
  warning: "Cảnh báo",
  offline: "Offline",
};

export default function DeviceOverviewTable({ devices }: DeviceOverviewTableProps) {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white/95 p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Bảng thiết bị</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Theo dõi thiết bị ấp</h3>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
          Xem tất cả
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3 text-left">
          <thead>
            <tr className="text-xs uppercase tracking-[0.2em] text-slate-500">
              <th className="px-4 py-3">Device ID</th>
              <th className="px-4 py-3">Tên máy</th>
              <th className="px-4 py-3">Chủ sở hữu</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Nhiệt độ</th>
              <th className="px-4 py-3">Độ ẩm</th>
              <th className="px-4 py-3">Ngày ấp</th>
              <th className="px-4 py-3">Còn lại</th>
              <th className="px-4 py-3">Camera</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id} className="rounded-[20px] bg-slate-50 shadow-inner/5">
                <td className="px-4 py-4 align-middle text-sm font-semibold text-slate-900">{device.id}</td>
                <td className="px-4 py-4 align-middle text-sm text-slate-700">{device.name}</td>
                <td className="px-4 py-4 align-middle text-sm text-slate-600">{device.owner}</td>
                <td className="px-4 py-4 align-middle">
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[device.status]}`}>
                    {device.status === "offline" ? <WifiOff className="h-3.5 w-3.5" /> : <CircleDashed className="h-3.5 w-3.5" />}
                    {statusLabels[device.status]}
                  </span>
                </td>
                <td className="px-4 py-4 align-middle text-sm text-slate-900">{device.temperature ? `${device.temperature.toFixed(1)}°C` : "—"}</td>
                <td className="px-4 py-4 align-middle text-sm text-slate-900">{device.humidity ? `${device.humidity}%` : "—"}</td>
                <td className="px-4 py-4 align-middle text-sm text-slate-700">{device.incubatingDay}/{device.totalIncubationDays}</td>
                <td className="px-4 py-4 align-middle text-sm text-slate-700">{device.remainingDays} ngày</td>
                <td className="px-4 py-4 align-middle text-sm text-slate-700">
                  {device.hasCamera ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      <Camera className="h-3.5 w-3.5" /> Có
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                      Không
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 align-middle">
                  <button className="inline-flex items-center gap-2 rounded-3xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100">
                    Xem chi tiết
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
