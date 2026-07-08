"use client";

import React, { useState } from "react";
import { incubationPhasesMock } from "@/src/data/settingsMock";
import { IncubationPhase, TurningMode } from "@/src/types/incubation-settings";
import DataTablePagination from "@/src/components/common/DataTablePagination";
import {
  Plus,
  Pencil,
  Copy,
  MoreHorizontal,
  Layers,
  Thermometer,
  Droplets,
  RefreshCw,
} from "lucide-react";

/* ──────────────────────────────────────────────
   Turning mode badge
────────────────────────────────────────────── */
function TurningModeBadge({ mode }: { mode: TurningMode }) {
  const styles: Record<TurningMode, string> = {
    auto:     "bg-emerald-50 text-emerald-700 border-emerald-100",
    manual:   "bg-amber-50  text-amber-700  border-amber-100",
    disabled: "bg-slate-50  text-slate-400  border-slate-200",
  };
  const labels: Record<TurningMode, string> = {
    auto:     "Tự động",
    manual:   "Thủ công",
    disabled: "Tắt đảo",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[mode]}`}
    >
      {mode !== "disabled" && <RefreshCw className="h-3 w-3" />}
      {labels[mode]}
    </span>
  );
}

/* ──────────────────────────────────────────────
   Phase badge (P1, P2, …)
────────────────────────────────────────────── */
const phaseBadgeColors = [
  "bg-sky-50 text-sky-700 border-sky-100",
  "bg-violet-50 text-violet-700 border-violet-100",
  "bg-orange-50 text-orange-700 border-orange-100",
  "bg-rose-50 text-rose-700 border-rose-100",
  "bg-teal-50 text-teal-700 border-teal-100",
];

function PhaseBadge({ index }: { index: number }) {
  const color = phaseBadgeColors[index % phaseBadgeColors.length];
  return (
    <span
      className={`inline-flex h-6 w-8 items-center justify-center rounded-lg border text-[10px] font-extrabold ${color}`}
    >
      P{index + 1}
    </span>
  );
}

/* ──────────────────────────────────────────────
   Main component
────────────────────────────────────────────── */
export default function IncubationPhaseTable() {
  const [phases] = useState<IncubationPhase[]>(incubationPhasesMock);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const totalItems = phases.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginated = phases.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white shadow-sm shadow-sky-100/10 overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-3 border-b border-sky-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
            <Layers className="h-4 w-4 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-sky-950">
              Cấu hình theo giai đoạn
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Mỗi giai đoạn có nhiệt độ, độ ẩm và chế độ đảo riêng
            </p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-1.5 self-start rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 text-xs font-bold text-white shadow-sm shadow-blue-200/50 transition duration-150 hover:from-sky-400 hover:to-blue-500 active:scale-95 sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          Thêm giai đoạn
        </button>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        {phases.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
              <Layers className="h-7 w-7 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-sky-950">Chưa có giai đoạn nào</p>
              <p className="mt-1 text-xs text-slate-400">Nhấn &quot;Thêm giai đoạn&quot; để bắt đầu cấu hình chu kỳ ấp.</p>
            </div>
          </div>
        ) : (
          <table className="w-full min-w-[860px] text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-gradient-to-r from-sky-50/40 to-slate-50/20">
                <th className="px-5 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Giai đoạn
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Ngày
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Thermometer className="h-3.5 w-3.5 text-orange-400" />
                    Nhiệt độ
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Droplets className="h-3.5 w-3.5 text-blue-400" />
                    Độ ẩm
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Chu kỳ đảo
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  TG đảo
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Chế độ đảo
                </th>
                <th className="px-4 py-3 text-left text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Ghi chú
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {paginated.map((phase, idx) => {
                const globalIdx = (currentPage - 1) * pageSize + idx;
                return (
                  <tr
                    key={phase.id}
                    className="group transition-colors duration-100 hover:bg-sky-50/30"
                  >
                    {/* Phase name + badge */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <PhaseBadge index={globalIdx} />
                        <span className="font-bold text-sky-950">{phase.phaseName}</span>
                      </div>
                    </td>

                    {/* Day range */}
                    <td className="px-4 py-4">
                      <span className="rounded-lg bg-slate-100/70 px-2 py-1 font-bold text-slate-600">
                        Ngày {phase.startDay}–{phase.endDay}
                      </span>
                    </td>

                    {/* Temperature */}
                    <td className="px-4 py-4">
                      <span className="font-bold text-orange-600">{phase.targetTemperature}°C</span>
                    </td>

                    {/* Humidity */}
                    <td className="px-4 py-4">
                      <span className="font-bold text-blue-600">{phase.targetHumidity}% RH</span>
                    </td>

                    {/* Turn interval */}
                    <td className="px-4 py-4 text-slate-600 font-semibold">
                      {phase.turningMode === "disabled"
                        ? <span className="text-slate-400 italic">—</span>
                        : `${phase.turnIntervalMin} phút/lần`}
                    </td>

                    {/* Turn duration */}
                    <td className="px-4 py-4 text-slate-600 font-semibold">
                      {phase.turningMode === "disabled"
                        ? <span className="text-slate-400 italic">—</span>
                        : `${phase.turnDurationSec} giây`}
                    </td>

                    {/* Turning mode badge */}
                    <td className="px-4 py-4">
                      <TurningModeBadge mode={phase.turningMode} />
                    </td>

                    {/* Notes */}
                    <td className="max-w-[200px] px-4 py-4">
                      <p className="line-clamp-2 text-slate-500">{phase.notes ?? "—"}</p>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="relative flex items-center justify-end gap-1">
                        {/* Edit */}
                        <button
                          type="button"
                          title="Sửa giai đoạn"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-400 opacity-0 transition duration-150 hover:border-sky-100 hover:bg-sky-50 hover:text-sky-600 group-hover:opacity-100"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          title="Nhân bản"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-400 opacity-0 transition duration-150 hover:border-sky-100 hover:bg-sky-50 hover:text-sky-600 group-hover:opacity-100"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>

                        {/* More */}
                        <div className="relative">
                          <button
                            type="button"
                            title="Thêm tác vụ"
                            onClick={() =>
                              setOpenMenu((prev) => (prev === phase.id ? null : phase.id))
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-400 opacity-0 transition duration-150 hover:border-sky-100 hover:bg-sky-50 hover:text-sky-600 group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>

                          {openMenu === phase.id && (
                            <div
                              className="absolute right-0 z-10 mt-1 w-36 rounded-xl border border-slate-100 bg-white py-1 shadow-xl shadow-slate-200/60"
                              onMouseLeave={() => setOpenMenu(null)}
                            >
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                              >
                                <Pencil className="h-3 w-3" /> Sửa
                              </button>
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-700"
                              >
                                <Copy className="h-3 w-3" /> Nhân bản
                              </button>
                              <hr className="my-1 border-slate-100" />
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50"
                              >
                                Xoá giai đoạn
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {phases.length > 0 && (
        <DataTablePagination
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 30, 50, 100]}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          itemLabel="giai đoạn"
        />
      )}
    </div>
  );
}
