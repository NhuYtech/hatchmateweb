"use client";

import React, { useState } from "react";
import { defaultEnvironmentSettings } from "@/src/constants/presets";
import { Thermometer, Droplets, Activity } from "lucide-react";

/* ── Shared label styles ── */
const fieldLabel = "block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 mb-1.5";
const selectCls =
  "h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs font-bold text-slate-700 outline-none transition duration-150 focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-50/80";

export default function EnvironmentSettingsCard() {
  const [settings, setSettings] = useState(defaultEnvironmentSettings);

  const handleChange = (key: keyof typeof settings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white shadow-sm shadow-sky-100/10 overflow-hidden flex flex-col">
      {/* Card header strip */}
      <div className="flex items-center gap-3 border-b border-sky-50 px-6 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          <Thermometer className="h-4.5 w-4.5 stroke-[2]" />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Cấu hình Môi trường
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Nhiệt độ, độ ẩm mục tiêu và tần suất lấy mẫu
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-5 p-6">
        {/* Temperature slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
              <Thermometer className="h-3.5 w-3.5 text-orange-500" />
              Nhiệt độ mục tiêu
            </label>
            <span className="rounded-lg bg-orange-50 border border-orange-100 px-2 py-0.5 text-xs font-extrabold text-orange-600">
              {settings.targetTemperature}°C
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="35"
              max="40"
              step="0.1"
              value={settings.targetTemperature}
              onChange={(e) => handleChange("targetTemperature", parseFloat(e.target.value))}
              className="w-full h-2 rounded-full bg-slate-100 appearance-none cursor-pointer accent-orange-500"
            />
            <input
              type="number"
              min="35"
              max="40"
              step="0.1"
              value={settings.targetTemperature}
              onChange={(e) => handleChange("targetTemperature", parseFloat(e.target.value) || 37.5)}
              className="w-20 h-10 rounded-xl border border-slate-200 bg-slate-50/40 text-center text-xs font-extrabold text-sky-950 outline-none focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-50"
            />
          </div>
        </div>

        {/* Humidity slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
              <Droplets className="h-3.5 w-3.5 text-blue-500" />
              Độ ẩm mục tiêu
            </label>
            <span className="rounded-lg bg-blue-50 border border-blue-100 px-2 py-0.5 text-xs font-extrabold text-blue-600">
              {settings.targetHumidity}% RH
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="40"
              max="80"
              step="1"
              value={settings.targetHumidity}
              onChange={(e) => handleChange("targetHumidity", parseInt(e.target.value, 10))}
              className="w-full h-2 rounded-full bg-slate-100 appearance-none cursor-pointer accent-blue-500"
            />
            <input
              type="number"
              min="40"
              max="80"
              step="1"
              value={settings.targetHumidity}
              onChange={(e) => handleChange("targetHumidity", parseInt(e.target.value, 10) || 58)}
              className="w-20 h-10 rounded-xl border border-slate-200 bg-slate-50/40 text-center text-xs font-extrabold text-sky-950 outline-none focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-50"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Interval grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={fieldLabel}>Sai số cho phép</label>
            <select
              value={settings.tempTolerance}
              onChange={(e) => handleChange("tempTolerance", parseFloat(e.target.value))}
              className={selectCls}
            >
              <option value="0.2">±0.2°C</option>
              <option value="0.5">±0.5°C</option>
              <option value="0.8">±0.8°C</option>
              <option value="1.0">±1.0°C</option>
            </select>
          </div>

          <div>
            <label className={fieldLabel}>
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Chu kỳ cảm biến
              </span>
            </label>
            <select
              value={settings.sensorIntervalSec}
              onChange={(e) => handleChange("sensorIntervalSec", parseInt(e.target.value, 10))}
              className={selectCls}
            >
              <option value="5">5 giây / lần</option>
              <option value="10">10 giây / lần</option>
              <option value="30">30 giây / lần</option>
              <option value="60">60 giây / lần</option>
            </select>
          </div>

          <div>
            <label className={fieldLabel}>Đồng bộ Cloud</label>
            <select
              value={settings.syncIntervalSec}
              onChange={(e) => handleChange("syncIntervalSec", parseInt(e.target.value, 10))}
              className={selectCls}
            >
              <option value="15">15 giây / lần</option>
              <option value="30">30 giây / lần</option>
              <option value="60">60 giây / lần</option>
              <option value="300">5 phút / lần</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
