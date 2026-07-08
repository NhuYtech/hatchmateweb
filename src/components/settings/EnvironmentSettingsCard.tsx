"use client";

import React, { useState } from "react";
import { defaultEnvironmentSettings } from "@/src/data/settingsMock";
import { Thermometer, Droplet } from "lucide-react";

export default function EnvironmentSettingsCard() {
  const [settings, setSettings] = useState(defaultEnvironmentSettings);

  const handleChange = (key: keyof typeof settings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="rounded-[24px] border border-sky-100/80 bg-white p-6 shadow-sm shadow-sky-100/10 flex flex-col justify-between">
      <div>
        <div className="mb-5 space-y-0.5">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 flex items-center gap-1.5">
            <Thermometer className="h-4 w-4 text-orange-500" />
            Cấu hình Môi trường
          </h3>
          <p className="text-xs text-slate-500">
            Điều chỉnh nhiệt độ, độ ẩm mục tiêu và tần suất lấy mẫu dữ liệu
          </p>
        </div>

        <div className="space-y-4">
          {/* Target Temperature */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1">
                <Thermometer className="h-3.5 w-3.5 text-orange-500" />
                Nhiệt độ mục tiêu
              </label>
              <span className="text-xs font-bold text-sky-600">{settings.targetTemperature}°C</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="35"
                max="40"
                step="0.1"
                value={settings.targetTemperature}
                onChange={(e) => handleChange("targetTemperature", parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <input
                type="number"
                min="35"
                max="40"
                step="0.1"
                value={settings.targetTemperature}
                onChange={(e) => handleChange("targetTemperature", parseFloat(e.target.value) || 37.5)}
                className="w-20 h-10 rounded-xl border border-slate-200 bg-slate-50/30 text-center text-xs font-bold text-sky-950 focus:border-sky-300 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Target Humidity */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1">
                <Droplet className="h-3.5 w-3.5 text-blue-500" />
                Độ ẩm mục tiêu
              </label>
              <span className="text-xs font-bold text-sky-600">{settings.targetHumidity}% RH</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="40"
                max="80"
                step="1"
                value={settings.targetHumidity}
                onChange={(e) => handleChange("targetHumidity", parseInt(e.target.value, 10))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <input
                type="number"
                min="40"
                max="80"
                step="1"
                value={settings.targetHumidity}
                onChange={(e) => handleChange("targetHumidity", parseInt(e.target.value, 10) || 58)}
                className="w-20 h-10 rounded-xl border border-slate-200 bg-slate-50/30 text-center text-xs font-bold text-sky-950 focus:border-sky-300 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Grid fields for intervals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-50">
            {/* Temp Tolerance */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Sai số cho phép
              </label>
              <select
                value={settings.tempTolerance}
                onChange={(e) => handleChange("tempTolerance", parseFloat(e.target.value))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 text-xs font-bold text-slate-700 outline-none focus:border-sky-300 focus:bg-white"
              >
                <option value="0.2">±0.2°C</option>
                <option value="0.5">±0.5°C</option>
                <option value="0.8">±0.8°C</option>
                <option value="1.0">±1.0°C</option>
              </select>
            </div>

            {/* Sensor sample interval */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Chu kỳ cảm biến
              </label>
              <select
                value={settings.sensorIntervalSec}
                onChange={(e) => handleChange("sensorIntervalSec", parseInt(e.target.value, 10))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 text-xs font-bold text-slate-700 outline-none focus:border-sky-300 focus:bg-white"
              >
                <option value="5">5 giây / lần</option>
                <option value="10">10 giây / lần</option>
                <option value="30">30 giây / lần</option>
                <option value="60">60 giây / lần</option>
              </select>
            </div>

            {/* Cloud Sync Interval */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Chu kỳ đồng bộ
              </label>
              <select
                value={settings.syncIntervalSec}
                onChange={(e) => handleChange("syncIntervalSec", parseInt(e.target.value, 10))}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/30 px-3 text-xs font-bold text-slate-700 outline-none focus:border-sky-300 focus:bg-white"
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
    </div>
  );
}
