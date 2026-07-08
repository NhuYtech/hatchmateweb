"use client";

import React, { useState } from "react";
import { defaultTurningSettings } from "@/src/data/settingsMock";
import { RefreshCw, ToggleLeft, ToggleRight, Calendar } from "lucide-react";

export default function TurningSettingsCard() {
  const [settings, setSettings] = useState(defaultTurningSettings);
  const [silentHour, setSilentHour] = useState("none");

  const toggleAuto = () => {
    setSettings((prev) => ({ ...prev, autoTurningEnabled: !prev.autoTurningEnabled }));
  };

  const toggleStopLastDays = () => {
    setSettings((prev) => ({ ...prev, stopTurningLastDays: !prev.stopTurningLastDays }));
  };

  const handleChange = (key: keyof typeof settings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white p-6 shadow-sm shadow-sky-100/10 flex flex-col justify-between">
      <div>
        <div className="mb-5 space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-sky-500 animate-spin-slow" />
            Cấu hình Đảo trứng
          </h3>
          <p className="text-xs text-slate-500">
            Thiết lập chu kỳ, góc xoay khay và các tùy chọn tắt đảo tự động
          </p>
        </div>

        <div className="space-y-4">
          {/* Toggles bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Auto turning status */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/40">
              <div>
                <p className="text-xs font-bold text-sky-950 uppercase tracking-wider">Đảo tự động</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Bật khay quay định kỳ</p>
              </div>
              <button
                type="button"
                onClick={toggleAuto}
                className="text-sky-600 hover:scale-105 transition"
              >
                {settings.autoTurningEnabled ? (
                  <ToggleRight className="h-9 w-9 stroke-[1.5] text-emerald-500" />
                ) : (
                  <ToggleLeft className="h-9 w-9 stroke-[1.5] text-slate-400" />
                )}
              </button>
            </div>

            {/* Stop last 3 days turning */}
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/40">
              <div>
                <p className="text-xs font-bold text-sky-950 uppercase tracking-wider">Ngừng đảo cuối kỳ</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">3 ngày cuối trước khi nở</p>
              </div>
              <button
                type="button"
                onClick={toggleStopLastDays}
                className="text-sky-600 hover:scale-105 transition"
              >
                {settings.stopTurningLastDays ? (
                  <ToggleRight className="h-9 w-9 stroke-[1.5] text-emerald-500" />
                ) : (
                  <ToggleLeft className="h-9 w-9 stroke-[1.5] text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Configuration Inputs fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Turn Interval */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Chu kỳ đảo trứng
              </label>
              <select
                disabled={!settings.autoTurningEnabled}
                value={settings.turnIntervalMin}
                onChange={(e) => handleChange("turnIntervalMin", parseInt(e.target.value, 10))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 text-xs font-bold text-slate-700 outline-none focus:border-sky-300 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="60">60 phút / lần</option>
                <option value="120">120 phút / lần</option>
                <option value="180">180 phút / lần</option>
                <option value="240">240 phút / lần</option>
              </select>
            </div>

            {/* Turn Duration */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Thời gian đảo (giây)
              </label>
              <input
                type="number"
                disabled={!settings.autoTurningEnabled}
                min="10"
                max="300"
                value={settings.turnDurationSec}
                onChange={(e) => handleChange("turnDurationSec", parseInt(e.target.value, 10) || 60)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 text-xs font-bold text-sky-950 focus:border-sky-300 focus:bg-white outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Max Turn Times per day */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Số lần đảo / ngày
              </label>
              <input
                type="number"
                disabled={!settings.autoTurningEnabled}
                min="1"
                max="24"
                value={settings.maxTurnsPerDay}
                onChange={(e) => handleChange("maxTurnsPerDay", parseInt(e.target.value, 10) || 8)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 text-xs font-bold text-sky-950 focus:border-sky-300 focus:bg-white outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Silent hours setting */}
          <div className="pt-2 border-t border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-500 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-400" />
              Khung giờ không đảo (ban đêm):
            </span>
            <select
              disabled={!settings.autoTurningEnabled}
              value={silentHour}
              onChange={(e) => setSilentHour(e.target.value)}
              className="h-9 rounded-xl border border-slate-200 bg-slate-50/30 px-3 text-xs font-bold text-slate-700 outline-none focus:border-sky-300 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed w-44"
            >
              <option value="none">Không thiết lập</option>
              <option value="22-06">22:00 - 06:00</option>
              <option value="23-05">23:00 - 05:00</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
