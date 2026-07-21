"use client";

import React, { useState } from "react";
import { FileSpreadsheet, FileText, Download, CheckCircle2 } from "lucide-react";
import { ReportSummaryItem } from "@/src/types/report";

interface ReportExportCardProps {
  items: ReportSummaryItem[];
  stats: {
    trackedDevices: number;
    activeIncubatingCount: number;
    maintenanceCount: number;
  };
}

export default function ReportExportCard({ items, stats }: ReportExportCardProps) {
  const [format, setFormat] = useState<"csv" | "excel" | "pdf">("excel");

  const exportExcel = () => {
    const title = `BÁO CÁO HOẠT ĐỘNG HỆ THỐNG HATCHMATE`;
    const dateStr = new Date().toLocaleDateString('vi-VN');
    
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
          th { background-color: #0284c7; color: white; font-weight: bold; border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
          .title-row { font-size: 16px; font-weight: bold; color: #0f172a; padding: 10px 0; }
          .stat-table { margin-bottom: 20px; }
          .stat-table td { font-weight: bold; }
          .stat-label { background-color: #f8fafc; font-weight: normal !important; }
        </style>
      </head>
      <body>
        <div class="title-row">${title} - Ngày xuất: ${dateStr}</div>
        
        <table class="stat-table">
          <tr>
            <td class="stat-label">Tổng thiết bị quản lý</td>
            <td>${stats.trackedDevices}</td>
          </tr>
          <tr>
            <td class="stat-label">Máy đang hoạt động</td>
            <td>${stats.activeIncubatingCount}</td>
          </tr>
          <tr>
            <td class="stat-label">Thiết bị cần bảo trì</td>
            <td>${stats.maintenanceCount}</td>
          </tr>
        </table>
        
        <br/>
        
        <table>
          <thead>
            <tr>
              <th>Mã thiết bị</th>
              <th>Tên thiết bị</th>
              <th>Nhiệt độ TB (°C)</th>
              <th>Độ ẩm TB (%)</th>
              <th>Số cảnh báo</th>
              <th>Tỷ lệ hoạt động (%)</th>
              <th>Ngày ấp</th>
              <th>Cập nhật cuối</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td>${item.deviceId}</td>
                <td>${item.deviceName}</td>
                <td>${item.avgTemperature.toFixed(1)}</td>
                <td>${item.avgHumidity}</td>
                <td>${item.alertCount}</td>
                <td>${item.uptimeRate}%</td>
                <td>Ngày ${item.incubationDay}</td>
                <td>${item.lastUpdated}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao_cao_he_thong_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportCSV = () => {
    const headers = ["Mã thiết bị", "Tên thiết bị", "Nhiệt độ TB (°C)", "Độ ẩm TB (%)", "Số cảnh báo", "Tỷ lệ hoạt động (%)", "Ngày ấp", "Cập nhật cuối"];
    const rows = items.map(item => [
      item.deviceId,
      item.deviceName,
      item.avgTemperature.toFixed(1),
      item.avgHumidity,
      item.alertCount,
      item.uptimeRate,
      item.incubationDay,
      item.lastUpdated
    ]);

    const csvContent = "\ufeff" + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bao_cao_he_thong_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const dateStr = new Date().toLocaleDateString('vi-VN');
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <html>
      <head>
        <title>Báo cáo hệ thống HatchMate - ${dateStr}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; background-color: #fff; }
          .header-container { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #f97316; letter-spacing: 0.05em; }
          .logo span { color: #0284c7; }
          .report-title { text-align: right; }
          .report-title h1 { font-size: 20px; margin: 0; color: #0f172a; }
          .report-title p { font-size: 12px; color: #64748b; margin: 5px 0 0 0; }
          
          .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
          .stat-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; background-color: #f8fafc; }
          .stat-card .label { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 5px; }
          .stat-card .value { font-size: 20px; font-weight: bold; color: #0f172a; }
          
          h2 { font-size: 16px; color: #0f172a; border-left: 4px solid #0284c7; padding-left: 10px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
          th { background-color: #f1f5f9; color: #475569; font-weight: bold; border-bottom: 2px solid #cbd5e1; padding: 12px 10px; text-align: left; }
          td { border-bottom: 1px solid #e2e8f0; padding: 12px 10px; color: #334155; }
          tr:nth-child(even) { background-color: #fafafa; }
          
          .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div class="logo">HATCH<span>MATE</span></div>
          <div class="report-title">
            <h1>BÁO CÁO HIỆU SUẤT HỆ THỐNG</h1>
            <p>Ngày tạo: ${dateStr}</p>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Tổng thiết bị quản lý</div>
            <div class="value">${stats.trackedDevices}</div>
          </div>
          <div class="stat-card">
            <div class="label">Máy đang hoạt động</div>
            <div class="value">${stats.activeIncubatingCount}</div>
          </div>
          <div class="stat-card">
            <div class="label">Thiết bị cần bảo trì</div>
            <div class="value">${stats.maintenanceCount}</div>
          </div>
        </div>
        
        <h2>Chi tiết hoạt động thiết bị</h2>
        <table>
          <thead>
            <tr>
              <th>Mã thiết bị</th>
              <th>Tên thiết bị</th>
              <th>Nhiệt độ TB (°C)</th>
              <th>Độ ẩm TB (%)</th>
              <th>Cảnh báo</th>
              <th>Tỷ lệ hoạt động</th>
              <th>Ngày ấp</th>
              <th>Cập nhật cuối</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(item => `
              <tr>
                <td><strong>${item.deviceId}</strong></td>
                <td>${item.deviceName}</td>
                <td>${item.avgTemperature.toFixed(1)}°C</td>
                <td>${item.avgHumidity}%</td>
                <td>${item.alertCount}</td>
                <td>${item.uptimeRate}%</td>
                <td>Ngày ${item.incubationDay}</td>
                <td>${item.lastUpdated}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          Báo cáo tự động từ Hệ thống Giám sát HatchMate - ${new Date().getFullYear()}
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleCreateReport = () => {
    if (format === "excel") {
      exportExcel();
    } else if (format === "pdf") {
      exportPDF();
    } else if (format === "csv") {
      exportCSV();
    }
  };

  return (
    <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6 min-w-0">
      
      {/* 1. Report Export Form Card */}
      <div className="rounded-[24px] border border-sky-100/80 bg-white p-6 shadow-sm shadow-sky-100/10">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">
          XUẤT BÁO CÁO
        </h3>
        <h4 className="text-base font-bold text-sky-950 mb-1">Cấu hình kết xuất</h4>
        <p className="text-xs text-slate-500 mb-6">Tải xuống báo cáo hoạt động hệ thống chi tiết dưới các định dạng thông dụng.</p>

        {/* Form selection */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => setFormat("excel")}
            className={`flex w-full items-center gap-3 rounded-[16px] border p-3.5 text-left transition duration-200 cursor-pointer ${
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
            className={`flex w-full items-center gap-3 rounded-[16px] border p-3.5 text-left transition duration-200 cursor-pointer ${
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
            className={`flex w-full items-center gap-3 rounded-[16px] border p-3.5 text-left transition duration-200 cursor-pointer ${
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
          onClick={handleCreateReport}
          className="flex w-full h-12 items-center justify-center gap-2 rounded-[20px] bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-semibold text-white shadow-md shadow-orange-200/50 transition duration-200 hover:from-amber-600 hover:to-orange-600 active:scale-95 hover:shadow-lg cursor-pointer"
        >
          <Download className="h-4.5 w-4.5 stroke-[2.5]" />
          <span>Tạo báo cáo</span>
        </button>
      </div>

    </div>
  );
}
