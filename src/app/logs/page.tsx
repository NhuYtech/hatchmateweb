"use client";

import React, { useEffect, useState } from "react";
import LogsPageHeader from "@/src/components/logs/LogsPageHeader";
import LogsMiniStatCard from "@/src/components/logs/LogsMiniStatCard";
import LogFilterBar from "@/src/components/logs/LogFilterBar";
import LogsTable from "@/src/components/logs/LogsTable";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/src/lib/firebase";
import { LogItem } from "@/src/types/log";
import { 
  Database, 
  Cpu, 
  ShieldAlert, 
  Settings
} from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    deviceLogs: 0,
    alertLogs: 0,
    adminLogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(rtdb, "incubators");

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
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

        // Sort logs by id to make order deterministic
        generatedLogs.sort((a, b) => b.id.localeCompare(a.id));

        setLogs(generatedLogs);
        setStats({
          totalToday: generatedLogs.length,
          deviceLogs: devCount,
          alertLogs: alCount,
          adminLogs: admCount,
        });
      } else {
        setLogs([]);
        setStats({
          totalToday: 0,
          deviceLogs: 0,
          alertLogs: 0,
          adminLogs: 0,
        });
      }
      setLoading(false);
    }, (err) => {
      console.error("RTDB logs listener failed:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid gap-4">
      {/* Header */}
      <LogsPageHeader totalToday={stats.totalToday} />

      {/* Mini Stats Component Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <LogsMiniStatCard
          label="Tổng log hôm nay"
          value={stats.totalToday}
          icon={Database}
          accent="indigo"
        />
        <LogsMiniStatCard
          label="Log thiết bị"
          value={stats.deviceLogs}
          icon={Cpu}
          accent="emerald"
        />
        <LogsMiniStatCard
          label="Log cảnh báo"
          value={stats.alertLogs}
          icon={ShieldAlert}
          accent="rose"
        />
        <LogsMiniStatCard
          label="Log quản trị"
          value={stats.adminLogs}
          icon={Settings}
          accent="amber"
        />
      </section>

      {/* Search & Filter Bar */}
      <LogFilterBar />

      {/* Logs Table Component Section */}
      {loading ? (
        <div className="flex h-32 items-center justify-center text-xs text-slate-400 font-semibold">
          Đang tải nhật ký hệ thống...
        </div>
      ) : (
        <LogsTable logs={logs} />
      )}
    </div>
  );
}
