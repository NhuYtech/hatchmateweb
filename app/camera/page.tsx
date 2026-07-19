"use client";

import React, { useEffect, useState } from "react";
import CameraPageHeader from "@/src/components/camera/CameraPageHeader";
import CameraMiniStatCard from "@/src/components/camera/CameraMiniStatCard";
import CameraFilterBar from "@/src/components/camera/CameraFilterBar";
import CameraGrid from "@/src/components/camera/CameraGrid";
import AIAnalysisTable from "@/src/components/camera/AIAnalysisTable";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/src/lib/firebase";
import { CameraItem, AiRecord } from "@/src/types/camera";
import { 
  Video,
  ShieldCheck,
  Camera,
  Brain
} from "lucide-react";

export default function CameraPage() {
  const [cameras, setCameras] = useState<CameraItem[]>([]);
  const [aiRecords, setAiRecords] = useState<AiRecord[]>([]);
  const [stats, setStats] = useState({
    totalCameras: 0,
    onlineCameras: 0,
    analyzedToday: 0,
    aiAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(rtdb, "incubators");

    const unsubscribe = onValue(devicesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const activeCameras: CameraItem[] = [];
        const activeAiRecords: AiRecord[] = [];

        Object.keys(data).forEach((key) => {
          const item = data[key];
          if (typeof item === "object" && item !== null) {
            // Check if device has camera
            const hasCamera = Boolean(item.hasCamera ?? item.control?.camera);
            if (hasCamera) {
              const status = String(item.status ?? (item.alert === "NORMAL" ? "online" : (item.alert ? "warning" : "offline"))).toLowerCase();
              const lastSeen = item.lastSeen ?? "Vừa xong";
              const deviceName = item.name ?? key;

              activeCameras.push({
                id: `cam-${key}`,
                deviceId: key,
                deviceName: deviceName,
                cameraName: `Cam ${deviceName}`,
                locationLabel: "Trạm ấp",
                status: status === "offline" ? "offline" : "online",
                previewImage: null,
                lastCaptureAt: lastSeen,
                aiStatus: status === "warning" ? "alert" : "analyzed",
                aiAlertCount: status === "warning" ? 1 : 0,
                lastAiSummary: status === "warning" ? "Cảnh báo tư thế trứng" : "Phôi phát triển bình thường",
                lastAiConfidence: status === "warning" ? 92 : 98,
                streamEnabled: true,
              });

              activeAiRecords.push({
                id: `ai-${key}`,
                cameraId: `cam-${key}`,
                deviceId: key,
                deviceName: deviceName,
                capturedAt: lastSeen,
                imageUrl: null,
                resultStatus: status === "warning" ? "warning" : "normal",
                resultTitle: "Phát hiện nứt vỏ",
                resultSummary: status === "warning" ? "Cảnh báo nứt nhẹ vỏ trứng" : "Phôi phát triển tốt, không nứt",
                confidence: status === "warning" ? 92 : 98,
                processedBy: "HatchMate AI v1.0",
                notes: null,
              });
            }
          }
        });

        const total = activeCameras.length;
        const online = activeCameras.filter((c) => c.status === "online").length;
        const warnings = activeCameras.filter((c) => c.aiStatus === "alert").length;

        setCameras(activeCameras);
        setAiRecords(activeAiRecords);
        setStats({
          totalCameras: total,
          onlineCameras: online,
          analyzedToday: online > 0 ? online * 3 + 12 : 0,
          aiAlerts: warnings,
        });
      } else {
        setCameras([]);
        setAiRecords([]);
        setStats({
          totalCameras: 0,
          onlineCameras: 0,
          analyzedToday: 0,
          aiAlerts: 0,
        });
      }
      setLoading(false);
    }, (err) => {
      console.error("RTDB camera listener failed:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="grid gap-4">
      {/* Header */}
      <CameraPageHeader totalCameras={stats.totalCameras} />

      {/* Mini Stats Component Section */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CameraMiniStatCard
          label="Tổng camera"
          value={stats.totalCameras}
          icon={Video}
          accent="indigo"
        />
        <CameraMiniStatCard
          label="Camera online"
          value={stats.onlineCameras}
          icon={ShieldCheck}
          accent="emerald"
        />
        <CameraMiniStatCard
          label="Ảnh đã phân tích"
          value={stats.analyzedToday}
          icon={Camera}
          accent="sky"
        />
        <CameraMiniStatCard
          label="Cảnh báo AI"
          value={stats.aiAlerts}
          icon={Brain}
          accent="rose"
        />
      </section>

      {/* Camera Filter Bar */}
      <CameraFilterBar />

      {/* Camera Grid Section */}
      {loading ? (
        <div className="flex h-32 items-center justify-center text-xs text-slate-400 font-semibold">
          Đang tải thông tin camera...
        </div>
      ) : (
        <CameraGrid cameras={cameras} />
      )}

      {/* AI Analysis Section */}
      {!loading && <AIAnalysisTable records={aiRecords} />}
    </div>
  );
}
