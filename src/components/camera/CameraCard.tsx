"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  Video, 
  Play, 
  Brain, 
  AlertTriangle, 
  ShieldCheck, 
  Eye, 
  MoreVertical, 
  RefreshCw,
  Info
} from "lucide-react";
import { CameraItem } from "@/src/types/camera";

interface CameraCardProps {
  camera: CameraItem;
  onRefreshCapture?: (id: string) => void;
}

export default function CameraCard({ camera, onRefreshCapture }: CameraCardProps) {
  const [activeDropdown, setActiveDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getAiBadge = (status: CameraItem["aiStatus"]) => {
    switch (status) {
      case "analyzed":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            AI: Đã quét
          </span>
        );
      case "alert":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg border border-rose-100 bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700">
            <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
            AI: Cảnh báo
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            <Info className="h-3.5 w-3.5" />
            AI: Chờ quét
          </span>
        );
    }
  };

  return (
    <div className="group rounded-[24px] border border-sky-100/80 bg-white p-5 shadow-sm shadow-sky-100/10 hover:shadow-lg transition duration-200 flex flex-col justify-between">
      <div>
        {/* Preview image slot */}
        <div className="relative aspect-video w-full rounded-[18px] bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 overflow-hidden flex items-center justify-center border border-slate-100">
          {camera.previewImage ? (
            <img 
              src={camera.previewImage} 
              alt={camera.cameraName} 
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="relative h-full w-full flex items-center justify-center">
              {/* Corner Viewfinder Brackets */}
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-slate-500/60 rounded-tr-sm"></div>
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-slate-500/60 rounded-tl-sm"></div>
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-slate-500/60 rounded-br-sm"></div>
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-slate-500/60 rounded-bl-sm"></div>
              
              {/* Camera Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-[0.03] pointer-events-none">
                <div className="border border-white"></div><div className="border border-white"></div><div className="border border-white"></div>
                <div className="border border-white"></div><div className="border border-white"></div><div className="border border-white"></div>
                <div className="border border-white"></div><div className="border border-white"></div><div className="border border-white"></div>
              </div>

              <div className="text-center p-6 text-slate-500 flex flex-col items-center z-10">
                <Camera className="h-9 w-9 text-slate-400/80 mb-2 stroke-[1.5] group-hover:scale-110 transition duration-300" />
                <p className="text-xs font-bold text-slate-300 font-mono tracking-wider">{camera.cameraName}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-semibold">{camera.locationLabel}</p>
              </div>

              {/* Viewfinder stats info */}
              <div className="absolute bottom-3 left-3.5 text-[9px] font-mono text-slate-500 flex gap-2">
                <span>1080P</span>
                <span>FPS: {camera.status === "online" ? "30" : "0"}</span>
              </div>
            </div>
          )}

          {/* Status badge overlays */}
          <div className="absolute left-3.5 top-3.5 flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md ${
              camera.status === "online" ? "bg-emerald-500" : "bg-slate-400"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full bg-white ${camera.status === "online" ? "animate-ping" : ""}`} />
              {camera.status === "online" ? "LIVE" : "OFFLINE"}
            </span>

            {camera.status === "online" && camera.streamEnabled && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                <Video className="h-3 w-3" />
                STREAM
              </span>
            )}
          </div>

          {/* Confidence Score Overlay */}
          {camera.lastAiConfidence !== undefined && (
            <div className="absolute right-3.5 bottom-3.5 bg-slate-950/75 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 text-[10px] font-extrabold text-white">
              AI: {camera.lastAiConfidence}%
            </div>
          )}
        </div>

        {/* Camera Info */}
        <div className="mt-4 flex justify-between items-start">
          <div className="space-y-0.5">
            <h4 className="font-bold text-sky-950 text-sm group-hover:text-sky-600 transition-colors">
              {camera.cameraName}
            </h4>
            <p className="text-xs font-semibold text-slate-500">{camera.deviceName}</p>
            <p className="text-[10px] font-medium text-slate-400 font-mono mt-0.5">{camera.deviceId} · {camera.locationLabel}</p>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setActiveDropdown(!activeDropdown)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition duration-150"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {activeDropdown && (
              <div 
                ref={dropdownRef}
                className="absolute right-0 top-full z-[100] mt-1 w-44 rounded-xl border border-sky-100 bg-white p-1.5 shadow-xl animate-in fade-in duration-100"
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                >
                  <Play className="h-3.5 w-3.5 text-slate-400" />
                  Mở luồng Stream
                </button>
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-sky-950 hover:bg-sky-50 transition"
                >
                  <Brain className="h-3.5 w-3.5 text-slate-400" />
                  Chuẩn đoán AI thủ công
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Analytics Status */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            {getAiBadge(camera.aiStatus)}
            {camera.aiAlertCount > 0 && (
              <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100 animate-bounce">
                {camera.aiAlertCount} cảnh báo AI
              </span>
            )}
          </div>

          {/* Egg Detection Stats grid */}
          {camera.eggCount !== undefined && (
            <div className="grid grid-cols-3 gap-2 bg-slate-50/60 rounded-[16px] p-3 border border-slate-100/50 text-center">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Hiện tại</span>
                <span className="text-base font-extrabold text-sky-950 font-mono">{camera.eggCount}</span>
              </div>
              <div className="space-y-0.5 border-x border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Ban đầu</span>
                <span className="text-base font-extrabold text-slate-500 font-mono">
                  {camera.previousEggCount ?? camera.eggCount}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Biến động</span>
                {camera.previousEggCount !== undefined && camera.eggCount !== camera.previousEggCount ? (
                  <span className="text-xs font-extrabold text-rose-600 animate-pulse block mt-1">
                    {camera.eggCount > camera.previousEggCount ? "+" : ""}
                    {camera.eggCount - camera.previousEggCount} quả
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-600 block mt-1">Ổn định</span>
                )}
              </div>
            </div>
          )}

          <div className="bg-slate-50/60 rounded-[14px] p-3 text-xs border border-slate-100/50">
            <span className="font-bold text-sky-950 block mb-0.5">Phân tích AI:</span>
            <span className="text-slate-500 font-semibold">{camera.lastAiSummary}</span>
          </div>
        </div>
      </div>

      {/* Action triggers */}
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-sky-100 bg-sky-50/20 text-xs font-bold text-sky-700 shadow-sm transition hover:bg-sky-50 active:scale-95 duration-150"
        >
          <Eye className="h-4 w-4" />
          <span>Xem chi tiết</span>
        </button>

        <button
          type="button"
          disabled={camera.status === "offline"}
          onClick={() => onRefreshCapture && onRefreshCapture(camera.id)}
          className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-xl text-xs font-bold shadow-sm transition duration-150 ${
            camera.status === "offline"
              ? "bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed shadow-none"
              : "border border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-700 bg-white"
          }`}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Chụp lại</span>
        </button>
      </div>
    </div>
  );
}
