import { ArrowRight, Camera, CameraOff } from "lucide-react";
import type { DeviceItem } from "../../types/dashboard";

interface DeviceOverviewTableProps {
  devices: DeviceItem[];
}

export default function DeviceOverviewTable({ devices }: DeviceOverviewTableProps) {
  return (
    <section className="rounded-[24px] border border-slate-200/80 bg-white/95 p-4 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md min-w-0 overflow-hidden">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Tổng quan thiết bị</h3>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi trạng thái hoạt động, cảm biến và tiến độ ấp của từng thiết bị
          </p>
        </div>
        <button className="self-start sm:self-center inline-flex items-center gap-2 rounded-full bg-slate-50 hover:bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition border border-slate-200/60">
          Xem tất cả
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6">
        <table className="w-full min-w-[1050px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <th className="pb-4 pt-2 font-semibold">Device ID</th>
              <th className="pb-4 pt-2 font-semibold">Tên máy</th>
              <th className="pb-4 pt-2 font-semibold">Chủ sở hữu</th>
              <th className="pb-4 pt-2 font-semibold text-center">Trạng thái</th>
              <th className="pb-4 pt-2 font-semibold text-center">Nhiệt độ</th>
              <th className="pb-4 pt-2 font-semibold text-center">Độ ẩm</th>
              <th className="pb-4 pt-2 font-semibold text-center">Ngày ấp</th>
              <th className="pb-4 pt-2 font-semibold text-center">Còn lại</th>
              <th className="pb-4 pt-2 font-semibold text-center">Camera</th>
              <th className="pb-4 pt-2 font-semibold text-center">Cập nhật cuối</th>
              <th className="pb-4 pt-2 font-semibold text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {devices.map((device) => {
              // Status Badge configuration
              let statusBadge = null;
              if (device.status === "online") {
                statusBadge = (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/40 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                );
              } else if (device.status === "warning") {
                statusBadge = (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/40 px-2.5 py-1 text-xs font-medium text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Warning
                  </span>
                );
              } else {
                statusBadge = (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/60 px-2.5 py-1 text-xs font-medium text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    Offline
                  </span>
                );
              }

              return (
                <tr
                  key={device.id}
                  className="group hover:bg-slate-50/50 transition-colors duration-200"
                >
                  {/* Device ID */}
                  <td className="py-4 align-middle text-sm font-semibold text-slate-900">
                    {device.id}
                  </td>
                  {/* Name */}
                  <td className="py-4 align-middle text-sm font-medium text-slate-800">
                    {device.name}
                  </td>
                  {/* Owner */}
                  <td className="py-4 align-middle text-sm text-slate-500">
                    {device.owner}
                  </td>
                  {/* Status */}
                  <td className="py-4 align-middle text-center">
                    {statusBadge}
                  </td>
                  {/* Temp */}
                  <td className="py-4 align-middle text-center text-sm font-semibold text-slate-900">
                    {device.temperature > 0 ? `${device.temperature.toFixed(1)}°C` : "—"}
                  </td>
                  {/* Humidity */}
                  <td className="py-4 align-middle text-center text-sm font-semibold text-slate-900">
                    {device.humidity > 0 ? `${device.humidity}%` : "—"}
                  </td>
                  {/* Incubating Days */}
                  <td className="py-4 align-middle text-center text-sm text-slate-700">
                    {device.incubatingDay > 0 ? (
                      <span>
                        {device.incubatingDay}
                        <span className="text-slate-400">/{device.totalIncubationDays}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  {/* Remaining Days */}
                  <td className="py-4 align-middle text-center text-sm text-slate-700">
                    {device.incubatingDay > 0 ? (
                      <span className="font-medium text-sky-600">
                        {device.remainingDays} ngày
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  {/* Camera */}
                  <td className="py-4 align-middle text-center">
                    {device.hasCamera ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/30 px-2.5 py-1 text-xs font-medium text-sky-700">
                        <Camera className="h-3.5 w-3.5" />
                        Có ảnh
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/50 px-2.5 py-1 text-xs font-medium text-slate-400">
                        <CameraOff className="h-3.5 w-3.5" />
                        Chưa có ảnh
                      </span>
                    )}
                  </td>
                  {/* Last Seen */}
                  <td className="py-4 align-middle text-center text-xs text-slate-500">
                    {device.lastSeen}
                  </td>
                  {/* Action */}
                  <td className="py-4 align-middle text-right">
                    <button className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/60 px-3.5 py-1.5 text-xs font-semibold text-amber-800 transition active:scale-95 cursor-pointer">
                      Xem chi tiết
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
