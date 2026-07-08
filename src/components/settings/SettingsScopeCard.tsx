"use client";

import React, { useState } from "react";
import { incubationProfilesMock } from "@/src/data/settingsMock";
import { Sliders, Copy, Plus, Info, LayoutGrid } from "lucide-react";

interface SettingsScopeCardProps {
  onScopeChange?: (scope: "all" | "device", deviceId?: string) => void;
  onProfileChange?: (profileId: string) => void;
}

export default function SettingsScopeCard({
  onScopeChange,
  onProfileChange,
}: SettingsScopeCardProps) {
  const [scope, setScope] = useState<"all" | "device">("all");
  const [selectedDevice, setSelectedDevice] = useState("SEI-IoT-001");
  const [selectedProfileId, setSelectedProfileId] = useState("chicken");

  const selectedProfile = incubationProfilesMock.find(
    (p) => p.id === selectedProfileId
  ) || incubationProfilesMock[0];

  const handleScopeChange = (newScope: "all" | "device") => {
    setScope(newScope);
    if (onScopeChange) {
      onScopeChange(newScope, newScope === "device" ? selectedDevice : undefined);
    }
  };

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDevice(deviceId);
    if (onScopeChange) {
      onScopeChange("device", deviceId);
    }
  };

  const handleProfileChange = (profileId: string) => {
    setSelectedProfileId(profileId);
    if (onProfileChange) {
      onProfileChange(profileId);
    }
  };

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white p-6 shadow-sm shadow-sky-100/10">
      <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Phạm vi áp dụng & Hồ sơ ấp
          </h3>
          <p className="text-xs text-slate-500">
            Chọn phạm vi ảnh hưởng của cấu hình và loại trứng đang ấp
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 duration-150"
          >
            <Copy className="h-3.5 w-3.5 text-slate-400" />
            <span>Nhân bản</span>
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-sky-100 bg-sky-50/20 px-3.5 text-xs font-bold text-sky-700 shadow-sm transition hover:bg-sky-50 active:scale-95 duration-150"
          >
            <Plus className="h-3.5 w-3.5 text-sky-600" />
            <span>Tạo mới</span>
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Side: Scope selector */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sky-950 uppercase tracking-wider mb-2">
              Phạm vi cấu hình
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleScopeChange("all")}
                className={`flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-bold border transition duration-150 ${
                  scope === "all"
                    ? "border-sky-500 bg-sky-50/40 text-sky-700 font-extrabold"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Toàn hệ thống</span>
              </button>

              <button
                type="button"
                onClick={() => handleScopeChange("device")}
                className={`flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-bold border transition duration-150 ${
                  scope === "device"
                    ? "border-sky-500 bg-sky-50/40 text-sky-700 font-extrabold"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span>Theo thiết bị</span>
              </button>
            </div>
          </div>

          {scope === "device" && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-150">
              <label className="block text-[11px] font-bold text-sky-950 uppercase tracking-wider mb-1.5">
                Chọn thiết bị áp dụng
              </label>
              <div className="relative">
                <select
                  value={selectedDevice}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 pr-10 text-xs font-semibold text-slate-700 outline-none transition duration-200 focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-50"
                >
                  <option value="SEI-IoT-001">SEI-IoT-001 (Alpha)</option>
                  <option value="SEI-IoT-002">SEI-IoT-002 (Bravo)</option>
                  <option value="SEI-IoT-003">SEI-IoT-003 (Delta)</option>
                  <option value="SEI-IoT-004">SEI-IoT-004 (Echo)</option>
                  <option value="SEI-IoT-005">SEI-IoT-005 (Foxtrot)</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Sliders className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Incubation Profile Selector & Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-sky-950 uppercase tracking-wider mb-2">
              Hồ sơ ấp mẫu (incubation Profile)
            </label>
            <div className="relative">
              <select
                value={selectedProfileId}
                onChange={(e) => handleProfileChange(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/30 px-3.5 pr-10 text-xs font-semibold text-slate-700 outline-none transition duration-200 focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-50"
              >
                {incubationProfilesMock.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Sliders className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Profile details card panel */}
          <div className="rounded-[18px] bg-sky-50/30 border border-sky-100/50 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Chi tiết Hồ sơ</span>
              <span className="text-sky-700 bg-sky-50 border border-sky-100 rounded-md px-1.5 py-0.5">
                {selectedProfile.totalDays} ngày
              </span>
            </div>

            <div className="flex items-center gap-4 text-sky-950 font-bold">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Chu kỳ:</span>
                <span>{selectedProfile.totalDays} ngày</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Số giai đoạn:</span>
                <span>{selectedProfile.stagesCount} bước</span>
              </div>
            </div>

            <p className="text-slate-500 font-medium leading-relaxed flex gap-1.5 pt-1 border-t border-slate-100/50">
              <Info className="h-4 w-4 text-sky-500 shrink-0" />
              <span>{selectedProfile.description}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
