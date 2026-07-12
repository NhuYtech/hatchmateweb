"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface DataTablePaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  itemLabel: string;
}

export default function DataTablePagination({
  totalItems,
  currentPage,
  pageSize,
  pageSizeOptions = [5, 10, 30, 50, 100],
  onPageChange,
  onPageSizeChange,
  itemLabel,
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.ceil(pageSize)));

  // Calculate item range text
  const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(totalItems, currentPage * pageSize);

  // Range helper: e.g., 1 ... 4 5 6 ... 12
  const getPaginationRange = () => {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="flex flex-col gap-4 border-t border-slate-100 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      
      {/* 1. Item description & Page size select */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
        <div>
          Hiển thị <span className="font-bold text-sky-950">{from}–{to}</span>
        </div>
        
        <div className="h-4 w-px bg-slate-100 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <span>Số dòng hiển thị:</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                onPageSizeChange(newSize);
              }}
              className="h-8 appearance-none rounded-xl border border-slate-200 bg-slate-50/50 pl-3 pr-8 text-xs font-bold text-sky-950 outline-none transition duration-150 hover:border-slate-300 focus:border-sky-300 focus:bg-white"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option} dòng
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <ChevronDown className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Controls */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        {/* Previous page button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95 transition duration-150 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed text-slate-300 border-slate-100 hover:bg-transparent active:scale-100" : ""
          }`}
          title="Trang trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Dynamic page numbers */}
        {paginationRange.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="flex h-9 w-9 items-center justify-center text-xs font-semibold text-slate-400"
              >
                ...
              </span>
            );
          }

          const isCurrent = page === currentPage;

          return (
            <button
              key={`page-${page}`}
              type="button"
              onClick={() => onPageChange(Number(page))}
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition duration-150 ${
                isCurrent
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-orange-100"
                  : "border border-transparent text-slate-500 hover:bg-sky-50 hover:text-sky-700"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next page button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={`flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 active:scale-95 transition duration-150 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed text-slate-300 border-slate-100 hover:bg-transparent active:scale-100" : ""
          }`}
          title="Trang sau"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
