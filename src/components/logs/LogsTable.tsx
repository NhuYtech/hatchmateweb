"use client";

import React, { useState } from "react";
import { 
  Download,
  RotateCw,
  ClipboardList
} from "lucide-react";
import { LogItem } from "@/src/types/log";
import DataTablePagination from "@/src/components/common/DataTablePagination";

interface LogsTableProps {
  logs: LogItem[];
  onRefresh?: () => void;
}

export default function LogsTable({ logs, onRefresh }: LogsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 if logs list changes
  const [prevLogs, setPrevLogs] = useState(logs);
  if (logs !== prevLogs) {
    setPrevLogs(logs);
    setCurrentPage(1);
  }

  const handleExport = () => {
    const headers = ["Thời gian", "Loại log", "Mức độ", "Thiết bị", "Người thực hiện", "Tiêu đề", "Nội dung"];
    const rows = logs.map(log => {
      const categoryLabels = {
        device: "Thiết bị",
        alert: "Cảnh báo",
        control: "Điều khiển",
        admin: "Quản trị",
      };
      const actorLabel = log.actorName || "Hệ thống";
      const deviceLabel = log.deviceId ? `${log.deviceName} (${log.deviceId})` : "Không có";
      return [
        log.timestamp,
        categoryLabels[log.category] || log.category,
        log.level.toUpperCase(),
        deviceLabel,
        actorLabel,
        log.title,
        log.message
      ];
    });

    const csvContent = "\ufeff" + [headers.join(","), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `nhat_ky_he_thong_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCategoryBadge = (category: LogItem["category"]) => {
    const labels = {
      device: "Thiết bị",
      alert: "Cảnh báo",
      control: "Điều khiển",
      admin: "Quản trị",
    };
    return (
      <span className="text-xs font-semibold text-slate-800">
        {labels[category]}
      </span>
    );
  };

  const getLevelBadge = (level: LogItem["level"]) => {
    const labels = {
      info: "Thông tin",
      warning: "Cảnh báo",
      danger: "Nguy hiểm",
    };
    return (
      <span className="text-xs font-semibold text-slate-800">
        {labels[level]}
      </span>
    );
  };

  if (logs.length === 0) {
    return (
      <div className="rounded-[24px] border border-sky-100/80 bg-white p-16 text-center shadow-sm shadow-sky-100/10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-sm shadow-amber-100">
          <ClipboardList className="h-8 w-8 stroke-[2.2] animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-sky-950">Chưa có nhật ký nào</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
          Hiện tại chưa có bản ghi hoạt động nào được ghi nhận. Hãy thử thay đổi bộ lọc thời gian.
        </p>
        <button
          type="button"
          onClick={onRefresh}
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-amber-500 to-orange-500 px-5 text-sm font-semibold text-white shadow-md shadow-orange-100 transition hover:from-amber-600 hover:to-orange-600 active:scale-95 duration-150"
        >
          <RotateCw className="h-4 w-4 stroke-[2.5]" />
          <span>Làm mới</span>
        </button>
      </div>
    );
  }

  const paginatedLogs = logs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white shadow-sm shadow-sky-100/10 overflow-hidden w-full min-w-0">
      
      {/* Table Toolbar */}
      <div className="border-b border-slate-100 bg-white px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Danh sách nhật ký hệ thống
          </h3>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-sky-500 to-blue-600 px-4 text-xs font-bold text-white shadow-md shadow-blue-100/50 transition hover:from-sky-600 hover:to-blue-700 active:scale-95 duration-150 cursor-pointer"
          >
            <Download className="h-4 w-4 text-white" />
            <span>Xuất file Excel</span>
          </button>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto relative min-h-[300px] w-full min-w-0">
        <table className="w-full min-w-[1200px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-white text-xs font-semibold text-slate-700">
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Loại log</th>
              <th className="px-6 py-4">Mức độ</th>
              <th className="px-6 py-4">Thiết bị</th>
              <th className="px-6 py-4">Người thực hiện</th>
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-6 py-4">Nội dung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedLogs.map((log, index) => (
              <tr 
                key={log.id} 
                className={`group transition-colors duration-150 ${
                  index % 2 === 0 ? "bg-white" : "bg-[#F5F7FA]"
                } hover:bg-sky-50/30`}
              >
                {/* Thời gian */}
                <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                  {log.timestamp}
                </td>

                {/* Loại log */}
                <td className="px-6 py-4">
                  {getCategoryBadge(log.category)}
                </td>

                {/* Mức độ */}
                <td className="px-6 py-4">
                  {getLevelBadge(log.level)}
                </td>

                {/* Thiết bị */}
                <td className="px-6 py-4">
                  {log.deviceId ? (
                    <span className="font-semibold text-slate-800 font-mono text-xs">
                      {log.deviceId}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Không có</span>
                  )}
                </td>

                {/* Nguồn / Người thực hiện */}
                <td className="px-6 py-4">
                  <span className="text-xs text-slate-600 font-semibold">{log.actorName || "Hệ thống"}</span>
                </td>

                {/* Tiêu đề */}
                <td className="px-6 py-4 font-semibold text-slate-800">
                  {log.title}
                </td>

                {/* Nội dung */}
                <td className="px-6 py-4 text-slate-500 max-w-[320px] truncate">
                  {log.message}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <DataTablePagination
        totalItems={logs.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        itemLabel="bản ghi"
      />
    </div>
  );
}
