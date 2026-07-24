"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ref, onValue, set } from "firebase/database";
import { rtdb } from "@/src/lib/firebase";
import { CameraItem } from "@/src/types/camera";
import {
  X,
  WifiOff,
  Maximize2,
  RefreshCw,
  Pencil,
  Circle,
  Camera,
  History,
  Image,
  ImageOff,
  Check,
  Play,
  Pause
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
  const [isEditingIp, setIsEditingIp] = useState(false);
  const [newIp, setNewIp] = useState(initialCamera.ipAddress || "192.168.88.220:81");
  const [savingIp, setSavingIp] = useState(false);
  
  // Realtime clock overlay in stream
  const [streamTime, setStreamTime] = useState("");
  const [bitrate, setBitrate] = useState(294);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

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
        const status = String(item.status ?? (item.alert === "NORMAL" ? "online" : (item.alert ? "warning" : "offline"))).toLowerCase();
        const lastSeen = item.lastSeen ?? "Vừa xong";
        const deviceName = item.name ?? deviceId;

        const eggCount = item.telemetry?.eggCount !== undefined ? Number(item.telemetry.eggCount) : (initialCamera.eggCount || 24);
        const previousEggCount = status === "warning" ? 24 : eggCount;
        const hasVariation = eggCount !== previousEggCount;
        const ipAddress = item.ipAddress ?? item.ip ?? item.telemetry?.ip ?? initialCamera.ipAddress ?? "192.168.88.220:81";

        setCamera({
          id: `cam-${deviceId}`,
          deviceId,
          deviceName,
          cameraName: `Cam ${deviceName}`,
          locationLabel: "Trạm ấp",
          status: status === "offline" ? "offline" : "online",
          previewImage: item.previewImage || null,
          lastCaptureAt: lastSeen,
          aiStatus: hasVariation ? "alert" : "analyzed",
          aiAlertCount: hasVariation ? 1 : 0,
          lastAiSummary: hasVariation 
            ? `Cảnh báo: Số lượng trứng thay đổi (Ban đầu: ${previousEggCount}, Hiện tại: ${eggCount})` 
            : `Số lượng trứng ổn định: ${eggCount} quả`,
          lastAiConfidence: 98,
          streamEnabled: true,
          eggCount,
          previousEggCount,
          ipAddress,
        });

        if (item.ipAddress) {
          setNewIp(item.ipAddress);
        } else if (item.ip) {
          setNewIp(item.ip);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, deviceId, initialCamera]);

  // Clock tick & random bitrate generator
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      setStreamTime(`${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
      
      // randomize bitrate slightly
      setBitrate(prev => {
        const delta = Math.floor(Math.random() * 21) - 10;
        const next = prev + delta;
        return next < 150 ? 150 : next > 450 ? 450 : next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Recording timer
  useEffect(() => {
    let recTimer: NodeJS.Timeout;
    if (isRecording) {
      recTimer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(recTimer);
  }, [isRecording]);

  if (!isOpen) return null;

  // Handle Save IP Address
  const handleSaveIp = async () => {
    if (!newIp.trim()) return;
    setSavingIp(true);
    try {
      // Save directly to Firebase RTDB
      await set(ref(rtdb, `incubators/${deviceId}/ipAddress`), newIp.trim());
      setIsEditingIp(false);
      showToast("Cập nhật IP thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật IP:", err);
      showToast("Lỗi khi lưu IP!");
    } finally {
      setSavingIp(false);
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Record Trigger
  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
    showToast(!isRecording ? "Bắt đầu ghi hình camera..." : "Đã dừng và lưu file ghi hình!");
  };

  // Snapshot Trigger
  const handleCaptureSnapshot = async () => {
    showToast("Đang chụp ảnh camera...");
    
    // Add current time snapshot to event logs
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, "0");
    const currentTimeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title: "Ảnh vừa chụp",
      time: currentTimeStr
    };

    setEvents(prev => [newEvent, ...prev]);

    // Send a trigger to Firebase for manual capture
    try {
      await set(ref(rtdb, `incubators/${deviceId}/control/camera`), true);
      // Automatically reset trigger after 1.5 seconds
      setTimeout(async () => {
        await set(ref(rtdb, `incubators/${deviceId}/control/camera`), false);
      }, 1500);
    } catch (err) {
      console.error("Lỗi gửi tín hiệu chụp ảnh:", err);
    }
  };

  // Fullscreen trigger (Mock)
  const handleExpandView = () => {
    showToast("Mở chế độ toàn màn hình");
  };

  // Remove event from list
  const handleRemoveEvent = (id: string) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
    showToast("Đã xóa sự kiện khỏi danh sách");
  };

  const formatRecordingTime = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const streamUrl = camera.ipAddress 
    ? (camera.ipAddress.startsWith("http") ? camera.ipAddress : `http://${camera.ipAddress}`)
    : "http://192.168.88.220:81/stream";
  
  const finalStreamUrl = streamUrl.includes("/stream") ? streamUrl : `${streamUrl.replace(/\/$/, "")}/stream`;

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

        {/* 1. Black Stream Monitor Panel */}
        <div className="relative aspect-video w-full rounded-[28px] bg-black overflow-hidden flex flex-col justify-between p-4 shadow-inner border border-black/10 select-none">
          
          {/* Top Info Bar */}
          <div className="flex items-center justify-between w-full z-10 text-[9px] font-mono font-semibold tracking-wider text-white/90">
            <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
              <span className={`h-1.5 w-1.5 rounded-full bg-red-600 ${camera.status === "online" ? "animate-pulse" : ""}`} />
              <span className="font-extrabold text-red-500">● LIVE</span>
              <span className="text-white/60">|</span>
              <span>{camera.ipAddress || "192.168.88.220:81"}/stream</span>
            </div>
            <div className="flex items-center gap-2 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/5">
              <span>{streamTime || "24/07/2026 13:44:10"}</span>
              <span className="text-white/60">|</span>
              <span className="font-bold text-amber-500">{bitrate} KB/s</span>
            </div>
          </div>

          {/* Central Connecting/Offline States */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-0">
            {camera.status === "offline" ? (
              <div className="flex flex-col items-center max-w-sm mt-3 animate-in fade-in duration-300">
                <div className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 shadow-lg">
                  <WifiOff className="h-7 w-7 stroke-[1.5]" />
                </div>
                <h4 className="text-base font-extrabold text-white tracking-wide">
                  Ngoại tuyến
                </h4>
                <p className="text-[10px] text-white/40 font-semibold mt-1">
                  Lỗi kết nối camera
                </p>
                <p className="text-[9px] font-mono text-white/30 mt-0.5 break-all">
                  URL: http://{camera.ipAddress || "192.168.88.220:81"}/stream
                </p>

                {/* Edit IP Form Inline */}
                {isEditingIp ? (
                  <div className="mt-4 flex flex-col gap-2 w-full max-w-[240px]">
                    <div className="flex gap-1.5 items-center bg-zinc-900 border border-zinc-700/60 rounded-xl px-2.5 py-1">
                      <input
                        type="text"
                        value={newIp}
                        onChange={(e) => setNewIp(e.target.value)}
                        className="bg-transparent text-white font-mono text-xs w-full focus:outline-none placeholder-zinc-500"
                        placeholder="IP:Port (e.g. 192.168.1.50:81)"
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setIsEditingIp(false)}
                        disabled={savingIp}
                        className="h-7 px-3 text-[10px] font-bold rounded-lg border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleSaveIp}
                        disabled={savingIp}
                        className="h-7 px-3 text-[10px] font-bold rounded-lg bg-amber-500 text-black hover:bg-amber-400 active:scale-95 transition flex items-center gap-1"
                      >
                        {savingIp ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        <span>Lưu</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 flex gap-2.5">
                    <button
                      onClick={() => {
                        showToast("Đang kết nối lại...");
                      }}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-white px-4 transition active:scale-95 duration-100 shadow-lg border border-zinc-700/50 cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Thử lại</span>
                    </button>
                    <button
                      onClick={() => setIsEditingIp(true)}
                      className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#EAB308] hover:bg-yellow-400 text-[10px] font-bold text-black px-4 transition active:scale-95 duration-100 shadow-lg cursor-pointer"
                    >
                      <Pencil className="h-3 w-3 text-black" />
                      <span>Đổi IP</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Online Simulated Stream Image/Viewfinder
              <div className="relative h-full w-full flex items-center justify-center">
                {/* Simulated live viewfinder grid/brackets */}
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-white/40 rounded-tr-sm"></div>
                <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-white/40 rounded-tl-sm"></div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-white/40 rounded-br-sm"></div>
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-white/40 rounded-bl-sm"></div>

                {isRecording && (
                  <div className="absolute top-0 left-0 flex items-center gap-1 bg-red-600/90 text-[9px] font-mono font-bold text-white px-2 py-0.5 rounded-md border border-red-500 animate-pulse z-20">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    <span>REC {formatRecordingTime(recordingSeconds)}</span>
                  </div>
                )}

                {isPlaying ? (
                  /* Live MJPEG Stream Image */
                  <img
                    src={finalStreamUrl}
                    alt="Live Camera Stream"
                    className="h-full w-full object-cover rounded-xl"
                    onError={(e) => {
                      console.error("Lỗi tải live stream");
                    }}
                  />
                ) : (
                  /* Standby / Paused state with Play Button overlay */
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlaying(true);
                    }}
                    className="relative h-full w-full flex items-center justify-center bg-slate-950/45 rounded-xl transition duration-200"
                  >
                    {camera.previewImage ? (
                      <img
                        src={camera.previewImage}
                        alt="Stream Standby"
                        className="h-full w-full object-cover rounded-xl opacity-40"
                      />
                    ) : (
                      <div className="text-center text-white/40 space-y-1">
                        <Camera className="h-8 w-8 stroke-[1.2] text-white/20 mx-auto" />
                        <p className="text-xs font-bold font-mono text-white/40">Stream đang tạm dừng</p>
                      </div>
                    )}
                    
                    {/* Large Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 border border-white/20 text-white transition active:scale-95 duration-100 shadow-2xl hover:scale-105">
                        <Play className="h-6 w-6 fill-current text-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover pause hint overlay */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/55 border border-white/10 text-white shadow-xl animate-in scale-in duration-150">
                      <Pause className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Controls Bar (Play/Pause & Fullscreen) */}
          <div className="w-full flex justify-between items-center z-10">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/45 hover:bg-black/60 border border-white/10 text-white/80 transition duration-150 cursor-pointer shadow-md"
              title={isPlaying ? "Tạm dừng Stream" : "Phát Stream"}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
            </button>

            <button
              onClick={handleExpandView}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-black/45 hover:bg-black/60 border border-white/10 text-white/80 transition duration-150 cursor-pointer shadow-md"
              title="Toàn màn hình"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Control Buttons Bar (Record, Capture, Fullscreen) */}
        <div className="bg-[#FFF8F6] border border-[#F5E1D6] rounded-[24px] p-4 flex justify-around items-center shadow-sm">
          {/* Record button */}
          <button
            onClick={handleToggleRecord}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className={`h-11 w-11 rounded-full flex items-center justify-center border transition-all duration-200 ${
              isRecording 
                ? "bg-red-50 border-red-200 text-red-500 shadow-sm" 
                : "bg-white border-[#F5E1D6] text-slate-500 hover:bg-slate-50"
            }`}>
              <Circle className={`h-5 w-5 fill-current ${isRecording ? "animate-pulse" : "text-red-500"}`} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-600">Ghi hình</span>
          </button>

          {/* Capture photo button */}
          <button
            onClick={handleCaptureSnapshot}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="h-11 w-11 rounded-full bg-white border border-[#F5E1D6] text-slate-500 hover:bg-slate-50 flex items-center justify-center transition shadow-sm">
              <Camera className="h-5 w-5 text-sky-950 group-hover:scale-105 transition" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-600">Chụp ảnh</span>
          </button>

          {/* Expand/More button */}
          <button
            onClick={handleExpandView}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className="h-11 w-11 rounded-full bg-white border border-[#F5E1D6] text-slate-500 hover:bg-slate-50 flex items-center justify-center transition shadow-sm">
              <Maximize2 className="h-4.5 w-4.5 text-sky-950" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-600">Mở rộng</span>
          </button>
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

        {/* 4. Playback Button at bottom */}
        <button
          onClick={() => {
            showToast("Bắt đầu phát lại dữ liệu camera lịch sử...");
          }}
          className="bg-[#FFF8F6] border border-[#F5E1D6] hover:bg-[#FAF0E6] rounded-[24px] p-4 flex items-center justify-center gap-2.5 transition active:scale-98 duration-100 shadow-sm cursor-pointer"
        >
          <History className="h-5 w-5 text-amber-500" />
          <span className="text-xs font-extrabold text-sky-950 uppercase tracking-wider">
            Phát Lại
          </span>
        </button>

      </div>
    </div>,
    document.body
  );
}
