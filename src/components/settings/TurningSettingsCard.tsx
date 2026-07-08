"use client";

import React, { useState } from "react";
import { defaultTurningSettings } from "@/src/data/settingsMock";
import { RefreshCw, Moon } from "lucide-react";

/* ── Shared styles ── */
const fieldLabel = "block text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-400 mb-1.5";
const selectCls =
  "h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs font-bold text-slate-700 outline-none transition duration-150 focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-50/80 disabled:opacity-40 disabled:cursor-not-allowed";
const inputCls =
  "h-10 w-full rounded-xl border border-slate-200 bg-slate-50/40 px-3.5 text-xs font-bold text-sky-950 outline-none transition duration-150 focus:border-sky-300 focus:bg-white focus:ring-2 focus:ring-sky-50/80 disabled:opacity-40 disabled:cursor-not-allowed";

/* ── Toggle pill component ── */
function TogglePill({
  label,
  description,
  enabled,
  onToggle,
  accent = "emerald",
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  accent?: "emerald" | "sky";
}) {
  const colors = {
    emerald: enabled
      ? "border-emerald-200 bg-emerald-50/60"
      : "border-slate-100 bg-slate-50/40",
    sky: enabled
      ? "border-sky-200 bg-sky-50/60"
      : "border-slate-100 bg-slate-50/40",
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition duration-150 hover:shadow-sm active:scale-[0.99] ${colors[accent]}`}
    >
      <div className="space-y-0.5">
        <p className="text-xs font-bold text-sky-950">{label}</p>
        <p className="text-[10px] font-semibold text-slate-400">{description}</p>
      </div>

      {/* Track */}
      <div
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-all duration-200 ${
          enabled
            ? "border-emerald-400 bg-emerald-500"
            : "border-slate-200 bg-slate-200"
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
            enabled ? "left-5" : "left-0.5"
          }`}
        />
      </div>
    </button>
  );
}

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
    <div className="rounded-[24px] border border-sky-100/80 bg-white shadow-sm shadow-sky-100/10 overflow-hidden flex flex-col">
      {/* Card header strip */}
      <div className="flex items-center gap-3 border-b border-sky-50 px-6 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
          <RefreshCw className="h-4 w-4 stroke-[2]" />
        </div>
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.15em] text-sky-950">
            Cấu hình Đảo trứng
          </h3>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Chu kỳ quay khay, thời gian và lịch im lặng
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-5 p-6">
        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TogglePill
            label="Đảo tự động"
            description="Bật khay quay định kỳ"
            enabled={settings.autoTurningEnabled}
            onToggle={toggleAuto}
            accent="emerald"
          />
          <TogglePill
            label="Ngừng đảo cuối kỳ"
            description="3 ngày cuối trước khi nở"
            enabled={settings.stopTurningLastDays}
            onToggle={toggleStopLastDays}
            accent="sky"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Config inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={fieldLabel}>Chu kỳ đảo</label>
            <select
              disabled={!settings.autoTurningEnabled}
              value={settings.turnIntervalMin}
              onChange={(e) => handleChange("turnIntervalMin", parseInt(e.target.value, 10))}
              className={selectCls}
            >
              <option value="60">60 phút / lần</option>
              <option value="120">120 phút / lần</option>
              <option value="180">180 phút / lần</option>
              <option value="240">240 phút / lần</option>
            </select>
          </div>

          <div>
            <label className={fieldLabel}>TG đảo (giây)</label>
            <input
              type="number"
              disabled={!settings.autoTurningEnabled}
              min="10"
              max="300"
              value={settings.turnDurationSec}
              onChange={(e) => handleChange("turnDurationSec", parseInt(e.target.value, 10) || 60)}
              className={inputCls}
            />
          </div>

          <div>
            <label className={fieldLabel}>Số lần / ngày</label>
            <input
              type="number"
              disabled={!settings.autoTurningEnabled}
              min="1"
              max="24"
              value={settings.maxTurnsPerDay}
              onChange={(e) => handleChange("maxTurnsPerDay", parseInt(e.target.value, 10) || 8)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Silent hours */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/30 px-4 py-3">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Moon className="h-4 w-4 text-slate-400" />
            <span>Khung giờ không đảo ban đêm:</span>
          </span>
          <select
            disabled={!settings.autoTurningEnabled}
            value={silentHour}
            onChange={(e) => setSilentHour(e.target.value)}
            className="h-9 appearance-none rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-bold text-slate-700 outline-none focus:border-sky-300 disabled:opacity-40 disabled:cursor-not-allowed w-44"
          >
            <option value="none">Không thiết lập</option>
            <option value="22-06">22:00 – 06:00</option>
            <option value="23-05">23:00 – 05:00</option>
          </select>
        </div>
      </div>
    </div>
  );
}
