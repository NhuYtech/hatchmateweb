"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Eye, 
  Copy, 
  MoreVertical, 
  Download,
  RotateCw,
  ClipboardList,
  Database,
  Cpu,
  Settings,
  User,
  Check,
  Link2,
  Filter
} from "lucide-react";
import { LogItem } from "@/src/types/log";
import DataTablePagination from "@/src/components/common/DataTablePagination";

interface LogsTableProps {
  logs: LogItem[];
  onRefresh?: () => void;
}

export default function LogsTable({ logs, onRefresh }: LogsTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 if logs list changes
  const [prevLogs, setPrevLogs] = useState(logs);
  if (logs !== prevLogs) {
    setPrevLogs(logs);
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

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

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
    const configs = {
      device: "bg-sky-50 text-sky-700 border-sky-100",
      alert: "bg-rose-50 text-rose-700 border-rose-100",
      control: "bg-indigo-50 text-indigo-700 border-indigo-100",
      admin: "bg-amber-50 text-amber-700 border-amber-200/60",
    };
    const labels = {
      device: "Thiết bị",
      alert: "Cảnh báo",
      control: "Điều khiển",
      admin: "Quản trị",
    };
    return (
      <span className={`inline-flex rounded-lg border px-2 py-0.5 text-xs font-semibold ${configs[category]}`}>
        {labels[category]}
      </span>
    );
  };

  const getLevelBadge = (level: LogItem["level"]) => {
    const configs = {
      info: "bg-slate-50 text-slate-600 border-slate-200",
      warning: "bg-amber-50 text-amber-700 border-amber-200/60",
      danger: "bg-rose-50 text-rose-700 border-rose-200/60",
    };
    const labels = {
      info: "Thông tin",
      warning: "Cảnh báo",
      danger: "Nguy hiểm",
    };
    return (
      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${configs[level]}`}>
        <span>{labels[level]}</span>
      </span>
    );
  };

  const getActorIcon = (type: LogItem["actorType"]) => {
    switch (type) {
      case "admin":
        return <Settings className="h-3.5 w-3.5 text-amber-500" />;
      case "user":
        return <User className="h-3.5 w-3.5 text-sky-500" />;
      default:
        return <Database className="h-3.5 w-3.5 text-slate-400" />;
    }
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
            <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Loại log</th>
              <th className="px-6 py-4">Mức độ</th>
              <th className="px-6 py-4">Thiết bị</th>
              <th className="px-6 py-4">Người thực hiện</th>
              <th className="px-6 py-4">Tiêu đề</th>
              <th className="px-6 py-4">Nội dung</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedLogs.map((log) => (
              <tr 
                key={log.id} 
                className="group hover:bg-sky-50/10 transition-colors duration-150"
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
                    <div>
                      <div className="font-bold text-sky-950 flex items-center gap-1">
                        <Cpu className="h-3.5 w-3.5 text-sky-500" />
                        <span>{log.deviceName}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">{log.deviceId}</p>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Không có</span>
                  )}
                </td>

                {/* Nguồn / Người thực hiện */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                      {getActorIcon(log.actorType)}
                    </div>
                    <span className="text-xs text-slate-600 font-bold">{log.actorName || "Hệ thống"}</span>
                  </div>
                </td>

                {/* Tiêu đề */}
                <td className="px-6 py-4 font-bold text-sky-950">
                  {log.title}
                </td>

                {/* Nội dung */}
                <td className="px-6 py-4 text-slate-500 max-w-[320px] truncate">
                  {log.message}
                </td>

                {/* Action Buttons */}
                <td className="px-6 py-4 relative">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      title="Xem chi tiết log"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition duration-150"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleCopy(log.id)}
                      title="Copy Log ID"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition duration-150"
                    >
                      {copiedId === log.id ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveDropdownId(activeDropdownId === log.id ? null : log.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition duration-150"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {activeDropdownId === log.id && (
                        <div 
                          ref={dropdownRef}
                          className="absolute right-0 top-full z-[100] mt-1.5 w-48 rounded-xl border border-sky-100 bg-white p-1.5 shadow-xl animate-in fade-in duration-100"
                        >
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                          >
                            <Cpu className="h-3.5 w-3.5 text-slate-400" />
                            Lọc theo thiết bị này
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                          >
                            <Filter className="h-3.5 w-3.5 text-slate-400" />
                            Lọc theo mức độ này
                          </button>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                          >
                            <Link2 className="h-3.5 w-3.5 text-slate-400" />
                            Xem log liên quan
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                          >
                            <Copy className="h-3.5 w-3.5 text-slate-400" />
                            Sao chép nội dung
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
