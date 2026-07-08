"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Eye, 
  Edit3, 
  MoreVertical, 
  Wifi, 
  Battery, 
  Camera, 
  CameraOff, 
  Thermometer, 
  Droplet,
  Download,
  RotateCw,
  Cpu,
  Trash2,
  Settings2,
  PowerOff,
  Plus
} from "lucide-react";
import { DeviceItem } from "@/src/types/device";
import DataTablePagination from "@/src/components/common/DataTablePagination";

interface DeviceTableProps {
  devices: DeviceItem[];
  onAddDevice?: () => void;
}

export default function DeviceTable({ devices, onAddDevice }: DeviceTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 if devices list changes (e.g. filtered)
  const [prevDevices, setPrevDevices] = useState(devices);
  if (devices !== prevDevices) {
    setPrevDevices(devices);
    setCurrentPage(1);
  }

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusBadge = (status: DeviceItem["status"]) => {
    const configs = {
      online: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      offline: "bg-rose-50 text-rose-700 border-rose-200/60",
      warning: "bg-amber-50 text-amber-700 border-amber-200/80",
    };
    const labels = {
      online: "Online",
      offline: "Ngoại tuyến",
      warning: "Cảnh báo",
    };
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${configs[status]}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${status === "online" ? "bg-emerald-500 animate-pulse" : status === "offline" ? "bg-rose-500" : "bg-amber-500 animate-bounce"}`} />
        {labels[status]}
      </span>
    );
  };

  const getIncubationBadge = (status: DeviceItem["incubationStatus"], day: number, total: number) => {
    const configs = {
      incubating: "bg-sky-50 text-sky-700 border-sky-100",
      hatchingSoon: "bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 border-orange-100",
      paused: "bg-slate-50 text-slate-500 border-slate-200/60",
    };
    const labels = {
      incubating: "Đang ấp",
      hatchingSoon: "Sắp nở",
      paused: "Tạm dừng",
    };
    return (
      <div className="space-y-1">
        <span className={`inline-flex rounded-lg border px-2 py-0.5 text-xs font-semibold ${configs[status]}`}>
          {labels[status]}
        </span>
        {status !== "paused" && (
          <p className="text-[11px] font-medium text-slate-500 pl-0.5">
            Ngày {day}/{total}
          </p>
        )}
      </div>
    );
  };

  const getBatteryIcon = (level: number) => {
    let color = "text-emerald-500";
    if (level < 20) color = "text-rose-500 animate-pulse";
    else if (level < 50) color = "text-amber-500";

    return (
      <div className="flex items-center gap-1.5">
        <Battery className={`h-4 w-4 ${color}`} />
        <span className="text-xs font-semibold text-slate-700">{level}%</span>
      </div>
    );
  };

  const getWifiSignal = (signal: number) => {
    let color = "text-emerald-500";
    if (signal <= 2) color = "text-rose-500";
    else if (signal <= 3) color = "text-amber-500";

    return (
      <div className="flex items-center gap-1.5">
        <Wifi className={`h-4 w-4 ${color}`} />
        <span className="text-xs font-semibold text-slate-700">{signal}/5</span>
      </div>
    );
  };

  // Empty State Render with Warm Yellow-Orange Theme
  if (devices.length === 0) {
    return (
      <div className="rounded-[24px] border border-sky-100/80 bg-white p-16 text-center shadow-sm shadow-sky-100/10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-sm shadow-amber-100">
          <Cpu className="h-8 w-8 stroke-[2.2] animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-sky-950">Chưa có thiết bị nào</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
          Hiện tại không tìm thấy trạm ấp trứng nào trong danh sách. Hãy thêm thiết bị mới để bắt đầu giám sát hệ thống.
        </p>
        <button
          type="button"
          onClick={onAddDevice}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-sm font-semibold text-white shadow-md shadow-orange-100 transition hover:from-amber-600 hover:to-orange-600 active:scale-95 duration-150"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>Thêm thiết bị mới</span>
        </button>
      </div>
    );
  }

  const paginatedDevices = devices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white shadow-sm shadow-sky-100/10 overflow-hidden">
      
      {/* Table Toolbar */}
      <div className="border-b border-slate-100 bg-white px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Danh sách thiết bị máy ấp
          </h3>
          <p className="text-xs text-slate-500">
            Tổng cộng <span className="font-semibold text-sky-600">{devices.length}</span> thiết bị
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[16px] border border-sky-100 bg-sky-50/20 px-4 text-xs font-bold text-sky-700 shadow-sm transition hover:bg-sky-50 hover:text-sky-800 active:scale-95 duration-150"
          >
            <Download className="h-4 w-4 text-sky-600" />
            <span>Xuất dữ liệu</span>
          </button>
          
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[16px] border border-sky-100 bg-sky-50/20 text-sky-700 shadow-sm transition hover:bg-sky-50 hover:text-sky-800 active:scale-95 duration-150"
            title="Làm mới bảng"
          >
            <RotateCw className="h-4 w-4 text-sky-600" />
          </button>
        </div>
      </div>

      {/* Responsive Wrapper */}
      <div className="overflow-x-auto relative min-h-[300px]">
        <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Device ID</th>
              <th className="px-6 py-4">Tên máy</th>
              <th className="px-6 py-4">Chủ sở hữu</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Chu kỳ ấp</th>
              <th className="px-6 py-4">Nhiệt độ</th>
              <th className="px-6 py-4">Độ ẩm</th>
              <th className="px-6 py-4">Pin</th>
              <th className="px-6 py-4">WiFi</th>
              <th className="px-6 py-4">Camera</th>
              <th className="px-6 py-4">Cập nhật cuối</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedDevices.map((device) => (
              <tr 
                key={device.id} 
                className="group hover:bg-sky-50/10 transition-colors duration-150"
              >
                {/* Device ID */}
                <td className="px-6 py-4 font-mono text-xs font-bold text-sky-600">
                  {device.id}
                </td>

                {/* Tên máy */}
                <td className="px-6 py-4">
                  <div className="font-bold text-sky-950 group-hover:text-sky-600 transition-colors">
                    {device.name}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Model: HM-Smart-v2</p>
                </td>

                {/* Chủ sở hữu */}
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-500 font-semibold">{device.owner}</span>
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4">
                  {getStatusBadge(device.status)}
                </td>

                {/* Chu kỳ ấp */}
                <td className="px-6 py-4">
                  {getIncubationBadge(device.incubationStatus, device.incubatingDay, device.totalIncubationDays)}
                </td>

                {/* Nhiệt độ */}
                <td className="px-6 py-4">
                  {device.status === "offline" ? (
                    <span className="text-slate-300 font-semibold">--</span>
                  ) : (
                    <div className="flex items-center gap-1 font-bold text-sky-950">
                      <Thermometer className={`h-4 w-4 ${device.temperature >= 38.0 ? "text-amber-500" : "text-sky-500"}`} />
                      <span>{device.temperature.toFixed(1)}°C</span>
                    </div>
                  )}
                </td>

                {/* Độ ẩm */}
                <td className="px-6 py-4">
                  {device.status === "offline" ? (
                    <span className="text-slate-300 font-semibold">--</span>
                  ) : (
                    <div className="flex items-center gap-1 font-bold text-sky-950">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span>{device.humidity}%</span>
                    </div>
                  )}
                </td>

                {/* Pin */}
                <td className="px-6 py-4">
                  {device.status === "offline" ? (
                    <span className="text-slate-300 font-medium">--</span>
                  ) : (
                    getBatteryIcon(device.battery)
                  )}
                </td>

                {/* WiFi */}
                <td className="px-6 py-4">
                  {device.status === "offline" ? (
                    <span className="text-slate-300 font-medium">--</span>
                  ) : (
                    getWifiSignal(device.wifi)
                  )}
                </td>

                {/* Camera */}
                <td className="px-6 py-4">
                  {device.hasCamera ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-2 py-0.5 text-xs font-bold text-sky-700 border border-sky-100">
                      <Camera className="h-3 w-3" />
                      Có ảnh
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-400 border border-slate-100">
                      <CameraOff className="h-3 w-3" />
                      Chưa có
                    </span>
                  )}
                </td>

                {/* Cập nhật cuối */}
                <td className="px-6 py-4 text-xs text-slate-400 font-semibold">
                  {device.lastSeen}
                </td>

                {/* Row Actions Dropdown */}
                <td className="px-6 py-4 relative">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      title="Xem chi tiết"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition duration-150"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Chỉnh sửa"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition duration-150"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveDropdownId(activeDropdownId === device.id ? null : device.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition duration-150"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {activeDropdownId === device.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-0 top-full z-[100] mt-1.5 w-48 rounded-xl border border-sky-100 bg-white p-1.5 shadow-xl animate-in fade-in duration-100"
                        >
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                          >
                            <Settings2 className="h-3.5 w-3.5 text-slate-400" />
                            Đồng bộ cấu hình
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                          >
                            <PowerOff className="h-3.5 w-3.5 text-slate-400" />
                            Tạm vô hiệu hóa
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Xóa khỏi danh sách
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <DataTablePagination
        totalItems={devices.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        itemLabel="thiết bị"
      />
    </div>
  );
}
