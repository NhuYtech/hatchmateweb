"use client";

import React, { useState } from "react";
import { 
  Eye, 
  Camera, 
  VideoOff,
  Settings
} from "lucide-react";
import { CameraItem } from "@/src/types/camera";
import DataTablePagination from "@/src/components/common/DataTablePagination";

interface CameraTableProps {
  cameras: CameraItem[];
  onSelectCamera?: (camera: CameraItem) => void;
  onCaptureNew?: (id: string) => void;
}

export default function CameraTable({ cameras, onSelectCamera, onCaptureNew }: CameraTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (cameras.length === 0) {
    return (
      <div className="rounded-[24px] border border-sky-100/80 bg-white p-16 text-center shadow-sm shadow-sky-100/10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-sm shadow-amber-100">
          <VideoOff className="h-8 w-8 stroke-[2.2] animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-sky-950">Chưa có camera nào</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
          Hiện tại không tìm thấy thiết bị camera nào khớp với tiêu chí tìm kiếm hoặc trạng thái của bộ lọc.
        </p>
      </div>
    );
  }

  const paginatedCameras = cameras.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getAiLabel = (status: CameraItem["aiStatus"]) => {
    switch (status) {
      case "analyzed":
        return "Đã quét";
      case "alert":
        return "Cảnh báo";
      default:
        return "Chờ quét";
    }
  };

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white shadow-sm shadow-sky-100/10 overflow-hidden">
      {/* Table Toolbar */}
      <div className="border-b border-slate-100 bg-white px-4 py-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
          Danh sách Camera thiết bị
        </h3>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto relative min-h-[150px]">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-700">
              <th className="px-4 py-2.5">Tên Camera</th>
              <th className="px-4 py-2.5">Mã thiết bị</th>
              <th className="px-4 py-2.5">Tên thiết bị</th>
              <th className="px-4 py-2.5">Số trứng quét</th>
              <th className="px-4 py-2.5">Trạng thái</th>
              <th className="px-4 py-2.5">Nhận diện AI</th>
              <th className="px-4 py-2.5">Cập nhật cuối</th>
              <th className="px-4 py-2.5 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedCameras.map((camera, index) => (
              <tr
                key={camera.id}
                className={`group transition-colors duration-150 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F5F7FA]"
                } hover:bg-sky-50/30`}
              >
                {/* Tên Camera */}
                <td className="px-4 py-2.5 font-semibold text-slate-900">
                  {camera.cameraName}
                </td>

                {/* Mã thiết bị */}
                <td className="px-4 py-2.5 font-mono text-xs font-semibold text-slate-800">
                  {camera.deviceId}
                </td>

                {/* Tên thiết bị */}
                <td className="px-4 py-2.5 text-slate-900 font-medium">
                  {camera.deviceName}
                </td>

                {/* Số trứng quét */}
                <td className="px-4 py-2.5 font-bold text-slate-900">
                  {camera.eggCount !== undefined ? `${camera.eggCount} quả` : "–"}
                </td>

                {/* Trạng thái */}
                <td className="px-4 py-2.5 text-slate-900 font-semibold">
                  {camera.status === "online" ? "Đang hoạt động" : "Ngoại tuyến"}
                </td>

                {/* Nhận diện AI */}
                <td className="px-4 py-2.5 text-slate-900 font-semibold">
                  {getAiLabel(camera.aiStatus)}
                </td>

                {/* Cập nhật cuối */}
                <td className="px-4 py-2.5 text-xs font-semibold text-slate-400">
                  {camera.lastCaptureAt}
                </td>

                {/* Hành động */}
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectCamera && onSelectCamera(camera)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-800 hover:bg-slate-100 transition active:scale-95 duration-100 cursor-pointer"
                      title="Xem Camera"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onCaptureNew && onCaptureNew(camera.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-800 hover:bg-slate-100 transition active:scale-95 duration-100 cursor-pointer"
                      title="Chụp ảnh mới"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <DataTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={cameras.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemLabel="camera"
      />
    </div>
  );
}
