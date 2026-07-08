"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Eye, 
  Plus, 
  MoreVertical, 
  RotateCw, 
  Edit3, 
  Copy, 
  Trash2,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  Play
} from "lucide-react";
import { IncubationPhase } from "@/src/types/incubation-settings";
import DataTablePagination from "@/src/components/common/DataTablePagination";

interface IncubationPhaseTableProps {
  phases: IncubationPhase[];
}

export default function IncubationPhaseTable({ phases }: IncubationPhaseTableProps) {
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Reset to page 1 if phases list changes (Render-phase state adjustment)
  const [prevPhases, setPrevPhases] = useState(phases);
  if (phases !== prevPhases) {
    setPrevPhases(phases);
    setCurrentPage(1);
  }

  const getTurningBadge = (mode: IncubationPhase["turningMode"]) => {
    switch (mode) {
      case "auto":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-100/50">
            Tự động
          </span>
        );
      case "manual":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-100">
            Thủ công
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-100">
            Tắt đảo
          </span>
        );
    }
  };

  const paginatedPhases = phases.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white shadow-sm shadow-sky-100/10 overflow-hidden">
      
      {/* Table Toolbar */}
      <div className="border-b border-slate-100 bg-white px-6 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Cấu hình theo giai đoạn
          </h3>
          <p className="text-xs text-slate-500">
            Thiết lập chu kỳ chi tiết nhiệt độ, độ ẩm tăng giảm theo thời gian ấp
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-amber-500 to-orange-500 px-4 text-xs font-bold text-white shadow-md shadow-orange-100/50 transition hover:from-amber-600 hover:to-orange-600 active:scale-95 duration-150"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm giai đoạn</span>
        </button>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto relative min-h-[200px]">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Giai đoạn</th>
              <th className="px-6 py-4">Khoảng ngày</th>
              <th className="px-6 py-4">Nhiệt độ mục tiêu</th>
              <th className="px-6 py-4">Độ ẩm mục tiêu</th>
              <th className="px-6 py-4">Chu kỳ đảo</th>
              <th className="px-6 py-4">Thời gian đảo</th>
              <th className="px-6 py-4">Trạng thái đảo</th>
              <th className="px-6 py-4">Ghi chú vận hành</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedPhases.map((phase) => (
              <tr 
                key={phase.id} 
                className="group hover:bg-sky-50/10 transition-colors duration-150"
              >
                {/* Giai đoạn */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-[10px] font-extrabold text-sky-700 border border-sky-100/60 font-mono">
                      {phase.id}
                    </span>
                    <span className="font-bold text-sky-950">{phase.phaseName}</span>
                  </div>
                </td>

                {/* Khoảng ngày */}
                <td className="px-6 py-4 text-xs font-bold text-slate-600 whitespace-nowrap">
                  Ngày {phase.startDay} – {phase.endDay}
                </td>

                {/* Nhiệt độ mục tiêu */}
                <td className="px-6 py-4 text-xs font-bold text-sky-950 whitespace-nowrap">
                  {phase.targetTemperature.toFixed(1)}°C
                </td>

                {/* Độ ẩm mục tiêu */}
                <td className="px-6 py-4 text-xs font-bold text-sky-950 whitespace-nowrap">
                  {phase.targetHumidity}% RH
                </td>

                {/* Chu kỳ đảo */}
                <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                  {phase.turnIntervalMin > 0 ? `${phase.turnIntervalMin} phút/lần` : "Không đảo"}
                </td>

                {/* Thời gian đảo */}
                <td className="px-6 py-4 text-xs font-semibold text-slate-500 whitespace-nowrap">
                  {phase.turnDurationSec > 0 ? `${phase.turnDurationSec} giây` : "Không"}
                </td>

                {/* Trạng thái đảo */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getTurningBadge(phase.turningMode)}
                </td>

                {/* Ghi chú vận hành */}
                <td className="px-6 py-4 text-xs font-medium text-slate-500 max-w-[220px]">
                  {phase.notes || <span className="italic text-slate-300">Không có</span>}
                </td>

                {/* Hành động */}
                <td className="px-6 py-4 text-center">
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={() => setActiveDropdownId(activeDropdownId === phase.id ? null : phase.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition duration-150"
                      title="Tác vụ"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeDropdownId === phase.id && (
                      <div 
                        ref={dropdownRef}
                        className="absolute right-0 top-full z-[100] mt-1 w-36 rounded-xl border border-sky-100 bg-white p-1.5 shadow-xl animate-in fade-in duration-100"
                      >
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                          Chỉnh sửa
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                        >
                          <Copy className="h-3.5 w-3.5 text-slate-400" />
                          Nhân bản
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <DataTablePagination
        totalItems={phases.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        itemLabel="giai đoạn"
      />
    </div>
  );
}
