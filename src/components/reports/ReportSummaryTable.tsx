"use client";

import React, { useState } from "react";
import { Eye, Thermometer, Droplet } from "lucide-react";
import { ReportSummaryItem } from "@/src/types/report";
import DataTablePagination from "@/src/components/common/DataTablePagination";

interface ReportSummaryTableProps {
  items: ReportSummaryItem[];
}

export default function ReportSummaryTable({ items }: ReportSummaryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 if items list changes
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setCurrentPage(1);
  }

  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getAlertBadge = (count: number) => {
    if (count === 0) {
      return (
        <span className="text-xs font-bold text-emerald-600">
          0 cảnh báo
        </span>
      );
    }
    const color = count > 5 
      ? "text-rose-600" 
      : "text-amber-600";

    return (
      <span className={`text-xs font-bold ${color}`}>
        {count} sự cố
      </span>
    );
  };

  const getUptimeColor = (rate: number) => {
    if (rate >= 98) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (rate >= 95) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-rose-600 bg-rose-50 border-rose-100";
  };

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white shadow-sm shadow-sky-100/10 overflow-hidden w-full min-w-0 flex-1">
      {/* Table Title Header */}
      <div className="border-b border-slate-100 bg-white px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5 min-w-0 flex-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Tổng hợp hiệu suất
          </h3>
        </div>
        <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2 py-1 rounded-lg self-start sm:self-auto shrink-0">
          30 ngày qua
        </span>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto w-full min-w-0">
        <table className="w-full min-w-[800px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Thiết bị</th>
              <th className="px-6 py-4">Nhiệt độ TB</th>
              <th className="px-6 py-4">Độ ẩm TB</th>
              <th className="px-6 py-4">Cảnh báo</th>
              <th className="px-6 py-4">Uptime</th>
              <th className="px-6 py-4">Ngày ấp</th>
              <th className="px-6 py-4">Cập nhật cuối</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedItems.map((item) => (
              <tr 
                key={item.deviceId} 
                className="group hover:bg-sky-50/10 transition-colors duration-150"
              >
                {/* Thiết bị */}
                <td className="px-6 py-4">
                  <div>
                    <div className="font-bold text-sky-950 group-hover:text-sky-600 transition-colors">
                      {item.deviceName}
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">{item.deviceId}</p>
                  </div>
                </td>

                {/* Nhiệt độ TB */}
                <td className="px-6 py-4 font-bold text-sky-950 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span>{item.avgTemperature.toFixed(1)}°C</span>
                  </div>
                </td>

                {/* Độ ẩm TB */}
                <td className="px-6 py-4 font-bold text-sky-950 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Droplet className="h-4 w-4 text-blue-500" />
                    <span>{item.avgHumidity}%</span>
                  </div>
                </td>

                {/* Cảnh báo */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getAlertBadge(item.alertCount)}
                </td>

                {/* Uptime */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded-md border px-1.5 py-0.5 text-xs font-semibold ${getUptimeColor(item.uptimeRate)}`}>
                      {item.uptimeRate}%
                    </span>
                  </div>
                </td>

                {/* Ngày ấp */}
                <td className="px-6 py-4 font-semibold text-slate-600">
                  {item.incubationDay > 0 ? `Ngày ${item.incubationDay}/21` : "Tạm dừng"}
                </td>

                {/* Cập nhật cuối */}
                <td className="px-6 py-4 text-xs font-semibold text-slate-400 whitespace-nowrap">
                  {item.lastUpdated}
                </td>

                {/* Hành động */}
                <td className="px-6 py-4 text-center">
                  <button
                    type="button"
                    title="Xem chi tiết thiết bị"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition duration-150"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DataTablePagination
        totalItems={items.length}
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
