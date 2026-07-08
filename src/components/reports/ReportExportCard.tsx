"use client";

import React, { useState } from "react";
import { FileSpreadsheet, FileText, Download, Sparkles, CheckCircle2 } from "lucide-react";

export default function ReportExportCard() {
  const [format, setFormat] = useState<"csv" | "excel" | "pdf">("excel");

  return (
    <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6">
      
      {/* 1. Report Export Form Card */}
      <div className="rounded-[24px] border border-sky-100/80 bg-white p-6 shadow-sm shadow-sky-100/10">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
          Xuất báo cáo
        </h3>
        <h4 className="text-base font-bold text-sky-950 mb-1">Cấu hình kết xuất</h4>
        <p className="text-xs text-slate-500 mb-6">Tải xuống báo cáo hoạt động hệ thống chi tiết dưới các định dạng thông dụng.</p>

        {/* Form selection */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => setFormat("excel")}
            className={`flex w-full items-center gap-3 rounded-[16px] border p-3.5 text-left transition duration-200 ${
              format === "excel" 
                ? "border-sky-300 bg-sky-50/20 text-sky-700 shadow-sm" 
                : "border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileSpreadsheet className="h-5 w-5 stroke-[2] text-emerald-600" />
            <div className="flex-1">
              <p className="text-xs font-bold text-sky-950">Định dạng Microsoft Excel</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Xuất bảng tính biểu đồ (.xlsx)</p>
            </div>
            {format === "excel" && <CheckCircle2 className="h-4 w-4 text-sky-600 fill-sky-50" />}
          </button>

          <button
            type="button"
            onClick={() => setFormat("pdf")}
            className={`flex w-full items-center gap-3 rounded-[16px] border p-3.5 text-left transition duration-200 ${
              format === "pdf" 
                ? "border-sky-300 bg-sky-50/20 text-sky-700 shadow-sm" 
                : "border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText className="h-5 w-5 stroke-[2] text-rose-500" />
            <div className="flex-1">
              <p className="text-xs font-bold text-sky-950">Định dạng PDF báo cáo</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Thích hợp in ấn & lưu trữ (.pdf)</p>
            </div>
            {format === "pdf" && <CheckCircle2 className="h-4 w-4 text-sky-600 fill-sky-50" />}
          </button>

          <button
            type="button"
            onClick={() => setFormat("csv")}
            className={`flex w-full items-center gap-3 rounded-[16px] border p-3.5 text-left transition duration-200 ${
              format === "csv" 
                ? "border-sky-300 bg-sky-50/20 text-sky-700 shadow-sm" 
                : "border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText className="h-5 w-5 stroke-[2] text-slate-500" />
            <div className="flex-1">
              <p className="text-xs font-bold text-sky-950">Định dạng CSV dữ liệu</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Dữ liệu thô phân tích nâng cao (.csv)</p>
            </div>
            {format === "csv" && <CheckCircle2 className="h-4 w-4 text-sky-600 fill-sky-50" />}
          </button>
        </div>

        <button
          type="button"
          className="flex w-full h-12 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-semibold text-white shadow-md shadow-orange-200/50 transition duration-200 hover:from-amber-600 hover:to-orange-600 active:scale-95 hover:shadow-lg"
        >
          <Download className="h-4.5 w-4.5 stroke-[2.5]" />
          <span>Tạo báo cáo</span>
        </button>
      </div>

      {/* 2. Quick Insight Card */}
      <div className="rounded-[24px] border border-sky-100/80 bg-gradient-to-br from-white to-sky-50/20 p-6 shadow-sm shadow-sky-100/10">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <h4 className="font-bold text-sky-950 text-sm">Insight nhanh</h4>
        </div>

        <ul className="space-y-3 text-xs text-slate-600 leading-relaxed font-semibold">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>Nhiệt độ toàn hệ thống duy trì ở mức ổn định 37.5°C trong 7 ngày qua.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500 animate-pulse" />
            <span>Thiết bị <strong className="text-sky-950">SEI-IoT-003</strong> ghi nhận số lượng cảnh báo quá nhiệt cao nhất (8 sự cố).</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
            <span>Thiết bị <strong className="text-sky-950">SEI-IoT-005</strong> đạt hiệu suất uptime xuất sắc 100% trong suốt chu kỳ.</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
