"use client";

import React from "react";
import CameraCard from "./CameraCard";
import { CameraItem } from "@/src/types/camera";
import { VideoOff } from "lucide-react";

interface CameraGridProps {
  cameras: CameraItem[];
  onRefreshCapture?: (id: string) => void;
  onViewDetail?: (camera: CameraItem) => void;
}

export default function CameraGrid({ cameras, onRefreshCapture, onViewDetail }: CameraGridProps) {
  if (cameras.length === 0) {
    return (
      <div className="rounded-[24px] border border-sky-100/80 bg-white p-16 text-center shadow-sm shadow-sky-100/10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 shadow-sm shadow-amber-100">
          <VideoOff className="h-8 w-8 stroke-[2.2] animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-sky-950">Chưa có camera nào</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 leading-relaxed">
          Hiện tại không tìm thấy thiết bị camera nào khớp với tiêu chí tìm kiếm hoặc trạng thái của bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cameras.map((camera) => (
        <CameraCard 
          key={camera.id} 
          camera={camera} 
          onRefreshCapture={onRefreshCapture}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
}
