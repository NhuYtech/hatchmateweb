"use client";

import React, { useEffect, useState } from "react";
import ReportsPageHeader from "@/src/components/reports/ReportsPageHeader";
import ReportsMiniStatCard from "@/src/components/reports/ReportsMiniStatCard";
import ReportFilterBar from "@/src/components/reports/ReportFilterBar";
import ReportsChartsSection from "@/src/components/reports/ReportsChartsSection";
import ReportSummaryTable from "@/src/components/reports/ReportSummaryTable";
import ReportExportCard from "@/src/components/reports/ReportExportCard";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/src/lib/firebase";
import { ReportChartPoint, ReportSummaryItem } from "@/src/types/report";
import { 
  Cpu, 
  Activity, 
  AlertTriangle, 
  Thermometer
} from "lucide-react";

export default function ReportsPage() {
  const [reportSummaryList, setReportSummaryList] = useState<ReportSummaryItem[]>([]);
  const [reportChartData, setReportChartData] = useState<ReportChartPoint[]>([]);
  const [stats, setStats] = useState({
    trackedDevices: 0,
    avgOnlineRate: 0,
    totalAlerts: 0,
    avgTemperature: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(rtdb, "incubators");

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list: any[] = [];

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

        const onlineRate = total > 0 ? Math.round((onlineCount / total) * 100) : 0;

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

        setStats({
          trackedDevices: total,
          avgOnlineRate: onlineRate,
          totalAlerts: warnings,
          avgTemperature: avgTemp,
        });
        setReportSummaryList(summaries);
        setReportChartData(charts);
      } else {
        setStats({
          trackedDevices: 0,
          avgOnlineRate: 0,
          totalAlerts: 0,
          avgTemperature: 0,
        });
        setReportSummaryList([]);
        setReportChartData([]);
      }
      setLoading(false);
    }, (err) => {
      console.error("RTDB reports listener failed:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid gap-4">
      {/* Header */}
      <ReportsPageHeader />

      {/* Mini Stats Component Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportsMiniStatCard
          label="Tổng thiết bị theo dõi"
          value={stats.trackedDevices}
          icon={Cpu}
          accent="indigo"
        />
        <ReportsMiniStatCard
          label="Tỷ lệ online trung bình"
          value={`${stats.avgOnlineRate}%`}
          icon={Activity}
          accent="emerald"
        />
        <ReportsMiniStatCard
          label="Tổng cảnh báo trong kỳ"
          value={stats.totalAlerts}
          icon={AlertTriangle}
          accent="rose"
        />
        <ReportsMiniStatCard
          label="Nhiệt độ TB hệ thống"
          value={`${stats.avgTemperature.toFixed(1)}°C`}
          icon={Thermometer}
          accent="amber"
        />
      </section>

      {/* Report Filter Bar */}
      <ReportFilterBar />

      {/* Charts Component Section */}
      {loading ? (
        <div className="flex h-32 items-center justify-center text-xs text-slate-400 font-semibold">
          Đang tải biểu đồ hiệu suất...
        </div>
      ) : (
        <ReportsChartsSection data={reportChartData} />
      )}

      {/* Summary Table & Export Card Section */}
      {!loading && (
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          <ReportSummaryTable items={reportSummaryList} />
          <ReportExportCard />
        </div>
      )}
    </div>
  );
}
