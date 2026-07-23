"use client";

import React, { useEffect, useState } from "react";
import ReportsMiniStatCard from "@/src/components/reports/ReportsMiniStatCard";
import ReportsChartsSection from "@/src/components/reports/ReportsChartsSection";
import ReportSummaryTable from "@/src/components/reports/ReportSummaryTable";
import ReportExportCard from "@/src/components/reports/ReportExportCard";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/src/lib/firebase";
import { ReportChartPoint, ReportSummaryItem } from "@/src/types/report";

// Imports for Logs
import LogsTable from "@/src/components/logs/LogsTable";
import LogsMiniStatCard from "@/src/components/logs/LogsMiniStatCard";
import { LogItem } from "@/src/types/log";
import { 
  Cpu, 
  Activity, 
  AlertTriangle, 
  Thermometer,
  Database,
  ShieldAlert,
  Settings
} from "lucide-react";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"reports" | "logs">("reports");
  const [loading, setLoading] = useState(true);

  // Update browser tab title when switching tabs
  useEffect(() => {
    document.title = activeTab === "reports" ? "Thống kê & Biểu đồ" : "Nhật ký hoạt động";
  }, [activeTab]);

  // Reports State
  const [reportSummaryList, setReportSummaryList] = useState<ReportSummaryItem[]>([]);
  const [reportChartData, setReportChartData] = useState<ReportChartPoint[]>([]);
  const [reportStats, setReportStats] = useState({
    trackedDevices: 0,
    activeIncubatingCount: 0,
    maintenanceCount: 0,
  });

  // Logs State
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [logsStats, setLogsStats] = useState({
    totalToday: 0,
    deviceLogs: 0,
    alertLogs: 0,
    adminLogs: 0,
  });

  useEffect(() => {
    const devicesRef = ref(rtdb, "incubators");

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list: any[] = [];

        // ── PROCESS REPORTS DATA ──
        Object.keys(data).forEach((key) => {
          const item = data[key];
          if (typeof item === "object" && item !== null) {
            const temp = item.telemetry?.temp !== undefined 
              ? Number(item.telemetry.temp) 
              : (item.temperature !== undefined ? Number(item.temperature) : Number(item.temp ?? 0));
            const humi = item.telemetry?.humi !== undefined 
              ? Number(item.telemetry.humi) 
              : (item.humidity !== undefined ? Number(item.humidity) : Number(item.humi ?? 0));
            const day = item.telemetry?.day !== undefined 
              ? Number(item.telemetry.day) 
              : (item.incubatingDay !== undefined ? Number(item.incubatingDay) : Number(item.day ?? 0));
            const status = String(item.status ?? (item.alert === "NORMAL" ? "online" : (item.alert ? "warning" : "offline"))).toLowerCase();
            const lastSeen = item.lastSeen ?? "Vừa xong";
            const deviceName = item.name ?? key;

            list.push({
              id: key,
              name: deviceName,
              status,
              temperature: temp,
              humidity: humi,
              incubatingDay: day,
              lastSeen,
            });
          }
        });

        // 1. Calculate stats
        const total = list.length;
        const onlineCount = list.filter((d) => d.status === "online" || d.status === "warning").length;
        const warnings = list.filter((d) => d.status === "warning").length;
        
        const activeDevices = list.filter((d) => d.status === "online" || d.status === "warning");
        const avgTemp = activeDevices.length > 0
          ? Number((activeDevices.reduce((sum, d) => sum + d.temperature, 0) / activeDevices.length).toFixed(1))
          : 0;
        const avgHumi = activeDevices.length > 0
          ? Math.round(activeDevices.reduce((sum, d) => sum + d.humidity, 0) / activeDevices.length)
          : 0;
        
        const activeIncubatingCount = list.filter((d) => (d.status === "online" || d.status === "warning") && d.incubatingDay > 0).length;
        const maintenanceCount = list.filter((d) => d.status === "offline" || d.status === "warning").length;

        // 2. Map summary list
        const summaries: ReportSummaryItem[] = list.map((d) => ({
          deviceId: d.id,
          deviceName: d.name,
          avgTemperature: d.temperature,
          avgHumidity: d.humidity,
          alertCount: d.status === "warning" ? 1 : 0,
          uptimeRate: d.status === "offline" ? 0 : 100,
          incubationDay: d.incubatingDay,
          lastUpdated: d.lastSeen,
        }));

        // 3. Generate 7-day trend
        const charts: ReportChartPoint[] = [
          { date: "13/07", avgTemperature: Math.max(30, avgTemp - 0.3), avgHumidity: avgHumi > 0 ? avgHumi - 1 : 60, alertCount: warnings },
          { date: "14/07", avgTemperature: Math.max(30, avgTemp - 0.2), avgHumidity: avgHumi > 0 ? avgHumi + 2 : 62, alertCount: warnings },
          { date: "15/07", avgTemperature: Math.max(30, avgTemp - 0.1), avgHumidity: avgHumi > 0 ? avgHumi - 2 : 58, alertCount: warnings + 1 },
          { date: "16/07", avgTemperature: avgTemp, avgHumidity: avgHumi > 0 ? avgHumi : 60, alertCount: warnings },
          { date: "17/07", avgTemperature: Math.max(30, avgTemp + 0.1), avgHumidity: avgHumi > 0 ? avgHumi - 1 : 59, alertCount: warnings },
          { date: "18/07", avgTemperature: Math.max(30, avgTemp - 0.1), avgHumidity: avgHumi > 0 ? avgHumi + 1 : 61, alertCount: warnings },
          { date: "19/07", avgTemperature: avgTemp, avgHumidity: avgHumi > 0 ? avgHumi : 60, alertCount: warnings },
        ];

        setReportSummaryList(summaries);
        setReportChartData(charts);
        setReportStats({
          trackedDevices: total,
          activeIncubatingCount,
          maintenanceCount,
        });

        // ── PROCESS LOGS DATA ──
        const generatedLogs: LogItem[] = [];
        let devCount = 0;
        let alCount = 0;
        let admCount = 0;

        // Static Admin log
        generatedLogs.push({
          id: "log-admin-login",
          timestamp: "Vừa xong",
          category: "admin",
          level: "info",
          actorName: "Admin",
          actorType: "admin",
          title: "Đăng nhập hệ thống",
          message: "Tài khoản quản trị đăng nhập vào bảng điều khiển HatchMate.",
        });
        admCount++;

        Object.keys(data).forEach((key) => {
          const item = data[key];
          if (typeof item === "object" && item !== null) {
            const status = String(item.status ?? (item.alert === "NORMAL" ? "online" : (item.alert ? "warning" : "offline"))).toLowerCase();
            const lastSeen = item.lastSeen ?? "Vừa xong";
            const deviceName = item.name ?? key;
            const temp = item.telemetry?.temp !== undefined 
              ? Number(item.telemetry.temp) 
              : (item.temperature !== undefined ? Number(item.temperature) : Number(item.temp ?? 0));
            const humi = item.telemetry?.humi !== undefined 
              ? Number(item.telemetry.humi) 
              : (item.humidity !== undefined ? Number(item.humidity) : Number(item.humi ?? 0));
            const day = item.telemetry?.day !== undefined 
              ? Number(item.telemetry.day) 
              : (item.incubatingDay !== undefined ? Number(item.incubatingDay) : Number(item.day ?? 0));

            if (status === "warning") {
              generatedLogs.push({
                id: `log-alert-${key}`,
                timestamp: lastSeen,
                category: "alert",
                level: "danger",
                deviceId: key,
                deviceName: deviceName,
                actorName: "Hệ thống",
                actorType: "system",
                title: "Cảnh báo chỉ số vượt ngưỡng",
                message: `Nhiệt độ đo được ${temp}°C, độ ẩm ${humi}% RH ngoài khoảng an toàn tại trạm ${deviceName}.`,
              });
              alCount++;
            }
            
            if (status === "offline") {
              generatedLogs.push({
                id: `log-offline-${key}`,
                timestamp: lastSeen,
                category: "device",
                level: "warning",
                deviceId: key,
                deviceName: deviceName,
                actorName: "Hệ thống",
                actorType: "system",
                title: "Thiết bị ngoại tuyến",
                message: `Mất kết nối với thiết bị ${deviceName} (${key}).`,
              });
              devCount++;
            } else {
              generatedLogs.push({
                id: `log-info-${key}`,
                timestamp: lastSeen,
                category: "device",
                level: "info",
                deviceId: key,
                deviceName: deviceName,
                actorName: "Hệ thống",
                actorType: "system",
                title: "Trạng thái ổn định",
                message: `Thiết bị ${deviceName} kết nối bình thường ở ngày ấp thứ ${day}.`,
              });
              devCount++;
            }
          }
        });

        // Sort logs by priority (danger > warning > info) and then by id to keep deterministic order
        const levelPriority: Record<string, number> = {
          danger: 3,
          warning: 2,
          info: 1,
        };
        generatedLogs.sort((a, b) => {
          const priorityA = levelPriority[a.level] || 0;
          const priorityB = levelPriority[b.level] || 0;
          if (priorityB !== priorityA) {
            return priorityB - priorityA;
          }
          return b.id.localeCompare(a.id);
        });

        setLogs(generatedLogs);
        setLogsStats({
          totalToday: generatedLogs.length,
          deviceLogs: devCount,
          alertLogs: alCount,
          adminLogs: admCount,
        });
      } else {
        setReportSummaryList([]);
        setReportChartData([]);
        setReportStats({
          trackedDevices: 0,
          activeIncubatingCount: 0,
          maintenanceCount: 0,
        });
        setLogs([]);
        setLogsStats({
          totalToday: 0,
          deviceLogs: 0,
          alertLogs: 0,
          adminLogs: 0,
        });
      }
      setLoading(false);
    }, (err) => {
      console.error("RTDB reports & logs listener failed:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid gap-4 w-full min-w-0">
      {/* Header Info */}
      <div className="flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
        <div className="space-y-1 min-w-0 flex-1">
          <h5 className="text-1xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            BÁO CÁO & NHẬT KÝ
          </h5>
          <p className="text-sm text-slate-500">
            Xem phân tích hiệu suất thiết bị, biểu đồ xu hướng và theo dõi lịch sử hoạt động hệ thống HatchMate
          </p>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 mb-2 overflow-x-auto w-full min-w-0">
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-6 py-3 text-xs sm:text-sm font-extrabold tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "reports"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          THỐNG KÊ & BIỂU ĐỒ
        </button>
        <button
          onClick={() => setActiveTab("logs")}
          className={`px-6 py-3 text-xs sm:text-sm font-extrabold tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === "logs"
              ? "border-amber-500 text-amber-600"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          NHẬT KÝ HOẠT ĐỘNG
        </button>
      </div>

      {activeTab === "reports" ? (
        // ── Tab 1: Reports & Charts ──
        <div className="grid gap-4 w-full min-w-0">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
            <ReportsMiniStatCard
              label="Tổng thiết bị quản lý"
              value={reportStats.trackedDevices}
              icon={Cpu}
              accent="indigo"
            />
            <ReportsMiniStatCard
              label="Máy đang hoạt động"
              value={reportStats.activeIncubatingCount}
              icon={Activity}
              accent="emerald"
            />
            <ReportsMiniStatCard
              label="Thiết bị cần bảo trì"
              value={reportStats.maintenanceCount}
              icon={AlertTriangle}
              accent="rose"
            />
          </section>


          {!loading && (
            <div className="flex flex-col lg:flex-row gap-4 lg:items-start w-full min-w-0">
              <div className="w-full min-w-0 flex-1">
                <ReportSummaryTable items={reportSummaryList} />
              </div>
              <ReportExportCard items={reportSummaryList} stats={reportStats} />
            </div>
          )}

          {loading ? (
            <div className="flex h-32 items-center justify-center text-xs text-slate-400 font-semibold w-full min-w-0">
              Đang tải biểu đồ hiệu suất...
            </div>
          ) : (
            <div className="w-full min-w-0">
              <ReportsChartsSection data={reportChartData} />
            </div>
          )}
        </div>
      ) : (
        // ── Tab 2: Logs & Audit Trail ──
        <div className="grid gap-4 w-full min-w-0">
          <section className="grid gap-4 sm:grid-cols-2">
            <LogsMiniStatCard
              label="Tổng log hôm nay"
              value={logsStats.totalToday}
              icon={Database}
              accent="indigo"
              className="bg-teal-glow-right"
            />
            <LogsMiniStatCard
              label="Log cảnh báo"
              value={logsStats.alertLogs}
              icon={ShieldAlert}
              accent="rose"
              className="bg-orange-glow-left"
            />
          </section>

          {loading ? (
            <div className="flex h-32 items-center justify-center text-xs text-slate-400 font-semibold">
              Đang tải nhật ký hệ thống...
            </div>
          ) : (
            <LogsTable logs={logs} />
          )}
        </div>
      )}
    </div>
  );
}
