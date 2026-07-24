"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ref, onValue } from "firebase/database";
import { rtdb } from "@/src/lib/firebase";
import { CameraItem } from "@/src/types/camera";
import {
  X,
  WifiOff,
  Image,
  ImageOff
} from "lucide-react";

interface CameraDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string;
  initialCamera: CameraItem;
}

interface EventItem {
  id: string;
  title: string;
  time: string;
}

export default function CameraDetailModal({
  isOpen,
  onClose,
  deviceId,
  initialCamera,
}: CameraDetailModalProps) {
  const [camera, setCamera] = useState<CameraItem>(initialCamera);
  const [loading, setLoading] = useState(true);

  // Events list matching UI
  const [events, setEvents] = useState<EventItem[]>([
    { id: "evt-1", title: "Ảnh vừa chụp", time: "13:31:49" },
    { id: "evt-2", title: "Ảnh vừa chụp", time: "12:15:30" },
    { id: "evt-3", title: "Ảnh vừa chụp", time: "08:00:15" },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  // Sync with Firebase Database
  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const deviceRef = ref(rtdb, `incubators/${deviceId}`);
    const unsubscribe = onValue(deviceRef, (snapshot) => {
      if (snapshot.exists()) {
        const item = snapshot.val();
        const cameraStatus = (item.camera?.status ?? item.status ?? "offline").toLowerCase() === "online" ? "online" : "offline";
        const status = String(item.status ?? (item.alert === "NORMAL" ? "online" : (item.alert ? "warning" : "offline"))).toLowerCase();
        const lastSeen = item.lastSeen ?? "Vừa xong";
        const deviceName = item.name ?? deviceId;

        const eggCount = item.telemetry?.eggCount !== undefined ? Number(item.telemetry.eggCount) : (initialCamera.eggCount || 24);
        const previousEggCount = status === "warning" ? 24 : eggCount;
        const hasVariation = eggCount !== previousEggCount;

        setCamera({
          id: `cam-${deviceId}`,
          deviceId,
          deviceName,
          cameraName: `Cam ${deviceName}`,
          locationLabel: "Trạm ấp",
          status: cameraStatus,
          previewImage: null,
          lastCaptureAt: lastSeen,
          aiStatus: hasVariation ? "alert" : "analyzed",
          aiAlertCount: hasVariation ? 1 : 0,
          lastAiSummary: hasVariation 
            ? `Cảnh báo: Số lượng trứng thay đổi (Ban đầu: ${previousEggCount}, Hiện tại: ${eggCount})` 
            : `Số lượng trứng ổn định: ${eggCount} quả`,
          lastAiConfidence: 98,
          streamEnabled: false,
          eggCount,
          previousEggCount,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, deviceId, initialCamera]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Remove event from list
  const handleRemoveEvent = (id: string) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
    showToast("Đã xóa sự kiện khỏi danh sách");
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 z-[10000] rounded-xl bg-slate-900/90 px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-sm border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
          {notification}
        </div>
      )}

      {/* Modal Container */}
      <div className="relative w-full max-w-lg rounded-[36px] bg-[#FAF2EB] p-6 shadow-2xl flex flex-col gap-4 border border-[#FBEBE3] overflow-y-auto max-h-[95vh] scrollbar-thin">
        
        {/* Modal Close & Title Info */}
        <div className="flex items-center justify-between pb-1">
          <div>
            <h3 className="text-base font-extrabold text-sky-950">
              {camera.cameraName}
            </h3>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
              {camera.locationLabel} · Trạm: {camera.deviceName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#F5E1D6] text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition duration-150 cursor-pointer shadow-sm"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* 1. Camera Status Panel (Admin only, NO live image stream) */}
        <div className="relative aspect-video w-full rounded-[28px] bg-slate-900 flex flex-col items-center justify-center gap-2 text-white/70 shadow-inner border border-slate-950/20 select-none">
          {camera.status === "online" ? (
            <>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-bold">Camera đang hoạt động</p>
            </>
          ) : (
            <>
              <WifiOff className="h-6 w-6 text-white/40" />
              <p className="text-sm font-bold">Camera ngắt kết nối</p>
            </>
          )}
          <p className="text-[10px] text-white/40">Cập nhật: {camera.lastCaptureAt}</p>
        </div>

        {/* 3. Event logs "SỰ KIỆN" list */}
        <div className="bg-[#FFF8F6] border border-[#F5E1D6] rounded-[28px] p-5 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#1E293B]">
              SỰ KIỆN
            </h4>
            <a
              href="#ai-analysis"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                const el = document.getElementById("ai-analysis");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-[11px] font-bold text-amber-600 hover:text-amber-700 transition"
            >
              Thêm &gt;
            </a>
          </div>

          <div className="flex flex-col gap-3">
            {events.length === 0 ? (
              <p className="text-[11px] font-bold text-slate-400 text-center py-4">Chưa có sự kiện chụp ảnh nào.</p>
            ) : (
              events.map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-center justify-between p-3.5 bg-white border border-[#F5E1D6]/30 rounded-2xl shadow-sm hover:shadow transition duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
                      <Image className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-sky-950">{evt.title}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{evt.time}</p>
                    </div>
                  </div>
                  
                  {/* Action delete/hide button */}
                  <button
                    onClick={() => handleRemoveEvent(evt.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E293B] hover:bg-[#2D3748] text-white transition active:scale-95 duration-100 cursor-pointer shadow-sm"
                    title="Ẩn sự kiện"
                  >
                    <ImageOff className="h-4.5 w-4.5 text-slate-200" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>


      </div>
    </div>,
    document.body
  );
}
